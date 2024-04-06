import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FButton from './FButton';
import {AppImages} from 'assets/image';

type FAlertInterface = {
  show: boolean;
  okClick: () => void;
  cancelClick?: () => void;
  containerStyle?: ViewStyle;
  title: string;
  subTitle?: string;
  titleStyle?: TextStyle;
  subTitleStyle?: TextStyle;
} & typeof defaultProps;

const defaultProps = {
  show: false,
};

const FAlert = (props: FAlertInterface) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.show}
      onRequestClose={() => {
        props.cancelClick && props.cancelClick();
      }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={AppImages.congratulation.source}
            style={AppImages.congratulation.style}
          />
          <Text style={styles.heading}>{props.title}</Text>
          <Text style={styles.subHeading}>{props.subTitle}</Text>
          <FButton
            label="OK"
            buttonClick={() => props.okClick()}
            containerStyle={styles.btnContainerStyle}
          />
          <Ionicons
            name="close-circle"
            style={styles.closeIcon}
            onPress={() => props.cancelClick && props.cancelClick()}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FAlert;

FAlert.defaultProps = defaultProps;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
    },
    content: {
      margin: 30,
      borderRadius: 20,
      backgroundColor: colors.white,
      padding: 24,
      alignItems: 'center',
    },
    heading: {
      ...fonts.heavy,
      color: colors.heading,
      textAlign: 'center',
      marginTop: 18,
    },
    subHeading: {
      ...fonts.subHeading,
      color: colors.subHeading,
      textAlign: 'center',
      marginTop: 5,
    },
    btnContainerStyle: {
      marginTop: 24,
      paddingHorizontal: 50,
      paddingVertical: 10,
    },
    closeIcon: {
      position: 'absolute',
      top: -10,
      right: -10,
      fontSize: 32,
    },
  });
