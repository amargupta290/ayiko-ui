import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';
import {RootState} from 'store';
import {
  SVGCatalogAddButton,
  SVGNotification,
  SVGProfilePic,
  SVGSearch,
} from 'assets/image';
import {catalogList} from 'store/slices/catalogSlice';
import {FButton, ImageComp, Loader} from 'components';
import {supplierApprovalRequest} from 'store/slices/SupplierSlice';
import {getSupplierByToken} from 'store/slices/authSlice';
import {acceptCart, rejectCart} from 'store/slices/CartSlice';

const SupplierHomeScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});

  const [address, setAddress] = useState(
    'Behind ganesh temple, New Sangvi, Pune, 411029',
  );
  const [pinCode, setPinCode] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const catalogData = useAppSelector((state: RootState) => state.catalog.data);
  const supplierData = useAppSelector(
    (state: RootState) => state.auth.supplierData,
  );
  const {supplierApprovalRequestData} = useAppSelector(
    (state: RootState) => state.supplier,
  );

  const {acceptCartData, rejectCartData} = useAppSelector(
    (state: RootState) => state.cart,
  );
  const isLoading = useAppSelector((state: RootState) => state.cart.loading);

  console.log(
    'supplierData supplierApprovalRequestData',
    JSON.stringify(supplierApprovalRequestData, null, 2),
  );

  useEffect(() => {
    dispatch(getSupplierByToken());
  }, [dispatch]);

  useEffect(() => {
    if (supplierData?.id) {
      let params = {
        id: supplierData?.id,
        status: !activeTab ? 'PENDING' : 'ACCEPTED',
      };
      dispatch(catalogList(supplierData?.id));
      dispatch(supplierApprovalRequest(params));
    }
  }, [dispatch, supplierData]);

  useEffect(() => {
    let params = {
      id: supplierData?.id,
      status: !activeTab ? 'PENDING' : 'ACCEPTED',
    };
    dispatch(supplierApprovalRequest(params));
  }, [acceptCartData, rejectCartData, activeTab]);

  const areAllProductsAvailable = (data: any) => {
    let totalQuantity = 0;
    let available = true;
    for (let item of data.items) {
      if (!item.product.available) {
        available = false; // If any product is not available, return false
      }
      totalQuantity += item.quantity;
    }
    return {available: available, totalQuantity: totalQuantity}; // If all products are available, return true
  };

  const renderOrderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() =>
          navigation.navigate('SupplierOrderDetailsScreen', {
            data: item,
            available: areAllProductsAvailable(item)?.available,
          })
        }
        key={index}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={styles.orderName}>
            {item.customer?.fullName} - {item?.id}
          </Text>
          <Text style={styles.orderStock}>
            {areAllProductsAvailable(item)?.available
              ? 'In Stock'
              : 'Out of Stock'}
          </Text>
        </View>
        <View style={[styles.row, {gap: 16, marginVertical: 8}]}>
          <Text>Qty: {areAllProductsAvailable(item)?.totalQuantity}</Text>
          <View style={[styles.row, {gap: 4}]}>
            <Feather name="star" color={colors.yellow} />
            <Text>{item.rating ?? 4.5}</Text>
          </View>
        </View>
        <Text numberOfLines={1} style={styles.orderDesc}>
          {item.description}
        </Text>
        {!activeTab && (
          <View style={styles.orderActionBtnContainer}>
            {/* {activeTab && paymentDetails?.customerStatus?.toLowerCase === "confirmed"} */}
            <FButton
              label="Approve"
              buttonClick={() => {
                dispatch(acceptCart({id: item?.id}));
              }}
              containerStyle={styles.orderActionBtn}
              labelStyle={styles.orderActionBtnTxt}
            />
            <FButton
              label="Reject"
              buttonClick={() => dispatch(rejectCart({id: item?.id}))}
              containerStyle={{
                ...styles.orderActionBtn,
                backgroundColor: colors.red,
              }}
              labelStyle={styles.orderActionBtnTxt}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const listOrderHeaderComp = () => {
    return (
      <View style={styles.orderHeader}>
        <TouchableOpacity
          onPress={() => setActiveTab(0)}
          style={[
            styles.orderHeaderBtn,
            activeTab === 0 && styles.activeOrderHeaderBtn,
          ]}>
          <Text
            style={[
              styles.orderHeaderBtnTxt,
              activeTab === 0 && styles.activeOrderHeaderBtnTxt,
            ]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab(1)}
          style={[
            styles.orderHeaderBtn,
            activeTab === 1 && styles.activeOrderHeaderBtn,
          ]}>
          <Text
            style={[
              styles.orderHeaderBtnTxt,
              activeTab === 1 && styles.activeOrderHeaderBtnTxt,
            ]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCatalogItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.catalogCard}
        onPress={() =>
          navigation.navigate('NewCatalogScreen', {
            catalogData: item,
          })
        }>
        <View>
          <View style={styles.imgContainer}>
            <ImageComp
              source={{
                uri: item?.imageUrl[0],
              }}
              imageStyle={{
                width: '100%',
                height: undefined,
                aspectRatio: 1.4,
                borderRadius: 4,
              }}
              resizeMode="cover"
            />
          </View>
        </View>
        <Text style={styles.catalogTitle}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.searchWrapper}>
              <SVGSearch />
              <TextInput
                placeholder="Search for items or supplier"
                style={styles.searchInput}
              />
            </View>
            <SVGNotification fill={colors.white} strokeWidth="2" />
          </View>
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => navigation.navigate('AddressScreen')}>
            <View style={styles.locationheader}>
              <Feather name="map-pin" size={16} color={colors.white} />
              <Text style={styles.locationTitle}>
                {pinCode ? pinCode : 'Delivery Location'}
              </Text>
              <Feather name="chevron-down" size={16} color={colors.white} />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>
              {address}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.heading}>Catalog </Text>
          <Text
            style={styles.subHeading}
            onPress={() => navigation.navigate('CatalogScreen')}>
            View all
          </Text>
        </View>
        <View>
          {catalogData && catalogData?.length > 0 ? (
            <FlatList
              data={catalogData?.slice(0, 6) || []}
              numColumns={3}
              keyExtractor={item => item.id.toString()}
              renderItem={renderCatalogItem}
            />
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('NewCatalogScreen')}>
              <SVGCatalogAddButton width={'100%'} />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.subHeaderContainer, {marginTop: 24}]}>
          <Text style={styles.heading}>Orders </Text>
          {/* <Text style={styles.subHeading}>View all</Text> */}
        </View>
        <FlatList
          style={styles.orderList}
          data={supplierApprovalRequestData ?? []}
          renderItem={renderOrderItem}
          ListHeaderComponent={listOrderHeaderComp}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupplierHomeScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 24,
      backgroundColor: colors.background,
    },
    userInfo: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      gap: 11,
    },
    userInfoContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    userName: {
      ...fonts.heavy,
      color: colors.white,
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
      height: 45,
    },
    heading: {
      ...fonts.bold,
      color: colors.heading,
    },
    subHeaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    subHeading: {
      ...fonts.description,
      color: colors.heading,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryImg: {
      backgroundColor: colors.white,
      borderRadius: 6,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowRadius: 8,
      elevation: 8,
      shadowOpacity: 1,
      flex: 1,
      height: 61,
      width: 61,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      marginRight: 16,
    },
    offerHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 12,
    },
    categoryHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 10,
      textAlign: 'center',
    },
    nearRHeading: {
      ...fonts.heading,
      color: colors.heading,
      fontSize: 13,
    },
    nearRSubHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 10,
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

    btnContainerStyle: {
      marginVertical: 8,
      marginTop: 32,
    },
    account: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      marginTop: 24,
    },
    inputContainerStyle: {
      marginVertical: 8,
    },
    forgotPasswordContainer: {
      alignSelf: 'flex-end',
    },
    forgotPassword: {
      ...fonts.heading,
      color: colors.heading,
      fontSize: 13,
      textDecorationLine: 'underline',
    },
    signUp: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    locationContainer: {
      paddingHorizontal: 16,
    },
    locationheader: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginBottom: 2,
    },
    locationTitle: {
      ...fonts.regular,
      color: colors.white,
      paddingHorizontal: 8,
    },
    locationText: {
      ...fonts.description,
      color: colors.gray,
      lineHeight: 12,
      paddingLeft: 24,
      paddingBottom: 10,
    },
    catalogCard: {
      flex: 1,
      margin: 7,
    },
    catalogTitle: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      paddingTop: 6,
    },
    imgContainer: {
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: {width: 1, height: 0},
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
      borderRadius: 6,
      // borderWidth: 1,
      // borderColor: Colors.CARD_BORDER_COLOR,
      flex: 1,
    },
    orderCard: {
      borderRadius: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
      padding: 15,
      elevation: 8,
      marginHorizontal: 15,
      marginVertical: 4,
    },
    orderName: {
      ...fonts.subHeading,
      color: colors.heading,
    },
    orderDesc: {
      ...fonts.description,
      color: colors.subHeading,
    },
    orderStock: {
      ...fonts.description,
      color: 'green',
    },
    orderList: {
      marginTop: 17,
      borderRadius: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 8,
      // padding: 15,
    },
    orderHeader: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    orderHeaderBtn: {
      flex: 1,
      alignItems: 'center',
      borderBottomWidth: 3,
      borderBottomColor: colors.border,
      padding: 20,
    },
    activeOrderHeaderBtn: {
      borderBottomColor: colors.primary,
    },
    orderHeaderBtnTxt: {
      ...fonts.regular,
      // color: 'green',
    },
    activeOrderHeaderBtnTxt: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    orderActionBtnContainer: {
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'flex-end',
      paddingTop: 16,
    },
    orderActionBtn: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 5,
      backgroundColor: '#10c300',
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 8,
    },
    orderActionBtnTxt: {
      ...fonts.description,
      color: colors.white,
    },
  });
