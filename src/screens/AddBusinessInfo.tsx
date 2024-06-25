import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
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
import {AddIconWithBg, CurrentLocationIcon} from 'assets/image';
import {updateSupplier} from 'store/slices/SupplierSlice';
import {getSupplierByToken, setCurrentUser} from 'store/slices/authSlice';

const AddBusinessInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
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
      order: 2,
      label: 'location',
      type: 'location',
      value: '',
      error: false,
      fixLabel: true,
      mandatory: 0,
    },
    {
      order: 3,
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
  const isLoading = useAppSelector(
    (state: RootState) => state.supplier.loading,
  );
  const supplierDetails = useAppSelector(
    (state: RootState) => state.auth.supplierData,
  );

  const s3 = new S3({
    accessKeyId: 'AKIAQXR5F2WXECSPPVG6',
    secretAccessKey: '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',
    region: 'af-south-1',
  });

  useEffect(() => {
    dispatch(getSupplierByToken());
  }, []);

  useEffect(() => {
    if (supplierDetails) {
      const inputVal = input;
      inputVal[0].value =
        supplierDetails?.businessName ?? supplierDetails?.companyName;
      inputVal[1].value = supplierDetails?.businessDescription;
      inputVal[3].value = [{url: supplierDetails?.imageUrl}];
      setInput(() => [...inputVal]);
    }
  }, [supplierDetails]);

  const onChangeText = (key: number, value: string) => {
    if (key !== undefined) {
      const inputVal = input;
      inputVal[key].value = value;
      inputVal[key].error = false;
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

    s3.upload(params, (err, data) => {
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
    } else if (item.type === 'file') {
      return (
        <>
          <FilePicker
            {...item}
            fileSelected={(file: any) => fileSelected(index, file)}
          />
          {item.value?.map((data, fileIndex) => (
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
          ))}
        </>
      );
    } else if (item.type === 'location') {
      return (
        <View style={[styles.inputContainerStyle]}>
          <View style={styles.locationContainer}>
            <Text style={styles.label}>Location</Text>
            <Pressable>
              <CurrentLocationIcon />
            </Pressable>
          </View>
          <View style={styles.breaker}></View>
          <View style={styles.addressContainer}>
            <Text style={styles.label}>Enter Address</Text>
            <View style={[styles.flexRow, styles.addAddress]}>
              <Pressable>
                <AddIconWithBg />
              </Pressable>
              <Text>Add New Address</Text>
            </View>
          </View>
        </View>
      );
    } else {
      null;
    }
  };

  const saveClick = () => {
    const inputValid = globalHelpers.validation(input);
    console.log('inputValid', JSON.stringify(inputValid, null, 2));
    setInput(() => [...inputValid]);
    console.log('inputValid', supplierDetails);
    if (inputValid) {
      const payload = {
        id: supplierDetails?.id,
        businessName: input[0].value,
        companyName: input[0].value,
        businessDescription: input[1].value,
        businessImages: [input[3].value[0]?.url],
      };
      console.log('payload', payload);
      dispatch(updateSupplier(payload)).then(async (data: any) => {
        if (data?.payload) {
          setAlertShow(prevAlertShow => !prevAlertShow);
          dispatch(getSupplierByToken());
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
          subTitle={'Business Information updated successfully.'}
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

export default AddBusinessInfo;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    flexRow: {
      flexDirection: 'row',
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
    locationContainer: {
      rowGap: 5,
    },
    addressContainer: {
      top: 20,
    },
    addAddress: {
      alignItems: 'center',
      paddingBottom: 20,
    },
    label: {
      ...fonts.medium,
      marginBottom: 8,
    },
    breaker: {
      top: 10,
      bottom: 10,
      width: '100%',
      height: 1,
      borderBottomWidth: 1,
      borderBottomColor: colors?.borderColor,
    },
  });
