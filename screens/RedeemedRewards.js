import React, {useEffect, useState} from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, Platform, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../screenstyles/redeemedRewardsStyles';
import axios from "axios";
import {BaseUrl} from "../api/BaseUrl";
import {usePerksContext} from "../context";

const windowWidth = Dimensions.get('window').width;

const RewardItem = ({ item, currentrdId }) => {
    const containerStyle = Platform.OS === 'ios' ? styles.rectangleIOS : styles.rectangleAndroid;
    const backgroundColor = item?.code_used_state ? 'rgba(169, 169, 169, 0.5)' : 'white';

    return (
        <View key={item.title} style={[
            containerStyle,
            {
                width: windowWidth * 0.9,
                backgroundColor:"white"
            },
        ]}>
            <View style={styles.borderradiusforimage}>
                <Image source={{uri:BaseUrl + item?.award.pic}} style={styles.image} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{item?.award.product}</Text>
                <Text style={styles.description}>You only spent {item?.award.points} points</Text>
            </View>

            <TouchableOpacity style={styles.getAndRedeemButton} >
                <Text style={styles.getAndRedeemReward}>Code: {item?.award_code}</Text>
            </TouchableOpacity>

        </View>
    );
};

const RedeemedRewards = () => {
    const [itemsToRedeem, setItemsToRedeem] = useState([]);
    const [loadingRedeem, setLoadingRedeem] = useState(false);
    const [redeemedRewards, setRedeemedRewards] = useState([])
    const {currentUser, currentRedeemedRewardId} = usePerksContext()

    async function loadData() {
        setLoadingRedeem(true)
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
        setLoadingRedeem(false)
    }

    useEffect(() => {
        loadData()
    }, [itemsToRedeem, currentRedeemedRewardId]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Your Last Five Rewards</Text>
            {loadingRedeem? <Text>loading...</Text>:
                redeemedRewards?.length === 0 ? (
                    <Text style={styles.noRewardsText}>You dont have any redeemed rewards!. </Text>
                ) : (
                    redeemedRewards?.map((item,index) => (
                        <RewardItem key={`${item.id}-${index}`} item={item} currentrdId={currentRedeemedRewardId}/>
                    ))
                )
            }
        </SafeAreaView>
    );
};

export default RedeemedRewards;
