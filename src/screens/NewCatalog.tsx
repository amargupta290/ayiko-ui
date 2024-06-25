import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {Buffer} from 'buffer';
import {
  FAlert,
  FButton,
  FRadio,
  FSwitch,
  FTextInput,
  FilePicker,
  Loader,
} from 'components';
import {useAppDispatch, useAppSelector} from 'hooks';
import globalHelpers from '../utils/helpers';
import {S3} from 'aws-sdk';
import RNFS from 'react-native-fs';
import {RootState} from 'store';
import {catalogCreate, catalogUpdate} from 'store/slices/catalogSlice';
import {IInputs} from 'utils/interface';
import helpers from '../utils/helpers';
import SelectDropdown from 'react-native-select-dropdown';

const windowWidth = Dimensions.get('window').width;

const NewCatalogScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {catalogData} = route.params;
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const {currentUser} = useAppSelector((state: RootState) => state.auth);
  const [isPopupVisible, setPopupVisible] = useState(false);

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

  const [input, setInput] = useState([
    {
      order: 0,
      label: 'Enter Name',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      errorText: 'Please enter valid name',
      key: 'name',
      fixLabel: true,
      type: 'input',
    },
    {
      order: 1,
      label: 'Select Category',
      placeholder: '',
      value: '',
      error: false,
      fixLabel: true,
      mandatory: 1,
      errorText: 'Please choose category',
      key: 'productCategory',
      type: 'select',
      items: globalHelpers?.productCategories?.map(item => {
        return {
          id: item,
          title: item,
          value: false,
        };
      }),
    },
    {
      order: 2,
      label: 'Select Unit type',
      placeholder: '',
      value: '',
      error: false,
      fixLabel: true,
      mandatory: true,
      errorText: 'Please enter valid price',
      key: 'category',
      type: 'radio',
      items: [
        {
          id: 0,
          title: 'Litre',
          value: false,
        },
        {
          id: 1,
          title: 'Kg',
          value: false,
        },
        {
          id: 2,
          title: 'Per Item',
          value: false,
        },
      ],
    },
    {
      order: 3,
      label: 'Select Availability',
      placeholder: '',
      value: true,
      error: false,
      fixLabel: true,
      mandatory: 1,
      errorText: 'Please select select availability',
      key: 'availability',
      checkedValue: 'In Stock',
      unCheckedValue: 'Out of Stock',
      type: 'switch',
    },
    {
      order: 4,
      label: 'Enter Price(In Rs.)',
      placeholder: '',
      value: '',
      error: false,
      fixLabel: true,
      mandatory: 1,
      errorText: 'Please enter valid price',
      key: 'price',
      type: 'input',
      keyboardType: 'numeric',
    },
    {
      order: 5,
      label: 'Enter Description',
      placeholder: '',
      value: '',
      error: false,
      fixLabel: true,
      mandatory: 1,
      errorText: 'Please enter valid description',
      key: 'description',
      type: 'input',
      multiline: true,
    },
    {
      order: 6,
      label: 'Upload Image',
      subLabel: '(Min 1 & Max 5)',
      placeholder: 'Upload File',
      value: [],
      error: false,
      fixLabel: true,
      mandatory: 1,
      errorText: 'Please select image',
      key: 'uploadImage',
      type: 'file',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const isLoading = useAppSelector((state: RootState) => state.catalog.loading);

  const s3 = new S3({
    accessKeyId: 'AKIAQXR5F2WXECSPPVG6',
    secretAccessKey: '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',
    region: 'af-south-1',
  });

  useEffect(() => {
    if (catalogData) {
      const inputVal = input;
      inputVal[0].value = catalogData?.name;
      inputVal[1].value = catalogData?.productCategory;
      inputVal[2].value = catalogData?.category;
      const items = inputVal[2].items;
      if (items) {
        let updatedItems = items.map((data, index) =>
          data.title === catalogData?.category
            ? {...data, value: true}
            : {...data, value: false},
        );
        // items[itemIndex].value = !items[itemIndex].value;
        inputVal[2].items = updatedItems;
      }
      let imgUrls = catalogData?.imageUrl?.map((item: any) => {
        return {
          imageType: item?.imageType,
          imageTitle: item?.imageTitle,
          imageDescription: item?.imageDescription,
          profilePicture: item?.profilePicture,
          imageUrl: item?.imageUrl,
        };
      });

      console.log('data?.imageTitle', imgUrls);
      inputVal[3].value = catalogData?.available;
      inputVal[4].value = catalogData?.unitPrice;
      inputVal[5].value = catalogData?.description;
      inputVal[6].value = imgUrls;
      setInput(() => [...inputVal]);
    }
  }, [catalogData]);

  const onChangeText = (key: number, value: string) => {
    if (key !== undefined) {
      const inputVal = input;
      inputVal[key].value = value;
      inputVal[key].error = false;
      setInput(() => [...inputVal]);
    }
  };

  const onSwitchClick = (key: number) => {
    if (key !== undefined) {
      const inputVal = input;
      inputVal[key].value = !inputVal[key].value;
      inputVal[key].error = false;
      setInput(() => [...inputVal]);
    }
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

  const deleteFile = (key: number, fileIndex: any) => {
    if (key !== undefined && fileIndex !== undefined) {
      const inputVal = input;
      let doctValue = inputVal[key].value;
      doctValue.splice(fileIndex, 1);
      inputVal[key].value = doctValue;
      inputVal[key].error = false;
      setInput(() => [...inputVal]);
    }
  };

  const fileSelected = async (key: number, filePaths: any[]) => {
    setLoading(prevLoading => !prevLoading);
    try {
      const uploadPromises = filePaths.map(async (filePath, index) => {
        const fileContent = await RNFS.readFile(filePath.uri, 'base64');
        const params = {
          Bucket: 'ayikos3bucket',
          Key: `images/${new Date().toISOString()}_${filePath.fileName}`,
          Body: Buffer.from(fileContent, 'base64'),
          ContentType: filePath.type,
        };
        console.log('Uploading file:', filePath.fileName);
        return new Promise((resolve, reject) => {
          s3.upload(params, (err: any, data: {Location: any}) => {
            if (err) {
              console.log('Error uploading to S3:', err);
              reject(err);
            } else {
              console.log('Upload successful:', data.Location);
              resolve(data.Location);
            }
          }).on('httpUploadProgress', progress => {
            const percentUploaded = Math.round(
              (progress.loaded / progress.total) * 100,
            );
            console.log(
              `Upload progress for file ${index + 1}: ${percentUploaded}%`,
            );
            // You can use this progress information to update your UI or perform other actions
          });
        });
      });

      Promise.all(uploadPromises)
        .then(uploadedUrls => {
          console.log('All files uploaded successfully:', uploadedUrls);
          if (key !== undefined) {
            const inputVal = input;
            let doctValue = inputVal[key].value;
            uploadedUrls.forEach((url, index) => {
              doctValue.push({
                name: filePaths[index].fileName,
                url: url,
                imageType: filePaths[index].type,
                imageTitle: filePaths[index].fileName,
                imageDescription: 'Nothing',
                profilePicture: false,
                imageUrl: url,
              });
            });
            inputVal[key].value = doctValue;
            inputVal[key].error = false;
            setInput(() => [...inputVal]);
          }
        })
        .catch(error => {
          console.error('Error uploading files:', error);
        })
        .finally(() => {
          setLoading(prevLoading => !prevLoading);
        });
    } catch (error) {
      console.error('Error reading file content:', error);
      setLoading(prevLoading => !prevLoading);
    }
  };

  const renderItem: ListRenderItem<IInputs> = ({item, index}) => {
    if (item.type === 'input') {
      return (
        <FTextInput
          {...item}
          containerStyle={styles.inputContainerStyle}
          onTextChange={text => onChangeText(index, text)}
        />
      );
    } else if (item.type === 'radio') {
      return (
        <FRadio
          {...item}
          radioClick={(itemIndex: number) => onRadioClick(index, itemIndex)}
        />
      );
    } else if (item.type === 'file') {
      return (
        <>
          <FilePicker
            {...item}
            fileSelected={(file: any) => fileSelected(index, file)}
          />
          {item.value?.map(
            (
              data: {
                name:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | null
                  | undefined;
              },
              fileIndex: React.Key | null | undefined,
            ) => (
              <View key={fileIndex} style={styles.filesContainer}>
                <View style={{flex: 1}}>
                  <Text numberOfLines={1} style={styles.fileName}>
                    {data.imageTitle}
                  </Text>
                  <View style={styles.progress} />
                </View>
                <Feather
                  name="x"
                  size={25}
                  onPress={() => deleteFile(index, fileIndex)}
                />
              </View>
            ),
          )}
        </>
      );
    } else if (item.type === 'switch') {
      return <FSwitch {...item} switchClick={() => onSwitchClick(index)} />;
    } else if (item.type === 'select') {
      return (
        <>
          <SelectDropdown
            data={item.items}
            onSelect={(selectedItem, itemIndex) => {
              console.log(selectedItem, itemIndex);
              onRadioClick(index, itemIndex);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View
                  style={{
                    ...styles.dropdownButtonStyle,
                    borderColor: item.error ? 'red' : 'black',
                  }}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {item.value ||
                      (selectedItem && selectedItem.title) ||
                      'Select Category'}
                  </Text>
                </View>
              );
            }}
            renderItem={(obj, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && {backgroundColor: '#D2D9DF'}),
                  }}>
                  {/* <Icon name={item.icon} style={styles.dropdownItemIconStyle} /> */}
                  <Text style={styles.dropdownItemTxtStyle}>{obj.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <View>
            <Text style={styles.message}>
              {item.error ? item.errorText : ''}
            </Text>
          </View>
        </>
      );
    } else {
      null;
    }
  };

  console.log('input saveClick', JSON.stringify(input, null, 2));

  const saveClick = () => {
    const inputValid = globalHelpers.validation(input);
    setInput(() => [...inputValid]);
    console.log('input saveClick', JSON.stringify(input, null, 2));
    if (inputValid.valid) {
      const payload = {
        name: input[0].value,
        productCategory: input[1].value,
        category: input[2].value,
        available: input[3].value,
        unitPrice: input[4].value,
        description: input[5].value,
        quantity: 1,
        imageUrl: input[6].value?.map(img => {
          return {
            imageType: img?.imageType,
            imageTitle: img?.imageTitle,
            imageDescription: img?.imageDescription,
            profilePicture: img?.profilePicture,
            imageUrl: img?.imageUrl,
          };
        }),
      };
      console.log('input saveClick', JSON.stringify(payload, null, 2));
      if (catalogData?.id) {
        payload.id = catalogData.id;
      }

      dispatch(
        catalogData?.id ? catalogUpdate(payload) : catalogCreate(payload),
      ).then(async (data: any) => {
        console.log('data?.payload', JSON.stringify(data, null, 2));
        if (data?.payload) {
          setAlertShow(prevAlertShow => !prevAlertShow);
          // navigation.navigate('Congratulation', {fromPage: 'singIn'});
        } else {
          Alert.alert('Error', data?.payload?.messageDescription, [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        }
        console.log('data', data);
      });
    }
  };

  const renderConfirmationPopup = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={closePopup}>
        {/* <TouchableWithoutFeedback onPress={closePopup}> */}
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
                  navigation.goBack();
                  navigation.navigate('AddBusinessInfo');
                }}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        // contentContainerStyle={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // enabled
        keyboardVerticalOffset={100}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? -150 : -150}
      >
        <Loader isLoading={isLoading || loading} />
        <FAlert
          show={alertShow}
          title="Successful!!"
          subTitle={
            catalogData?.id
              ? 'Your catalog updated successfully.'
              : 'Your catalog created successfully.'
          }
          okClick={() => {
            setAlertShow(prevAlertShow => !prevAlertShow);
            navigation.pop();
          }}
          cancelClick={() => {
            setAlertShow(prevAlertShow => !prevAlertShow);
          }}
        />
        <ScrollView
          // style={styles.container}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <FlatList
            data={input}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
          />
          <View style={styles.footerButton}>
            <FButton
              label="Cancel"
              buttonClick={() => navigation.pop()}
              containerStyle={{
                ...styles.footerBtnContainer,
                ...styles.cancelBtn,
              }}
            />
            <FButton
              label="Save"
              buttonClick={() => saveClick()}
              containerStyle={styles.footerBtnContainer}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {renderConfirmationPopup()}
    </SafeAreaView>
  );
};

