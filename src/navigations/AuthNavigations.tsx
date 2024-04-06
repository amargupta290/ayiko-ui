import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CongratulationScreen,
  LoginScreen,
  SignUpScreen,
  SignUpWelcomeScreen,
  SplashScreen,
  WelcomeScreen,
  SupplierSignUpScreen,
} from 'screens';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  const {colors, fonts} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={'Splash'}
      screenOptions={{
        headerTintColor: colors.heading,
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={SplashScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="SignUpWelcome"
        component={SignUpWelcomeScreen}
      />
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false,
          headerBackTitleStyle: {
            fontSize: 1,
          },
        }}
        name="SignUp"
        component={SignUpScreen}
      />
      <Stack.Screen
        options={{
          title: 'Sign Up',
          headerBackTitleVisible: false,
          headerBackTitleStyle: {
            fontSize: 1,
          },
        }}
        name="SupplierSignUpScreen"
        component={SupplierSignUpScreen}
      />
      <Stack.Screen
        options={{title: 'Login', headerTransparent: true}}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Congratulation"
        component={CongratulationScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
