import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import styles from '../screenstyles/scannerStyles';
import { usePerksContext } from '../context';
import axios from 'axios';
import { BaseUrl } from '../api/BaseUrl';

export default function App() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser, setUserPointsUpdated, userPointsUpdated } = usePerksContext();
  useFocusEffect(
      React.useCallback(() => {
        // This function is called when the screen comes into focus
        setScanned(true);
        if (userPointsUpdated === true){
          setUserPointsUpdated(false);
          setScanned(false);
        }
      }, [])
  );
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    if (!currentUser) {
      alert('Please log in to record transactions.');
      setScanned(false); 
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
          `${BaseUrl}/api/coupon?querytype=single&coupon=${data}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );
      let points = parseFloat(response.data?.start_amount) / 2000
      const pointsRsp =  await  axios.post(
          `${BaseUrl}/api/user-restraurant`,
          {
            user: currentUser.id,
            restraurant:response.data?.restraurant.id,
            total_points: points,
            coupon:response.data?.id
          }
      )
      if (pointsRsp.data) {
        navigation.navigate('SpecificVendorStack', {screen: 'SpecificVendor',
          params: {
            restraurant: response.data?.restraurant.name,
            restId: response.data?.restraurant.id,
            total_points_earned: points
          }
        });
        setUserPointsUpdated(userPointsUpdated+1);
        const message = `Congratulations! You just earned ${points} points at ${response.data?.restraurant?.name}.`;
        alert(message, [
          {
            text: 'OK',
            onPress: () => {
              setScanned(false);
            },
          },
        ]);
      }
    } catch (err) {
      alert('An error occurred:', err.message);
      setScanned(false); 
    } finally {
      setLoading(false);
    }
  };
  const handlefalse = () => {
    setScanned(false);
  };
  if (hasPermission === null) {
    return <Text style={styles.statusText}>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.statusText}>No access to camera</Text>;
  }
  return (
      <View style={styles.container}>
        <View style={styles.background}>
          {hasPermission && !scanned && (
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={styles.barcodeScanner}
            />
          )}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="larger" color="#fff" />
            </View>
          )}

          {scanned === true && (
            <TouchableOpacity style={styles.tapToScan} onPress={() => handlefalse()}>
              <Text style={styles.tapToScanText}>Tap to scan</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.scanText}>Scan QR code</Text>
            <View>
              <Text style={styles.explanationText}>
                Scan the Perks QR code to get your exclusive points back.
              </Text>
            </View>
            
          </View>
        </View>
      </View>
  );
}