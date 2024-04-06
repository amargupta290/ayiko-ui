import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
      order: 2,
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
      order: 3,
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
      order: 4,
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
      order: 5,
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
      inputVal[1].value = catalogData?.category;
      const items = inputVal[1].items;
      if (items) {
        let updatedItems = items.map((data, index) =>
          data.title === catalogData?.category
            ? {...data, value: true}
            : {...data, value: false},
        );
        // items[itemIndex].value = !items[itemIndex].value;
        inputVal[1].items = updatedItems;
      }
      let imgUrls = catalogData?.imageUrl?.map((item: any) => {
        return {url: item};
      });
      inputVal[2].value = catalogData?.available;
      inputVal[3].value = catalogData?.unitPrice;
      inputVal[4].value = catalogData?.description;
      inputVal[5].value = imgUrls;
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

  const fileSelected = async (key: number, filePath: any) => {
    setLoading(prevLoading => !prevLoading);
    const fileContent = await RNFS.readFile(filePath[0].uri, 'base64');

    const params = {
      Bucket: 'ayikos3bucket',
      Key: `images/${new Date().toISOString()}_${filePath[0].fileName}`,
      Body: Buffer.from(fileContent, 'base64'),
      ContentType: filePath[0].type,
    };

    console.log('params', params);

    s3.upload(params, (err: any, data: {Location: any}) => {
      if (err) {
        console.log('Error uploading to S3:', err);
      } else {
        if (key !== undefined) {
          const inputVal = input;
          let doctValue = inputVal[key].value;
          doctValue.push({
            name: filePath[0].fileName,
            url: data.Location,
          });
          inputVal[key].value = doctValue;
          inputVal[key].error = false;
          setInput(() => [...inputVal]);
        }
        console.log('Upload successful:', data.Location);
        setLoading(prevLoading => !prevLoading);
      }
    }).on('httpUploadProgress', progress => {
      const percentUploaded = Math.round(
        (progress.loaded / progress.total) * 100,
      );
      console.log(`Upload progress: ${percentUploaded}%`);
      // You can use this progress information to update your UI or perform other actions
    });
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
                    {data.name}
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
    } else {
      null;
    }
  };

  const saveClick = () => {
    const inputValid = globalHelpers.validation(input);
    setInput(() => [...inputValid]);
    console.log('input saveClick', JSON.stringify(input, null, 2));
    if (inputValid.valid) {
      const payload = {
        name: input[0].value,
        category: input[1].value,
        available: input[2].value,
        unitPrice: input[3].value,
        description: input[4].value,
        quantity: 1,
        imageUrl: input[5].value?.map((item: {url: any}) => item?.url),
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
  });
