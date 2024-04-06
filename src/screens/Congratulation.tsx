import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useAppDispatch, useAppSelector} from 'hooks';
import {AppImages} from 'assets/image';
import {FButton} from 'components';
import {
  congratulationUpdate,
  setCongratulationView,
} from 'store/slices/authSlice';
import {RootState} from 'store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CongratulationScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {fromPage} = route.params;
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const role = useAppSelector((state: RootState) => state.auth.role);

  console.log('login screen navigation CongratulationScreen');

  const okClick = async () => {
    dispatch(congratulationUpdate());
    dispatch(setCongratulationView(false));
    await AsyncStorage.clear();
    if (role == 'supplier') {
      navigation.navigate('Login', {role: 'supplier'});
    } else {
      navigation.navigate('Login', {role: 'customer'});
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={AppImages.congratulation.source}
          style={AppImages.congratulation.style}
        />
        <Text style={styles.heading}>Congratulation!!</Text>
        <Text style={styles.subHeading}>
          You are registered in successfully.
        </Text>
        <FButton
          label="OK"
          buttonClick={() => okClick()}
          containerStyle={styles.btnContainerStyle}
        />
        <Ionicons name="close-circle" style={styles.closeIcon} />
      </View>
    </View>
  );
};

export default CongratulationScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: 'center',
    },
    content: {
      margin: 30,
      borderRadius: 20,
      backgroundColor: colors.white,
      padding: 24,
      alignItems: 'center',
    },
    heading: {
      ...fonts.heavy,
      color: colors.heading,
      textAlign: 'center',
      marginTop: 18,
    },
    subHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      marginTop: 5,
    },
    btnContainerStyle: {
      marginTop: 24,
      paddingHorizontal: 50,
      paddingVertical: 10,
    },
    closeIcon: {
      position: 'absolute',
      top: -10,
      right: -10,
      fontSize: 32,
    },
  });
