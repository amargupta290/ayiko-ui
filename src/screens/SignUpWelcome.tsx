import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {SVGLoginLogo} from 'assets/image';
import {FButton} from 'components';

const SignUpWelcomeScreen = ({navigation}: {navigation: any}) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  return (
    <View style={styles.container}>
      <SVGLoginLogo />
      <View style={styles.content}>
        <Text style={styles.heading}>
          Welcome to the world’s most imaginative marketplace
        </Text>
        <FButton
          label="Sign up as a customer"
          buttonClick={() => navigation.navigate('SignUp')}
          containerStyle={styles.btnContainerStyle}
        />
        <FButton
          border
          label="Sign up as a supplier"
          buttonClick={() => navigation.navigate('SupplierSignUpScreen')}
          containerStyle={styles.btnContainerStyle}
        />
        {/* <FButton
          border
          label="Sign up as a admin"
          buttonClick={() => {}}
          containerStyle={styles.btnContainerStyle}
        /> */}
        <Text style={styles.account}>
          Already have an account?{' '}
          <Text
            style={styles.signUp}
            onPress={() => {
              // navigation.goBack();
              navigation.reset({
                index: 0,
                routes: [{name: 'Welcome'}],
              });
            }}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUpWelcomeScreen;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
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
    heading: {
      ...fonts.heading,
      color: colors.heading,
      textAlign: 'center',
      marginBottom: 40,
    },
    btnContainerStyle: {
      marginVertical: 8,
    },
    account: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      marginTop: 24,
    },
    signUp: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
  });
