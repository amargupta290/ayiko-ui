// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import {useTheme} from '@react-navigation/native';
// import Feather from 'react-native-vector-icons/Feather';
// import {RootState} from 'store';
// import {useAppSelector} from 'hooks';
// import helpers from 'utils/helpers';
// import Geolocation from '@react-native-community/geolocation';
// import {Alert} from 'react-native';
// import {TextStyle, ViewStyle} from 'react-native-size-matters';
// import {PERMISSIONS, check} from 'react-native-permissions';

// interface LocationHeaderInterface {
//   show?: boolean;
//   addressSetter?: () => void;
//   okClick?: () => void;
//   cancelClick?: () => void;
//   containerStyle?: ViewStyle;
//   title?: string;
//   subTitle?: string;
//   titleStyle?: TextStyle;
//   subTitleStyle?: TextStyle;
//   navigation: any;
// }

// const defaultProps = {
//   show: false,
// };

// const LocationHeader = (props: LocationHeaderInterface) => {
//   const {colors, fonts} = useTheme();
//   const styles = StyleSheet.create(Styles({colors, fonts}));
//   const [, setLocation] = useState<any>(null);
//   const [address, setAddress] = useState<string>('Fetching location...');
//   const [pinCode, setPinCode] = useState<string>('');
//   const [, setAddressDetails] = useState<any>(null);
//   // const {currentUser, userLocation} = useAppSelector(
//   //   (state: RootState) => state.auth,
//   // );

//   const getLocationCoords = () => {
//     return new Promise((resolve, reject) => {
//       Geolocation.getCurrentPosition(
//         position => {
//           console.log('Location Access getCurrentPosition', position);
//           resolve({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         error => {
//           Alert.alert('Error: ', error.message);
//           reject(error);
//         },
//         {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
//       );
//     });
//   };

//   const getLocation = async () => {
//     if (Platform.OS === 'ios') {
//       const permissionStatus = await check(
//         PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
//       );
//       const coords =
//         permissionStatus === 'granted'
//           ? await getLocationCoords()
//           : await helpers.requestLocationPermission();

//       setLocation(coords);
//     } else {
//       const permissionStatus = await check(
//         PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
//       );
//       const coords =
//         permissionStatus === 'granted'
//           ? await getLocationCoords()
//           : await helpers.requestLocationPermission();

//       setLocation(coords);
//     }
//   };

//   const requestLocationPermissioninBackground = async () => {
//     if (Platform.OS === 'android' && Platform.Version >= 29) {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//           {
//             title: 'Location Permission',
//             message:
//               'This app needs access to your location in order to provide accurate tracking.',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );

//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log('You can use the Location');
//           await getLocationCoords();
//           return true;
//         } else {
//           console.log('Location permission denied');
//           return false;
//         }
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//   };

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android' && Platform.Version >= 29) {
//       const granted = await PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//       );

//       if (granted) {
//         console.log('You can use the Location');
//         await getLocationCoords();
//         return true;
//       } else {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//             {
//               title: 'Location Permission',
//               message:
//                 'This app needs access to your location in order to provide accurate tracking.',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             },
//           );

//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             console.log('You can use the Location');
//             await getLocationCoords();
//             return true;
//           } else {
//             console.log('Location permission denied');
//             return false;
//           }
//         } catch (err) {
//           console.warn(err);
//           return false;
//         }
//       }
//     } else {
//       try {
//         const granted = await PermissionsAndroid.check(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         );

//         if (granted) {
//           console.log('You can use the Location');
//           await getLocationCoords();
//           return true;
//         } else {
//           try {
//             const granted = await PermissionsAndroid.request(
//               PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//               {
//                 title: 'Location Permission',
//                 message:
//                   'This app needs access to your location in order to provide accurate tracking.',
//                 buttonNegative: 'Cancel',
//                 buttonPositive: 'OK',
//               },
//             );