export default NewCatalogScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flexGrow: 1,
      padding: 24,
      backgroundColor: colors.background,
      paddingBottom: 200,
    },
    footerButton: {
      marginTop: 50,
      // position: 'absolute',
      flexDirection: 'row',
      // right: 24,
      // left: 24,
      // bottom: 30,
      gap: 16,
    },
    cancelBtn: {
      backgroundColor: colors.subHeading,
    },
    footerBtnContainer: {
      flex: 1,
    },
    message: {
      ...fonts.regular,
      color: colors.red,
      marginLeft: 5,
      marginBottom: 8,
    },
    searchWrapper: {
      borderRadius: 26,
      backgroundColor: colors.white,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 1,
        height: 0,
      },
      shadowRadius: 8,
      elevation: 8,
      shadowOpacity: 1,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 40,
    },
    searchInput: {
      ...fonts.subHeading,
      color: colors.subHeading,
      flex: 1,
      marginHorizontal: 4,
      height: 45,
    },
    filesContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    fileName: {
      ...fonts.regular,
      color: colors.heading,
    },
    progress: {
      flex: 1,
      height: 5,
      backgroundColor: colors.primary,
      borderRadius: 50,
      marginTop: 8,
    },
    heading: {
      ...fonts.heavy,
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
    offerHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
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
    dropdownButtonStyle: {
      width: '100%',
      height: 58,
      marginBottom: 20,
      backgroundColor: 'transparent',
      borderRadius: 12,
      borderColor: 'black',
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
  });
