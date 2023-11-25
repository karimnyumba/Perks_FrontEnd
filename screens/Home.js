import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ImageBackground, Image, TouchableOpacity, Modal, ActivityIndicator, RefreshControl, ScrollView, BackHandler, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import styles from "../screenstyles/homeStyles";
import { usePerksContext } from "../context";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";

export default function Home() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [recommendationText, setRecommendationText] = useState("");
  const [userLocation, setUserLocation] = useState(null);  const [userRestaurantData, setUserRestaurantData] = useState([]);
  const [visitedRestaurants, setVisitedRestaurants] = useState([]);
  const [unVisitedRestaurants, setUnVisitedRestaurants] = useState();
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser, userPointsUpdated } = usePerksContext();

  const closeModal = () => {
    setModalVisible(false);
    // Reset recommendationText and locationText when the modal is closed
    setRecommendationText("");
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // exits the app when user goes back from home page
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const loadRestaurants = async () => {
    setLoadingData(true);
    try {
      const response = await axios.get(
        `${BaseUrl}/api/user-restraurant?userId=${currentUser?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      const sortedRestaurants = data.sort(
        (a, b) => b.total_points - a.total_points
      );
      const topRestaurants = sortedRestaurants.slice(0, 3);
      setVisitedRestaurants(topRestaurants);

      const shuffledUnvisited = shuffleArray(data);
      const topUnvisitedRestaurants = shuffledUnvisited.slice(0, 3);

      setUnVisitedRestaurants(topUnvisitedRestaurants);
      setUserRestaurantData(data);
      setLoadingData(false);
    } catch (e) {
      alert(`Error ${e.message}`);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, [currentUser, userPointsUpdated]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const submitRecommendation = async () => {
    setModalVisible(!isModalVisible);
    try {
      const response = await axios.post(
        `${BaseUrl}/api/send_recommendation`,
        {
          recommendationText: recommendationText + ' ~ ' + userLocation,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    } catch (e) {}
    // Handle the submission of recommendationText here
    // You can send it to a backend or perform other actions
    toggleModal();
  };

  const determineGreeting = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  };

  useEffect(() => {
    determineGreeting();
  }, []);

  const [greeting, setGreeting] = useState("");

  const requestLocationPermission = async () => {
    try { 
      setLoadingData(true); // Set loading indicator

      let { status } = await Location.requestForegroundPermissionsAsync(); // Request location permission
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        setRecommendationText("");
        toggleModal();
        setUserLocation(`Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
      } else {
        console.log("Location permission denied");
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    } finally {
      setLoadingData(false);
    }
  };

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
      <View style={styles.topCard}>
        <ImageBackground
          style={styles.topCardBackground}
          source={require("../assets/images/darkBlueBackground.png")}
        >
          <View style={styles.greetingText}>
            <Text style={styles.hiText}>
              {greeting}, {currentUser?.fname} {currentUser?.lname}
            </Text>
          </View>

          {loadingData ? (
            <View style={styles.loadingContainer1}>
              <ActivityIndicator size="large" color="gold" />
            </View>
          ) : (
            <Text style={styles.totalPoints}>
              {userRestaurantData[0]?.user?.total_lifetime_points}
            </Text>
          )}
          <Text style={styles.totalPointsText}> Total Perks Points </Text>
        </ImageBackground>
      </View>

      {loadingData ? (
        <View style={styles.loadingContainer2}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <View style={styles.restaurantPage}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Your Restaurants</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Vendors");
              }}
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.specialAlign}>
            {visitedRestaurants?.length > 0 ? (
              visitedRestaurants?.slice(0, 3).map((item) => {
                return (
                  <TouchableOpacity
                    key={item?.id}
                    style={styles.openButton}
                    activeOpacity={0.5}
                    onPress={() => {
                      navigation.navigate("SpecificVendorStack", {
                        screen: "SpecificVendor",
                        params: {
                          restraurant: item?.restraurant.name,
                          restId: item?.restraurant.id,
                        },
                      });
                    }}
                  >
                    <View style={styles.cardContainerCrave}>
                      <Image
                        resizeMode="contain"
                        style={styles.shishiImg}
                        source={{ uri: BaseUrl + item?.restraurant?.pic }}
                      />
                      <View>
                        <Text style={styles.restaurantname}>
                          {item?.restraurant.name}
                        </Text>
                        <Text style={styles.pointsCard}>
                          points: {item?.total_points}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={[styles.restaurantname, { color: "black" }]}>
                You haven't visited any restaurant yet
              </Text>
            )}
          </View>

          {/* All restaurants in our system */}
          <View style={styles.title}>
            <Text style={styles.titleText}>All Restaurants</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AllRestaurants");
              }}
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.specialAlign}>
            {unVisitedRestaurants?.length > 0 ? (
              unVisitedRestaurants?.slice(0, 3).map((item) => {
                return (
                  <TouchableOpacity
                    key={item?.id}
                    style={styles.openButton}
                    activeOpacity={0.5}
                    onPress={() => {
                      navigation.navigate("SpecificVendorStack", {
                        screen: "SpecificVendor",
                        params: {
                          restraurant: item?.restraurant.name,
                          restId: item?.restraurant.id,
                        },
                      });
                    }}
                  >
                    <View style={styles.cardContainerCrave}>
                      <Image
                        resizeMode="contain"
                        style={styles.shishiImg}
                        source={{ uri: BaseUrl + item?.restraurant?.pic }}
                      />
                      <View>
                        <Text style={styles.restaurantname}>
                          {item?.restraurant.name}
                        </Text>
                        <Text style={styles.pointsCard}>
                          points: {item?.total_points}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyRestaurantsText}>No Restaurants</Text>
            )}
          </View>
        </View>
      )}

      {/* for the restaurant recommendations */}
      <TouchableOpacity style={styles.recommendButton} onPress={toggleModal}>
        <Text style={styles.recommendText}>Add Recommendation</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
