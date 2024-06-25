import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';
import {RootState} from 'store';
import globalHelpers from '../utils/helpers';
import {
  AppImages,
  SVGCatalogAddButton,
  SVGNotification,
  SVGProfilePic,
  SVGSearch,
} from 'assets/image';
import {catalogList} from 'store/slices/catalogSlice';
import {FButton, ImageComp, Loader} from 'components';
import {
  supplierApprovalRequest,
  supplierOrders,
} from 'store/slices/SupplierSlice';
import {getSupplierByToken} from 'store/slices/authSlice';
import {
  acceptCart,
  rejectCart,
  updatePaymentStatus,
} from 'store/slices/CartSlice';
import OrderList from './OrderList';

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
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [state, setState] = useState<Number | null>(null);
  const [dataItem, setDataItem] = useState<any>(null);

  const catalogData = useAppSelector((state: RootState) => state.catalog.data);
  const supplierData = useAppSelector(
    (state: RootState) => state.auth.supplierData,
  );
  const {supplierApprovalRequestData, supplierOrdersData} = useAppSelector(
    (state: RootState) => state.supplier,
  );

  const {acceptCartData, rejectCartData, paymentStatusData} = useAppSelector(
    (state: RootState) => state.cart,
  );
  const isLoading = useAppSelector((state: RootState) => state.cart.loading);

  console.log(
    'supplierData supplierApprovalRequestData',
    JSON.stringify(supplierOrdersData, null, 2),
  );

  useEffect(() => {
    dispatch(getSupplierByToken());
  }, [dispatch]);

  useEffect(() => {
    if (supplierData?.id) {
      let params = {
        id: supplierData?.id,
        status: '',
      };
      dispatch(catalogList(supplierData?.id));
      activeTab
        ? dispatch(supplierOrders())
        : dispatch(supplierApprovalRequest(params));
    }
  }, [dispatch, supplierData]);

  const areAllProductsAvailable = (data: any) => {
    let totalQuantity = 0;
    let available = true;
    for (let item of data?.items) {
      if (!item?.product?.available) {
        available = false; // If any product is not available, return false
      }
      totalQuantity += item.quantity;
    }
    return {available: available, totalQuantity: totalQuantity}; // If all products are available, return true
  };

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    let params = {
      id: supplierData?.id,
      status: '',
    };
    activeTab
      ? dispatch(supplierOrders())
      : dispatch(supplierApprovalRequest(params));
    closePopup();
  }, [acceptCartData, rejectCartData, activeTab, paymentStatusData]);

  const onConfirm = () => {
    // Handle confirmation action here
    if (state === 0) {
      dispatch(acceptCart({id: dataItem?.id}));
    } else if (state === 1) {
      dispatch(rejectCart({id: dataItem?.id}));
    } else if (state === 2) {
      dispatch(updatePaymentStatus({id: dataItem?.id, status: 'CONFIRMED'}));
    } else if (state === 3) {
      dispatch(updatePaymentStatus({id: dataItem?.id, status: 'REJECTED'}));
    }
  };

  const renderOrderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() =>
          navigation.navigate('SupplierOrderDetailsScreen', {
            data: !!activeTab ? item?.cart : item,
            available: areAllProductsAvailable(item)?.available,
          })
        }
        key={index}>
        <View
          style={[
            styles.row,
            {
              width: Dimensions.get('window').width - 150,
              justifyContent: 'space-between',
              gap: 10,
            },
          ]}>
          <Text style={styles.orderName}>
            {!!activeTab
              ? item?.cart?.customer?.fullName
              : item.customer?.fullName}{' '}
            - {item?.id}
          </Text>
          {!activeTab && (
            <Text style={styles.orderStock}>
              {areAllProductsAvailable(item)?.available
                ? 'In Stock'
                : 'Out of Stock'}
            </Text>
          )}
        </View>
        <View style={{gap: 16, marginVertical: 8, width: '70%'}}>
          <View style={{gap: 10}}>
            <Text>Qty: {areAllProductsAvailable(item)?.totalQuantity}</Text>
            {!!activeTab && (
              <View>
                <Text>Customer: {item?.cart?.customer?.fullName}</Text>
                <View style={[styles.row, {gap: 4}]}>
                  <Text>Address: </Text>
                  <Text>
                    {item?.deliveryAddress?.addressLine1
                      ? item?.deliveryAddress?.addressLine1
                      : 'no location found'}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <Text numberOfLines={1} style={styles.orderDesc}>
          {item.description}
        </Text>
        <View
          style={{
            ...styles.row,
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}>
          <Text style={styles.orderStatus}>
            {globalHelpers?.getSupplierOrderStatus(item)}
          </Text>

          {!activeTab && item?.status === 'PENDING' ? (
            <View style={styles.orderActionBtnContainer}>
              {/* {activeTab && paymentDetails?.customerStatus?.toLowerCase === "confirmed"} */}
              <FButton
                label="Approve"
                buttonClick={() => {
                  openPopup();
                  setState(0);
                  setDataItem(item);
                }}
                containerStyle={styles.orderActionBtn}
                labelStyle={styles.orderActionBtnTxt}
              />
              <FButton
                label="Reject"
                buttonClick={() => {
                  openPopup();
                  setState(1);
                  setDataItem(item);
                }}
                containerStyle={{
                  ...styles.orderActionBtn,
                  backgroundColor: colors.red,
                }}
                labelStyle={styles.orderActionBtnTxt}
              />
            </View>
          ) : item?.paymentDetails?.customerStatus === 'CONFIRMED' &&
            item?.paymentDetails?.supplierStatus !== 'CONFIRMED' ? (
            <View style={styles.orderActionBtnContainer}>
              <FButton
                label="Approve"
                buttonClick={() => {
                  openPopup();
                  setState(2);
                  setDataItem(item);
                }}
                containerStyle={styles.orderActionBtn}
                labelStyle={styles.orderActionBtnTxt}
              />
              <FButton
                label="Reject"
                buttonClick={() => {
                  openPopup();
                  setState(3);
                  setDataItem(item);
                }}
                containerStyle={{
                  ...styles.orderActionBtn,
                  backgroundColor: colors.red,
                }}
                labelStyle={styles.orderActionBtnTxt}
              />
            </View>
          ) : (
            <></>
          )}
        </View>
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
            In-Progress
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
                uri: item?.imageUrl[0]?.imageUrl,
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
            {/* <View style={styles.searchWrapper}>
              <SVGSearch />
              <TextInput
                placeholder="Search for items or orders"
                style={styles.searchInput}
              />
            </View>
            <SVGNotification fill={colors.white} strokeWidth="2" /> */}
          </View>
        </View>
      </>
    );
  };

  const renderConfirmationPopup = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={closePopup}>
        <TouchableWithoutFeedback onPress={closePopup}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.messageText}>
                Are you sure you want to proceed?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onConfirm}>
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={closePopup}>
                  <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
          data={
            activeTab
              ? supplierOrdersData
              : supplierApprovalRequestData?.filter(item => !item?.orderId)
          }
          renderItem={renderOrderItem}
          ListHeaderComponent={listOrderHeaderComp}
        />
        {renderConfirmationPopup()}
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
      paddingBottom: 10,
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
      flex: 1 / 3,
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
      width: 70,
    },
    orderStatus: {
      ...fonts.subHeading,
      color: 'green',
      fontSize: 14,
      width: 150,
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
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    messageText: {
      marginBottom: 20,
      fontSize: 18,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
