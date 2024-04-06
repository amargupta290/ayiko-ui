import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CatalogScreen, DriverScreen, NewCatalogScreen} from 'screens';
import {TouchableOpacity} from 'react-native';
import {SVGMenu} from 'assets/image';
import ManageDriverScreen from 'screens/ManageDriver';
import DriverDeliveryDetail from 'screens/DriverDliveryDetail';

const Stack = createNativeStackNavigator();

const SupplierDriverNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Driver" screenOptions={{}}>
      <Stack.Screen name="Driver" component={DriverScreen} />
      <Stack.Screen
        initialParams={{catalogData: null}}
        name="ManageDriver"
        component={ManageDriverScreen}
      />
      <Stack.Screen
        initialParams={{catalogData: null}}
        name="DriverDeliveryDetailScreen"
        component={DriverDeliveryDetail}
      />
    </Stack.Navigator>
  );
};

export default SupplierDriverNavigation;