//             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//               console.log('You can use the Location');
//               await getLocationCoords();
//               return true;
//             } else {
//               console.log('Location permission denied');
//               return false;
//             }
//           } catch (err) {
//             console.warn(err);
//             return false;
//           }
//         }
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//   };

//   useEffect(() => {
//     if (props.show) {
//       requestLocationPermission().then(granted => {
//         if (granted) {
//           Geolocation.watchPosition(
//             position => {
//               setLocation({
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude,
//               });

//               fetch(
//                 `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyDzJQxTpGpIeCmjcI-rOzL7QaIwMVKuVc`,
//               )
//                 .then(response => response.json())
//                 .then(json => {
//                   setAddress(json.results[0].formatted_address);
//                   setAddressDetails(json.results[0]);
//                   setPinCode(
//                     json.results[0].address_components.find((comp: any) =>
//                       comp.types.includes('postal_code'),
//                     ).long_name,
//                   );
//                 });
//             },
//             error => {
//               console.log('Error: ', error);
//             },
//             {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
//           );
//         }
//       });
//     }
//   }, [props.show]);

//   const {
//     show,
//     addressSetter,
//     okClick,
//     cancelClick,
//     containerStyle,
//     title,
//     subTitle,
//     titleStyle,
//     subTitleStyle,
//   } = props;

//   return (
//     <View style={[styles.container, containerStyle]}>
//       {show && (
//         <View style={styles.locationContainer}>
//           <View style={styles.locationContent}>
//             <Text style={[styles.locationText, titleStyle]}>{title}</Text>
//             <Text style={[styles.locationSubText, subTitleStyle]}>
//               {subTitle}
//             </Text>
//           </View>
//           <View style={styles.locationIconContainer}>
//             <Feather name="map-pin" size={24} color={colors.primary} />
//           </View>
//         </View>
//       )}
//       {show && (
//         <View style={styles.locationAddressContainer}>
//           <Text style={styles.locationAddressText}>{address}</Text>
//           <Text style={styles.locationPinCodeText}>{pinCode}</Text>
//         </View>
//       )}
//       {show && (
//         <View style={styles.locationButtonContainer}>
//           <TouchableOpacity
//             style={[styles.locationButton, styles.locationCancelButton]}
//             onPress={cancelClick}>
//             <Text style={styles.locationButtonText}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.locationButton, styles.locationOkButton]}
//             onPress={okClick}>
//             <Text style={styles.locationButtonText}>OK</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const Styles = ({colors, fonts}: any) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: colors.background,
//       paddingHorizontal: 20,
//       paddingVertical: 10,
//     },
//     locationContainer: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginBottom: 10,
//     },
//     locationContent: {
//       flex: 1,
//     },
//     locationText: {
//       fontSize: 18,
//       fontFamily: fonts.medium,
//       color: colors.text,
//     },
//     locationSubText: {
//       fontSize: 14,
//       fontFamily: fonts.regular,
//       color: colors.text,
//       marginTop: 5,
//     },
//     locationIconContainer: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       backgroundColor: colors.primaryLight,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     locationAddressContainer: {
//       marginBottom: 10,
//     },
//     locationAddressText: {
//       fontSize: 16,
//       fontFamily: fonts.medium,
//       color: colors.text,
//     },
//     locationPinCodeText: {
//       fontSize: 14,
//       fontFamily: fonts.regular,
//       color: colors.text,
//       marginTop: 5,
//     },
//     locationButtonContainer: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//     },
//     locationButton: {
//       flex: 1,
//       paddingVertical: 10,
//       borderRadius: 5,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     locationCancelButton: {
//       backgroundColor: colors.error,
//       marginRight: 10,
//     },
//     locationOkButton: {
//       backgroundColor: colors.primary,
//     },
//     locationButtonText: {
//       fontSize: 16,
//       fontFamily: fonts.medium,
//       color: colors.text,
//     },
//   });

