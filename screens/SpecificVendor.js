import React, {useEffect, useState} from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { logoSvgCode } from './Welcome';
import { SvgXml } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../screenstyles/specificVendorStyles';
import {usePerksContext} from "../context";
import axios from "axios";
import {BaseUrl} from "../api/BaseUrl";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpecificVendor = (props) => {
    const navigation = useNavigation();
    const {currentUser, setUserPointsUpdated, userPointsUpdated, setCurrentRedeemedRewardId} = usePerksContext();
    const [userResturantData, setUserResturantData] = useState();
    const [restaurantAwards, setRestaurantAwards] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const {restraurant, restId} = props.route.params;


    const userRstDataLoad = async () => {
        try {
            setLoadingData(true)
            const response = await axios.get(
                    `${BaseUrl}/api/user-restraurant?userId=${currentUser.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const awardsData = await axios.get(
                `${BaseUrl}/api/award?restraurantId=${restId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setRestaurantAwards(awardsData.data)
            const restaurants = response.data

            const data = restaurants.find((rst) => rst.restraurant.id === restId);
            setUserResturantData(data)
            setLoadingData(false)
        }catch (e) {
            alert(`error ${e.message}`)
            setLoadingData(false)
        }
    };

    useEffect(() => {
        userRstDataLoad()
    }, []);

    const RewardCard = ({ title, points, imageSource, id, rest }) => {
        const handleGetReward = async () => {
            if (points <= userResturantData?.total_points ){
                const response = await axios.post(`${BaseUrl}/api/use_points`, {
                        user: currentUser.id,
                        award: id,
                        point_used:points,
                        restaurant_id:restId
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                setUserPointsUpdated(userPointsUpdated+1);
                if (response.data.save){
                    const rewards_to_redeem = await AsyncStorage.getItem('rewards_to_redeem');

                    if (rewards_to_redeem){
                        let rewards_array = JSON.parse(rewards_to_redeem)
                        setCurrentRedeemedRewardId(id);
                        const found_item = rewards_array.find((item) => item.id === id)
                        if (found_item){
                            found_item.count += 1
                        }else {
                            rewards_array.push({
                                id:id,
                                name:title,
                                image:imageSource,
                                points:points,
                                redeemed: false,
                                restaurant:rest,
                                count:1
                            })
                        }

                        await AsyncStorage.setItem('rewards_to_redeem', JSON.stringify(rewards_array));
                    }else {
                        let rewards = []
                        setCurrentRedeemedRewardId(id);
                        rewards.push({
                            id:id,
                            name:title,
                            image:imageSource,
                            points:points,
                            redeemed: false,
                            restaurant:rest,
                            count:1
                        })

                        await AsyncStorage.setItem('rewards_to_redeem', JSON.stringify(rewards));
                    }
                    userRstDataLoad()
                    // Show an alert when the "GET" button is pressed
                    Alert.alert(
                        'Reward Purchased',
                        'You just purchased the product. Now you can redeem it here.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    // The user has acknowledged the alert
                                },
                            },
                        ],
                        { cancelable: true }
                    );
                    navigation.navigate('MainScreens', { screen: 'Rewards'});
                }
            }else {
                Alert.alert(
                    'Reward Purchased',
                    'Ooops!! You dont have enough points.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // The user has acknowledged the alert
                            },
                        },
                    ],
                    { cancelable: true }
                );
            }
        };

        return (
            <View style={styles.rewardContainer} key={id}>
                <Image style={styles.rewardImg} source={{uri:imageSource}} />
                <View style={styles.rewardInfo}>
                    <Text style={styles.rewardCard}>{title}</Text>
                    <Text style={styles.pointsCard}>Points: {points}</Text>
                </View>
                <TouchableOpacity style={styles.getAndRedeemButton} onPress={handleGetReward}>
                    <Text style={styles.getAndRedeemReward}>Get</Text>
                </TouchableOpacity>
            </View>
        );
    };


  return (
    <SafeAreaView style={styles.container}>
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl
          refreshing={loadingData}
          onRefresh={() => {
            userRstDataLoad();
          }}
        />
      }
    >
      <SvgXml xml={logoSvgCode} width="5%" height="10%" />

        <View style={styles.card}>
            <ImageBackground style={styles.imagesomething} source={require('../assets/images/darkBlueBackgroundmodified.png')}>
                <View style={styles.contentOfCard}>
                    <Text style={styles.restaurantName}>{restraurant}</Text>
                    {loadingData? (
                        <View style={styles.loadingTopCard}>
                            <ActivityIndicator size="large" color="gold" />
                        </View>
                    )
                    : <Text style={styles.points}>{userResturantData?.total_points}pts</Text>}
                    <Text style={styles.userName}>{currentUser?.fname} {currentUser?.lname}</Text>
                </View>
            </ImageBackground>
        </View>
        <View style={styles.rewardsRow}>
            <Text style={styles.leftTitle}>Available rewards</Text>
            <TouchableOpacity 
                style={styles.rewardsButton}
                onPress={() => {
                    navigation.navigate('SVRewards', { restraurant: userResturantData?.restraurant.name });
                }}
            >
                <Text style={styles.myRewardsText}>My rewards</Text>
            </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollcontainer}>
          {loadingData ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="larger" color="#132D7B" />
                </View>
            ) :  restaurantAwards?.length > 0 ? (
                restaurantAwards.map((award) => {
                  return (
                    <RewardCard title={award?.product} points={award?.points} imageSource={BaseUrl+award?.pic}  key={award?.id} id={award?.id} 
                        rest={
                            {rst_name: restraurant,
                                user_id: currentUser.id,
                                rest_id: restId,
                        }}    
                    />
                );
            })
        ) : (
                <Text style={styles.noRewardsText}>No Rewards Yet</Text>
        )}

      </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SpecificVendor;
