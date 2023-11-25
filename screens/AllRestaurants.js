import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, ScrollView, RefreshControl, ActivityIndicator, } from "react-native";
import { SearchBar } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import styles from "../screenstyles/AllRestaurantsstyles";
import Icon from "react-native-vector-icons/FontAwesome";
import { usePerksContext } from "../context";
import axios from "axios";
import { BaseUrl } from "../api/BaseUrl";
import LottieView from "lottie-react-native";

const AllRestaurants = () => {
  const navigation = useNavigation();
  const [restaurantss, setRestaurantss] = useState();
  const [loadingData, setLoadingData] = useState(false);
  const { currentUser, userPointsUpdated } = usePerksContext();

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
      setRestaurantss(data);
      setLoadingData(false);
    } catch (e) {
      alert(`Error ${e.message}`);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, [userPointsUpdated, currentUser]);

  const [searchText, setSearchText] = useState("");
  const [modalFilteredRestaurants, setModalFilteredRestaurants] = useState([]);

  // Filter restaurants based on the user's input
  const handleOnChangeText = (text) => {
    setSearchText(text);

    const filtered = restaurantss?.filter((restaurant) =>
      restaurant.restraurant.name.toLowerCase().includes(text.toLowerCase())
    );
    setModalFilteredRestaurants(filtered);
  };

  const renderRestaurant = (restaurant) => (
    <TouchableOpacity
      style={styles.openButton}
      activeOpacity={0.5}
      onPress={() => {
        navigation.navigate("SpecificVendorStack", {
          screen: "SpecificVendor",
          params: {
            restraurant: restaurant?.restraurant.name,
            restId: restaurant?.restraurant.id,
          },
        });
      }}
      key={restaurant?.id}
    >
      <Image
        resizeMode="contain"
        style={styles.restaurantImage}
        source={{ uri: BaseUrl + restaurant?.restraurant?.pic }}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantname}>
          {restaurant?.restraurant.name}
        </Text>
        <Text style={styles.pointsCard}>
          points: {restaurant?.total_points}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderNoRestaurantsView = () => (
    <View style={styles.noRestaurantsView}>
      <Text style={styles.noRestaurantsText}>
        Oops! We don't seem to be working with this restaurant yet. Go back to
        the home page to add it as a recommendation.{" "}
      </Text>
      <LottieView
        source={require("../assets/animations/unavailableAnimation.json")}
        autoPlay
        loop
      />
    </View>
  );

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
        <ImageBackground
          style={styles.headerImage}
          source={require("../assets/images/foodbackground.png")}
        >
          {/* Dark overlay */}
          <View style={styles.overlay} />
          <View style={styles.overlayContent}>
            <Text style={styles.titleText}>All Restaurants</Text>
          </View>
        </ImageBackground>
      </View>
      <ScrollView style={styles.page}>
        <SearchBar
          placeholder="Search for restaurants..."
          onChangeText={handleOnChangeText}
          value={searchText}
          searchIcon={<Icon name={"search"} size={24} color="#888" />}
          containerStyle={{
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderBottomWidth: 0,
            borderTopWidth: 0,
            marginVertical: 10,
          }}
          inputContainerStyle={{
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderBottomWidth: 1,
          }}
          placeholderTextColor={"#888"}
          inputStyle={{ color: "#333" }}
        />
        {loadingData ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="larger" color="#132D7B" />
          </View>
        ) : modalFilteredRestaurants?.length > 0 ? (
          modalFilteredRestaurants.map(renderRestaurant)
        ) : searchText !== "" ? ( // Check if user has entered a search text
          renderNoRestaurantsView()
        ) : (
          restaurantss?.map(renderRestaurant)
        )}
      </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllRestaurants;
