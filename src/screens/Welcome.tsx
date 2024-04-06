import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {SVGLoginLogo} from 'assets/image';
import {FButton} from 'components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({navigation}: {navigation: any}) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});

  useEffect(() => {
    const setSplashOpened = async () => {
      await AsyncStorage.setItem(
        'showSplash',
        JSON.stringify({showSplash: true}),
      );
    };
    setSplashOpened();
  }, []);

  return (
    <View style={styles.container}>
      <SVGLoginLogo />
      <View style={styles.content}>
        <Text style={styles.heading}>
          Welcome to the world’s most imaginative marketplace
        </Text>
        <FButton
          label="Login as a customer"
          buttonClick={() => navigation.navigate('Login', {role: 'customer'})}
          containerStyle={styles.btnContainerStyle}
        />
        <FButton
          border
          label="Login as a supplier"
          buttonClick={() => navigation.navigate('Login', {role: 'supplier'})}
          containerStyle={styles.btnContainerStyle}
        />
        <FButton
          border
          label="Login as a driver"
          buttonClick={() => navigation.navigate('Login', {role: 'driver'})}
          containerStyle={styles.btnContainerStyle}
        />
        {/* <FButton
          border
          label="Login as a admin"
          buttonClick={() => {}}
          containerStyle={styles.btnContainerStyle}
        /> */}
        <Text style={styles.account}>
          Don’t have an account?{' '}
          <Text
            style={styles.signUp}
            onPress={() => navigation.navigate('SignUpWelcome')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      borderRadius: 30,
      backgroundColor: colors.white,
      padding: 24,
      paddingBottom: 48,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    heading: {
      ...fonts.heading,
      color: colors.heading,
      textAlign: 'center',
      marginBottom: 40,
    },
    btnContainerStyle: {
      marginVertical: 8,
    },
    account: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      marginTop: 24,
    },
    signUp: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });
