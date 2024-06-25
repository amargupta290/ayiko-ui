import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CongratulationScreen, OrderDetailsScreen} from 'screens';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {SVGProfilePic, SVGWaveIcon} from 'assets/image';
import AddBusinessInfo from 'screens/AddBusinessInfo';
import SupplierHomeScreen from 'screens/SupplierHome';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';

const Stack = createNativeStackNavigator();

const SupplierHomeNavigation = () => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const supplierData = useAppSelector(
    (state: RootState) => state.auth.supplierData,
  );

  return (
    <Stack.Navigator
      initialRouteName={'SupplierHomeScreen'}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitleStyle,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="SupplierHomeScreen"
        component={SupplierHomeScreen}
        options={({navigation}) => ({
          title: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <SVGWaveIcon />
              <Text style={styles.headerTitleStyle}>
                Hello {supplierData?.businessName}
              </Text>
            </View>
          ),
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('UserProfileScreen')}>
              {/* <SVGProfilePic /> */}
              <Image
                source={require('../assets/image/profilePic.png')}
                style={{
                  resizeMode: 'cover',
                  width: 50,
                  height: 50,
                }}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        options={{
          title: '',
        }}
        // initialParams={{}}
        name="SupplierOrderDetailsScreen"
        component={OrderDetailsScreen}
      />
      <Stack.Screen
        options={{
          title: 'Business Info',
        }}
        initialParams={{catalogData: null}}
        name="AddBusinessInfo"
        component={AddBusinessInfo}
      />
    </Stack.Navigator>
  );
};

export default SupplierHomeNavigation;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    headerTitleStyle: {
      ...fonts.title,
      color: colors.white,
    },
    headerLeft: {flexDirection: 'row', gap: 5},
  });
