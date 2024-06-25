import {useTheme} from '@react-navigation/native';
import {
  SVGBusinessInfo,
  SVGDeliveriesIcon,
  SVGLanguage,
  SVGMembership,
  SVGOrderIcon,
  SVGPaymentMethod,
  SVGPrivcacyPolicy,
  SVGProfilePic,
} from 'assets/image';
import {S3} from 'aws-sdk';
import RNFS from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useCallback, useEffect, useState} from 'react';
import {Buffer} from 'buffer';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAppDispatch, useAppSelector} from 'hooks';
import {
  deleteCustomer,
  deleteDriver,
  deleteSupplier,
  getCustomerByToken,
  getDriverByToken,
  getSupplierByToken,
  setUserNextRoute,
  signOut,
  updateCustomerProfilePicture,
  updateDriverProfilePicture,
  updateSupplierProfilePicture,
} from 'store/slices/authSlice';
import {RootState} from 'store';
import {current} from '@reduxjs/toolkit';
import {launchImageLibrary} from 'react-native-image-picker';
import {FButton, Loader} from 'components';
import {BlurView} from '@react-native-community/blur';
import {BASE_URL} from 'networking/Config';

const UserProfileScreen = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [profileImagePayload, setProfileImagePayload] = useState<any>(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const s3 = new S3({
    accessKeyId: 'AKIAQXR5F2WXECSPPVG6',
    secretAccessKey: '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',
    region: 'af-south-1',
  });

  const isLoading = useAppSelector((state: RootState) => state.auth.loading);

  const {
    customerData,
    supplierData,
    currentUser,
    role,
    updateProfilePictureRes,
    deleteCustomerRes,
    deleteDriverRes,
    deleteSupplierRes,
  } = useAppSelector((state: RootState) => state.auth);

  console.log('currentUser!!', currentUser);

  useEffect(() => {
    if (role == 'supplier') {
      dispatch(getSupplierByToken());
    } else if (role == 'customer') {
      dispatch(getCustomerByToken());
    } else {
      dispatch(getDriverByToken());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (updateProfilePictureRes) {
      if (role == 'supplier') {
        dispatch(getSupplierByToken());
      } else if (role == 'customer') {
        dispatch(getCustomerByToken());
      } else {
        dispatch(getDriverByToken());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, updateProfilePictureRes]);

  useEffect(() => {
    if (currentUser) {
      setProfileImageAccordingly();
    } else {
      setProfileImage(null);
    }
  }, [currentUser]);

  const setProfileImageAccordingly = () => {
    if (role == 'supplier') {
      setProfileImage(currentUser.profileImage?.imageUrl); // supplierData?.supplier?.profileImage
    } else if (role == 'customer') {
      setProfileImage(currentUser?.profileImage?.imageUrl);
    } else {
      setProfileImage(currentUser?.profileImage?.imageUrl);
    }
  };

  const deleteAccount = (id: string) => {
    if (role == 'supplier') {
      dispatch(deleteSupplier(id));
    } else if (role == 'customer') {
      dispatch(deleteCustomer(id));
    } else {
      dispatch(deleteDriver(id));
    }
  };

  const supplierRows = [
    // {name: 'Membership', icon: <SVGMembership />, navigation: ''},
    // {
    //   name: 'Privacy policy and setting',
    //   icon: <SVGPrivcacyPolicy />,
    //   navigation: '',
    // },
    // {name: 'Payment Method', icon: <SVGPaymentMethod />, navigation: ''},
    // {name: 'Language', icon: <SVGLanguage />, navigation: ''},
    {
      name: 'Business Info',
      icon: <SVGBusinessInfo />,
      navigation: 'AddBusinessInfo',
    },
    {name: 'Delete Account', icon: <SVGMembership />, navigation: false},
    {name: 'Logout', icon: <SVGMembership />, navigation: 'logout'},
  ];

  const customerRows = [
    // {name: 'Membership', icon: <SVGMembership />, navigation: ''},
    {name: 'My Orders', icon: <SVGOrderIcon />, navigation: 'OrderList'},
    // {name: 'Payment Method', icon: <SVGPaymentMethod />, navigation: ''},

    // {name: 'Language', icon: <SVGLanguage />, navigation: ''},
    {
      name: 'Adresses',
      icon: <SVGDeliveriesIcon />,
      navigation: 'AddressScreen',
    },
    // {
    //   name: 'Privacy policy and setting',
    //   icon: <SVGPrivcacyPolicy />,
    //   navigation: '',
    // },
    {name: 'Delete Account', icon: <SVGMembership />, navigation: false},
    {name: 'Logout', icon: <SVGMembership />, navigation: 'logout'},
  ];

  const driverRows = [
    {name: 'My Orders', icon: <SVGOrderIcon />, navigation: 'OrderList'},
    {
      name: 'Privacy policy and setting',
      icon: <SVGPrivcacyPolicy />,
      navigation: '',
    },
    {name: 'Delete Account', icon: <SVGMembership />, navigation: false},
    {name: 'Logout', icon: <SVGMembership />, navigation: 'logout'},
  ];

  const getNavRows = () => {
    console.log('customerData', customerData);
    return role == 'supplier'
      ? supplierRows
      : role == 'customer'
      ? customerRows
      : driverRows;
  };

  const logoutFunction = useCallback(async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem(
      'showSplash',
      JSON.stringify({showSplash: true}),
    );
    navigation.navigate('Welcome');
    dispatch(signOut());
  }, [dispatch, navigation]);

  useEffect(() => {
    if (deleteCustomerRes || deleteDriverRes || deleteSupplierRes) {
      logoutFunction();
    }
  }, [deleteCustomerRes, deleteDriverRes, deleteSupplierRes, logoutFunction]);
  const cardClick = async (text: string) => {
    if (text === 'logout') {
      logoutFunction();
    } else if (!text) {
      deleteAccount(currentUser?.id);
    } else {
      navigation.navigate(text);
    }
  };

  const fileSelected = async (filePath: any) => {
    setLoading(prevLoading => !prevLoading);
    const fileContent = await RNFS.readFile(filePath[0].uri, 'base64');

    const params = {
      Bucket: 'ayikos3bucket',
      Key: `images/${new Date().toISOString()}_${filePath[0].fileName}`,
      Body: Buffer.from(fileContent, 'base64'),
      ContentType: filePath[0].type,
    };

    console.log('params', params);

    s3.upload(params, (err: any, data: any) => {
      if (err) {
        console.log('Error uploading to S3:', err);
      } else {
        setProfileImagePayload({
          imageUrl: data.Location,
          imageType: 'string',
          imageTitle: filePath[0].fileName,
          imageDescription: 'string',
          profilePicture: true,
        });
        if (role == 'supplier') {
          dispatch(
            updateSupplierProfilePicture({
              id: currentUser?.id,
              payload: {
                imageUrl: data.Location,
                imageType: 'string',
                imageTitle: filePath[0].fileName,
                imageDescription: 'string',
                isProfilePicture: true,
              },
            }),
          );
        } else if (role == 'customer') {
          dispatch(
            updateCustomerProfilePicture({
              id: currentUser?.id,
              payload: {
                imageUrl: data.Location,
                imageType: 'string',
                imageTitle: filePath[0].fileName,
                imageDescription: 'string',
                profilePicture: true,
              },
            }),
          );
        } else {
          dispatch(
            updateDriverProfilePicture({
              id: currentUser?.id,
              payload: {
                imageUrl: data.Location,
                imageType: 'string',
                imageTitle: filePath[0].fileName,
                imageDescription: 'string',
                profilePicture: true,
              },
            }),
          );
        }
      }
      console.log('Upload successful:', data.Location);
      setLoading(prevLoading => !prevLoading);
    }).on('httpUploadProgress', progress => {
      const percentUploaded = Math.round(
        (progress.loaded / progress.total) * 100,
      );
      console.log(`Upload progress: ${percentUploaded}%`);
      // You can use this progress information to update your UI or perform other actions
    });
  };

  const imageLibrary = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: false,
      includeExtra: true,
      selectionLimit: 0,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        // Alert.alert('User cancelled camera picker');
        return;
      }
      if (response.errorCode === 'camera_unavailable') {
        // Alert.alert('Camera not available on device');
        return;
      }
      if (response.errorCode === 'permission') {
        // Alert.alert('Permission not satisfied');
        return;
      }
      if (response.errorCode === 'others') {
        // Alert.alert(response.errorMessage);
        return;
      }
      if (response.assets) {
        const source = response.assets[0].uri;
        setProfileImage(source);
        fileSelected(response.assets);
        // props.fileSelected(response.assets);
      }
      // setFilePath(response);
      // setValue('profilePhoto', response.assets[0], {
      //   shouldValidate: true,
      //   shouldDirty: true,
      // });
    });
  };

  console.log('customerData', customerData);
  return (
    <ScrollView>
      <Loader isLoading={isLoading || loading} />
      <View style={styles.container}>
        <View style={styles.circle1}>
          <View style={styles.circle2}>
            <View style={styles.circle3}>
              <View style={styles.circle4}>
                {/* <SVGProfilePic height={'100%'} width={'100%'} /> */}
                <Image
                  source={
                    profileImage
                      ? {uri: profileImage}
                      : require('../assets/image/profilePic.png')
                  }
                  style={{
                    resizeMode: 'cover',
                    width: '100%',
                    height: '100%',
                    borderRadius: 100,
                  }}
                />
                <TouchableOpacity
                  style={styles.editContainer}
                  onPress={imageLibrary}>
                  <FontAwesome name="pencil" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>
            {role == 'supplier'
              ? supplierData?.businessName
              : customerData?.fullName ||
                currentUser?.fullName ||
                currentUser?.name}
          </Text>
          {/* <FontAwesome name="pencil" /> */}
        </View>
        <Text style={styles.heading}>Account </Text>
        {getNavRows()?.map((item, key) => (
          <TouchableOpacity
            style={styles.card}
            key={key}
            onPress={() => cardClick(item.navigation)}>
            <View style={styles.cardContent}>
              <View style={styles.icon}>{item.icon}</View>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
            <Feather name="chevron-right" size={20} />
          </TouchableOpacity>
        ))}
      </View>
      {!currentUser && (
        <>
          <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={styles.contentContainer}>
            <Text style={styles.cardTitle}>
              Please Login or Sign up to proceed futher{' '}
            </Text>
            {/* <View>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login', {role: 'customer'})}
          /> */}
            <FButton
              label="Login"
              buttonClick={() => {
                dispatch(setUserNextRoute('cart'));
                navigation.navigate('Login', {role: 'customer'});
              }}
              containerStyle={styles.btnContainerStyle}
            />
            <FButton
              label="Sign up"
              buttonClick={() => {
                dispatch(setUserNextRoute('cart'));
                navigation.navigate('SignUp');
              }}
              containerStyle={styles.btnContainerStyle}
            />
            {/* </View> */}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default UserProfileScreen;
const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
    },
    heading: {
      ...fonts.bold,
      color: colors.heading,
    },
    circle1: {
      borderWidth: 1,
      borderColor: 'rgba(33, 150, 243, 0.05)',
      borderRadius: 310,
      width: 310,
      height: 310,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnContainerStyle: {
      marginVertical: 8,
      width: 260,
    },
    circle2: {
      borderWidth: 1,
      borderColor: 'rgba(33, 150, 243, 0.2)',
      borderRadius: 260,
      width: 260,
      height: 260,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle3: {
      borderWidth: 1,
      borderColor: 'rgba(33, 150, 243, 0.4)',
      borderRadius: 100,
      width: 210,
      height: 210,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle4: {
      borderWidth: 1,
      borderColor: 'rgba(33, 150, 243, 1)',
      borderRadius: 100,
      width: 160,
      height: 160,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 100,
    },
    editContainer: {
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 16,
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      position: 'absolute',
      right: 0,
      bottom: 5,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    userName: {
      ...fonts.medium,
      color: colors.primary,
    },
    cardTitle: {
      ...fonts.regular,
      color: colors.heading,
    },
    card: {
      borderRadius: 10,
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      marginVertical: 8,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    icon: {
      backgroundColor: colors.white,
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: {
        width: 1,
        height: 1,
      },
      shadowRadius: 8,
      shadowOpacity: 1,
      elevation: 16,
      padding: 8,
      borderRadius: 50,
    },
    absolute: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    contentContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      width: '100%',
      top: '-50%',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#007BFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
    },
  });
