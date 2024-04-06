import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useAppSelector, useAppDispatch} from 'hooks';
import AuthNavigation from './AuthNavigations';
import {RootState} from 'store';
import {setRole, signIn} from 'store/slices/authSlice';
import HomeNavigation from './HomeNavigation';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state: RootState) => state.auth.data);
  const congratulation = useAppSelector(
    (state: RootState) => state.auth.congratulation,
  );

  useEffect(() => {
    _bootstrapAsync();
  }, []);

  const _bootstrapAsync = async () => {
    const token = await AsyncStorage.getItem('token');
    const role = await AsyncStorage.getItem('role');
    dispatch(signIn(token));
    dispatch(setRole(role));
    console.log('role userData', role, userData);
  };

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {userData || (userData && congratulation) ? (
        <Stack.Screen name="HomeNavigation" component={HomeNavigation} />
      ) : (
        <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigation;
