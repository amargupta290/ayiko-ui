import {useTheme} from '@react-navigation/native';
import {
  AppImages,
  NoteIcon,
  SVGBurger,
  SVGDeliveryMan,
  SVGRoad,
} from 'assets/image';
import {FButton, ImageComp, Loader} from 'components';
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Popover from 'react-native-popover-view';
import {
  acceptCart,
  rejectCart,
  updatePaymentStatus,
} from 'store/slices/CartSlice';
import {useDispatch} from 'react-redux';

const DriverDeliveryDetail = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const dispatch = useDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  // const [data, setdata] = useState(route.params?.data);

  console.log('DriverDeliveryDetail data', JSON.stringify(data, null, 2));

  const calculateTotal = (items: any) => {
    let total = 0;

    // Iterate over each item and calculate the total cost
    items.forEach(item => {
      const quantity = parseInt(item.quantity); // Convert quantity to integer
      const unitPrice = parseFloat(item.product.unitPrice); // Convert unitPrice to float
      total += quantity * unitPrice;
    });

    return total;
  };

  const data = {
    items: [
      {
        name: 'Potato',
        unitPrice: 30,
        unit: 'Kg',
        available: true,
        quantity: 1,
        product: {
          unitPrice: 300,
          name: 'Potato',
          available: true,
          quantity: 1,
          category: 'kg',
        },
      },
      // {
      //   name: 'Potato',
      //   price: 30,
      //   unit: 'Kg',
      //   available: true,
      //   qty: 1,
      // },
      // {
      //   name: 'Potato',
      //   price: 30,
      //   unit: 'Kg',
      //   available: true,
      //   qty: 1,
      // },
    ],
  };
  const renderOrderItem = () => {
    return (
      <View style={styles.orderItemsCard}>
        <View style={[styles.row, styles.upperCardHeader]}>
          <Text style={styles.headingText}>Order Details</Text>
        </View>
        <View style={styles.orderItemContainer}>
          {data?.items?.map((item: any, i: number) => {
            return (
              <View style={styles.orderItemCard} key={i}>
                <View style={styles.row}>
                  <View>
                    <ImageComp
                      source={
                        item?.product?.imageUrl?.length
                          ? {uri: item?.product?.imageUrl[0]}
                          : AppImages.noImg.source
                      }
                      resizeMode="cover"
                      imageStyle={styles.orderItemImage}
                    />
                  </View>
                  <View style={styles.orderItemTextContainer}>
                    <Text style={styles.headingText}>
                      {item?.product?.name}
                    </Text>
                    <Text style={[styles.title]}>
                      Rs. {item?.product?.unitPrice}/{item.product?.category}
                    </Text>
                    <Text
                      style={{
                        ...styles.available,
                        color: item?.product?.available
                          ? colors.green
                          : colors.red,
                      }}>
                      {item?.product?.available ? 'In Stock' : 'Out of Stock'}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderItemQty}>
                  <Text style={styles.quantity}> {item?.quantity}/</Text>
                  <Text style={styles.unitText}>{item?.product?.category}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const orderDetailCard = () => {
    return (
      <View style={styles.addCard}>
        <View style={[styles.row, styles.upperCardHeader]}>
          <Text style={styles.headingText}>Delivery Request</Text>
          <View>
            <Text
              style={{
                ...styles.available,
                color: route?.params?.available ? colors.green : colors.red,
              }}>
              {route?.params?.available ? 'In stock' : 'Out of stock'}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.orderDetailTextContainer]}>
          <Image
            source={require('assets/image/logos_google-maps.png')}
            resizeMode="contain"
            style={styles.orderDetailAddressImage}
          />
          <Text style={styles.title}>Delivery Address: </Text>
          <Text style={styles.title}>New sangvi, Pune</Text>
        </View>
        <View style={[styles.row, styles.orderDetailLowerTextContainer]}>
          <View style={styles.orderDetailNoteIcon}>
            <NoteIcon />
          </View>
          <Text style={styles.title}>Order ID: </Text>
          <Text style={styles.title}>#{data?.id}</Text>
        </View>
      </View>
    );
  };

  const orderCalculationCard = () => {
    return (
      <View style={{marginHorizontal: 8}}>
        <View style={{marginVertical: 10}}>
          <Text>Order Delivery Status</Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginVertical: 10,
          }}>
          <FButton
            label="Start Delivery"
            // buttonClick={() => {
            //   dispatch(acceptCart({id: data?.id}));
            // }}
            containerStyle={styles.orderActionBtn}
            labelStyle={styles.orderActionBtnTxt}
          />
          <FButton
            label="End Delivery"
            // buttonClick={() => {
            //   dispatch(rejectCart({id: data?.id}));
            // }}
            containerStyle={{
              ...styles.orderActionBtn,
              backgroundColor: colors?.subHeading,
            }}
            labelStyle={styles.orderActionBtnTxt}
          />
        </View>
        <View>
          <SVGDeliveryMan />
          <SVGRoad width={'100%'} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Loader isLoading={isLoading} /> */}
      <ScrollView style={styles.content}>
        {orderDetailCard()}
        {renderOrderItem()}
        {orderCalculationCard()}
        <View
          style={{
            position: 'absolute',
            top: 'auto',
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'space-between',
            flexDirection: 'row',
            // marginVertical: 10,
          }}>
          <FButton
            label="Cancel"
            // buttonClick={() => {
            //   dispatch(acceptCart({id: data?.id}));
            // }}
            containerStyle={styles.orderActionBtn}
            labelStyle={styles.orderActionBtnTxt}
          />
          <FButton
            label="Complete"
            // buttonClick={() => {
            //   dispatch(rejectCart({id: data?.id}));
            // }}
            containerStyle={{
              ...styles.orderActionBtn,
            }}
            labelStyle={styles.orderActionBtnTxt}
          />
        </View>
        <View style={{padding: 30}}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverDeliveryDetail;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      marginHorizontal: 10,
    },
    container: {
      padding: 24,
      backgroundColor: colors.background,
    },
    addCard: {
      borderRadius: 10,
      height: 130,
      width: '100%',
      alignSelf: 'center',
      marginVertical: 10,
      paddingHorizontal: 8,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
    },
    orderDetailAddressImage: {
      height: 16,
      width: 10,
      alignSelf: 'center',
      marginRight: 5,
    },
    orderDetailNoteIcon: {
      top: 2.5,
      left: -2.5,
      right: 0,
    },
    orderItemsCard: {
      borderRadius: 10,
      height: 'auto',
      width: '100%',
      alignSelf: 'center',
      marginVertical: 10,
      paddingBottom: 30,
      backgroundColor: colors.white,
      paddingHorizontal: 8,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
    },
    orderItemContainer: {
      top: 15,
    },
    row: {
      flexDirection: 'row',
    },
    upperCardHeader: {
      justifyContent: 'space-between',
      top: 10,
    },
    orderDetailTextContainer: {
      top: 25,
    },
    orderDetailLowerTextContainer: {
      top: 30,
    },
    orderItemImage: {
      height: 66,
      width: 70,
      borderRadius: 8,
      marginRight: 10,
    },
    orderItemCard: {
      borderRadius: 10,
      width: '100%',
      justifyContent: 'space-between',
      alignSelf: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      marginVertical: 10,
      flexDirection: 'row',
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
    orderItemTextContainer: {
      marginTop: 5,
    },
    orderItemQty: {
      borderRadius: 10,
      height: 24,
      width: 80,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      marginHorizontal: 10,
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
    orderCalculationTextContainer: {
      justifyContent: 'space-between',
    },
    orderCalculationCard: {
      borderRadius: 10,
      height: 'auto',
      width: '100%',
      alignSelf: 'center',
      paddingBottom: 30,
      marginVertical: 10,
      paddingHorizontal: 8,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowRadius: 4,
      shadowOpacity: 1,
    },
    breaker: {
      width: '100%',
      height: 1,
      borderBottomWidth: 1,
    },
    orderCalculationInnerContainer: {
      marginTop: 20,
      rowGap: 10,
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
    headingText: {
      ...fonts.medium,
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
    quantity: {
      ...fonts.regular,
      color: colors.primary,
      fontSize: 16,
    },
    unitText: {
      ...fonts.regular,
      color: colors.primary,
      fontSize: 12,
    },
    calculationPrice: {
      ...fonts.subHeading,
    },
    calculationTotalPrice: {
      ...fonts.bold,
    },
    orderActionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 16,
      paddingHorizontal: 8,
    },
    orderActionBtnContainer: {
      flexDirection: 'row',
      gap: 5,
      justifyContent: 'flex-end',
    },
    orderActionBtn: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 5,
      backgroundColor: colors.primary,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 8,
    },
    orderActionBtnTxt: {
      ...fonts.description,
      color: colors.white,
    },
  });
