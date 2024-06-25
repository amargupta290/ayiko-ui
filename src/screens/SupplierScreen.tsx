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
  FlatList,
  Pressable,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';

import {AppImages, SVGSearch, SVGStarIcon} from 'assets/image';
import {RootState} from 'store';
import {catalogList, supplierList} from 'store/slices/DashboardSlice';
import {ImageComp, Loader} from 'components';
import {getCustomer} from 'store/slices/authSlice';
import {supplierDetails, supplierProducts} from 'store/slices/SupplierSlice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SupplierScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const id = route.params?.id;
  const isLoading = useAppSelector(
    (state: RootState) => state.dashboard.loading,
  );

  const {supplierDetailsData, supplierProductsData} = useAppSelector(
    (state: RootState) => state.supplier,
  );

  const catalogData = useAppSelector(
    (state: RootState) => state.dashboard.data,
  );

  console.log(
    'supplierDetailsData',
    // JSON.stringify(supplierProductsData, null, 2),
    id,
  );

  useEffect(() => {
    if (id) {
      console.log(
        'supplierDetailsData',
        // JSON.stringify(supplierProductsData, null, 2),
        id,
      );
      dispatch(supplierDetails(id));
      dispatch(supplierProducts(id));
      // dispatch(catalogList());
    } else {
      navigation.goBack();
    }
  }, [id]);

  const renderBestSellers = () => {
    return (
      <>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.heading}>Best Sellers</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductList', {id: id})}>
            <Text style={styles.subHeading}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.nearBySupplierContainer}>
          {supplierProductsData?.length ? (
            supplierProductsData?.slice(0, 3)?.map((item: any, index: any) => {
              return (
                <TouchableOpacity
                  style={{
                    flex: 1 / 3,
                    padding: 10,
                    margin: 4,
                    borderRadius: 10,
                  }}
                  key={index}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      product_id: item?.id,
                      product: item,
                      supplier_id: supplierDetails?.id,
                    })
                  }>
                  <View
                    style={{
                      backgroundColor: colors.white,
                      borderRadius: 10,
                      paddingBottom: 4,
                      height: 118,
                      width: '100%',
                      justifyContent: 'center',
                      // alignItems: 'center'
                    }}>
                    <ImageComp
                      source={
                        item?.imageUrl?.length
                          ? {uri: item?.imageUrl[0]?.imageUrl}
                          : AppImages.noImg.source
                      }
                      resizeMode="cover"
                      imageStyle={styles.image}
                    />

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductDetail', {
                          product_id: item?.id,
                          product: item,
                          supplier_id: supplierDetails?.id,
                        })
                      }>
                      <View style={styles.plusIconContainer}>
                        <Feather name="plus" size={18} style={{}} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <Text style={styles.itemText}>{`${item.name}`}</Text>
                    <Text style={styles.itemText}>
                      {`Rs. ${item.unitPrice}/${item.category}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.catalogTitle}>
              No Best seller products found.
            </Text>
          )}
        </View>
      </>
    );
  };

  const headerComponent = () => {
    return (
      <View
        style={[
          styles.headerContainer,
          {height: 80, justifyContent: 'center'},
        ]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={25} color={colors.white} />
          </Pressable>
          {/* <View style={styles.searchWrapper}>
            <SVGSearch />
            <TextInput
              placeholder="Search for items or supplier"
              style={styles.searchInput}
            />
          </View>

          <Feather name="bell" size={32} color={colors.white} /> */}
        </View>
      </View>
    );
  };

  const renderCatalog = () => {
    return (
      <>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.heading}>Catalog</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductList', {id: id})}>
            <Text style={styles.subHeading}>View all</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView
            style={{marginTop: 10, marginBottom: 20}}
            horizontal
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}>
            {supplierProductsData?.length > 0 ? (
              <FlatList
                data={supplierProductsData}
                contentContainerStyle={{alignSelf: 'flex-start'}}
                // numColumns={Math.ceil(supplierProductsData?.length / 2)}
                numColumns={20}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.catalogCard}
                    onPress={() =>
                      navigation.navigate('ProductDetail', {
                        product_id: item?.id,
                        product: item,
                        supplier_id: supplierDetails?.id ?? null,
                      })
                    }>
                    <View style={{}}>
                      <View style={styles.imgContainer}>
                        <ImageComp
                          source={
                            item?.imageUrl?.length
                              ? {uri: item?.imageUrl[0]?.imageUrl}
                              : AppImages.noImg.source
                          }
                          imageStyle={{
                            width: 72,
                            height: 62,
                            // aspectRatio: 1.4,
                            borderRadius: 4,
                          }}
                          resizeMode="cover"
                        />
                        {/* <SVGPizzBrug width={'100%'} height={100} /> */}
                      </View>
                    </View>
                    <Text style={styles.catalogTitle}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text>No catalog found.</Text>
            )}
            <View style={{paddingBottom: 60}}></View>
          </ScrollView>
        </View>
      </>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />
      {headerComponent()}
      <ScrollView style={styles.container}>
        <View style={styles.thumbnailContainer}>
          <ImageComp
            source={
              supplierDetailsData?.businessImages?.length
                ? {uri: supplierDetailsData?.businessImages[0]}
                : AppImages.noImg.source
            }
            resizeMode="cover"
            imageStyle={{
              borderRadius: 25,
              width: '100%',
              height: 200,
              aspectRatio: 1.6,
            }}
          />
        </View>
        <View style={{alignContent: 'flex-start', padding: 5}}>
          <Text style={styles.nameText}>
            {supplierDetailsData?.companyName ?? 'Smart Buy'}
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <SVGStarIcon />
            <Text style={styles.ratingText}>
              {supplierDetailsData?.rating ?? '4.5 (100 Rating)'}
            </Text>
          </View>
        </View>
        <View style={styles.breaker}></View>
        {renderBestSellers()}
        <View style={styles.breaker}></View>
        {renderCatalog()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupplierScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    image: {
      borderRadius: 10,
      alignSelf: 'center',
      width: '80%',
      height: 102,
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
    thumbnailContainer: {
      alignItems: 'center',
    },
    nameText: {
      ...fonts.subHeading,
      fontSize: 20,
      marginBottom: 10,
    },
    ratingText: {
      ...fonts.heading,
      color: colors.heading,
      fontSize: 10,
    },
    breaker: {
      width: '100%',
      borderBottomWidth: 1,
      height: 10,
    },
    heading: {
      ...fonts.bold,
      color: colors.heading,
    },
    subHeading: {
      ...fonts.description,
      color: colors.heading,
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
    plusIconContainer: {
      backgroundColor: colors.white,
      shadowColor: '#000000',
      shadowOffset: {
        width: 4,
        height: 3,
      },
      shadowRadius: 60,
      elevation: 10,
      shadowOpacity: 1,
      width: 27,
      height: 27,
      position: 'absolute',
      top: -32,
      bottom: 0,
      left: '62%',
      right: 0,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },

    itemText: {
      ...fonts.subHeading,
      fontSize: 12,
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
      maxWidth: 70,
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
      maxHeight: 118,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    nearBySupplierContainer: {
      flexDirection: 'row',
    },
  });
