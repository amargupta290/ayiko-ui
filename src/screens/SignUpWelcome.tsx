import React from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {SVGLoginLogo} from 'assets/image';
import {FButton} from 'components';

const SignUpWelcomeScreen = ({navigation}: {navigation: any}) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const termsAndCondition = 'https://ayiko.net/TermsAndCondition.html';
  const privacyPolicy = 'https://ayiko.net/privacyPolicy.html';
  const aboutUs = 'https://ayiko.net/aboutUs.html';
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
            style={styles.linkText}
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
        <View style={styles.bottomText}>
          <Text style={styles.signUp} onPress={() => Linking.openURL(aboutUs)}>
            About Us
          </Text>
          <Text> | </Text>
          <Text
            style={styles.signUp}
            onPress={() => Linking.openURL(privacyPolicy)}>
            Privacy & policy
          </Text>
          <Text> | </Text>
          <Text
            style={styles.signUp}
            onPress={() => Linking.openURL(termsAndCondition)}>
            Terms & Condition
          </Text>
        </View>
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
      ...fonts.subHeading,
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 12,
      textDecorationLine: 'underline',
    },
    linkText: {
      color: colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    bottomText: {flexDirection: 'row', top: 10, justifyContent: 'center'},
  });
