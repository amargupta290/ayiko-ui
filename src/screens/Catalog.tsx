import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {useAppDispatch, useAppSelector} from 'hooks';
import Popover, {PopoverPlacement} from 'react-native-popover-view';

import {catalogList} from 'store/slices/catalogSlice';
import {RootState} from 'store';
import {FRadio, ImageComp, Loader} from 'components';
import {SVGLoader} from 'assets/image';
import helpers from 'utils/helpers';

const windowWidth = Dimensions.get('window').width;

const CatalogScreen = ({navigation, route}: {navigation: any; route: any}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [popOverId, setPopOverId] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const isLoading = useAppSelector((state: RootState) => state.catalog.loading);
  const catalogData = useAppSelector((state: RootState) => state.catalog.data);
  const {currentUser} = useAppSelector((state: RootState) => state.auth);
  const [changeStatus, setChangeStatus] = useState(false);

  console.log('Market currentUser', currentUser);

  useEffect(() => {
    dispatch(catalogList());
  }, [dispatch]);

  const onClose = () => {
    setPopOverId(null);
  };

  const onOpen = (id: any) => {
    setPopOverId(id);
  };

  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    if (helpers.getBusinessInfoStatus(currentUser)) {
      setPopupVisible(true);
    } else {
      setPopupVisible(false);
    }
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.card,
          {marginBottom: catalogData?.length == index + 1 ? 150 : 8},
        ]}
        key={index}>
        <ImageComp
          source={{uri: item?.imageUrl[0]?.imageUrl}}
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
              onPress={() => {
                onClose();
                setChangeStatus(!changeStatus);
              }}>
              <Feather name="refresh-cw" />
              <Text style={styles.title}>Change Status</Text>
            </TouchableOpacity>
          </View>
        </Popover>
      </View>
    );
  };

  const onRadioClick = (key: number, itemIndex: number) => {
    if (key !== undefined && itemIndex !== undefined) {
      const inputVal = input;
      const items = inputVal[key].items;
      if (items) {
        let updatedItems = items.map((data, index) =>
          index === itemIndex
            ? {...data, value: true}
            : {...data, value: false},
        );
        // items[itemIndex].value = !items[itemIndex].value;
        inputVal[key].value = updatedItems[itemIndex].title;
        inputVal[key].items = updatedItems;
        inputVal[key].error = false;
      }

      setInput(() => [...inputVal]);
    }
  };

  const renderPaymentStatusModal = () => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={changeStatus}
          onRequestClose={() => {
            setChangeStatus(!changeStatus);
          }}>
          {/* <TouchableWithoutFeedback
          onPress={() => setChangeStatus(!changeStatus)}> */}
          <View style={styles.centeredView}>
            {/* <TouchableWithoutFeedback onPress={() => setChangeStatus(false)}> */}
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {/* <SVGLoader /> */}
                {/* <Text style={styles.headingText}>Payment Confirmation</Text> */}
                <FRadio
                  {...{
                    order: 2,
                    label: 'Change Status',
                    placeholder: '',
                    value: true,
                    error: false,
                    fixLabel: true,
                    mandatory: 0,
                    errorText: 'Please select Change Status',
                    key: 'availability',
                    checkedValue: 'In Stock',
                    unCheckedValue: 'Out of Stock',
                    type: 'switch',
                  }}
                  radioClick={(itemIndex: number) =>
                    onRadioClick(index, itemIndex)
                  }
                />
              </View>
            </View>
            {/* </TouchableWithoutFeedback> */}
          </View>
          {/* </TouchableWithoutFeedback> */}
          {/* </View> */}
        </Modal>
      </View>
    );
  };

  const renderConfirmationPopup = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={closePopup}>
        <TouchableWithoutFeedback onPress={closePopup}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.messageText}>
                Please complete the Business info before proceeding to the next
                step.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setPopupVisible(false);
                    navigation.navigate('AddBusinessInfo');
                  }}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Loader isLoading={isLoading} />
      <View>
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
        {renderPaymentStatusModal()}
        {renderConfirmationPopup()}
      </View>
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
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      // marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      height: 200,
      width: windowWidth - 30,
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
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    messageText: {
      marginBottom: 20,
      fontSize: 18,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginHorizontal: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
