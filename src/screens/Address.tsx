import Container from 'components/Container';
import LocationHeader from 'components/LocationHeader';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';
import {getCustomer, setUserLocation} from 'store/slices/authSlice';
import {useTheme} from '@react-navigation/native';
import helpers from 'utils/helpers';
import {deleteAddress} from 'store/slices/DashboardSlice';
import {sendDriverLocationCoords} from 'store/slices/DriverSlice';
export const Address = (props): any => {
  const dispatch = useDispatch();
  const {colors, fonts} = useTheme();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const styles = Styles({colors, fonts});
  const [showForm, setShowForm] = useState(false);
  const {loading, deleteAddressRes, addAddressRes} = useAppSelector(
    (state: RootState) => state.dashboard,
  );
  const {currentUser} = useAppSelector((state: RootState) => state.auth);
  const [addresses, setAddresses] = useState<any>([]);

  const handleSelect = (item: any) => {
    setSelectedAddressId(item?.id);
    dispatch(
      setUserLocation({
        ...item,
        address:
          (helpers.isEmpty(item.addressLine1) ? 'N/A' : item.name) +
          ' ' +
          item.city +
          ' ' +
          item.country +
          ' ' +
          item.postalCode,
      }),
    );
  };

  const handleDelete = id => {
    setAddresses(prevAddresses =>
      prevAddresses.filter(address => address.id !== id),
    );

    setSelectedAddressId(null); // Deselect the deleted address
    dispatch(deleteAddress({addressId: id, id: currentUser?.id}));
  };

  useEffect(() => {
    dispatch(getCustomer(currentUser?.id));
  }, [dispatch]);

  useEffect(() => {
    if (currentUser?.deliveryAddresses) {
      setAddresses(currentUser?.deliveryAddresses);
    }
  }, [currentUser]);

  useEffect(() => {
    if (deleteAddressRes || addAddressRes) {
      dispatch(getCustomer(currentUser?.id));
    }
  }, [deleteAddressRes, addAddressRes]);

  const renderItem = ({item}) => {
    const isSelected = selectedAddressId === item.id;
    return (
      <View
        style={[styles.item, isSelected && styles.selectedItem]}
        key={item.id}>
        <View style={styles.paddingHorizontal}>
          <Text
            style={{
              ...styles.address,
              color: selectedAddressId == item?.id ? 'white' : 'black',
            }}>
            {helpers.isEmpty(item.name) ? 'N/A' : item.name}
          </Text>
          <Text
            style={{
              ...styles.address,
              color: selectedAddressId == item?.id ? 'white' : 'black',
            }}>
            {(helpers.isEmpty(item.addressLine1) ? 'N/A' : item.name) +
              ' ' +
              item.city +
              ' ' +
              item.country}
          </Text>
          <Text
            style={{
              ...styles.address,
              color: selectedAddressId == item?.id ? 'white' : 'black',
            }}>
            {item.postalCode}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleSelect(item)}>
              <Text style={styles.buttonText}>
                {isSelected ? 'Selected' : 'Select'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  console.log('currentUser!!', currentUser);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.headerContainer}>
          <LocationHeader navigation={props.navigation} />
        </View>

        <View style={styles.addNewButtonContainer}>
          <Button
            title={'Add New Address'}
            onPress={() => props?.navigation.navigate('ManageAddressScreen')}
          />
        </View>
        <Container isScrollable>
          <View style={styles.paddingHorizontal}>
            {/* {!showForm && (
              <>
                <View>
                  <FlatList
                    data={input}
                    renderItem={renderItem}
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              </>
            )} */}
            <FlatList
              data={addresses}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.list}
            />
          </View>
        </Container>

        <View
          style={{
            paddingHorizontal: scale(20),
            justifyContent: 'flex-end',
            // flex: 0.5,
            alignItems: 'flex-end',
          }}>
          {/* < title="New" /> */}
        </View>
      </SafeAreaView>
    </>
  );
};

const Styles = ({colors}: any) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: colors.primary,
      width: '100%',
    },
    paddingHorizontal: {
      paddingHorizontal: scale(8),
    },
    addNewButtonContainer: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      paddingHorizontal: scale(8),
      marginVertical: scale(8),
    },
    list: {
      flexGrow: 1,
    },
    item: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    selectedItem: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      color: '#fff',
    },
    address: {
      fontSize: 16,
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: scale(160),
      height: scale(30),
    },
    selectButton: {
      flex: 1,
      paddingVertical: 5,
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: '#007bff',
      marginRight: 10,
    },
    deleteButton: {
      flex: 1,
      paddingVertical: 5,
      borderRadius: 5,
      backgroundColor: 'red',
      alignItems: 'center',
    },
    buttonText: {
      textAlign: 'center',
      color: '#fff',
    },
  });
