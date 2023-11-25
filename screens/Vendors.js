import React, {useEffect, useState} from 'react';
import { View, Text, Image, RefreshControl, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../screenstyles/vendorsStyles';
import {usePerksContext} from "../context";
import axios from "axios";
import {BaseUrl} from "../api/BaseUrl";

const Vendors = () => {
    const navigation = useNavigation();
    const [restaurants, setRestaurants] = useState();
    const [loadingData, setLoadingData] = useState(false);
    const {currentUser, userPointsUpdated} = usePerksContext();

    const loadRestaurants = async () => {
        setLoadingData(true)
        try{
            const response = await axios.get(
                `${BaseUrl}/api/user-restraurant?userId=${currentUser?.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const data = response.data
            setRestaurants(data)
            setLoadingData(false)
        }catch (e) {
            alert(`Error ${e.message}`)
            setLoadingData(false)
        }
    };

    useEffect(() => {
        loadRestaurants();
    }, [currentUser, userPointsUpdated]);

    return (
        <SafeAreaView style={styles.container}>
        <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
                <RefreshControl
                refreshing={loadingData}
                onRefresh={() => {
                    loadRestaurants();
                }}
                />
            }
        >
            <View style={styles.topPart}>
                <ImageBackground style={styles.headerImage} source={require('../assets/images/foodbackground.png')}>
                    <View style={styles.overlay} />
                    <View style={styles.overlayContent}>
                        <Text style={styles.titleText}>All Your Restaurants</Text>
                    </View>
                </ImageBackground>
            </View>
            {loadingData ? (
                <View style={styles.loadingContainer}>
                <ActivityIndicator size="larger" color="#132D7B" />
                </View>
            ) :  restaurants?.length > 0 ? (
                restaurants?.map((item) => {
                    return   <TouchableOpacity
                        key={item?.id}
                        style={styles.openButton}
                        activeOpacity={0.5}
                        onPress={() => {
                            navigation.navigate('SpecificVendorStack', { screen: 'SpecificVendor',
                                params: {
                                    restraurant: item?.restraurant.name,
                                    restId: item?.restraurant.id,
                                }
                            });
                        }}
                    >
                        <Image resizeMode="stretch" style={styles.shawarmaImg} source={{uri:BaseUrl+item?.restraurant?.pic}}/>
                        <View style={styles.restaurantInfo}>
                            <Text style={styles.restaurantname}>{item?.restraurant.name}</Text>
                            <Text style={styles.pointsCard}>points: {item?.total_points}</Text>
                        </View>
                    </TouchableOpacity>
                })
            ) : (
                <Text style={[styles.restaurantname, {color:"black"}]}>No Restaurants</Text>
            )}
        </ScrollView>
        </SafeAreaView>
    );
};

export default Vendors;
