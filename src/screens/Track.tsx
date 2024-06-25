/* eslint-disable react-hooks/exhaustive-deps */
import BottomSheet from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {
  SVGBorderedCircleIcon,
  SVGBrokenBar,
  SVGPhoneIcon,
  SVGdriverIcon,
} from 'assets/image';
import {useAppSelector} from 'hooks';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker, LatLng} from 'react-native-maps';
import {useDispatch} from 'react-redux';
import {RootState} from 'store';
import {orderDetails} from 'store/slices/DriverSlice';
import call from 'react-native-phone-call';
import debounce from 'lodash/debounce';

import MovingMarkerMap from 'components/MovingMarkerMap';
import helpers from 'utils/helpers';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TrackScreen = ({navigation, route}: any) => {
  const {colors, fonts}: any = useTheme();
  const bottomSheetRef = useRef({});
  const dispatch = useDispatch();
  const styles = Styles({colors, fonts});
  const source: LatLng = {latitude: 37.78825, longitude: -122.4324};
  const destination: LatLng = {latitude: 37.7749, longitude: -122.4194};
  const [travelTime, setTravelTime] = useState<any>(null);
  const routeCoordinates: LatLng[] = [
    {latitude: 37.78825, longitude: -122.4324},
    {latitude: 37.7875, longitude: -122.432}, // Example additional coordinate 1
    {latitude: 37.786, longitude: -122.432}, // Example additional coordinate 2
    {latitude: 37.785, longitude: -122.431},
    // Add more coordinates here for the route
  ];
  const {
    drivers,
    orderDetailsRes,
    selfAssignDriverRes,
    assignDriverRes,
    loading,
  } = useAppSelector((state: RootState) => state.driver);

  const handleMarkerPress = () => {
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    dispatch(orderDetails(route?.params?.id));
  }, [route?.params?.id]);

  // console.log(
  //   'orderDetailsRes Track',
  //   JSON.stringify(orderDetailsRes, null, 2),
  // );

  const status = [
    'Order Placed',
    'Driver assigned to Order',
    'On the way',
    'Order Delivered',
  ];

  const handleOnCall = (number: number) => {
    const args = {
      number: number, // String value with the number to call
      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call
      skipCanOpen: true, // Skip the canOpenURL check
    };

    call(args).catch(console.error);
  };

  // useEffect(() => {
  //   if (!source || !destination) return;

  //   const getTravelTime = async () => {
  //     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${source}&destinations=${destination}&key=${helpers?.API_KEY}`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     console.log('data rows elements', data.rows[0].elements[0]);
  //     // dispatch(setTravelTimeInfo(data.rows[0].elements[0]));
  //   };

  //   getTravelTime();
  // }, [source, destination]);

  // useEffect(() => {
  //   // Fetch route coordinates only if source coordinates change
  //   const fetchRoute = debounce(fetchRouteCoordinates, 1000); // Debounce API call with a delay of 1 second
  //   fetchRoute(sourceCoordinates);

  //   // Cleanup function to cancel any pending API requests
  //   return () => {
  //     fetchRoute.cancel();
  //   };
  // }, [sourceCoordinates]);

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
      'renderApprovedRequestView orderDetailsRes?.cart',
      orderDetailsRes?.cart?.status === 'ACCEPTED' &&
        orderDetailsRes?.cart?.paymentDetails?.supplierStatus === 'CONFIRMED',
    );
    return (
      <View>
        {/* <Text style={styles.title}>Order status</Text> */}
        <View style={{paddingTop: 10}}>
          {orderDetailsRes?.cart?.status === 'PENDING'
            ? renderStatusBar({color: 'black', i: 1})
            : !orderDetailsRes?.cart
            ? renderStatusBar({color: 'black', i: 0})
            : orderDetailsRes?.cart?.status === 'ACCEPTED' &&
              orderDetailsRes?.cart?.paymentDetails?.supplierStatus !==
                'CONFIRMED'
            ? renderStatusBar({color: 'black', i: 2})
            : orderDetailsRes?.cart?.status === 'ACCEPTED' &&
              orderDetailsRes?.cart?.paymentDetails?.supplierStatus ===
                'CONFIRMED' &&
              renderStatusBar({color: 'black', i: 6})}
        </View>
        {orderDetailsRes?.cart?.status === 'ACCEPTED' &&
          orderDetailsRes?.cart?.paymentDetails?.supplierStatus !==
            'CONFIRMED' && (
            <View style={{padding: 10}}>
              <Text style={styles.title}>Supplier Payment Details: </Text>
              <Text>
                Account No.:{' '}
                {orderDetailsRes?.cart?.supplier?.bankAccountNumber}
              </Text>
              <Text>
                Mobile Money No.:{' '}
                {orderDetailsRes?.cart?.supplier?.mobileMoneyNumber}
              </Text>
              <Text style={styles.title}>
                After payment processing click on Place Order
              </Text>
            </View>
          )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={region => setRegion(region)}>
        <Marker
          coordinate={{latitude: 37.78825, longitude: -122.4324}}
          title="Marker"
          onPress={handleMarkerPress}
        />
      </MapView> */}
      <MovingMarkerMap
        source={source}
        destination={destination}
        orderDetails={orderDetailsRes}
        orderId={route?.params?.id}
        setTravelTime={(v: any) => setTravelTime(v)}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['10%', '50%', '90%']}
        index={0}
        // enablePanDownToClose
        backgroundComponent={() => (
          <View style={styles.bottomSheetHeader}>
            <Text>Draggable Handle</Text>
          </View>
        )}>
        <View style={styles.bottomSheetContent}>
          {/* <Text>Bottom Sheet Content</Text> */}
          {travelTime && (
            <View style={styles.estimatedTimeContainer}>
              <Text style={styles.estimatedText}>
                Estimated Delivery Time:{' '}
              </Text>
              <Text style={styles.estimatedText}>{travelTime}</Text>
            </View>
          )}
          <View style={styles.statusContainer}>
            {renderApprovedRequestView()}
          </View>
          <View style={styles.breakBar}></View>
          <View style={styles.orderDetailContainer}>
            <View>
              <Text
                style={{
                  ...styles.estimatedText,
                  fontSize: 15,
                  color: colors.subHeading,
                }}>
                {orderDetailsRes?.cart?.items[0]?.product?.name}
              </Text>
              <Text
                style={{
                  ...styles.estimatedText,
                  fontSize: 10,
                  color: colors.subHeading,
                }}>
                {orderDetailsRes?.address ||
                  'Near Mansi Angan,New sangvi, Pune'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('OrderDetailScreen', {
                  id: orderDetailsRes?.cart?.id,
                })
              }>
              <Text
                style={{
                  ...styles.estimatedText,
                  fontSize: 10,
                  color: colors.primary,
                }}>
                See Details
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.breakBar}></View>
          {orderDetailsRes?.driver ? (
            <>
              <View
                style={{
                  ...styles.orderDetailContainer,
                  justifyContent: '',
                  gap: 10,
                }}>
                <SVGdriverIcon />
                <View>
                  <Text
                    style={{
                      ...styles.estimatedText,
                      fontSize: 15,
                      color: colors.subHeading,
                    }}>
                    {orderDetailsRes?.driver?.name}
                  </Text>
                  <Text
                    style={{
                      ...styles.estimatedText,
                      fontSize: 10,
                      color: colors.subHeading,
                    }}>
                    {orderDetailsRes?.address || 'Is picking up your order'}
                  </Text>
                </View>
              </View>
              <View style={styles.orderDetailContainer}>
                <View>
                  <Text
                    style={{
                      ...styles.estimatedText,
                      fontSize: 15,
                      color: colors.subHeading,
                    }}>
                    {orderDetailsRes?.driver?.vehicleNumber}
                  </Text>
                  <Text
                    style={{
                      ...styles.estimatedText,
                      fontSize: 10,
                      color: colors.subHeading,
                    }}>
                    {orderDetailsRes?.driver?.phone}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleOnCall(orderDetailsRes?.driver?.phone)}>
                  <SVGPhoneIcon />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.orderDetailContainer}>
              <View>
                <Text
                  style={{
                    ...styles.estimatedText,
                    fontSize: 15,
                    color: colors.subHeading,
                  }}>
                  Order Submitted
                </Text>
                <Text
                  style={{
                    ...styles.estimatedText,
                    fontSize: 10,
                    color: colors.subHeading,
                  }}>
                  {'Waiting for action'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleOnCall(orderDetailsRes?.driver?.phone)}>
                <SVGPhoneIcon />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BottomSheet>
    </View>
  );
};
export default TrackScreen;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    bottomSheetHeader: {
      backgroundColor: 'white',
      alignItems: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    bottomSheetContent: {
      flex: 1,
      backgroundColor: 'white',
    },
    estimatedTimeContainer: {
      width: width,
      paddingHorizontal: 8,
      marginVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    estimatedText: {
      ...fonts.regular,
      color: colors.black,
      FontSize: 20,
    },
    statusContainer: {
      paddingHorizontal: 8,
    },
    breakBar: {
      height: 0.5,
      backgroundColor: colors.subHeading,
      width: '100%',
      marginVertical: 10,
    },
    space: {
      flexDirection: 'row',
    },
    statusBarText: {
      ...fonts.regular,
      color: colors.title,
      fontSize: 12,
    },
    orderDetailContainer: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      marginVertical: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
