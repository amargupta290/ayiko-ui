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
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';

import {AppImages, SVGHeartIcon, SVGOutOfStock, SVGSearch} from 'assets/image';
import {RootState} from 'store';
import {catalogList, supplierList} from 'store/slices/DashboardSlice';
import {FButton, ImageComp, Loader} from 'components';
import {getCustomer} from 'store/slices/authSlice';
import {supplierDetails, supplierProducts} from 'store/slices/SupplierSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getItemQuantity, setCarItem} from 'store/slices/CartSlice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProductDetail = ({navigation, route}: {navigation: any; route: any}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const {product, product_id, supplier_id} = route.params;
  const [quantity, setQuantity] = useState(0);
  const [cart, setCart] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const isLoading = useAppSelector(
    (state: RootState) => state.dashboard.loading,
  );

  const {supplierDetailsData, supplierProductsData} = useAppSelector(
    (state: RootState) => state.supplier,
  );

  console.log('id', supplierDetailsData);

  useEffect(() => {
    if (supplier_id) {
      dispatch(supplierDetails(supplier_id));
      dispatch(supplierProducts(supplier_id));
      getItemQuantity(product, setQuantity);
    }
  }, [dispatch, supplier_id]);

  const [shopByCatalog, setShopByCatalog] = useState([
    {id: 1, title: 'Fruits'},
    {id: 2, title: 'Vegetables'},
    {id: 3, title: 'Dairy Products'},
    {id: 4, title: 'Fast Food'},
    {id: 5, title: 'Tea, Coffee'},
    {id: 6, title: 'Healthy Food'},
    {id: 7, title: 'Fruits'},
    {id: 8, title: 'Vegetables'},
    {id: 9, title: 'Dairy Products'},
    {id: 10, title: 'Fast Food'},
    {id: 11, title: 'Tea, Coffee'},
    {id: 12, title: 'Healthy Food'},
  ]);

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

  const renderProductDetailComp = () => {
    getItemQuantity(product, setQuantity);
    return (
      <>
        <View style={styles.thumbnailContainer}>
          <ImageComp
            source={
              product?.imageUrl?.length
                ? {uri: product?.imageUrl[0]?.imageUrl}
                : AppImages.noImg.source
            }
            imageStyle={{
              width: windowWidth - 40,
              height: 200,
              // aspectRatio: 1.4,
              borderRadius: 25,
            }}
            resizeMode="cover"
          />
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text style={styles.nameText}>{product?.name}</Text>
          </View>
          <View style={styles.orderItemQty}>
            <TouchableOpacity
              onPress={() => {
                if (product?.available) {
                  setCarItem(product, null, quantity, setQuantity);
                } else {
                  setPaymentModal(true);
                }
              }}
              disabled={parseInt(quantity) <= 0}>
              <Feather name="minus" size={16} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.quantity}> {quantity ?? 0}</Text>
            <TouchableOpacity
              onPress={() => {
                if (product?.available) {
                  setCarItem(product, 'add', quantity, setQuantity);
                } else {
                  setPaymentModal(true);
                }
              }}>
              <Feather name="plus" size={16} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={styles.unitPriceText}>
              Rs. {product?.unitPrice}/
              <Text style={styles.ratingText}>{product?.category}</Text>
            </Text>
            <Text
              style={[
                styles.ratingText,
                {color: product?.available ? 'green' : 'red'},
              ]}>
              {product?.available ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
          <SVGHeartIcon />
        </View>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text>Description: {product?.description}</Text>
        </View>
      </>
    );
  };

  const renderOtherItems = () => {
    return (
      <>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.heading}>All Popular items</Text>
        </View>

        <View>
          <ScrollView
            style={{marginTop: 10, marginBottom: 20}}
            horizontal
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}>
            <FlatList
              data={supplierProductsData ?? []}
              contentContainerStyle={{alignSelf: 'flex-start'}}
              numColumns={Math.ceil(shopByCatalog?.length / 2)}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={styles.catalogCard}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      product_id: item?.id,
                      product: item,
                      supplier_id: supplier_id,
                    })
                  }
                  key={index}>
                  <View style={styles.imgContainer}>
                    <ImageComp
                      source={
                        item?.imageUrl?.length
                          ? {uri: item?.imageUrl[0]?.imageUrl}
                          : AppImages.noImg.source
                      }
                      imageStyle={{
                        width: 64,
                        height: 62,
                        // aspectRatio: 1.4,
                        borderRadius: 4,
                      }}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.catalogTitle}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={{paddingBottom: 60}}></View>
          </ScrollView>
        </View>
      </>
    );
  };

  const outOfStockModal = () => {
    return (
      <>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={paymentModal}
            onRequestClose={() => {
              setPaymentModal(false);
            }}>
            <TouchableWithoutFeedback onPress={() => setPaymentModal(false)}>
              <View style={styles.centeredView}>
                {/* <View style={styles.modalView}> */}
                <SVGOutOfStock width={'80%'} />
                {/* </View> */}
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Loader isLoading={isLoading} />
        {headerComponent()}
        <ScrollView style={styles.container}>
          {renderProductDetailComp()}
          <View style={styles.breaker}></View>
          {renderOtherItems()}
        </ScrollView>
        <FButton
          label="Add to Cart"
          buttonClick={async () => {
            if (product?.available) {
              quantity <= 0 &&
                (await setCarItem(product, 'add', quantity, setQuantity));

              navigation.navigate('Cart');
            } else {
              setPaymentModal(true);
            }
          }}
          containerStyle={styles.footerBtnContainer}
        />

        {outOfStockModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
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
    footerBtnContainer: {
      margin: 20,
    },
    quantity: {
      ...fonts.regular,
      color: colors.primary,
      marginBottom: 2,
    },
    unitPriceText: {
      ...fonts.regular,
      color: colors.black,
      marginBottom: 2,
    },
    available: {
      ...fonts.description,
      color: colors.green,
      marginBottom: 2,
    },
    orderItemQty: {
      borderRadius: 17.34,
      height: 34,
      width: 115,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
      // marginHorizontal: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
      paddingHorizontal: 8,
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
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowRadius: 54,
      elevation: 8,
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
      width: 68,
      justifyContent: 'center',
      alignItems: 'center',
      // borderWidth: 1,
      // borderColor: Colors.CARD_BORDER_COLOR,
      flex: 1,
    },
    nearBySupplierContainer: {
      flexDirection: 'row',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });
