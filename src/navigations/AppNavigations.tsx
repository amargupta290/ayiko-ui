import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppSelector, useAppDispatch} from 'hooks';
import AuthNavigation from './AuthNavigations';
import {RootState} from 'store';
import {
  getCustomerByToken,
  getDriverByToken,
  getSupplierByToken,
  setCurrentUser,
  setRole,
  signIn,
} from 'store/slices/authSlice';
import HomeNavigation from './HomeNavigation';
import CustomerHomeNavigation from './CustomerHomeNavigation';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const dispatch = useAppDispatch();

  const userData = useAppSelector((state: RootState) => state.auth.data);
  const {customerData, supplierData, driverData, currentUser, role} =
    useAppSelector((state: RootState) => state.auth);
  const congratulation = useAppSelector(
    (state: RootState) => state.auth.congratulation,
  );

  useEffect(() => {
    _bootstrapAsync();
  }, []);

  const _bootstrapAsync = async () => {
    const token = await AsyncStorage.getItem('token');
    const currentRole = await AsyncStorage.getItem('role');
    dispatch(signIn(token));
    dispatch(setRole(currentRole));
  };

  useEffect(() => {
    console.log('role userData!!', role, userData);
    if (userData) {
      if (role === 'customer') {
        dispatch(getCustomerByToken());
      } else if (role === 'supplier') {
        dispatch(getSupplierByToken());
      } else {
        dispatch(getDriverByToken());
      }
    }
  }, []);

  console.log('useEffect currentUser', currentUser);

  useEffect(() => {
    if (customerData || supplierData || driverData) {
      setCurrentUser(customerData || supplierData || driverData);
    }
  }, [customerData, supplierData, driverData]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {userData || (userData && congratulation) ? (
        <Stack.Screen name="HomeNavigation" component={HomeNavigation} />
      ) : (
        <>
          <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
          <Stack.Screen
            name="CustomerHomeNavigation"
            component={CustomerHomeNavigation}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigation;
