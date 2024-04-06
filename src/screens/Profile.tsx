import {useTheme} from '@react-navigation/native';
import {AppImages} from 'assets/image';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const ProfileScreen = () => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>More Features Coming Soon</Text>
      <Image
        source={AppImages.comingSoon.source}
        resizeMode="contain"
        style={AppImages.comingSoon.style}
      />
    </View>
  );
};

export default ProfileScreen;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      ...fonts.heavy,
      color: colors.white,
    },
  });
