import Geolocation from '@react-native-community/geolocation';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {PERMISSIONS, check} from 'react-native-permissions';

const validation = data => {
  let valid = true;
  data.map(input => {
    if (!input) return;
    input.error = false;
    if (
      (input?.mandatory && input?.value === '') ||
      input?.value === null ||
      input?.value?.length === 0
    ) {
      input.error = true;
      input.errorText = `${input?.label} is required.`;
      valid = false;
    }
    if (input?.value && input?.pattern && !input?.pattern.test(input?.value)) {
      input.error = true;
      input.errorText = `Please enter valid ${input?.label}`;
      valid = false;
    }
    return input;
  });
  data.valid = valid;
  return data;
};

const isEmpty = (value: any) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) {
      return true; // If object is empty, return true
    }
  }

  return false;
};

const getSupplierOrderStatus = (data: any) => {
  if (data.status === 'PENDING') {
    return 'APPROVAL PENDING';
  } else if (
    data?.status === 'ACCEPTED' &&
    !data.paymentDetails.customerStatus
  ) {
    return 'Payment Pending';
  } else if (
    data.paymentDetails.customerStatus === 'CONFIRMED' &&
    data.paymentDetails.supplierStatus !== 'CONFIRMED'
  ) {
    return 'Payment Confirmation Pending';
  } else if (data.paymentDetails.supplierStatus === 'CONFIRMED') {
    return 'Delivery Pending';
  } else if (!!data.driverId && !data.driverStatus) {
    return 'Driver Status Pending';
  } else if (!!data.driverStatus && data.driverStatus === 'DRIVER_ASSIGNED') {
    return 'Driver Assigned';
  } else if (!!data.driverStatus && data.driverStatus === 'DRIVER_ACCEPTED') {
    return 'Driver Accepted';
  } else if (!!data.driverStatus && data.driverStatus === 'DRIVER_REJECTED') {
    return 'Driver Rejected';
  } else if (!!data.driverStatus && data.driverStatus === 'DRIVER_DISPATCHED') {
    return 'Driver Dispatched';
  } else if (
    !!data.driverStatus &&
    data.driverStatus === 'DELIVERY_COMPLETED'
  ) {
    return 'Delivery Completed';
  }
};

const getCustomerOrderStatus = (data: any) => {
  if (data.status === 'PENDING') {
    return 'Approval Pending';
  } else if (
    data?.status === 'ACCEPTED' &&
    !data.paymentDetails.customerStatus
  ) {
    return 'Payment Pending';
  } else if (
    data.paymentDetails.customerStatus === 'CONFIRMED' &&
    data.paymentDetails.supplierStatus !== 'CONFIRMED'
  ) {
    return 'Payment Confirmation Pending';
  } else if (data.paymentDetails.supplierStatus === 'CONFIRMED') {
    return 'Delivery Pending';
  } else if (!!data.driverStatus && data.driverStatus === 'DRIVER_ASSIGNED') {
    return 'Driver Assigned';
  } else if (!!data.driverStatus && data.driverStatus === 'DRIVER_DISPATCHED') {
    return 'Driver Dispatched';
  } else if (
    !!data.driverStatus &&
    data.driverStatus === 'DELIVERY_COMPLETED'
  ) {
    return 'Delivery Completed';
  } else {
    return 'Order Placed';
  }
};

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    const permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    console.log('permissionStatus', permissionStatus);
    if (permissionStatus === 'granted') {
      console.log('permissionStatusgranted', await getLocation());
      return await getLocation();
    } else {
      // Alert.alert(
      //   'This app needs access to your location to provide location data.',
      // );
    }
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to provide location data.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted.');
        return await getLocation();
      } else {
        console.log('Location permission denied.');
      }
    } catch (err) {
      console.warn(err);
    }
  }
};

export const getLocation = async () => {
  let locationCoords = {};
  Geolocation.getCurrentPosition(
    position => {
      console.log('Location Access Coords', position);
      locationCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    },
    error => {
      Alert.alert('Error: ', error.message);
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, title: "HOLA", description: "hola"},
  );
  return locationCoords;
};

const getBusinessInfoStatus = (currentUser: any) => {
  if (!currentUser?.businessDescription && !currentUser?.businessDescription) {
    return true;
  }
  return false;
};

export const API_KEY = 'AIzaSyBIHlJ75gl-Pl8S4o-jmjdZkrIUp3mvMx4';

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const address = data;
      return address;
    } else {
      return 'Address not found';
    }
  } catch (error) {
    console.error('Error fetching address:', error);
    return 'Error fetching address';
  }
};

// Function to extract address components
export const extractAddressComponents = (response: any) => {
  // Initialize variables to store extracted components
  let pincode = '';
  let country = '';
  let state = '';
  let city = '';
  let addressLine1 = '';
  let addressLine2 = '';

  // Iterate through each result in the results array
  response.results.forEach((result: any) => {
    // Iterate through each address component in the address_components array
    result.address_components.forEach((component: any) => {
      // Check the types of the address component
      if (component.types.includes('postal_code')) {
        pincode = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('street_number')) {
        addressLine1 = component.long_name;
      } else if (component.types.includes('route')) {
        addressLine1 += ' ' + component.long_name;
      }
    });
  });

  // Return the extracted address components
  return {
    pincode,
    country,
    state,
    city,
    addressLine1,
    addressLine2,
  };
};

const productCategories = [
  'Water and drinks',
  'Bars and restaurants',
  'Fish and frozen foods',
  'Butchers and delicatessens',
  'Gas and household appliances',
  'IT and consumables',
  'Telephony and accessories',
  'Automobiles and parts',
  'Ready-to-wear and accessories',
  'Hardware and cement',
  'Cafeteria and pastries',
  'Beauty, cosmetics and care',
  'Fashion and jewelry',
  'General living and nutrition',
  'Fruits and vegetables',
  'Tubers and cereals',
  'Loincloths, fabrics and haberdashery',
  'Furniture and equipment',
  'Raw materials',
  'Plumbing and electricity',
  'Tiles and marbles',
  'Painting and precious stones',
  'Bookstores and stationery',
  'Grocery and health food stores',
  'Arts and decorations',
  'Local products',
  'Miscellaneous items',
];

export default {
  validation,
  isEmpty,
  getSupplierOrderStatus,
  getCustomerOrderStatus,
  getBusinessInfoStatus,
  requestLocationPermission,
  getLocation,
  getAddressFromCoordinates,
  extractAddressComponents,
  productCategories,
  API_KEY,
};
