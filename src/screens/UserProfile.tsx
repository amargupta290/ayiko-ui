import {useTheme} from '@react-navigation/native';
import {
  SVGBusinessInfo,
  SVGLanguage,
  SVGMembership,
  SVGOrderIcon,
  SVGPaymentMethod,
  SVGPrivcacyPolicy,
  SVGProfilePic,
} from 'assets/image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAppDispatch, useAppSelector} from 'hooks';
import {
  getCustomerByToken,
  getSupplierByToken,
  signOut,
} from 'store/slices/authSlice';
import {RootState} from 'store';

const UserProfileScreen = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});

  const isLoading = useAppSelector(
    (state: RootState) => state.dashboard.loading,
  );

  const {customerData, supplierData, role} = useAppSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (role == 'supplier') {
      dispatch(getSupplierByToken());
    } else {
      dispatch(getCustomerByToken());
    }
  }, [dispatch]);

  const supplierRows = [
    {name: 'Membership', icon: <SVGMembership />, navigation: ''},
    {
      name: 'Privacy policy and setting',
      icon: <SVGPrivcacyPolicy />,
      navigation: '',
    },
    {name: 'Payment Method', icon: <SVGPaymentMethod />, navigation: ''},
    {name: 'Language', icon: <SVGLanguage />, navigation: ''},
    {
      name: 'Business Info',
      icon: <SVGBusinessInfo />,
      navigation: 'AddBusinessInfo',
    },
    {name: 'Logout', icon: <SVGMembership />, navigation: 'logout'},
  ];

  const customerRows = [
    // {name: 'Membership', icon: <SVGMembership />, navigation: ''},
    {name: 'My Orders', icon: <SVGOrderIcon />, navigation: 'OrderList'},
    {name: 'Payment Method', icon: <SVGPaymentMethod />, navigation: ''},
    {name: 'Language', icon: <SVGLanguage />, navigation: ''},
    {
      name: 'Privacy policy and setting',
      icon: <SVGPrivcacyPolicy />,
      navigation: '',
    },
    {name: 'Logout', icon: <SVGMembership />, navigation: 'logout'},
  ];

  const getNavRows = () => {
    console.log('customerData', customerData);
    return role == 'supplier' ? supplierRows : customerRows;
  };

  const cardClick = async (text: string) => {
    if (text === 'logout') {
      await AsyncStorage.clear();
      await AsyncStorage.setItem(
        'showSplash',
        JSON.stringify({showSplash: true}),
      );
      navigation.navigate('Welcome');
      dispatch(signOut());
    } else {
      navigation.navigate(text);
    }
  };

  console.log('customerData', customerData);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 100}}>
      <View style={styles.circle1}>
        <View style={styles.circle2}>
          <View style={styles.circle3}>
            <View style={styles.circle4}>
              <SVGProfilePic height={'100%'} width={'100%'} />
              <View style={styles.editContainer}>
                <FontAwesome name="pencil" />
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.userName}>
          {role == 'supplier'
            ? supplierData?.ownerName
            : customerData?.fullName}
        </Text>
        <FontAwesome name="pencil" />
      </View>
      <Text style={styles.heading}>Account </Text>
      {getNavRows()?.map((item, key) => (
        <TouchableOpacity
          style={styles.card}
          key={key}
          onPress={() => cardClick(item.navigation)}>
          <View style={styles.cardContent}>
            <View style={styles.icon}>{item.icon}</View>
            <Text style={styles.cardTitle}>{item.name}</Text>
          </View>
          <Feather name="chevron-right" size={20} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default UserProfileScreen;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
    },
    heading: {
      ...fonts.bold,
      color: colors.heading,
    },
    circle1: {
      borderWidth: 1,
      borderColor: 'rgba(33, 150, 243, 0.05)',
      borderRadius: 310,
      width: 310,
      height: 310,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle2: {
      borderWidth: 1,
      borderColor: 'rgba(33, 150, 243, 0.2)',
      borderRadius: 260,
      width: 260,
      height: 260,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle3: {
      borderWidth: 1,
      borderColor: 'rgba(33, 150, 243, 0.4)',
      borderRadius: 100,
      width: 210,
      height: 210,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle4: {
      borderWidth: 1,
      borderColor: 'rgba(33, 150, 243, 1)',
      borderRadius: 100,
      width: 160,
      height: 160,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 100,
    },
    editContainer: {
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 16,
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      position: 'absolute',
      right: 0,
      bottom: 5,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    userName: {
      ...fonts.medium,
      color: colors.primary,
    },
    cardTitle: {
      ...fonts.regular,
      color: colors.heading,
    },
    card: {
      borderRadius: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      marginVertical: 8,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    icon: {
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 16,
      padding: 8,
      borderRadius: 50,
    },
  });
