import React, {useState} from 'react';
import {Linking, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useAppDispatch} from 'hooks';
import BottomNavigation from './BottomNavigation';
import {signOut} from 'store/slices/authSlice';

const DrawerStack = createDrawerNavigator();

const DrawerView = (props: any) => {
  const dispatch = useAppDispatch();
  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
      <DrawerItem
        label="Logout"
        labelStyle={styles.labelStyle}
        onPress={() => {
          AsyncStorage.clear();
          dispatch(signOut());
        }}
      />
    </DrawerContentScrollView>
  );
};
const DrawerNavigation = () => {
  const insets = useSafeAreaInsets();
  const {colors, fonts} = useTheme();
  return (
    <DrawerStack.Navigator
      initialRouteName="BottomNavigation"
      screenOptions={({navigation}) => ({
        drawerType: 'front',
        headerShown: true,
        headerTintColor: colors.white,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerLeft: () => (
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color={colors.white}
            onPress={() => navigation.goBack()}
          />
        ),
        title: '',
        headerTransparent: true,
        headerLeftContainerStyle: {paddingLeft: 10},
        headerTitleStyle: {
          textTransform: 'uppercase',
        },
      })}
      drawerContent={props => <DrawerView {...props} insets={insets} />}>
      <DrawerStack.Screen
        name="BottomNavigation"
        component={BottomNavigation}
        options={{headerShown: false}}
      />
    </DrawerStack.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  drawerContainer: {
    // backgroundColor: colors.white,
    flex: 1,
  },
  drawerContent: {
    paddingVertical: 11,
    paddingLeft: 47,
    paddingRight: 20,
  },
  labelStyle: {
    fontSize: 16,
    color: '#000',
  },
});
