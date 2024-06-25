import {useTheme} from '@react-navigation/native';
import {AppImages, NoteIcon} from 'assets/image';
import {FButton, ImageComp, Loader} from 'components';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  I18nManager,
  Image,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {createMapLink} from 'react-native-open-maps';
import {
  acceptCart,
  getCartDetails,
  rejectCart,
  updatePaymentStatus,
} from 'store/slices/CartSlice';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';
import SelectDropdown from 'react-native-select-dropdown';
import {
  assignDriver,
  assignToSelf,
  getDrivers,
  orderDetails,
} from 'store/slices/DriverSlice';
import DriverDeliveryDetail from './DriverDliveryDetail';

const OrderDetailsScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const dispatch = useDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [data, setdata] = useState();
  const [options, setOptions] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [state, setState] = useState<Number | null>(null);
  const [dataItem, setDataItem] = useState<any>(null);

  const {cartDetailsData, acceptCartData, paymentStatusData} = useAppSelector(
    (state: RootState) => state.cart,
  );
  const {currentUser} = useAppSelector((state: RootState) => state.auth);

  const {
    drivers,
    orderDetailsRes,
    selfAssignDriverRes,
    assignDriverRes,
    loading,
  } = useAppSelector((state: RootState) => state.driver);

  console.log('orderDetailsRes', JSON.stringify(currentUser, null, 2));

  useEffect(() => {
    dispatch(getCartDetails(route?.params?.data?.id));
  }, [
    route?.params?.data?.id,
    acceptCartData,
    paymentStatusData,
    selfAssignDriverRes,
    assignDriverRes,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(getDrivers());
    // dispatch(orderDetails('1a2d0537-88b9-4a42-842a-0b7f547248c9'));
  }, [dispatch]);

  useEffect(() => {
    if (cartDetailsData?.orderId || route?.params?.data?.id) {
      console.log(
        'cartDetailsData?.orderId',
        cartDetailsData?.orderId || route?.params?.data?.id,
      );
      dispatch(
        orderDetails(cartDetailsData?.orderId || route?.params?.data?.id),
      );
    }
  }, [cartDetailsData]);

  useEffect(() => {
    if (drivers) {
      setOptions([...drivers, {name: 'Self Assign', id: 'Self Assign'}]);
    }
  }, [drivers]);

  useEffect(() => {
    //TODO: When order data coming correctly
    // if (orderDetailsRes) {
    //   setdata(orderDetailsRes);
    // } else
    if (cartDetailsData) {
      setdata(cartDetailsData);
    }
  }, [cartDetailsData]);

  const calculateTotal = (items: any) => {
    let total = 0;
    if (!items) {
      return;
    }
    // Iterate over each item and calculate the total cost
    items.forEach(item => {
      const quantity = parseInt(item?.quantity); // Convert quantity to integer
      const unitPrice = parseFloat(item?.product?.unitPrice); // Convert unitPrice to float
      total += quantity * unitPrice;
    });

    return total;
  };

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const onConfirm = () => {
    // Handle confirmation action here
    if (state === 0) {
      dispatch(acceptCart({id: data?.id}));
    } else if (state === 1) {
      dispatch(rejectCart({id: data?.id}));
    } else if (state === 2) {
      dispatch(updatePaymentStatus({id: data?.id, status: 'CONFIRMED'}));
    } else if (state === 3) {
      dispatch(updatePaymentStatus({id: data?.id, status: 'REJECTED'}));
    }
  };

  const renderOrderItem = () => {
    return (
      <View style={styles.orderItemsCard}>
        <View style={[styles.row, styles.upperCardHeader]}>
          <Text style={styles.headingText}>Order Details</Text>
        </View>
        <View style={styles.orderItemContainer}>
          {data?.items?.map((item: any, i: number) => {
            return (
              <View style={styles.orderItemCard} key={i}>
                <View style={styles.row}>
                  <View>
                    <ImageComp
                      source={
                        item?.product?.imageUrl?.length
                          ? {uri: item?.product?.imageUrl[0]?.imageUrl}
                          : AppImages.noImg.source
                      }
                      resizeMode="cover"
                      imageStyle={styles.orderItemImage}
                    />
                  </View>
                  <View style={styles.orderItemTextContainer}>
                    <Text style={styles.headingText}>
                      {item?.product?.name}
                    </Text>
                    <Text style={[styles.title]}>
                      Rs. {item?.product?.unitPrice}/{item.product?.category}
                    </Text>
                    <Text
                      style={{
                        ...styles.available,
                        color: item?.product?.available
                          ? colors.green
                          : colors.red,
                      }}>
                      {item?.product?.available ? 'In Stock' : 'Out of Stock'}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderItemQty}>
                  <Text style={styles.quantity}> {item?.quantity}/</Text>
                  <Text style={styles.unitText}>{item?.product?.category}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const _openGoogleMap = async (data: any) => {
    Linking.openURL(
      createMapLink({
        provider: Platform?.OS === 'ios' ? 'apple' : 'google',
        query: 'Coffee Shop',
        latitude: data?.deliveryAddress?.lat
          ? data?.deliveryAddress?.lat
          : 37.484847,
        longitude: data?.deliveryAddress?.long
          ? data?.deliveryAddress?.long
          : -122.148386,
      }),
    );
  };

  const orderDetailCard = () => {
    return (
      <View style={styles.addCard}>
        <View style={[styles.row, styles.upperCardHeader]}>
          <Text style={styles.headingText}>Delivery Request</Text>
          <View>
            <Text
              style={{
                ...styles.available,
                color: route?.params?.available ? colors.green : colors.red,
              }}>
              {route?.params?.available ? 'In stock' : 'Out of stock'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.row, styles.orderDetailTextContainer]}
          onPress={() => {
            _openGoogleMap(data);
          }}>
          <Image
            source={require('assets/image/logos_google-maps.png')}
            resizeMode="contain"
            style={styles.orderDetailAddressImage}
          />
          <Text style={styles.title}>Delivery Address: </Text>
          <Text style={{...styles.title, color: colors.primary}}>
            {data?.deliveryAddress?.addressLine1
              ? data?.deliveryAddress?.addressLine1
              : 'New sangvi, Pune'}
          </Text>
        </TouchableOpacity>
        <View style={[styles.row, styles.orderDetailLowerTextContainer]}>
          <View style={styles.orderDetailNoteIcon}>
            <NoteIcon />
          </View>
          <Text style={styles.title}>Order ID: </Text>
          <Text style={styles.title}>#{data?.id}</Text>
        </View>
      </View>
    );
  };

  const orderCalculationCard = () => {
    return (
      <View style={styles.orderCalculationCard}>
        <View style={[styles.row, styles.upperCardHeader]}>
          <Text style={styles.headingText}>Bill Details</Text>
        </View>
        <View style={styles.orderCalculationInnerContainer}>
          <View style={[styles.row, styles.orderCalculationTextContainer]}>
            <Text style={styles.calculationPrice}>Subtotal </Text>
            <Text style={styles.calculationPrice}>
              Rs. {calculateTotal(data?.items)}
            </Text>
          </View>
          <View style={[styles.row, styles.orderCalculationTextContainer]}>
            <Text style={styles.calculationPrice}>Promocode </Text>
            <Text style={styles.calculationPrice}>-0</Text>
          </View>
          <View style={[styles.row, styles.orderCalculationTextContainer]}>
            <Text style={styles.calculationPrice}>Delivery Fee </Text>
            <Text style={styles.calculationPrice}>Rs. 0</Text>
          </View>
          <View style={[styles.row, styles.orderCalculationTextContainer]}>
            <Text style={styles.calculationPrice}>Tax & other Fee </Text>
            <Text style={styles.calculationPrice}>Rs. 0</Text>
          </View>
          <View style={styles.breaker}></View>
          <View style={[styles.row, styles.orderCalculationTextContainer]}>
            <Text style={styles.calculationTotalPrice}>Total </Text>
            <Text style={styles.calculationTotalPrice}>
              Rs. {calculateTotal(data?.items)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderRequestAction = () => {
    return (
      <>
        {data?.status === 'PENDING' && (
          <View style={styles.orderActionContainer}>
            <Text style={styles.headingText}>Approval Pending</Text>
            <View style={styles.orderActionBtnContainer}>
              <FButton
                label="Approve"
                buttonClick={() => {
                  openPopup();
                  setState(0);
                }}
                containerStyle={styles.orderActionBtn}
                labelStyle={styles.orderActionBtnTxt}
              />
              <FButton
                label="Reject"
                buttonClick={() => {
                  openPopup();
                  setState(1);
                }}
                containerStyle={{
                  ...styles.orderActionBtn,
                  backgroundColor: colors?.red,
                }}
                labelStyle={styles.orderActionBtnTxt}
              />
            </View>
          </View>
        )}
      </>
    );
  };

  const renderPaymentRequestAction = () => {
    return (
      <>
        {data?.paymentDetails?.customerStatus === 'CONFIRMED' &&
          data?.paymentDetails?.supplierStatus !== 'CONFIRMED' && (
            <View style={styles.orderActionContainer}>
              <Text style={styles.headingText}>Payment Status</Text>
              <View style={styles.orderActionBtnContainer}>
                <FButton
                  label="Approve"
                  buttonClick={() => {
                    openPopup();
                    setState(3);
                  }}
                  containerStyle={styles.orderActionBtn}
                  labelStyle={styles.orderActionBtnTxt}
                />
                <FButton
                  label="Reject"
                  buttonClick={() => {
                    openPopup();
                    setState(4);
                  }}
                  containerStyle={{
                    ...styles.orderActionBtn,
                    backgroundColor: colors?.red,
                  }}
                  labelStyle={styles.orderActionBtnTxt}
                />
              </View>
            </View>
          )}
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
      <Loader isLoading={loading} />
      <ScrollView style={styles.content}>
        {orderDetailCard()}
        {renderOrderItem()}
        {orderCalculationCard()}
        {renderRequestAction()}
        {renderPaymentRequestAction()}
        <View>
          {data?.orderId &&
            (!orderDetailsRes?.driverId ? (
              <SelectDropdown
                data={options}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  if (selectedItem?.id === 'Self Assign') {
                    dispatch(
                      assignToSelf({
                        id: data?.orderId || orderDetailsRes?.id,
                      }),
                    );
                  } else {
                    dispatch(
                      assignDriver({
                        driver_id: selectedItem?.id,
                        id: data?.orderId || orderDetailsRes?.id,
                      }),
                    );
                  }
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(selectedItem && selectedItem.name) || 'Choose Driver'}
                      </Text>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View
                      style={{
                        ...styles.dropdownItemStyle,
                        ...(isSelected && {backgroundColor: '#D2D9DF'}),
                      }}>
                      {/* <Icon name={item.icon} style={styles.dropdownItemIconStyle} /> */}
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item.name}
                      </Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    marginHorizontal: 8,
                  }}>
                  <Text style={styles.title}>Assigned Driver: </Text>
                  <Text style={{...fonts.regular, color: colors.primary}}>
                    {orderDetailsRes?.assignedToSelf
                      ? (currentUser?.businessName ||
                          currentUser?.businessName) + '  (Self assigned)'
                      : drivers?.find(
                          (item: any) => item.id === orderDetailsRes?.driverId,
                        )?.name}
                  </Text>
                </View>
                {orderDetailsRes?.assignedToSelf && (
                  <View style={{marginTop: 10}}>
                    <DriverDeliveryDetail
                      navigation={navigation}
                      route={{params: {data: orderDetailsRes, header: true}}}
                    />
                  </View>
                )}
              </>
            ))}
        </View>
        <View style={{padding: 30}}></View>
        {renderConfirmationPopup()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      marginHorizontal: 10,
    },
    container: {
      padding: 24,
      backgroundColor: colors.background,
    },
    addCard: {
      borderRadius: 10,
      height: 130,
      width: '100%',
      alignSelf: 'center',
      marginVertical: 10,
      paddingHorizontal: 8,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
    },
    orderDetailAddressImage: {
      height: 16,
      width: 10,
      alignSelf: 'center',
      marginRight: 5,
    },
    orderDetailNoteIcon: {
      top: 2.5,
      left: -2.5,
      right: 0,
    },
    orderItemsCard: {
      borderRadius: 10,
      height: 'auto',
      width: '100%',
      alignSelf: 'center',
      marginVertical: 10,
      paddingBottom: 30,
      backgroundColor: colors.white,
      paddingHorizontal: 8,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
    },
    orderItemContainer: {
      top: 15,
    },
    row: {
      flexDirection: 'row',
    },
    upperCardHeader: {
      justifyContent: 'space-between',
      top: 10,
    },
    orderDetailTextContainer: {
      top: 25,
    },
    orderDetailLowerTextContainer: {
      top: 30,
      width: Dimensions.get('window').width - 140,
    },
    orderItemImage: {
      height: 66,
      width: 70,
      borderRadius: 8,
      marginRight: 10,
    },
    orderItemCard: {
      borderRadius: 10,
      width: '100%',
      justifyContent: 'space-between',
      alignSelf: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      marginVertical: 10,
      flexDirection: 'row',
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
      paddingHorizontal: 8,
    },
    orderItemTextContainer: {
      marginTop: 5,
    },
    orderItemQty: {
      borderRadius: 10,
      height: 24,
      width: 80,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      marginHorizontal: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
      paddingHorizontal: 8,
    },
    orderCalculationTextContainer: {
      justifyContent: 'space-between',
    },
    orderCalculationCard: {
      borderRadius: 10,
      height: 'auto',
      width: '100%',
      alignSelf: 'center',
      paddingBottom: 30,
      marginVertical: 10,
      paddingHorizontal: 8,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
    },
    breaker: {
      width: '100%',
      height: 1,
      borderBottomWidth: 1,
    },
    orderCalculationInnerContainer: {
      marginTop: 20,
      rowGap: 10,
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
      justifyContent: 'center',
      flex: 1,
    },
    headingText: {
      ...fonts.medium,
    },
    title: {
      ...fonts.regular,
      color: colors.title,
      marginBottom: 2,
    },
    available: {
      ...fonts.description,
      color: colors.green,
      marginBottom: 2,
    },
    quantity: {
      ...fonts.regular,
      color: colors.primary,
      fontSize: 16,
    },
    unitText: {
      ...fonts.regular,
      color: colors.primary,
      fontSize: 12,
    },
    calculationPrice: {
      ...fonts.subHeading,
    },
    calculationTotalPrice: {
      ...fonts.bold,
    },
    orderActionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 16,
      paddingHorizontal: 8,
    },
    orderActionBtnContainer: {
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'flex-end',
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
    dropdownButtonStyle: {
      width: '100%',
      height: 50,
      marginTop: 20,
      backgroundColor: '#E9ECEF',
      borderRadius: 12,
      borderBlockColor: colors.borderColor,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
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
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
