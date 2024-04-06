import React, {useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {View, StyleSheet, Image} from 'react-native';

import {AppImages} from 'assets/image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';

const SplashScreen = ({navigation}: {navigation: any}) => {
  const {colors} = useTheme();
  const styles = Styles(colors);
  const userData = useAppSelector((state: RootState) => state.auth.data);
  const congratulation = useAppSelector(
    (state: RootState) => state.auth.congratulation,
  );

  useEffect(() => {
    const _getSplashFlag = async () => {
      await AsyncStorage.getItem('showSplash')
        .then(res => {
          console.log('hide_intro res', res);
          res
            ? navigation.navigate('Welcome')
            : setTimeout(() => {
                navigation.navigate('Welcome');
              }, 9100);
        })
        .catch(err => {
          console.log('hide_intro err', err);
        });
    };
    {
      userData || (userData && congratulation)
        ? navigation.navigate('BottomNavigation')
        : _getSplashFlag();
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={AppImages.splash.source} style={AppImages.splash.style} />
    </View>
  );
};

export default SplashScreen;

const Styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      // alignItems: 'center',
      // justifyContent: 'center',
    },
  });
