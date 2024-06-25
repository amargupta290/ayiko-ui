/* eslint-disable react-native/no-inline-styles */
import {useTheme} from '@react-navigation/native';
import {
  AppImages,
  BlueDot,
  SVGLoader,
  SVGOfferIcon,
  SVGBorderedCircleIcon,
  SVGBrokenBar,
} from 'assets/image';
import {FButton, ImageComp, Loader} from 'components';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {RootState} from 'store';
import {useAppSelector} from 'hooks';
import {
  checkPaymentStatus,
  getCartDetails,
  sendForApproval,
} from 'store/slices/CartSlice';
import {useDispatch} from 'react-redux';
import {getCustomerByToken, getSupplier} from 'store/slices/authSlice';
import LocationHeader from 'components/LocationHeader';

const OrderDetail = ({navigation, route}: {navigation: any; route: any}) => {
  const {colors, fonts} = useTheme();
  const dispatch = useDispatch();
  const styles = Styles({colors, fonts});
  const [cartData, setCartData] = useState(null);
  const [cartId, setCartId] = useState(route?.params?.id || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sendRequest, setSendRequest] = useState(false);
  const [emptyCartVisible, setEmptyCartVisible] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [pinCode, setPinCode] = useState(null);
  const [address, setAddress] = useState(
    'Behind ganesh temple, New Sangvi, Pune, 411029',
  );
  const [preRender, setPreRender] = useState(true);
  const status = [
    'Send Request',
    'Request Sent Succesfully',
    'Waiting For Supplier Approval',
    'Payment Pending',
    'Payment  Confirmed',
    'Order Placed',
  ];

  const {sendForApprovalData, loading, cartDetailsData} = useAppSelector(
    (state: RootState) => state.cart,
  );

  const {customerData, supplierData} = useAppSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (route?.params?.id && (!cartId || cartId !== route?.params?.id))
      setCartId(route?.params?.id);
    return intervalId && clearInterval(intervalId);
  }, [navigation, cartId, route?.params?.id]);

  const getTotalPrice = (cartItems: any) => {
    return cartItems.reduce(
      (total: number, item: {unitPrice: string; quantity: number}) =>
        total + parseFloat(item.unitPrice) * item.quantity,
      0,
    );
  };

  useEffect(() => {
    const didFocus = navigation.addListener('focus', () => {
      // getCartData();
      if (cartData && !supplierData) {
        dispatch(getSupplier(cartData?.supplierId));
      }
      if (cartId) {
        intervalId && clearInterval(intervalId);
        setEmptyCartVisible(false);
        dispatch(getCartDetails(cartId));
      }
      dispatch(getCustomerByToken());
    });

    // Remove the listener when you are done
    return didFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, cartId]);

  function transformData(data: any) {
    const transformedData: any = {};

    // Transform items
    transformedData.items = {};
    data.items.forEach((item: any) => {
      const newItem = {
        id: item.productId,
        name: item.product.name,
        description: item.product.description,
        category: item.product.category,
        supplierId: item.product.supplierId,
        unitPrice: item.product.unitPrice,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
        createdAt: item.product.createdAt,
        updatedAt: item.product.updatedAt,
        available: item.product.available,
      };
      transformedData.items[item.id] = newItem;
    });

    // Calculate totalPrice
    let totalPrice = 0;
    data.items.forEach((item: any) => {
      totalPrice += item.product.unitPrice * item.quantity;
    });
    transformedData.totalPrice = totalPrice;

    // Add supplierId
    transformedData.supplierId = data.supplierId;
    transformedData.supplier = data.supplier;
    transformedData.customer = data.customer;
    return transformedData;
  }

  const getCartData = async () => {
    // const checkCarData = await getLocalCart();
    if (cartDetailsData) {
      setCartData(await transformData(cartDetailsData));
      setEmptyCartVisible(false);
    }
    // } else {
    //   if (checkCarData) {
    //     setCartData(checkCarData);
    //     setEmptyCartVisible(false);
    //   } else {
    //     setCartData(null);
    //     setEmptyCartVisible(true);
    //   }
    // }
  };

  useEffect(() => {
    if (cartDetailsData) {
      if (cartDetailsData?.paymentDetails?.supplierStatus === 'CONFIRMED') {
        setPaymentModal(false);
      }
      getCartData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartDetailsData]);

  useEffect(() => {
    if (sendForApprovalData) {
      setModalVisible(false);
      setCartId(sendForApprovalData?.id);
    }
  }, [sendForApprovalData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cartId && cartDetailsData?.status !== 'REJECTED') {
        dispatch(getCartDetails(sendForApprovalData?.id ?? cartId));
        console.log('HOLA 111111');
      } else {
        clearInterval(interval);
      }
    }, 10000);
    setIntervalId(interval);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestApproval = (cartData: any) => {
    let products = Object.values(cartData?.items ?? {})?.map((item: any) => {
      return {
        productId: item.id,
        quantity: item.quantity,
      };
    });
    const params = {
      supplierId: cartData?.supplierId,
      customerId: customerData?.id,
      items: products,
      status: 'PENDING',
    };
    setSendRequest(true);
    dispatch(sendForApproval(params));
  };

  const renderOrderItem = () => {
    return (
      <View style={styles.orderItemsCard}>
        <View style={[styles.row, styles.upperCardHeader]}>
          <Text style={styles.title}>
            Cart Id: <Text style={styles.title}>{cartId}</Text>{' '}
          </Text>
        </View>
        <View style={[styles.row, styles.upperCardHeader]}>
          <Text style={styles.headingText}>Items</Text>
        </View>

        <View style={styles.orderItemContainer}>
          {Object.values(cartData?.items)?.map((item: any, i) => {
            return (
              <View style={styles.orderItemCard} key={i}>
                <View style={styles.row}>
                  <View>
                    <Image
                      source={
                        item?.imageUrl?.length
                          ? {
                              uri:
                                item?.imageUrl[0]?.imageUrl ??
                                AppImages.noImg.source,
                            }
                          : AppImages.noImg.source
                      }
                      style={styles.orderItemImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.orderItemTextContainer}>
                    <Text style={styles.headingText}>{item?.name}</Text>
                    <Text style={[styles.title]}>
                      Rs. {item?.unitPrice}/{item.category}
                    </Text>
                    <Text style={styles.available}>
                      {item?.available ? 'In Stock' : 'Out of Stock'}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderItemQty}>
                  <TouchableOpacity
                    onPress={async () => {
                      // await setCarItem(item, null, item.quantity, getCartData);
                      // getCartData();
                    }}
                    disabled={
                      !!cartDetailsData?.status || !!(item.quantity <= 0)
                    }>
                    <Feather name="minus" size={16} color={colors.black} />
                  </TouchableOpacity>

                  <Text style={styles.quantity}> {item?.quantity}</Text>
                  <TouchableOpacity
                    onPress={async () => {
                      // await setCarItem(item, 'add', item.quantity, getCartData);
                      // getCartData();
                    }}
                    disabled={!!cartDetailsData?.status}>
                    <Feather name="plus" size={16} color={colors.black} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
        {!cartDetailsData?.status && (
          <>
            <View style={styles.grayBreaker}></View>

            <View style={styles.orderActionBtnContainer}>
              <FButton
                label="Add more items"
                buttonClick={() =>
                  navigation.navigate('SupplierScreen', {
                    id: cartData?.supplierId,
                  })
                }
                containerStyle={styles.orderActionBtn}
                labelStyle={styles.orderActionBtnTxt}
                leftIconStyle={styles.leftIconStyle}
                iconLib="Material"
                leftIcon="plus"
                size={18}
              />
              <FButton
                label="Apply coupon"
                buttonClick={() => {}}
                containerStyle={styles.orderActionBtn}
                labelStyle={styles.orderActionBtnTxt}
                leftIconStyle={styles.leftIconStyle}
                leftIcon={
                  <View style={{marginRight: 5}}>
                    <SVGOfferIcon />
                  </View>
                }
                size={18}
              />
            </View>
          </>
        )}
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
              Rs. {getTotalPrice(Object.values(cartData?.items))}
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
              Rs. {getTotalPrice(Object.values(cartData?.items))}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const header = () => {
    return (
      <>
        <LocationHeader navigation={navigation} />
        <View style={styles.headerContainer}>
          {/* <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => navigation.navigate('AddressScreen')}>
          <View style={styles.locationheader}>
            <Feather name="map-pin" size={16} color={colors.black} />
            <Text style={styles.locationTitle}>
              {pinCode ? pinCode : 'Delivery Location'}
            </Text>
            <Feather name="chevron-down" size={16} color={colors.black} />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>
            {address}
          </Text>
        </TouchableOpacity> */}
        </View>
      </>
    );
  };

  const renderSendRequestView = () => {
    return (
      <View>
        <Text>Order Status</Text>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.sendRequestButton}>
            <Text style={styles.buttonText}>Send Request</Text>
          </View>
        </TouchableOpacity>

        {/* </View> */}
      </View>
    );
  };

  const renderStatusBar = (props: any) => {
    return (
      <>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        {status.map((item: string, index: number) => (
          <View
            style={{flexDirection: 'row', gap: 10, alignItems: 'flex-start'}}
            key={index}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 2,
              }}>
              <SVGBorderedCircleIcon />
              {index + 1 == status.length ? <></> : <SVGBrokenBar />}
            </View>
            <View>
              <Text
                style={{
                  ...styles.statusBarText,
                  color:
                    props.i >= index
                      ? colors.green
                      : props.i + 1 === index
                      ? colors.primary
                      : props.color,
                }}>
                {item}
              </Text>
            </View>
          </View>
        ))}
      </>
    );
  };

  const renderApprovedRequestView = () => {
    console.log(
      'renderApprovedRequestView cartDetailsData',
      cartDetailsData?.status === 'ACCEPTED' &&
        cartDetailsData?.paymentDetails?.supplierStatus === 'CONFIRMED',
    );
    return (
      <View>
        <Text style={styles.title}>Order status</Text>
        <View style={{marginTop: 20}}>
          {cartDetailsData?.status === 'PENDING'
            ? renderStatusBar({color: 'black', i: 1})
            : !cartDetailsData && sendRequest
            ? renderStatusBar({color: 'black', i: 0})
            : cartDetailsData?.status === 'ACCEPTED' &&
              cartDetailsData?.paymentDetails?.supplierStatus !== 'CONFIRMED'
            ? renderStatusBar({color: 'black', i: 2})
            : cartDetailsData?.status === 'ACCEPTED' &&
              cartDetailsData?.paymentDetails?.supplierStatus === 'CONFIRMED' &&
              renderStatusBar({color: 'black', i: 6})}
        </View>
        {cartDetailsData?.status === 'ACCEPTED' &&
          cartDetailsData?.paymentDetails?.supplierStatus !== 'CONFIRMED' && (
            <View style={{padding: 10}}>
              <Text style={styles.title}>Supplier Payment Details: </Text>
              <Text>
                Account No.: {cartDetailsData?.supplier?.bankAccountNumber}
              </Text>
              <Text>
                Mobile Money No.: {cartDetailsData?.supplier?.mobileMoneyNumber}
              </Text>
              <Text style={styles.title}>
                After payment processing click on Place Order
              </Text>
            </View>
          )}
      </View>
    );
  };

  const renderNoItemInCartModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={emptyCartVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setEmptyCartVisible(!emptyCartVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Feather name="shopping-cart" size={45} />
              <Text style={styles.headingText}>No Items in Cart</Text>

              <View style={styles.footerButton}>
                <FButton
                  label="Add Items"
                  buttonClick={() => {
                    setEmptyCartVisible(!emptyCartVisible);
                    navigation.goBack();
                  }}
                  containerStyle={{
                    ...styles.footerBtnContainer,
                    ...styles.cancelBtn,
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.headingText}>Confirm</Text>
              <Text style={styles.modalDescriptionText}>
                You want to send request to the supplier?
              </Text>
              {loading && <ActivityIndicator />}
              <View style={styles.footerButton}>
                <FButton
                  label="No"
                  buttonClick={() => setModalVisible(!modalVisible)}
                  containerStyle={{
                    ...styles.footerBtnContainer,
                    ...styles.cancelBtn,
                  }}
                />
                <FButton
                  label="Yes"
                  buttonClick={() => handleRequestApproval(cartData)}
                  containerStyle={[
                    styles.footerBtnContainer,
                    {backgroundColor: colors.primary},
                  ]}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderPaymentStatusModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={paymentModal}
          onRequestClose={() => {
            setPaymentModal(false);
          }}>
          <TouchableWithoutFeedback onPress={() => setPaymentModal(false)}>
            <View style={styles.centeredView}>
              {preRender ? (
                <View style={styles.modalView}>
                  {/* <SVGLoader /> */}
                  <Text style={styles.headingText}>Are you sure</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setPreRender(false);
                        dispatch(checkPaymentStatus({id: cartDetailsData?.id}));
                      }}>
                      <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        setPaymentModal(false);
                      }}>
                      <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.modalView}>
                  <SVGLoader />
                  <Text style={styles.headingText}>Payment Confirmation</Text>
                  <Text style={styles.modalDescriptionText}>
                    <BlueDot />{' '}
                    <Text style={styles.modalDescriptionText}>
                      Waiting for supplier’s payment confirmation
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={loading} />
      <ScrollView style={styles.scroll}>
        {header()}
        <View style={styles.content}>
          {/* {orderDetailCard()} */}
          {cartData && (
            <>
              {renderOrderItem()}
              {!cartDetailsData
                ? renderSendRequestView()
                : renderApprovedRequestView()}
              {orderCalculationCard()}
              {
                <View>
                  {cartDetailsData?.status === 'ACCEPTED' &&
                    cartDetailsData?.paymentDetails?.customerStatus !=
                      'CONFIRMED' && (
                      <FButton
                        label="Place Order"
                        buttonClick={() => {
                          setPreRender(true);

                          setPaymentModal(true);
                        }}
                        disabled={!!(cartDetailsData?.status !== 'ACCEPTED')}
                        containerStyle={{
                          ...styles.footerBtnContainer,
                          backgroundColor:
                            cartDetailsData?.status === 'ACCEPTED'
                              ? colors.primary
                              : colors.subHeading,
                        }}
                      />
                    )}
                </View>
              }
              {renderModal()}
              {renderPaymentStatusModal()}
            </>
          )}
          {renderNoItemInCartModal()}
          {/* {renderRequestAction()} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetail;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      marginHorizontal: 10,
    },
    scroll: {
      flex: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: 22,
    },
    footerButton: {
      marginTop: 50,
      flexDirection: 'row',
      gap: 16,
      width: 250,
    },
    sendRequestButton: {
      marginTop: 10,
      backgroundColor: colors.buttonPrimary,
      borderRadius: 8,
      paddingVertical: 10,
      display: 'flex',
      alignItems: 'center',
      width: 112,
    },
    cancelBtn: {
      backgroundColor: colors.subHeading,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    nullContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerBtnContainer: {
      flex: 1,
      marginTop: 5,
      backgroundColor: colors.subHeading,
    },
    headerContainer: {
      marginVertical: 10,
      // backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray,
    },
    grayBreaker: {
      borderBottomWidth: 1,
      borderBottomColor: colors.gray,
      top: 10,
    },
    container: {
      padding: 24,
      backgroundColor: colors.background,
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
      // color: colors.white,
      paddingHorizontal: 8,
    },
    buttonText: {
      ...fonts.regular,
      color: colors.white,
      fontSize: 12,
    },
    modalDescriptionText: {
      ...fonts.regular,
      marginTop: 10,
      color: colors.subheading,
      fontSize: 15,
      textAlign: 'center',
    },
    locationText: {
      ...fonts.description,
      color: colors.primary,
      lineHeight: 12,
      paddingLeft: 24,
      paddingBottom: 10,
    },
    leftIconStyle: {
      color: colors.primary,
      marginRight: 4,
    },
    addCard: {
      borderRadius: 10,
      height: 110,
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
    },
    orderItemImage: {
      height: 66,
      width: 70,
      borderRadius: 8,
      marginRight: 10,
    },
    orderItemCard: {
      // borderRadius: 10,
      width: '100%',
      justifyContent: 'space-between',
      alignSelf: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      marginVertical: 10,
      flexDirection: 'row',

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
      justifyContent: 'space-between',
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
    statusBarText: {
      ...fonts.regular,
      color: colors.title,
      fontSize: 12,
    },

    available: {
      ...fonts.description,
      color: colors.green,
      marginBottom: 2,
    },
    quantity: {
      ...fonts.regular,
      color: colors.primary,
      marginBottom: 2,
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
      gap: 5,
      top: 20,
    },
    orderActionBtn: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 5,
      height: 36,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderBlockColor: colors.primary,
      elevation: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    orderActionBtnTxt: {
      ...fonts.subHeading,
      color: colors.primary,
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
  });
