import React, {useEffect, useState} from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, Platform, Modal, ImageBackground, ActivityIndicator, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../screenstyles/rewardStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import {BaseUrl} from "../api/BaseUrl";
import {usePerksContext} from "../context";
import {useNavigation} from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;

const RewardItem = ({ item, currentrdId, onPress }) => {
  const containerStyle = Platform.OS === 'ios' ? styles.rectangleIOS : styles.rectangleAndroid;
  const backgroundColor = currentrdId === item?.id  ? 'rgba(255, 215, 0, 0.5)' : 'white';

  return (
      <View key={item.title} style={[
        containerStyle,
        {
          width: windowWidth * 0.9,
          backgroundColor
        },
      ]}>
        <View style={styles.borderradiusforimage}>
          <Image source={{uri:item?.image}} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{item.count} {item.name}</Text>
          <Text style={styles.additionalText}>You only spent {item.points} points</Text>
          <Text style={styles.additionalText}>{item.restaurant.rst_name}</Text>
        </View>
        {!item.redeemed && (
          <TouchableOpacity style={styles.getAndRedeemButton} onPress={() => onPress(item)}>
            <Text style={styles.getAndRedeemReward}>Redeem</Text>
          </TouchableOpacity>
        )}
      </View>
  );
};

const Rewards = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [itemsToRedeem, setItemsToRedeem] = useState([]);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [loadingRedeem, setLoadingRedeem] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState();
  const {currentUser, setCurrentRedeemedRewardId, currentRedeemedRewardId} = usePerksContext()
  const [selectedItem, setSelectedItem] = useState();
  const [redeemedImageSource, setRedeemedImageSource] = useState(null);
  const [redeemedCode, setRedeemedCode] = useState(null);

  async function loadData() {
    const rewards_to_redeem = await AsyncStorage.getItem('rewards_to_redeem');
    try {
      const user_redeemed_rewards = await axios.get(
          `${BaseUrl}/api/generate_rewards?querytype=user_redeemed_rewards&user=${currentUser.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );
      setRedeemedRewards(user_redeemed_rewards.data)
    }catch (e) {

    }

    if(rewards_to_redeem){
      setItemsToRedeem(JSON.parse(rewards_to_redeem))
    }
  }

  useEffect(() => {
    loadData()
  }, [itemsToRedeem, currentRedeemedRewardId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentRedeemedRewardId(' ');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


  const handleRedeemPress = async (item) => {
    
    setLoadingRedeem(true);
    try {
      const awardsData = await axios.get(
          `${BaseUrl}/api/generate_rewards?querytype=award&award=${item?.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );

      if(awardsData?.data.length > 0){
        const availableRewards =await awardsData.data?.filter((data) => data?.code_used_state !== true)
        if (availableRewards.length > 0){
          const count = availableRewards.length;
          const randomIndex = Math.floor(Math.random() * count);
          const awardChosen = availableRewards[randomIndex];

          const response = await axios.get(
              `${BaseUrl}/api/generate_rewards?querytype=use_award&id=${awardChosen?.id}&user=${currentUser.id}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
          );

          if (response?.data.success){
            const found_item = itemsToRedeem.find((item) => item.id === item.id);
            if (found_item.count > 1){
              const index = itemsToRedeem.indexOf(found_item);
              itemsToRedeem[index].count -= 1;
              await AsyncStorage.setItem('rewards_to_redeem', JSON.stringify(itemsToRedeem));
            }else {
              const rewards_to_redeem_after_removal = itemsToRedeem.filter((itemrd) => itemrd.id !== item.id);
              await AsyncStorage.setItem('rewards_to_redeem', JSON.stringify(rewards_to_redeem_after_removal));
            }

            loadData();
            
            setRedeemedCode(response?.data?.award_code);
            setLoadingRedeem(false);
          }else {
            alert("Something went wrong try again later!")
          }
        }else {
          alert("Sadly your order is not available yet!!!")
        }
      }else {
        alert("Sadly your order is not available yet!!!")
      }
    }catch (e) {
      alert(`Error ${e.message}`)
      setLoadingRedeem(false);
    }
    setItemToRemove(item);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmPurchase = (item) => {
    setShowModal(true);
    setRedeemedImageSource(item.image);
    handleRedeemPress(item); 
    setSelectedItem(item)
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topPart}>
        <ImageBackground style={styles.headerImage} source={require('../assets/images/celebration.jpg')}>
            <View style={styles.overlay} />
            <View style={styles.overlayContent}>
                <Text style={styles.titleText}>Redeem Rewards</Text>
            </View>
        </ImageBackground>
      </View>
      {itemsToRedeem.length === 0 ? (
        <Text style={styles.noRewardsText}>You do not have any rewards currently. Get new rewards from your preferred restaurant. </Text>
      ) : (
          itemsToRedeem.map((item,index) => (
          <RewardItem key={`${item.id}-${index}`} item={item} currentrdId={currentRedeemedRewardId} onPress={handleConfirmPurchase}/>
        ))
      )}
      <TouchableOpacity style={styles.recommendButton} onPress={() => {navigation.navigate('RedeemedRewards');}}>
        <Text style={styles.recommendText}>Your last 5 redeemed rewards</Text>
      </TouchableOpacity>
      

      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.circle} >
              <Image style={styles.modalimage} source={redeemedImageSource ? { uri: redeemedImageSource } : require('../assets/images/soda.png')} />
            </View>
            <View style={styles.outlinedTextContainer}>
              <Text style={[styles.modalTextTitle, styles.overlay]}>Congratulations 🎊</Text>
              <Text style={styles.modalTextTitle}> Congratulations 🎊</Text>
            </View>
            <Text style={styles.modalText}>Show the code below to the waiter to get your reward.</Text>
            
            {loadingRedeem?
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#132D7B" />
              </View>
            : <Text style={styles.modalnumber}>Code: {redeemedCode}</Text>}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Rewards;
