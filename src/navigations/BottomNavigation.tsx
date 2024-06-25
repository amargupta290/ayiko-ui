/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useAppSelector} from 'hooks';

import {
  CartScreen,
  DriverScreen,
  FavoritesScreen,
  HomeScreen,
  TrackScreen,
  UserProfileScreen,
} from 'screens';
import {
  SVGCart,
  SVGCatalog,
  SVGDeliveriesIcon,
  SVGDriver,
  SVGHeart,
  SVGHome,
  SVGNotificationIcon,
  SVGProfilePic,
  SVGTrack,
  SVGTrackIcon,
  SVGUserIcon,
  SVGWaveIcon,
} from 'assets/image';
import CatalogNavigation from './CatalogNavigation';
import {RootState} from 'store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SupplierHomeNavigation from './SupplierHomeNavigation';
import Feather from 'react-native-vector-icons/Feather';
import CustomerNavigation from './CustomerNavigation';
import OrderDetail from 'screens/OrderDetail';
import SupplierDriverNavigation from './SupplierDriverNavigation';
import DriverHomeScreen from 'screens/DriverHome';
import TrackOrderList from 'screens/TrackOrderList';
import TrackNavigation from './TrackNavigation';
import DriverNavigation from './DriverNavigation';

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
    <>
      {role === 'driver' ? (
        <DriverNavigation />
      ) : (
        <BottomStack.Navigator
          screenOptions={({navigation}) => ({
            tabBarLabelStyle: styles.tabBarLabelStyle,
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
                  tabBarIcon: ({color}) => (
                    <SVGHome
                      fill={color}
                      width={39}
                      stroke={color}
                      strokeWidth="2"
                    />
                  ),
                })}
              />
              <BottomStack.Screen
                name="Driver"
                component={SupplierDriverNavigation}
                options={({navigation, route}) => ({
                  title: 'Manage Drivers',
                  tabBarLabel: 'Driver',
                  tabBarIcon: ({color}) => (
                    <SVGDriver stroke={color} strokeWidth="1" width={39} />
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
                    <SVGCatalog stroke={color} strokeWidth="1" width={39} />
                  ),
                }}
              />
              <BottomStack.Screen
                name="Account"
                component={UserProfileScreen}
                options={({navigation, route}) => ({
                  title: 'Account',
                  tabBarIcon: ({color}) => (
                    <SVGUserIcon
                      fill={colors?.primary}
                      strokeWidth="1"
                      width={45}
                    />
                  ),
                })}
              />
            </>
          ) : role === 'driver' ? (
            <>
              <BottomStack.Screen
                name="DriverHomeScreen"
                component={DriverNavigation}
                options={({navigation, route}) => ({
                  headerBackTitleVisible: false,
                  title: '',
                  headerShown: false,

                  // eslint-disable-next-line react/no-unstable-nested-components

                  tabBarLabel: 'Home',
                  tabBarIcon: ({color}) => <SVGHome fill={color} width={39} />,
                })}
              />
              <BottomStack.Screen
                name="Deliveries"
                component={SupplierDriverNavigation}
                options={({navigation, route}) => ({
                  title: 'Deliveries',
                  tabBarLabel: 'Deliveries',
                  tabBarIcon: ({color}) => (
                    <SVGDeliveriesIcon fill={color} strokeWidth="2" />
                  ),
                })}
              />
              <BottomStack.Screen
                name="Notifications"
                component={FavoritesScreen}
                options={{
                  headerShown: false,
                  title: 'Notifications',
                  headerTitleStyle: {fontFamily: 'knockout'},
                  tabBarIcon: ({color}) => (
                    <SVGNotificationIcon stroke={color} strokeWidth="2" />
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
                  headerLeft: () => (
                    <View style={styles.headerLeft}>
                      <SVGWaveIcon />
                      <Text style={styles.headerTitleStyle}>
                        Hello {customerData?.fullName}
                      </Text>
                    </View>
                  ),
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
                  tabBarLabel: 'Home',
                  tabBarIcon: ({color}) => <SVGHome fill={color} width={39} />,
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
                        <Feather
                          name="arrow-left"
                          size={25}
                          color={colors.white}
                        />
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
                  tabBarIcon: ({color}) => (
                    <SVGCart fill={color} strokeWidth="2" width={39} />
                  ),
                })}
              />

              <BottomStack.Screen
                name="trackOrderList"
                component={TrackNavigation}
                options={({navigation, route}) => ({
                  headerShown: false,
                  headerLeft: () => {
                    return (
                      <TouchableOpacity
                        // style={{width: '35%'}}
                        onPress={() => {
                          navigation.navigate('Home');
                        }}>
                        <Feather
                          name="arrow-left"
                          size={25}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                    );
                  },
                  headerTitle: 'Track your order',
                  title: 'Track',
                  tabBarIcon: ({color}) => (
                    <SVGTrack
                      fill={colors?.primary}
                      strokeWidth="1"
                      width={39}
                    />
                  ),
                })}
              />
              <BottomStack.Screen
                name="Account"
                component={UserProfileScreen}
                options={({navigation, route}) => ({
                  title: 'Account',
                  tabBarIcon: ({color}) => (
                    <SVGUserIcon
                      fill={colors?.primary}
                      strokeWidth="1"
                      width={45}
                    />
                  ),
                })}
              />
            </>
          )}
        </BottomStack.Navigator>
      )}
    </>
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

    headerLeft: {flexDirection: 'row', gap: 5},
  });
