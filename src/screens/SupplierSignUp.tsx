import React, {useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {FButton, FTextInput, Loader} from 'components';
import {useAppDispatch, useAppSelector} from 'hooks';
// import globalHelpers from 'utils';
import globalHelpers from '../utils/helpers';
import {
  setCongratulationView,
  setRole,
  signIn,
  signUp,
  supplier_signUp,
} from 'store/slices/authSlice';
import {RootState} from 'store';
import patterns from 'utils/patterns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SupplierSignUpScreen = ({navigation}: {navigation: any}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [input, setInput] = useState([
    {
      order: 0,
      label: 'Company Name',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid company name',
      key: 'companyName',
      fixLabel: true,
      returnKeyType: 'next',
    },
    {
      order: 1,
      label: 'Owner Name',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter owner name',
      key: 'ownerName',
      fixLabel: true,
      returnKeyType: 'next',
    },
    {
      order: 2,
      label: 'Phone Number',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid phone number',
      key: 'phoneNumber',
      fixLabel: true,
      keyboardType: 'numeric',
      returnKeyType: 'next',
      isMobile: true,
      countryCode: '+91',
    },
    {
      order: 3,
      label: 'Mobile money number',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid mobile money number',
      key: 'mobileMoneyNumber',
      fixLabel: true,
      keyboardType: 'numeric',
      returnKeyType: 'next',
      isMobile: true,
      countryCode: '+91',
    },
    {
      order: 4,
      label: 'Bank Account Number',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid bank account number',
      key: 'bankAccountNumber',
      fixLabel: true,
      keyboardType: 'numeric',
      returnKeyType: 'next',
      pattern: patterns.BANK_PATTERN,
    },
    {
      order: 5,
      label: 'City',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid city',
      key: 'city',
      fixLabel: true,
      returnKeyType: 'next',
    },
    {
      order: 6,
      label: 'Email Address',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid email address',
      key: 'emailAddress',
      fixLabel: true,
      keyboardType: 'email',
      returnKeyType: 'next',
    },

    {
      order: 7,
      label: 'Enter Password',
      placeholder: '',
      value: '',
      error: false,
      fixLabel: true,
      secureTextEntry: true,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid password',
      key: 'password',
      rightIconName: 'eye',
      returnKeyType: 'next',
    },
    {
      order: 8,
      label: 'Re-Enter Password',
      placeholder: '',
      value: '',
      error: false,
      fixLabel: true,
      secureTextEntry: true,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid password',
      key: 'rePassword',
      rightIconName: 'eye',
      returnKeyType: 'done',
    },
  ]);

  const isLoading = useAppSelector((state: RootState) => state.auth.loading);

  const onChangeText = (key: number, value: string) => {
    if (key !== undefined) {
      const inputVal = input;
      inputVal[key].value = value;
      inputVal[key].error = false;
      setInput(() => [...inputVal]);
    }
  };

  const onChangeCountryCode = (key: number, value: string) => {
    if (key !== undefined) {
      const inputVal = input;
      inputVal[key].countryCode = value;
      inputVal[key].error = false;
      setInput(() => [...inputVal]);
    }
  };

  const onRightButtonClick = (key: number) => {
    if (key !== undefined) {
      const inputVal = input;
      inputVal[key].secureTextEntry = !inputVal[key].secureTextEntry;
      inputVal[key].rightIconName = inputVal[key].secureTextEntry
        ? 'eye'
        : 'eye-off';
      setInput(() => [...inputVal]);
    }
  };

  const signUpClick = () => {
    const inputValid = globalHelpers.validation(input);
    setInput(() => [...inputValid]);
    if (inputValid.valid) {
      const payload = {
        companyName: input[0].value,
        ownerName: input[1].value,
        phoneNumber: `${input[2].countryCode} ${input[2].value}`,
        mobileMoneyNumber: `${input[3].countryCode} ${input[3].value}`,
        bankAccountNumber: input[4].value,
        city: input[5].value,
        emailAddress: input[6].value?.toLowerCase()?.trim(),
        password: input[7].value,
      };
      console.log('payload', payload);
      dispatch(supplier_signUp(payload)).then(async (data: any) => {
        if (data?.type === 'auth/supplier_signUp/fulfilled') {
          await AsyncStorage.setItem('role', 'supplier');
          // dispatch(signIn(token));
          dispatch(setRole('supplier'));
          dispatch(setCongratulationView(true));
          navigation.navigate('Congratulation', {fromPage: 'signUp'});
        }
        console.log('data', data);
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Loader isLoading={isLoading} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
        keyboardVerticalOffset={50}>
        <View style={styles.content}>
          <FlatList
            keyboardShouldPersistTaps="always"
            data={input}
            renderItem={({item, index}) => (
              <FTextInput
                {...item}
                containerStyle={styles.inputContainerStyle}
                onTextChange={text => onChangeText(index, text)}
                onRightButtonClick={() => onRightButtonClick(index)}
                setCountryCode={text => onChangeCountryCode(index, text)}
                // onSubmitEditing={() => [`ref_input${index}`]?.current.focus()}
              />
            )}
          />
          <FButton
            label="Sign Up"
            buttonClick={() => signUpClick()}
            containerStyle={styles.btnContainerStyle}
          />
          <Text style={styles.account}>
            Already have an account?{' '}
            <Text
              style={styles.signUp}
              onPress={() => navigation.navigate('Login', {role: 'supplier'})}>
              Login
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default SupplierSignUpScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      // borderRadius: 30,
      // backgroundColor: colors.white,
      padding: 24,
      paddingBottom: 48,
      // position: 'absolute',
      // bottom: 0,
      // left: 0,
      // right: 0,
    },
    heading: {
      ...fonts.heading,
      color: colors.heading,
      textAlign: 'center',
      marginBottom: 40,
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
      // marginVertical: 8,
    },
    signUp: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });
