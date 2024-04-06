import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';

import {SVGSearch} from 'assets/image';
import {RootState} from 'store';
import {ImageComp, Loader} from 'components';
import {getCartList} from 'store/slices/CartSlice';

const OrderList = ({navigation, route}: {navigation: any; route: any}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const isLoading = useAppSelector(
    (state: RootState) => state.dashboard.loading,
  );

  const customerData = useAppSelector(
    (state: RootState) => state.auth.customerData,
  );

  const {cartListData} = useAppSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (customerData) {
      dispatch(getCartList(customerData?.id));
    }
  }, [dispatch, customerData]);

  // console.log('cartListData', JSON.stringify(cartListData, null, 2));

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {marginBottom: cartListData?.length == index + 1 ? 150 : 8},
        ]}
        onPress={() => navigation.navigate('OrderDetailScreen', {id: item?.id})}
        key={index}>
        <ImageComp
          source={{
            uri: item?.supplier?.businessImages
              ? item?.supplier?.businessImages[0]
              : '',
          }}
          imageStyle={styles.image}
        />
        <View style={styles.cardDescription}>
          <Text style={styles.title}>{item?.supplier?.companyName}</Text>
          <Text style={styles.available}>Order date: {'02/03/2024'}</Text>
          {/* <Text style={styles.unitPrice}>{'4.5'}</Text> */}
        </View>
        <View style={{justifyContent: 'center'}}>
          <Feather name="chevron-right" size={18} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderTitle = () => {
    return (
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          alignItems: 'center',
        }}>
        <Text style={styles.title}>Past Orders</Text>
      </View>
    );
  };

  const headerComponent = () => {
    return (
      <View
        style={[
          styles.headerContainer,
          {height: 80, justifyContent: 'center'},
        ]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={25} color={colors.white} />
          </Pressable>
          <View style={styles.searchWrapper}>
            <SVGSearch />
            <TextInput
              placeholder="Search for items or cartListData"
              style={styles.searchInput}
            />
          </View>

          <Feather name="bell" size={32} color={colors.white} />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />
      {headerComponent()}
      {renderTitle()}
      <FlatList
        style={styles.container}
        data={cartListData ?? []}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default OrderList;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    headerContainer: {
      backgroundColor: colors.primary,
    },
    header: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      // paddingVertical: 15,
      paddingBottom: 5,
      alignItems: 'center',
      gap: 11,
    },
    searchWrapper: {
      borderRadius: 26,
      backgroundColor: colors.white,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    searchInput: {
      ...fonts.subHeading,
      color: colors.subHeading,
      flex: 1,
      marginHorizontal: 4,
      height: 35,
    },
    heading: {
      ...fonts.bold,
      color: colors.heading,
    },
    subHeading: {
      ...fonts.description,
      color: colors.heading,
    },
    row: {
      marginTop: 16,
      marginBottom: 32,
    },
    card: {
      flexDirection: 'row',
      flex: 1,
      borderRadius: 10,
      backgroundColor: colors.white,
      marginVertical: 8,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      padding: 11,
    },
    image: {
      borderRadius: 8,
      width: 70,
      height: 70,
    },
    cardDescription: {
      marginLeft: 8,
      justifyContent: 'space-around',
      flex: 1,
    },
    title: {
      ...fonts.regular,
      color: colors.title,
      marginBottom: 2,
    },
    available: {
      ...fonts.description,
      fontSize: 12,
      // color: colors.green,
      marginBottom: 2,
    },
    unitPrice: {
      ...fonts.description,
      color: colors.subHeading,
    },
  });
