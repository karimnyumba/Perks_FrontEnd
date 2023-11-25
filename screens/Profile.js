import React, { useState } from 'react';
import {View, Text, Image, Modal, TouchableOpacity, Alert} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { logoSvgCode, profilepic, editicon, profileicon, phonecallicon, calendericon, mailicon, logoutIcon, HelpIcon } from '../svgData/svgData';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../screenstyles/profileStyles';
import {usePerksContext} from "../context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Avatar} from "@rneui/themed";
import {BaseUrl} from "../api/BaseUrl";

const ModalComponent = ({ isVisible, onClose, children }) => (
  <Modal visible={isVisible} transparent={true} animationType="fade">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {children}
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const Profile = () => {
    const navigation = useNavigation();
    const {currentUser} = usePerksContext();
    const [isAboutUsModalVisible, setAboutUsModalVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [isPreviewModalVisible, setPreviewModalVisible] = useState(false);

    const openAboutUsModal = () => {
      setAboutUsModalVisible(true);
    };

    const closeAboutUsModal = () => {
      setAboutUsModalVisible(false);
    };

    const openPreviewModal = (image) => {
      setPreviewImage(image);
      setPreviewModalVisible(true);
    };
  
    const closePreviewModal = () => {
      setPreviewModalVisible(false);
    };

    const handleLogout = () => {

        Alert.alert(
            'Logout Confirmation',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        await AsyncStorage.clear();

                        // Navigate to the Login screen
                        navigation.navigate('Login');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };

    return (
    <SafeAreaView style={styles.container}>

      <View style={styles.backgroundContainer}>
        <Image
          source={require('../assets/images/darkPurpleBackground.png')}
          style={styles.backgroundImage}
        />
        <SvgXml xml={logoSvgCode} style={styles.logoImage} />
        <View style={styles.textContainer}>
            {currentUser.profile ? (
                  <TouchableOpacity onPress={() => openPreviewModal(`${BaseUrl + currentUser?.profile}`)}>
                  <Avatar
                    size={75}
                    rounded
                    source={{ uri: `${BaseUrl + currentUser?.profile}` }}
                    style={styles.profile3}
                  />
                </TouchableOpacity>
            ):(
                <SvgXml xml={profilepic} style={styles.profile2} width={90} />
            )}
          <View style={styles.profileText}>
            <Text style={styles.nameText}>{currentUser?.fname} {currentUser?.lname}</Text>
            <Text style={styles.emailText}>{currentUser?.email}</Text>
          </View>
        </View>
      </View>
      <View style={styles.infocontainer}>
        <View style={styles.profileTextAndEditIcon}>
          <Text style={styles.titleText}>Profile Page</Text>
            <TouchableOpacity onPress={() => {
                navigation.navigate("EditProfile");
            }}>
                <SvgXml xml={editicon} style={styles.editIcon} />
            </TouchableOpacity>
        </View>

        <View style={styles.rectangleContainer}>
            <SvgXml xml={profileicon} style={styles.profileIcon} />
            <Text style={styles.profileTextCenter}>{currentUser?.fname} {currentUser?.lname}</Text>
        </View>
        <View style={[styles.rectangleContainer]}>
            <SvgXml xml={phonecallicon} style={styles.profileIcon} />
            <Text style={styles.profileTextCenter}>+{currentUser.phone_number}</Text>
        </View>
        <View style={[styles.rectangleContainer]}>
            <SvgXml xml={profileicon} style={styles.profileIcon} />
            <Text style={styles.profileTextCenter}>
                {currentUser.gender ? currentUser.gender : 'Gender'}
            </Text>        
        </View>
        <View style={[styles.rectangleContainer]}>
            <SvgXml xml={calendericon} style={styles.profileIcon} />
            <Text style={styles.profileTextCenter}>Date of birth</Text>
        </View>
        <View style={[styles.rectangleContainer]}>
            <SvgXml xml={mailicon} style={styles.profileIcon} />
            <Text style={styles.profileTextCenter}>{currentUser?.email}</Text>
        </View>

        <TouchableOpacity onPress={openAboutUsModal}>
          <View style={[styles.Helpdesk]}>
            <SvgXml xml={HelpIcon} style={styles.profileIcon} />
            <Text style={styles.profileTextCenter}>Help Desk</Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton]}>
          <SvgXml xml={logoutIcon} />
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
      <ModalComponent isVisible={isAboutUsModalVisible} onClose={closeAboutUsModal}>
        <Text style={styles.modalTitle}>Hassan Liana</Text>
        <Text style={styles.modalText}>+255785679111</Text>
        <Text style={styles.modalTitle}>Anen Isaac</Text>
        <Text style={styles.modalText}>+255763860354</Text>
      </ModalComponent>

      <Modal visible={isPreviewModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.previewImageContainer}>
            <View>
              <Text style={styles.previewImageTitle}>Profile Picture</Text>
            </View>
            <Image
              source={{ uri: previewImage }}
              style={styles.previewImage}
            />
            <TouchableOpacity onPress={closePreviewModal}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
