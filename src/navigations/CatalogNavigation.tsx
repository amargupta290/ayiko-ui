import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CatalogScreen, NewCatalogScreen} from 'screens';
import {TouchableOpacity} from 'react-native';
import {SVGMenu} from 'assets/image';

const Stack = createNativeStackNavigator();

const CatalogNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="CatalogScreen" screenOptions={{}}>
      <Stack.Screen
        name="CatalogScreen"
        component={CatalogScreen}
        options={({navigation}) => ({
          title: 'Catalog',
        })}
      />
      <Stack.Screen
        options={{
          title: 'Manage Catalog',
        }}
        initialParams={{catalogData: null}}
        name="NewCatalogScreen"
        component={NewCatalogScreen}
      />
    </Stack.Navigator>
  );
};

export default CatalogNavigation;
