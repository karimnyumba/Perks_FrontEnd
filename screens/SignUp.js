import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { logoSvgCode } from './Welcome';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../screenstyles/signupStyles';
import axios from "axios";
import {BaseUrl} from "../api/BaseUrl";

import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form';

const signupSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phoneNumber: yup.string().matches(/^\d{12}$/, 'Invalid phone number').required('Phone number is required'),
});

export default function SignUp() {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onChange'
  });

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${BaseUrl}/api/auth/register`, {
        email: email,
        password: password,
        fname: firstName,
        lname: lastName,
        phone_number: phoneNumber,
        username: firstName,
      }, {
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": "{{ csrf_token }}"
        }
      });

      if (response.data.save === true) {
        navigation.navigate('Login');
      } else {
        console.error('Sign-up error:', response.data.errors);
        Alert.alert('Sign-up Error', 'An error occurred while signing up.');
      }
    } catch (err) {
      if (err.response) {
        // Handle HTTP errors (e.g., 4xx, 5xx)
        console.error('HTTP Error:', err.response.status, err.response.data);
        Alert.alert('HTTP Error', 'An error occurred while making the request.');
      } else if (err.message) {
        // Handle network or request errors
        console.error('Network Error:', err.message);
        Alert.alert('Network Error', 'An error occurred while making the request.');
      } else {
        console.error('Unknown Error:', err);
        Alert.alert('Unknown Error', 'An unknown error occurred.');
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
            <SvgXml xml={logoSvgCode} width="100%" height="100%" />
          </View>
          <Text style={styles.nameText}>erks</Text>
        </View>

        <Text>Earn your money back with us</Text>

        <Text style={styles.signUpText}>Sign Up</Text>

        <View style={styles.nameStyles}>
          <Controller
            control={control}
            name='firstName'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="First name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.halfInput]}
              />
            )}
          />
          <Controller
            control={control}
            name='lastName'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Last name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.halfInput]}
              />
              )}
              />
        </View>
              {errors.firstName && <Text style={styles.errorMsg}>*{errors.firstName.message}</Text>}
        {errors.lastName && <Text style={styles.errorMsg}>*{errors.lastName.message}</Text>}

        <Controller
          control={control}
          name='phoneNumber'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Phone number: 255*********"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        {errors.phoneNumber && <Text style={styles.errorMsg}>*{errors.phoneNumber.message}</Text>}
        <Controller
          control={control}
          name='email'
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email: JohnDoe@gmail.com"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={[styles.input]}
            />
          )}
        />
        {errors.email && <Text style={styles.errorMsg}>*{errors.email.message}</Text>}

        <View style={styles.passwordInputContainer}>
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Password (minimum 6 characters)"
                secureTextEntry={!passwordVisible}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={[styles.input]}
              />
            )}
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
        {errors.password && <Text style={styles.passwordErrorMsg}>*{errors.password.message}</Text>}

        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : (
        <TouchableOpacity
          style={styles.customButton}
          onPress={handleSubmit(handleSignup)}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        )}
        <View style={styles.horizontalLine}></View>
        <Text style={styles.footerText}>Copyright @ {new Date().getFullYear()} Perks</Text>

      </View>
    </ScrollView>
  );
}