// LocationHeader.defaultProps = defaultProps;

// export default LocationHeader;

import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native-gesture-handler';
import helpers from 'utils/helpers';
import {PERMISSIONS, check} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {RootState} from 'store';
import {useAppSelector} from 'hooks';

type LocationHeaderInterface = {
  show?: boolean;
  addressSetter?: () => void;
  okClick?: () => void;
  cancelClick?: () => void;
  containerStyle?: ViewStyle;
  title?: string;
  subTitle?: string;
  titleStyle?: TextStyle;
  subTitleStyle?: TextStyle;
  navigation: any;
} & typeof defaultProps;

const defaultProps = {
  show: false,
};

const LocationHeader = (props: LocationHeaderInterface) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState('Fetching location ...');
  const [pinCode, setPinCode] = useState('');
  const [addressDetails, setAddressDetails] = useState<any>(null);
  const {userLocation, role} = useAppSelector((state: RootState) => state.auth);
  const getLocationCoords = async () => {
    let locationCoords = {};
    Geolocation.getCurrentPosition(
      position => {
        console.log('Location Access getCurrentPosition', position);
        locationCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(locationCoords);
      },
      error => {
        Alert.alert('Error: ', error.message);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    return locationCoords;
  };

  const getLocation = async () => {
    if (Platform.OS === 'ios') {
      const permissionStatus = await check(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      const coords =
        permissionStatus == 'granted'
          ? getLocationCoords()
          : await helpers.requestLocationPermission();

      // console.log('requestLocationPermissioncoords', coords);
      setLocation(coords);
    } else {
      const permissionStatus = await check(
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      );
      const coords =
        permissionStatus == 'granted'
          ? getLocationCoords()
          : await helpers.requestLocationPermission();

      setLocation(coords);
    }
  };

  const requestLocationPermissioninBackground = async () => {
    try {
      let alwaysPermission;

      if (Platform.Version < 29) {
        alwaysPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      } else {
        alwaysPermission = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
      }

      const granted = await PermissionsAndroid.request(alwaysPermission, {
        title: 'Location Permission',
        message:
          'This app needs access to your location in order to provide accurate tracking.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
        getLocationCoords();
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Prermnission',
          message: 'Can we access your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
        // if(r)
        role === 'driver' && requestLocationPermissioninBackground();
        getLocationCoords();
        return true;
      } else {
        // console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      requestLocationPermission();
    }
  }, []);

  useEffect(() => {
    if (location?.latitude) {
      //Fetch the address/place from google api
      const fetchAddress = async () => {
        const fetchedAddress = await helpers.getAddressFromCoordinates(
          location?.latitude,
          location?.longitude,
        );
        // console.log('fetchedAddress', JSON.stringify(fetchedAddress, null, 2));
        const addressComponents =
          helpers.extractAddressComponents(fetchedAddress);
        setAddressDetails(addressComponents);
        props?.addressSetter && props?.addressSetter(addressComponents);
        setAddress(fetchedAddress?.results[0].formatted_address);
      };

      fetchAddress();
    }
  }, [location]);

  console.log('addressDetails', addressDetails);

  return (
    <TouchableOpacity
      style={styles.locationContainer}
      onPress={() => props?.navigation.navigate('ManageAddressScreen')}>
      <View style={styles.locationheader}>
        <Feather name="map-pin" size={16} color={colors.white} />
        <Text style={styles.locationTitle}>
          {pinCode ? pinCode : 'Delivery Location'}
        </Text>
        <Feather name="chevron-down" size={16} color={colors.white} />
      </View>
      <Text style={styles.locationText} numberOfLines={1}>
        {userLocation ? userLocation?.address : address}
      </Text>
    </TouchableOpacity>
  );
};

export default LocationHeader;

LocationHeader.defaultProps = defaultProps;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    locationContainer: {
      paddingHorizontal: 16,
      backgroundColor: colors.primary,
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
  });
