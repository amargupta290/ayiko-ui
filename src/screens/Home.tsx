import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {useAppDispatch, useAppSelector} from 'hooks';

import {
  AppImages,
  SVGNearbyRestaurant1,
  SVGNearbyRestaurant2,
  SVGNotification,
  SVGPizzBrug,
  SVGPopularItems1,
  SVGPopularItems2,
  SVGPopularItems3,
  SVGPopularItems4,
  SVGSearch,
  SVGSlideOne,
  SVGSlideThree,
  SVGSlideTwo,
} from 'assets/image';
import {RootState} from 'store';
import {
  catalogList,
  popularProductsList,
  supplierList,
} from 'store/slices/DashboardSlice';
import {ImageComp, Loader} from 'components';
import {getCustomer} from 'store/slices/authSlice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const isLoading = useAppSelector(
    (state: RootState) => state.dashboard.loading,
  );

  const catalogData = useAppSelector(
    (state: RootState) => state.dashboard.data,
  );

  const {supplier, popularProducts} = useAppSelector(
    (state: RootState) => state.dashboard,
  );

  const [address, setAddress] = useState(
    'Behind ganesh temple, New Sangvi, Pune, 411029',
  );
  const [pinCode, setPinCode] = useState('');

  const [offers, setOffers] = useState([
    {
      id: 1,
      title: 'Snacks',
      discount: 40,
      image: <SVGPizzBrug height={100} width={100} />,
    },
    {
      id: 2,
      title: 'Vegetables',
      discount: 30,
      image: <SVGSlideOne height={100} width={100} />,
    },
    {
      id: 3,
      title: 'Dairy Products',
      discount: 50,
      image: <SVGSlideTwo height={100} width={100} />,
    },
    {
      id: 4,
      title: 'Breads',
      discount: 40,
      image: <SVGSlideThree height={100} width={100} />,
    },
    {
      id: 5,
      title: 'Snacks',
      discount: 50,
      image: <SVGPizzBrug height={100} width={100} />,
    },
    {
      id: 6,
      title: 'Dairy Products',
      discount: 30,
      image: <SVGSlideTwo height={100} width={100} />,
    },
    {
      id: 7,
      title: 'Dairy Products',
      discount: 50,
      image: <SVGSlideThree height={100} width={100} />,
    },
    {
      id: 8,
      title: 'Snakes',
      discount: 30,
      image: <SVGSlideThree height={100} width={100} />,
    },
    {
      id: 9,
      title: 'Vegetables',
      discount: 40,
      image: <SVGSlideThree height={100} width={100} />,
    },
  ]);

  const groupedOffers = [];
  for (let i = 0; i < offers.length; i += 3) {
    groupedOffers.push(offers.slice(i, i + 3));
  }

  useEffect(() => {
    dispatch(catalogList());
    dispatch(supplierList());
    dispatch(popularProductsList());
  }, [dispatch]);

  console.log('popularProducts', popularProducts);

  const renderSlide = ({item}) => {
    return (
      <View style={styles.swipeCard}>
        <Text style={styles.heading}>Offers</Text>
        <View style={styles.swipeCardContent}>
          {item.map(offer => (
            <View key={offer.id} style={{flex: 1, alignItems: 'center'}}>
              {offer?.image}
              <Text style={styles.offerHeading}>{offer.title}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSlides = () => {
    return (
      <View style={styles.offerContainer}>
        <SwiperFlatList
          autoplay={false}
          autoplayDelay={6}
          autoplayLoop
          showPagination
          paginationDefaultColor={colors.dot}
          paginationActiveColor={colors.primary}
          paginationStyleItem={{height: 8, width: 8}}
          data={groupedOffers}
          contentContainerStyle={{flexGrow: 1}}
          renderItem={renderSlide}
        />
      </View>
    );
  };

  const renderSuppliers = () => {
    return (
      <>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.heading}>Nearby Supplier</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SupplierListScreen')}
            style={{
              alignSelf: 'flex-end',
            }}>
            <Text style={styles.subHeading}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nearBySupplierContainer}>
          {/* {supplier && ( */}
          <TouchableOpacity
            style={{width: '50%'}}
            onPress={() =>
              navigation.navigate('SupplierScreen', {id: supplier[0]?.id})
            }>
            {/* <SVGNearbyRestaurant1 width={'100%'} /> */}
            <ImageComp imageStyle={{width: '90%'}} resizeMode={'cover'} />
            <Text style={styles.nearRHeading}>
              {(supplier && supplier?.length && supplier[0].companyName) ??
                'Signature By Kitchen'}
            </Text>
            <Text style={styles.nearRSubHeading}>5 Km Away</Text>
          </TouchableOpacity>
          {/* )} */}
          {/* {supplier && ( */}
          {supplier?.length > 1 && (
            <TouchableOpacity
              style={{width: '90%', left: '10%'}}
              onPress={() =>
                navigation.navigate('SupplierScreen', {id: supplier[1]?.id})
              }>
              {/* <SVGNearbyRestaurant2 width={'100%'} /> */}
              <ImageComp imageStyle={{width: '50%'}} resizeMode={'cover'} />
              <Text style={styles.nearRHeading}>
                {(supplier &&
                  supplier?.length > 1 &&
                  supplier[1]?.companyName) ??
                  'Signature By Kitchen'}
              </Text>
              <Text style={styles.nearRSubHeading}>5 Km Away</Text>
            </TouchableOpacity>
          )}
          {/* )} */}
        </View>
      </>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.searchWrapper}>
              <SVGSearch />
              <TextInput
                placeholder="Search for item or supplier"
                style={styles.searchInput}
              />
            </View>
            <SVGNotification fill={colors.white} strokeWidth="2" />
          </View>
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => navigation.navigate('AddressScreen')}>
            <View style={styles.locationheader}>
              <Feather name="map-pin" size={16} color={colors.white} />
              <Text style={styles.locationTitle}>
                {pinCode ? pinCode : 'Delivery Location'}
              </Text>
              <Feather name="chevron-down" size={16} color={colors.white} />
            </View>
            <Text style={styles.locationText} numberOfLines={1}>
              {address}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderPopularItems = () => {
    return (
      <>
        <View style={[styles.subHeaderContainer, {marginTop: 34}]}>
          <Text style={styles.heading}>Popular Items</Text>
        </View>
        <ScrollView horizontal style={styles.row}>
          {popularProducts?.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                style={{width: 100}}
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    product_id: item?.id,
                    product: item,
                    supplier_id: item?.supplierId,
                  })
                }
                key={index}>
                <Image
                  source={
                    item?.imageUrl?.length
                      ? {uri: item?.imageUrl[0]}
                      : AppImages.noImg.source
                  }
                  style={{
                    height: 125,
                    width: 87,
                    marginBottom: 10,
                  }}
                />
                <Text style={styles.nearRHeading}>{item?.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />
      {renderHeader()}
      <ScrollView style={styles.container}>
        {renderSlides()}
        {renderSuppliers()}
        {renderPopularItems()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    headerContainer: {
      backgroundColor: colors.primary,
    },
    header: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      // paddingVertical: 15,
      paddingBottom: 5,
      alignItems: 'center',
      gap: 11,
    },
    searchWrapper: {
      borderRadius: 26,
      backgroundColor: colors.white,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    searchInput: {
      ...fonts.subHeading,
      color: colors.subHeading,
      flex: 1,
      marginHorizontal: 4,
      height: 45,
    },
    heading: {
      ...fonts.bold,
      color: colors.heading,
    },
    subHeading: {
      ...fonts.description,
      color: colors.heading,
      fontSize: 10,
    },
    row: {
      marginTop: 16,
      marginBottom: 32,
    },
    categoryImg: {
      backgroundColor: colors.white,
      borderRadius: 6,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowRadius: 8,
      elevation: 8,
      shadowOpacity: 1,
      flex: 1,
      height: 61,
      width: 61,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
      marginRight: 16,
    },
    offerHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 12,
      textAlign: 'center',
    },
    categoryHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 10,
      textAlign: 'center',
    },
    nearRHeading: {
      ...fonts.heading,
      color: colors.heading,
      fontSize: 13,
    },
    nearRSubHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      fontSize: 10,
      marginTop: 4,
    },
    content: {
      borderRadius: 30,
      backgroundColor: colors.white,
      padding: 24,
      paddingBottom: 48,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },

    btnContainerStyle: {
      marginVertical: 8,
      marginTop: 32,
    },
    account: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      marginTop: 24,
    },
    inputContainerStyle: {
      marginVertical: 8,
    },
    forgotPasswordContainer: {
      alignSelf: 'flex-end',
    },
    forgotPassword: {
      ...fonts.heading,
      color: colors.heading,
      fontSize: 13,
      textDecorationLine: 'underline',
    },
    signUp: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    locationContainer: {
      paddingHorizontal: 16,
    },
    locationheader: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginBottom: 2,
    },
    locationTitle: {
      ...fonts.regular,
      color: colors.white,
      paddingHorizontal: 8,
    },
    locationText: {
      ...fonts.description,
      color: colors.gray,
      lineHeight: 12,
      paddingLeft: 24,
      paddingBottom: 10,
    },
    offerContainer: {
      height: 208,
      borderRadius: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
    },
    swipeCard: {
      width: windowWidth - 48,
      padding: 11,
    },
    swipeCardContent: {
      flexDirection: 'row',
      flex: 1,
      marginTop: 10,
    },
    subHeaderContainer: {
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    catalogCard: {
      flex: 1,
      margin: 7,
    },
    catalogTitle: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      paddingTop: 6,
    },
    imgContainer: {
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.15)',
      shadowOffset: {width: 1, height: 0},
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
      borderRadius: 6,
      // borderWidth: 1,
      // borderColor: Colors.CARD_BORDER_COLOR,
      flex: 1,
    },
    nearBySupplierContainer: {
      // backgroundColor: 'red',

      flexDirection: 'row',
      rowGap: 10,
      height: 130,
      marginTop: 10,
    },
  });
