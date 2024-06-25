import {useTheme} from '@react-navigation/native';
import {
  AppImages,
  NoteIcon,
  SVGBurger,
  SVGDeliveryMan,
  SVGRoad,
} from 'assets/image';
import {FButton, ImageComp, Loader} from 'components';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  completeDelivery,
  orderDetails,
  sendDriverLocationCoords,
  startDelivery,
} from 'store/slices/DriverSlice';
import {createMapLink} from 'react-native-open-maps';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';
import {Example} from '../services';

const DriverDeliveryDetail = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const dispatch = useDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [data, setdata] = useState(route.params?.data);
  const [location, setLocation] = useState<any>(null);
  const {cartDetailsData, acceptCartData, paymentStatusData} = useAppSelector(
    (state: RootState) => state.cart,
  );

  const {orderDetailsRes, startDeliveryRes, completeDeliveryRes, loading} =
    useAppSelector((state: RootState) => state.driver);

  console.log(
    'DriverDeliveryDetail data',
    JSON.stringify(orderDetailsRes, null, 2),
  );

  useEffect(() => {
    //TODO: When order data coming correctly
    if (orderDetailsRes) {
      setdata(orderDetailsRes);
    }
  }, [orderDetailsRes]);

  useEffect(() => {
    dispatch(orderDetails(route?.params?.data?.id));
  }, [
    route?.params?.data?.id,
    startDeliveryRes,
    completeDeliveryRes,
    dispatch,
  ]);

  useEffect(() => {
    if (startDeliveryRes) {
      if (Platform?.OS === 'android') Example.startService();
    }
  }, [startDeliveryRes]);

  useEffect(() => {
    if (completeDeliveryRes) {
      if (Platform?.OS === 'android') Example.stopService();
    }
  }, [completeDeliveryRes]);

  const MyEventEmitter =
    Platform.OS !== 'ios' &&
    new NativeEventEmitter(NativeModules?.MyEventEmitter);

  useEffect(() => {
    const subscription =
      Platform.OS !== 'ios' &&
      MyEventEmitter.addListener(
        'LocationUpdateEvent',
        async (locationCoords: {latitude: number; longitude: number}) => {
          console.log(
            'Received locationCoords from native NativeModules:',
            locationCoords,
            orderDetailsRes,
          );
          if (locationCoords) {
            const {latitude, longitude} = locationCoords;
            setLocation({
              latitude,
              longitude,
            });
            if (location?.latitude !== latitude) {
              dispatch(
                sendDriverLocationCoords({
                  id: orderDetailsRes?.id,
                  locationData: {
                    latitude,
                    longitude,
                  },
                }),
              );
            }
          }
          // Handle data received from native side
        },
      );
    console.log(
      'Received locationCoords from native NativeModules:',
      subscription,
    );
    return () => {
      console.log('HOLAAA Removed');
      subscription.remove();
    };
  }, []);

  // Don't forget to unsubscribe when component unmounts

  const _openGoogleMap = async () => {
    Linking.openURL(
      createMapLink({
        provider: Platform?.OS === 'ios' ? 'apple' : 'google',
        query: 'Destination',
        latitude: orderDetailsRes?.deliveryAddress?.location
          ? orderDetailsRes?.deliveryAddress?.location?.latitude
          : 37.484847,
        longitude: orderDetailsRes?.deliveryAddress?.location
          ? orderDetailsRes?.deliveryAddress?.location?.longitude
          : -122.148386,
      }),
    );
  };

  const orderDetailCard = () => {
    return (
      <View style={styles.addCard}>
        <View style={[styles.row, styles.upperCardHeader]}>
          <Text style={styles.headingText}>Delivery Request</Text>
        </View>
        <TouchableOpacity
          style={[styles.row, styles.orderDetailTextContainer]}
          onPress={_openGoogleMap}>
          <Image
            source={require('assets/image/logos_google-maps.png')}
            resizeMode="contain"
            style={styles.orderDetailAddressImage}
          />
          <Text style={styles.title}>Delivery Address: </Text>
          <Text style={{...styles.title, color: colors.primary}}>
            {orderDetailsRes?.deliveryAddress?.addressLine1
              ? orderDetailsRes?.deliveryAddress?.addressLine1
              : 'No location found'}
          </Text>
        </TouchableOpacity>
        <View style={[styles.row, styles.orderDetailLowerTextContainer]}>
          <View style={styles.orderDetailNoteIcon}>
            <NoteIcon />
          </View>
          <Text style={styles.title}>Order ID: </Text>
          <Text style={styles.title}>#{orderDetailsRes?.id}</Text>
        </View>
      </View>
    );
  };

  const checkStartDeliveryEnabled = () => {
    if (orderDetailsRes?.assignedToSelf) {
      return ['DELIVERY_COMPLETED', 'DRIVER_DISPATCHED', 'DRIVER_REJECTED'];
    } else {
      return [
        'DELIVERY_COMPLETED',
        'DRIVER_ASSIGNED',
        'DRIVER_DISPATCHED',
        'DRIVER_REJECTED',
      ];
    }
  };

  const orderCalculationCard = () => {
    return (
      <View style={{marginHorizontal: 8}}>
        <View style={{marginVertical: 10}}>
          <Text>Order Delivery Status</Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginVertical: 10,
          }}>
          <FButton
            label="Start Delivery"
            buttonClick={() => {
              dispatch(startDelivery({id: orderDetailsRes?.id}));
            }}
            disabled={
              !!checkStartDeliveryEnabled().includes(
                orderDetailsRes?.driverStatus,
              )
            }
            containerStyle={{
              ...styles.orderActionBtn,
              backgroundColor: !!checkStartDeliveryEnabled().includes(
                orderDetailsRes?.driverStatus,
              )
                ? colors.subHeading
                : colors.primary,
            }}
            labelStyle={styles.orderActionBtnTxt}
          />
          <FButton
            label="End Delivery"
            buttonClick={() => {
              dispatch(completeDelivery({id: orderDetailsRes?.id}));
            }}
            disabled={
              !![
                'DELIVERY_COMPLETED',
                'DRIVER_ACCEPTED',
                'DRIVER_ASSIGNED',
              ].includes(orderDetailsRes?.driverStatus)
            }
            containerStyle={{
              ...styles.orderActionBtn,
              backgroundColor: !![
                'DELIVERY_COMPLETED',
                'DRIVER_ACCEPTED',
                'DRIVER_ASSIGNED',
              ].includes(orderDetailsRes?.driverStatus)
                ? colors?.subHeading
                : colors.primary,
            }}
            labelStyle={styles.orderActionBtnTxt}
          />
        </View>
        <View>
          <View
            style={{
              left:
                orderDetailsRes?.driverStatus === 'DELIVERY_COMPLETED'
                  ? '90%'
                  : '0%',
            }}>
            <SVGDeliveryMan />
          </View>
          <SVGRoad width={'100%'} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Loader isLoading={isLoading} /> */}
      <ScrollView
        style={{
          ...styles.content,
          marginHorizontal: !route?.params?.header ? 10 : 0,
        }}>
        {!route?.params?.header && orderDetailCard()}
        {orderCalculationCard()}
        <View
          style={{
            position: 'absolute',
            top: 'auto',
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <FButton
            label="Cancel"
            // buttonClick={() => {
            //   dispatch(acceptCart({id: data?.id}));
            // }}
            containerStyle={styles.orderActionBtn}
            labelStyle={styles.orderActionBtnTxt}
          />
          <FButton
            label="Complete"
            // buttonClick={() => {
            //   dispatch(rejectCart({id: data?.id}));
            // }}
            containerStyle={{
              ...styles.orderActionBtn,
            }}
            labelStyle={styles.orderActionBtnTxt}
          />
        </View>
        <View style={{padding: 30}}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverDeliveryDetail;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      // marginHorizontal: 10,
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
      flexDirection: 'row',
      width: '60%',
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
      backgroundColor: colors.primary,
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
