import React, {useEffect, useRef, useState} from 'react';
import MapView, {Marker, Polyline, LatLng} from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import helpers from 'utils/helpers';
import {useDispatch} from 'react-redux';
import {getDriverLocationCoords} from 'store/slices/DriverSlice';
import {useAppSelector} from 'hooks';
import {RootState} from 'store';
import {Image} from 'react-native';

interface MovingMarkerMapProps {
  source: LatLng;
  destination: LatLng;
  orderId: number | string | null;
  orderDetails: any;
  setTravelTime: (v: any) => void;
  //   routeCoordinates: LatLng[];
}

const MovingMarkerMap: React.FC<MovingMarkerMapProps> = ({
  source,
  destination,
  orderId,
  orderDetails,
  setTravelTime,
  //   routeCoordinates,
}) => {
  const markerRef = useRef<Animatable.View>(null);
  const dispatch = useDispatch();
  const {driverLocationCoords, loading}: any = useAppSelector(
    (state: RootState) => state.driver,
  );
  const intervalIdRef = useRef(null); // useRef to store interval ID
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);

  useEffect(() => {
    // Function to dispatch the API call
    const fetchDriverLocation = () => {
      dispatch(getDriverLocationCoords(orderId));
    };

    // Call the function immediately
    fetchDriverLocation();

    // Set up an interval to call the function every 10 seconds
    if (!intervalIdRef?.current) {
      intervalIdRef.current = setInterval(fetchDriverLocation, 10000);
    }

    // Clear the interval when the component unmounts
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [dispatch, orderId]);

  console.log('driverLocationCoords', driverLocationCoords);

  useEffect(() => {
    const sourceCoords = driverLocationCoords?.driverLocation
      ? driverLocationCoords?.driverLocation
      : source;
    const destinationCoords = orderDetails?.deliveryAddress?.location
      ? orderDetails?.deliveryAddress?.location
      : source;
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${sourceCoords.latitude},${sourceCoords.longitude}&destination=${destinationCoords.latitude},${destinationCoords.longitude}&key=${helpers?.API_KEY}`,
        );
        const data = await response.json();
        console.log('data', data);
        const points = data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        setRouteCoordinates(decodedPoints);

        // Extract travel time from response
        const travelTimeInSeconds = data.routes[0].legs[0].duration.value;
        const hours = Math.floor(travelTimeInSeconds / 3600);
        const minutes = Math.floor((travelTimeInSeconds % 3600) / 60);
        if (hours > 0) {
          setTravelTime(`${hours} hours ${minutes} minutes`);
        } else {
          setTravelTime(`${minutes} minutes`);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    fetchRoute();
  }, [
    source,
    destination,
    driverLocationCoords?.driverLocation,
    orderDetails?.deliveryAddress?.location,
    setTravelTime,
  ]);

  // Function to decode polyline points
  const decodePolyline = (encoded: string) => {
    const points: LatLng[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({latitude: lat / 1e5, longitude: lng / 1e5});
    }

    return points;
  };

  useEffect(() => {
    if (markerRef.current?.animateMarker) {
      markerRef?.current?.animateMarker();
    }
  }, [routeCoordinates]);

  return (
    <MapView
      style={{flex: 1}}
      initialRegion={{
        latitude:
          (driverLocationCoords?.driverLocation.latitude +
            orderDetails?.deliveryAddress?.location.latitude) /
          2,
        longitude:
          (driverLocationCoords?.driverLocation.longitude +
            orderDetails?.deliveryAddress?.location.longitude) /
          2,
        latitudeDelta:
          Math.abs(
            driverLocationCoords?.driverLocation.latitude -
              orderDetails?.deliveryAddress?.location.latitude,
          ) * 2,
        longitudeDelta:
          Math.abs(
            driverLocationCoords?.driverLocation.longitude -
              orderDetails?.deliveryAddress?.location.longitude,
          ) * 2,
      }}>
      <Marker
        coordinate={
          driverLocationCoords?.driverLocation
            ? driverLocationCoords.driverLocation
            : source
        }>
        <Image
          source={require('../assets/image/movingsource.png')}
          style={{width: 40, height: 40}}
        />
      </Marker>
      <Marker
        coordinate={
          orderDetails?.deliveryAddress?.location
            ? orderDetails?.deliveryAddress?.location
            : destination
        }>
        <Image
          source={require('../assets/image/destination.png')}
          style={{width: 40, height: 40}}
        />
      </Marker>
      <Polyline
        coordinates={routeCoordinates}
        strokeWidth={4}
        strokeColor="blue"
      />
      <Animatable.View ref={markerRef}>
        <Marker
          coordinate={
            driverLocationCoords?.driverLocation
              ? driverLocationCoords.driverLocation
              : source
          }>
          <Image
            source={require('../assets/image/movingsource.png')}
            style={{width: 40, height: 40}}
          />
        </Marker>
      </Animatable.View>
    </MapView>
  );
};

export default MovingMarkerMap;
