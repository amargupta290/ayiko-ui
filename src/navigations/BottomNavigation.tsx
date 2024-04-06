/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAppSelector} from 'hooks';

import {
  CartScreen,
  DriverScreen,
  FavoritesScreen,
  HomeScreen,
  TrackScreen,
} from 'screens';
import {
  SVGCart,
  SVGCatalog,
  SVGDriver,
  SVGHeart,
  SVGHome,
  SVGProfilePic,
  SVGTrack,
} from 'assets/image';
import CatalogNavigation from './CatalogNavigation';
import {RootState} from 'store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SupplierHomeNavigation from './SupplierHomeNavigation';
import Feather from 'react-native-vector-icons/Feather';
import CustomerNavigation from './CustomerNavigation';
import OrderDetail from 'screens/OrderDetail';
import SupplierDriverNavigation from './SupplierDriverNavigation';

const BottomStack = createBottomTabNavigator();

const BottomNavigation = () => {
  const insets = useSafeAreaInsets();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts, insets});
  const role = useAppSelector((state: RootState) => state.auth.role);
  console.log('BottomNavigation role', role);
  const customerData = useAppSelector(
    (state: RootState) => state.auth.customerData,
  );
  return (
    <BottomStack.Navigator
      screenOptions={({navigation}) => ({
        tabBarLabelStyle: styles.tabBarLabelStyle,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfileScreen')}>
            <SVGProfilePic />
          </TouchableOpacity>
        ),
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        tabBarShowLabel: true,
        headerTitleAlign: 'center',
        tabBarLabelPosition: 'below-icon',
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: styles.headerTitleStyle,
        headerLeftContainerStyle: {
          paddingLeft: 24,
        },
        headerRightContainerStyle: {
          paddingRight: 24,
        },
        // tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.black,
        tabBarIconStyle: styles.tabBarIconStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
      })}>
      {role === 'supplier' ? (
        <>
          <BottomStack.Screen
            name="SupplierHome"
            component={SupplierHomeNavigation}
            options={({navigation, route}) => ({
              headerShown: false,
              // title: `Hello,Welcome ${customerData?.fullName}`,
              // eslint-disable-next-line react/no-unstable-nested-components
              headerTitle: () => (
                <Text
                  style={[
                    styles.headerTitleStyle,
                    {
                      maxWidth: '96%',
                      overflow: 'hidden',
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  Hello {customerData?.fullName}
                </Text>
              ),
              tabBarLabel: 'Home',
              tabBarIcon: ({color}) => <SVGHome fill={color} />,
            })}
          />
          <BottomStack.Screen
            name="Driver"
            component={SupplierDriverNavigation}
            options={({navigation, route}) => ({
              title: 'Manage Drivers',
              tabBarLabel: 'Driver',
              tabBarIcon: ({color}) => (
                <SVGDriver stroke={color} strokeWidth="1" />
              ),
            })}
          />
          <BottomStack.Screen
            name="Track"
            component={TrackScreen}
            options={({navigation, route}) => ({
              title: 'Track',
              tabBarIcon: ({color}) => (
                <SVGTrack stroke={color} strokeWidth="1" />
              ),
            })}
          />
          <BottomStack.Screen
            name="Catalog"
            component={CatalogNavigation}
            options={{
              headerShown: false,
              title: 'Catalog',
              headerTitleStyle: {fontFamily: 'knockout'},
              tabBarIcon: ({color}) => (
                <SVGCatalog stroke={color} strokeWidth="1" />
              ),
            }}
          />
        </>
      ) : (
        <>
          <BottomStack.Screen
            name="Home"
            component={CustomerNavigation}
            options={({navigation, route}) => ({
              headerShown: false,
              // eslint-disable-next-line react/no-unstable-nested-components
              headerTitle: () => (
                <Text
                  style={[
                    styles.headerTitleStyle,
                    {
                      maxWidth: '96%',
                      overflow: 'hidden',
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  Hello {customerData?.fullName}
                </Text>
              ),
              tabBarLabel: 'Home',
              tabBarIcon: ({color}) => <SVGHome fill={color} />,
            })}
          />

          <BottomStack.Screen
            name="Cart"
            component={CartScreen}
            options={({navigation, route}) => ({
              headerLeft: () => {
                return (
                  <TouchableOpacity
                    // style={{width: '35%'}}
                    onPress={() => {
                      navigation.navigate('Home');
                    }}>
                    <Feather name="arrow-left" size={25} color={colors.white} />
                  </TouchableOpacity>
                );
              },
              // eslint-disable-next-line react/no-unstable-nested-components
              headerTitle: () => (
                <View>
                  <Text style={[styles.headerTitleStyle]}>Cart</Text>
                </View>
              ),
              headerRight: () => {
                return (
                  <>
                    <View></View>
                  </>
                ); /* <HeaderButtons CustomComponent={AddTo*/
              },
              headerShown: true,
              // title: 'Cart',
              tabBarIcon: ({color}) => <SVGCart fill={color} strokeWidth="2" />,
            })}
          />

          <BottomStack.Screen
            name="CustomerTrack"
            component={TrackScreen}
            options={{
              headerShown: false,
              title: 'Track',
              headerTitleStyle: {fontFamily: 'knockout'},
              tabBarIcon: ({color}) => (
                <SVGTrack stroke={color} strokeWidth="2" />
              ),
            }}
          />
          <BottomStack.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{
              headerShown: false,
              title: 'Favorites',
              headerTitleStyle: {fontFamily: 'knockout'},
              tabBarIcon: ({color}) => (
                <SVGHeart stroke={color} strokeWidth="2" />
              ),
            }}
          />

          {/* <BottomStack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerShown: false,
              title: 'Profile',
              headerTitleStyle: {fontFamily: 'knockout'},
              tabBarIcon: ({color}) => (
                <SVGProfile stroke={color} strokeWidth="2" />
              ),
            }}
          /> */}
        </>
      )}
    </BottomStack.Navigator>
  );
};
export default BottomNavigation;

const Styles = ({colors, fonts, insets}: any) =>
  StyleSheet.create({
    tabBarStyle: {
      height: Platform.OS === 'ios' ? insets.bottom + 60 : insets.bottom + 70,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      elevation: 4,
      shadowOpacity: 1,
      paddingVertical: 16,
      // alignItems: 'center',
    },
    tabBarLabelStyle: {
      // ...Fonts.title(14),
      fontFamily: 'knockout',
      fontSize: 14,
    },
    headerTitleStyle: {
      ...fonts.title,
      color: colors.white,
    },
    cart: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 50,
      shadowOpacity: 1,
      shadowOffset: {
        width: 1,
        height: 12,
      },
      shadowRadius: 16,
      elevation: 24,
      shadowColor: colors.black,
      position: 'absolute',
      bottom: 0,
    },
    tabBarIconStyle: {
      paddingBottom: 8,
    },
    tabBarItemStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      // paddingVertical: 20,
      // backgroundColor: colors.primary,
    },
  });
