import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CatalogScreen, DriverScreen, NewCatalogScreen} from 'screens';
import {TouchableOpacity} from 'react-native';
import {SVGMenu} from 'assets/image';
import ManageDriverScreen from 'screens/ManageDriver';
import DriverDeliveryDetail from 'screens/DriverDliveryDetail';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';

const Stack = createNativeStackNavigator();

const SupplierDriverNavigation = () => {
  const role = useAppSelector((state: RootState) => state.auth.role);

  return (
    <Stack.Navigator
      initialRouteName={
        role === 'supplier' ? 'Driver' : 'DriverDeliveryDetailScreen'
      }
      screenOptions={() => {
        return {
          headerShown: false,
        };
      }}>
      <Stack.Screen name="Driver" component={DriverScreen} />
      <Stack.Screen
        initialParams={{catalogData: null}}
        options={{
          headerShown: false,
          headerTitle: '',
        }}
        name="ManageDriver"
        component={ManageDriverScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          headerTitle: '',
        }}
        name="DriverDeliveryDetailScreen"
        component={DriverDeliveryDetail}
      />
    </Stack.Navigator>
  );
};

export default SupplierDriverNavigation;
