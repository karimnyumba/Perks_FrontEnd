import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { logoSvgCode } from './Welcome';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../screenstyles/loginStyles';
import {usePerksContext} from "../context";
import axios from "axios";
import {BaseUrl} from "../api/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form';

const loginSchema = yup.object({
    phone_number: yup.string().required('Enter your phone number').matches(/^\d{12}$/, 'Invalid phone number'),
    password: yup.string('It should be a string').required('Enter your password'),
})

export default function Login(){
    const navigation = useNavigation();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {setCurrentUser} = usePerksContext();

    const {control, handleSubmit, formState:{errors}} = useForm({
        resolver:yupResolver(loginSchema),
        // mode:'onChange' 
    })

    const handleLogin = async ({phone_number, password}) => {
        setIsLoading(true);
        try {

            const response = await axios.post(`${BaseUrl}/api/auth/login`, {
                phone_number: phone_number,
                password: password,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }

            });

            if (response.data?.token) {
                await AsyncStorage.setItem('authToken', response.data.token);
                await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
                setCurrentUser(response.data.user);

                navigation.navigate('MainScreens', {
                    screen: 'Home',
                    params: {
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        userId: response.data.user.id,
                    },
                });
            } else {
                alert("Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                alert("Server error. Please try again later.");
            } else if (error.request) {
                alert("Network error. Please check your internet connection.");
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>

                <View style={styles.companyName}>
                    <View style={styles.logoImg}>
                        <SvgXml xml={logoSvgCode} width="100%" height="120%"/>
                    </View>
                    <Text style={styles.nameText}>erks</Text>
                </View>

                <Text>Earn your money back with us</Text>

                <Text style={styles.loginText}>Login</Text>
                <Controller
                control={control}
              
                name='phone_number'
            
                render = {
                    ({ field: { onChange, onBlur, value } })=>{
                        
                        return(


                        <TextInput
                        placeholder="Phone Number: 255*********"
                        keyboardType="phone-pad"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}

                        style={styles.input} />
                            )}
                }
                />
                {errors.phone_number && <Text>{errors.phone_number.message}</Text>}
               

                <View style={styles.passwordInputContainer}>
                    <Controller
                    name='password'
                    control={control}
                   
                    render ={
                    ({ field: { onChange, onBlur, value } })=>{

                        
                        return(
                            <TextInput
                            placeholder="Password"
                            secureTextEntry={!passwordVisible}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.input}
                        />
                        )}
                    }
                    />
                    

    
                    <TouchableOpacity
                        style={styles.passwordVisibilityIcon}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                        <Icon
                            name={passwordVisible ? 'eye' : 'eye-slash'}
                            size={24}
                            padding={5}
                            color="#333"
                        />
                    </TouchableOpacity>
                </View>
                    {errors.password && (<Text>*{errors.password.message}*</Text>)}

                {isLoading ? (
                    <ActivityIndicator size = "large" color = "#0000ff" />
                ) : (

                <TouchableOpacity
                    style={styles.customButton}
                    onPress={handleSubmit(handleLogin)}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                )}

                <Text>Don't have an account yet?</Text>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('SignUp')
                    }}
                >
                    <View>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </View>

                </TouchableOpacity>

                <View style={styles.horizontalLine}></View>
                <Text style={styles.footerText}>Copyright @ {new Date().getFullYear()} Perks</Text>

            </View>
        </ScrollView>
  )
}
