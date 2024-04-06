import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CatalogScreen, NewCatalogScreen, UserProfileScreen} from 'screens';
import BottomNavigation from './BottomNavigation';
import ProductDetail from 'screens/ProductDetail';

const Stack = createNativeStackNavigator();

const HomeNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomNavigation"
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="BottomNavigation"
        component={BottomNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{title: 'User Profile'}}
      />
      <Stack.Screen
        options={{
          title: 'Create Catalog',
        }}
        initialParams={{catalogData: null}}
        name="NewCatalogScreen"
        component={NewCatalogScreen}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
