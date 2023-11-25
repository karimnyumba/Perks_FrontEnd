import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { profilepic } from '../svgData/svgData';
import * as ImagePicker from 'expo-image-picker';
import styles from '../screenstyles/editProfileStyles';
import { usePerksContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar, Dialog} from "@rneui/themed";
import axios from "axios";
import {BaseUrl} from "../api/BaseUrl";
import RNPickerSelect from 'react-native-picker-select';


const EditProfile = ({navigation}) => {
    const [pickedImage, setpickedImage] = useState();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    // const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const {currentUser, setCurrentUser} = usePerksContext();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const getPermissionAsync = async () => {
        const status = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status.status !== "granted") {
            Alert.alert(
                "Insufficient permissions!",
                "You need to grant camera permissions to use this app.",
                [{ text: "Okay" }]
            );
            return false;
        }
        return true;
    };

    const takeImageHandler = async () => {
        const hasPermission = await getPermissionAsync();
        if (!hasPermission) {
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
            resize: {
                width: 300, 
                height: 400, 
            },
        });
    
        // Explore the result
        if (!result.cancelled) {
            setpickedImage(result.assets[0].uri);
            props.onImageTaken(result.assets[0].uri);
        }
    };    

    const prepareFormData = async () => {
        const formData = new FormData();

        // Add the profile picture to the FormData
        formData.append('profile', {
            uri: pickedImage,
            type: 'image/jpeg',
            name: 'profile.jpg',
        });

        formData.append('email', email);
        formData.append('fname', firstName);
        formData.append('lname', lastName);
        formData.append('phone_number', currentUser.phone_number);
        formData.append('username', firstName);
        formData.append('gender', gender);

        return formData;
    };


    const handleSave = async () => {
        try {
            setIsLoading(true);

            const formData = await prepareFormData();
            const response = await axios.post(`${BaseUrl}/api/auth/update-user`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "X-CSRFToken": "{{ csrf_token }}"
                }
            });

            if (response.data.save === true) {
                await AsyncStorage.setItem('user', JSON.stringify(response.data?.user));
                setCurrentUser(response.data?.user)
                navigation.navigate('Profile');
            } else {
                Alert.alert('Update error:', 'An error occurred while update .');
            }
        } catch (err) {
            if (err.response) {
                // Handle HTTP errors (e.g., 4xx, 5xx)
                Alert.alert('HTTP Error', 'An error occurred while making the request.');
            } else if (err.message) {
                // Handle network or request errors
                Alert.alert('Network Error', 'An error occurred while making the request.');
            } else {
                Alert.alert('Unknown Error', 'An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {/* Your profile content goes here */}
                <Text style={styles.titleText}>Edit Profile</Text>

                <View style={styles.imagepicker}>
                    {pickedImage ? ( <TouchableOpacity onPress={() => {
                            takeImageHandler().then(r => {
                                })
                        }} style={styles.chooseImage}><Avatar
                        size={72}
                        rounded
                        source={{uri:pickedImage}}
                        on
                    />
                    </TouchableOpacity> ): (<TouchableOpacity onPress={() => {
                        takeImageHandler().then(r => {
                            })
                    }} style={styles.chooseImage}>
                        <SvgXml xml={profilepic} style={styles.profile} />
                    </TouchableOpacity>)}
                    <View style={styles.imagepickertextcontianer}>
                        <Text style={styles.imagepickertext}>Photo Upload +</Text>
                    </View>
                </View>

                <View style={styles.inputcontainer}>
                    <View style={styles.inputcontainer2}>
                        <TextInput
                            style={styles.input2}
                            placeholder="First Name: John"
                            value={firstName}
                            onChangeText={(text) => setFirstName(text)}
                        />

                        <TextInput
                            style={styles.input2}
                            placeholder="Last Name: Doe"
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                        />
                    </View>

                    {/* <TextInput
                        style={styles.input}
                        placeholder="Phone Number: 255*********"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text)}
                    /> */}

                    <View style={styles.input3}>
                        <RNPickerSelect
                             style={styles.pickerSelectStyles} 
                            onValueChange={(value) => setGender(value)}
                            placeholder={{ label: 'Select a gender', value: null }}
                            items={[
                                { label: 'Male', value: 'M' },
                                { label: 'Female', value: 'F' },
                            ]}
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        keyboardType="email-address"
                        placeholder="Email: JohnDoe@gmail.com"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
            <Dialog
                isVisible={isLoading}
            >
                <Text style={{ fontFamily: "", fontSize: 10, textAlign: "center" }}>Editing Profile..</Text>
                <Dialog.Loading
                />
            </Dialog>
        </ScrollView>
    );
};

export default EditProfile;
