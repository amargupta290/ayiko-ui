import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';
import Popover, {PopoverPlacement} from 'react-native-popover-view';

import {catalogList} from 'store/slices/catalogSlice';
import {RootState} from 'store';
import {ImageComp, Loader} from 'components';

const CatalogScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [popOverId, setPopOverId] = useState(null);
  const isLoading = useAppSelector((state: RootState) => state.catalog.loading);
  const catalogData = useAppSelector((state: RootState) => state.catalog.data);

  useEffect(() => {
    dispatch(catalogList());
  }, [dispatch]);

  const onClose = () => {
    setPopOverId(null);
  };

  const onOpen = (id: any) => {
    setPopOverId(id);
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.card,
          {marginBottom: catalogData?.length == index + 1 ? 150 : 8},
        ]}
        key={index}>
        <ImageComp
          source={{uri: item?.imageUrl[0]}}
          imageStyle={styles.image}
        />
        <View style={styles.cardDescription}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.available}>
            {item.available ? 'In Stock' : 'Out Of Stock'}
          </Text>
          <Text style={styles.unitPrice}>
            {item.unitPrice}/{item.category}
          </Text>
        </View>
        <Popover
          // key={index}
          isVisible={item.id === popOverId ? true : false}
          onRequestClose={onClose}
          // mode={PopoverMode.TOOLTIP}
          placement={PopoverPlacement.BOTTOM}
          // fromView={item}
          from={
            <TouchableOpacity onPress={() => onOpen(item.id)}>
              <Feather name="more-vertical" size={25} />
            </TouchableOpacity>
          }>
          <View style={styles.popoverContainer}>
            <TouchableOpacity
              style={styles.popoverContent}
              onPress={() => {
                onClose();
                navigation.navigate('NewCatalogScreen', {
                  catalogData: item,
                });
              }}>
              <Feather name="edit-2" />
              <Text style={styles.title}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popoverContent}
              onPress={() => onClose()}>
              <Feather name="refresh-cw" />
              <Text style={styles.title}>Change Status</Text>
            </TouchableOpacity>
          </View>
        </Popover>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />
      <FlatList
        style={styles.container}
        data={catalogData}
        renderItem={renderItem}
      />
      <View style={styles.BottomPadding}></View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('NewCatalogScreen')}
        style={styles.fabButton}>
        <Feather name="plus" size={25} color={colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CatalogScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      padding: 24,
      backgroundColor: colors.background,
      paddingBottom: 100,
    },
    fabButton: {
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 20,
      bottom: 20,
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
