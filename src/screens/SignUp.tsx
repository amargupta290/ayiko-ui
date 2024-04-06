import React, {useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
import {setCongratulationView, setRole, signUp} from 'store/slices/authSlice';
import {RootState} from 'store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpScreen = ({navigation}: {navigation: any}) => {
  const dispatch = useAppDispatch();
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [input, setInput] = useState([
    {
      order: 0,
      label: 'Full Name',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid name',
      key: 'username',
      fixLabel: true,
      returnKeyType: 'next',
    },
    {
      order: 1,
      label: 'Email',
      placeholder: '',
      value: '',
      error: false,
      mandatory: 1,
      documentName: '',
      errorText: 'Please enter valid email',
      key: 'email',
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
      label: 'Password',
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
      order: 4,
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
        emailAddress: input[1].value,
        fullName: input[0].value,
        password: input[3].value,
        phoneNumber: `${input[2].countryCode} ${input[2].value}`,
      };
      console.log('payload', payload);

      dispatch(signUp(payload)).then(async (data: any) => {
        if (data?.type === 'auth/signUp/fulfilled') {
          await AsyncStorage.setItem('role', 'customer');
          dispatch(setRole('customer'));
          dispatch(setCongratulationView(true));
          navigation.navigate('Congratulation', {fromPage: 'signUp'});
        }
        console.log('data', data);
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // enabled
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 150}
        // keyboardVerticalOffset={50}
      >
        <Loader isLoading={isLoading} />
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <FlatList
              keyboardShouldPersistTaps="handled"
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
                onPress={() =>
                  navigation.navigate('Login', {role: 'customer'})
                }>
                Login
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: colors.background,
    },
    scrollView: {
      flexGrow: 1,
      paddingBottom: 200,
    },
    content: {
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
      marginVertical: 8,
    },
    signUp: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });
