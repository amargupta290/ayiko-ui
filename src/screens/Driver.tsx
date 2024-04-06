import {useTheme} from '@react-navigation/native';
import {AppImages} from 'assets/image';
import {Loader} from 'components';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Popover from 'react-native-popover-view';

const DriverScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});

  const driverData = [
    {
      name: 'John Doe1',
      available: true,
    },
    {
      name: 'John Doe1',
      available: true,
    },
    {
      name: 'John Doe1',
      available: true,
    },
    {
      name: 'John Doe1',
      available: true,
    },
    {
      name: 'John Doe1',
      available: true,
    },
    {
      name: 'John Doe1',
      available: true,
    },
    {
      name: 'John Doe1',
      available: true,
    },
    {
      name: 'John Doe1',
      available: true,
    },
    {
      name: 'John Doe1',
      available: true,
    },
  ];
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DriverDeliveryDetailScreen')}>
        {/* <ImageComp source={{uri: item?.imageUrl}} imageStyle={styles.image} /> */}
        <View style={styles.cardDescription}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.available}>
            {item.available ? 'Available' : 'Not Available'}
          </Text>
        </View>
        <Popover
          from={
            <Feather
              // ref={touchable}
              name="more-vertical"
              size={25}
            />
          }>
          <View style={styles.popoverContainer}>
            <TouchableOpacity
              style={styles.popoverContent}
              onPress={() => {
                navigation.navigate('NewCatalogScreen', {
                  catalogData: item,
                });
              }}>
              <Feather name="edit-2" />
              <Text style={styles.title}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popoverContent}>
              <Feather name="refresh-cw" />
              <Text style={styles.title}>Assign Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popoverContent}>
              <Feather name="refresh-cw" />
              <Text style={styles.title}>Deactivate</Text>
            </TouchableOpacity>
          </View>
        </Popover>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Loader isLoading={isLoading} /> */}
      <FlatList
        style={styles.container}
        data={driverData}
        renderItem={renderItem}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('ManageDriver')}
        style={styles.fabButton}>
        <Feather name="plus" size={25} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DriverScreen;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      padding: 24,
      backgroundColor: colors.background,
    },
    fabButton: {
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      bottom: 30,
      borderRadius: 50,
      backgroundColor: colors.primary,
    },
    card: {
      flexDirection: 'row',
      flex: 1,
      borderRadius: 10,
      backgroundColor: colors.white,
      marginVertical: 8,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      padding: 11,
    },
    image: {
      borderRadius: 8,
      width: 70,
      height: 70,
    },
    cardDescription: {
      marginLeft: 8,
      justifyContent: 'center',
      flex: 1,
    },
    title: {
      ...fonts.regular,
      color: colors.title,
      marginBottom: 2,
    },
    available: {
      ...fonts.description,
      color: colors.green,
      marginBottom: 2,
    },
    unitPrice: {
      ...fonts.description,
      color: colors.subHeading,
    },
    popoverContent: {
      flexDirection: 'row',
      padding: 7,
      alignItems: 'center',
      flex: 1,
      gap: 10,
      width: 'auto',
    },
    popoverContainer: {
      padding: 10,
    },
  });
