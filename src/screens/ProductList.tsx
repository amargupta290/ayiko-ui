import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';
import {SVGSearch, SVGStarIcon} from 'assets/image';
import {RootState} from 'store';
import {ImageComp, Loader} from 'components';
import {supplierDetails, supplierProducts} from 'store/slices/SupplierSlice';
import {returnItemQuantity, setCarItem} from 'store/slices/CartSlice';

const ProductList = ({navigation, route}: {navigation: any; route: any}) => {
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

  useEffect(() => {
    if (id) {
      dispatch(supplierDetails(id));
      dispatch(supplierProducts(id));
    }
  }, [dispatch, id]);

  console.log('supplierData', supplierProductsData);

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {marginBottom: supplierProductsData?.length == index + 1 ? 150 : 8},
        ]}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            product_id: item?.id,
            product: item,
            supplier_id: item?.supplierId,
          })
        }
        key={index}>
        <ImageComp
          source={{uri: item?.imageUrl[0]?.imageUrl}}
          imageStyle={styles.image}
        />
        <View style={styles.cardDescription}>
          <Text style={styles.title}>{item?.name}</Text>
          <Text style={styles.subHeading}>
            Rs. {item?.unitPrice}/{item?.category}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <SVGStarIcon />
            <Text style={styles.unitPrice}>{'4.5'}</Text>
          </View>
        </View>
        <View style={{justifyContent: 'center'}}>
          <Feather name="chevron-right" size={18} />
        </View>
        {/* <View style={styles.orderItemQty}>
          <TouchableOpacity
            onPress={async () =>
              setCarItem(item, 'add', await returnItemQuantity(item), () => {})
            }>
            <Feather name="plus" size={16} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.quantity}>
            {' '}
            {(await returnItemQuantity(item)) || 0}
          </Text>
          <TouchableOpacity
            onPress={async () =>
              setCarItem(item, null, await returnItemQuantity(item), () => {})
            }>
            <Feather name="minus" size={16} color={colors.black} disabled={parseInt(quantity) <= 0}/>
          </TouchableOpacity>
        </View> */}
      </TouchableOpacity>
    );
  };

  const renderTitle = () => {
    return (
      <View
        style={{...styles.flexRow, paddingVertical: 10, paddingHorizontal: 20}}>
        <View style={{width: '78%'}}>
          <Text style={{...styles.filterText, color: colors.subHeading}}>
            {supplierProductsData?.length
              ? supplierProductsData?.length + 1
              : 0}{' '}
            results for Products
          </Text>
        </View>
        <TouchableOpacity
          style={{
            ...styles.flexRow,
            borderWidth: 1,
            borderRadius: 14,
            padding: 5,
            borderBlockColor: '#272727',
          }}>
          <Text style={{...styles.filterText, color: '#272727'}}>Sort By</Text>
          <Feather name="chevron-down" size={15} />
        </TouchableOpacity>
      </View>
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />
      {headerComponent()}
      {renderTitle()}
      <FlatList
        style={styles.container}
        data={supplierProductsData ?? []}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default ProductList;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 10,
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
    filterText: {
      ...fonts.description,
      fontSize: 12,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInput: {
      ...fonts.subHeading,
      color: colors.subHeading,
      flex: 1,
      marginHorizontal: 4,
      height: 35,
    },
    heading: {
      ...fonts.bold,
      color: colors.heading,
    },
    subHeading: {
      ...fonts.description,
      color: colors.heading,
      fontSize: 12,
    },
    row: {
      marginTop: 16,
      marginBottom: 32,
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
    quantity: {
      ...fonts.regular,
      color: colors.primary,
      marginBottom: 2,
    },
    available: {
      ...fonts.description,
      color: colors.green,
      marginBottom: 2,
    },
    orderItemQty: {
      borderRadius: 17.34,
      height: 30,
      width: 80,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    image: {
      borderRadius: 8,
      width: 70,
      height: 70,
    },
    cardDescription: {
      marginLeft: 8,
      justifyContent: 'space-around',
      flex: 1,
    },
    title: {
      ...fonts.regular,
      color: colors.title,
      marginBottom: 2,
    },
    available: {
      ...fonts.description,
      // color: colors.green,
      marginBottom: 2,
    },
    unitPrice: {
      ...fonts.description,
      color: colors.subHeading,
    },
  });
