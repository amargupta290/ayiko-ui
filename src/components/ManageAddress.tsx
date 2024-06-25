import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteProps,
} from 'react-native-google-places-autocomplete';
import {colors} from 'react-native-swiper-flatlist/src/themes';
import helpers from 'utils/helpers';
import Feather from 'react-native-vector-icons/Feather';
import {getCustomer, setUserLocation} from 'store/slices/authSlice';
import {addAddresses} from 'store/slices/DashboardSlice';
import {useDispatch} from 'react-redux';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';

const ManageAddress: React.FC = (props): any => {
  const dispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [fullAddress, setFullAddress] = useState<any>('');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [addressCoordinatesAndOther, setAddressCoordinatesAndOther] =
    useState<any>('');
  const [searchState, setSearchState] = useState(false);
  const googlePlacesAutocompleteRef =
    useRef<GooglePlacesAutocompleteProps>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const {currentUser, userLocation} = useAppSelector(
    (state: RootState) => state.auth,
  );

  const handleMapPress = (event: any) => {
    handleScreenPress();
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
    // Retrieve address when map region changes
    getAddressFromCoordinates(
      event.nativeEvent.coordinate.latitude,
      event.nativeEvent.coordinate.longitude,
    );
  };

  const handleScreenPress = () => {
    if (googlePlacesAutocompleteRef?.current) {
      googlePlacesAutocompleteRef.current.blur();
    }
  };

  const getAddressFromCoordinates = (latitude: number, longitude: number) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${helpers.API_KEY}`,
    )
      .then(response => response.json())
      .then(data => {
        if (
          data &&
          data.results &&
          data.results.length > 0 &&
          data.results[0].formatted_address
        ) {
          const address = data.results[0].formatted_address;
          console.log(
            'data.results[0]',
            JSON.stringify(data.results[0], null, 2),
          );
          handlePlaceSelect(data.results[0], data.results[0]);
          setFullAddress(address);
        } else {
          setFullAddress('');
        }
      })
      .catch(error => {
        console.error('Error fetching address:', error);
        setFullAddress('');
      });
  };

  const handlePlaceSelect = (data: any, details: any) => {
    let street = '';
    let houseNumber = '';
    let city = '';
    let state = '';
    let country = '';
    let postalCode = '';

    console.log(
      'setAddressCoordinatesAndOther err',
      JSON.stringify(data, null, 2),
    );

    details.address_components.forEach((component: any) => {
      const types = component.types;
      if (types.includes('route') || types.includes('premise')) {
        street = component.long_name;
      } else if (
        types.includes('street_number') ||
        types.includes('neighborhood')
      ) {
        houseNumber = component.long_name;
      } else if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    });

    // Construct the full address
    let address = '';
    if (street) address += street + (houseNumber ? ' ' + houseNumber : '');
    if (city) address += (address ? ', ' : '') + city;
    if (state) address += (address ? ', ' : '') + state;
    if (country) address += (address ? ', ' : '') + country;
    if (postalCode) address += (address ? ', ' : '') + postalCode;
    const {lat, lng} = data.geometry.location;
    console.log('address', street);
    setAddressCoordinatesAndOther({
      name: street + (houseNumber ? ' ' + houseNumber : ''),
      latitude: lat,
      longitude: lng,
      location: {
        latitude: lat,
        longitude: lng,
      },
      addressLine1: street + (houseNumber ? ' ' + houseNumber : ''),
      addressLine2: '',
      city,
      state,
      country,
      postalCode,
    });
    setFullAddress(address);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.searchContainer,
          height: searchState ? '100%' : '7%',
        }}>
        <GooglePlacesAutocomplete
          ref={googlePlacesAutocompleteRef}
          placeholder="Search for a location..."
          onPress={(data, details = null) => {
            // console.log('details', JSON.stringify(data, null, 2), details);
            if (details) {
              // Extract the place_id
              const placeId = details.place_id;
              // Make a separate API call to retrieve the details of the place using placeId
              fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${helpers.API_KEY}`,
              )
                .then(response => response.json())
                .then(async data => {
                  // Extract latitude and longitude from the response
                  const {lat, lng} = data.result.geometry.location;
                  handlePlaceSelect(data.result, data.result);
                  setSelectedLocation({
                    latitude: lat,
                    longitude: lng,
                  });
                  setSelectedAddress(details.description);
                  mapRef.current?.animateToRegion({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  });
                  handleScreenPress();
                  // handleOpenBottomSheet();
                })
                .catch(error => {
                  handleScreenPress();
                  console.error('Error fetching place details:', error);
                });
            } else {
              handleScreenPress();
              console.error('No details available for the selected location.');
            }
          }}
          query={{
            key: helpers.API_KEY,
            language: 'en',
          }}
          styles={{
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              marginTop: 10,
              height: 40,
              color: '#5d5d5d',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          textInputProps={{
            onFocus: () => setSearchState(true),
            onBlur: () => {
              setSearchState(false);
              handleScreenPress();
            },
          }}
          renderLeftButton={() => (
            <>
              {searchState && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchState(false);
                    handleScreenPress();
                  }}>
                  <Feather
                    name="arrow-left"
                    size={24}
                    color="black"
                    style={{marginLeft: 15, marginTop: '50%'}}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
          isFocused={searchState}
        />
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
          ref={mapRef}>
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
            />
          )}
        </MapView>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['10%', '30%']}
        index={0}
        containerStyle={{backgroundColor: colors.black}}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.addressText}>{fullAddress}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Save address"
            onPress={() => {
              dispatch(
                setUserLocation({...selectedLocation, address: fullAddress}),
              );
              console.log(
                'Save address Payload Pre',
                JSON.stringify(
                  {
                    id: currentUser?.id,
                    data: addressCoordinatesAndOther,
                  },
                  null,
                  2,
                ),
              );
              dispatch(
                addAddresses({
                  id: currentUser?.id,
                  data: addressCoordinatesAndOther,
                }),
              ).then(async (data: any) => {
                console.log(
                  'Save address Res Pre',
                  JSON.stringify(data, null, 2),
                );
                if (data) {
                  dispatch(getCustomer(currentUser?.id));
                  if (data?.type === 'dashboard/addAddresses/fulfilled') {
                    console.log('Save address Res', data);
                  }
                } else {
                  Alert.alert('Error', "You've entered wrong credentials", [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ]);
                }
                console.log('data', data);
              });
              props?.navigation?.goBack();
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    marginTop: 10,
    height: '7%',
    // padding: 30,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  addressText: {
    fontSize: 16,
  },
  buttonContainer: {
    // padding: 20,
  },
});

export default ManageAddress;
