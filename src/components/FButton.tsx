import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useTheme} from '@react-navigation/native';

interface CProps {
  label: string;
  buttonClick: () => void;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  leftIcon?: string;
  leftIconStyle?: ViewStyle;
  border?: boolean;
  iconLib?: string;
  size?: number;
}

const FButton = (props: CProps) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={[
        styles.container,
        props.containerStyle,
        props.border && styles.borderStyle,
        props.disabled && styles.disabledContainer,
      ]}
      onPress={() => props.buttonClick()}>
      {props.leftIcon && props?.iconLib ? (
        <Feather
          name={props.leftIcon}
          size={props?.size ?? 25}
          style={props.leftIconStyle}
        />
      ) : (
        props?.leftIcon
      )}
      <Text
        style={[
          styles.label,
          props.labelStyle,
          props.border && styles.borderLabelStyle,
          props.disabled && styles.disabledLabel,
        ]}
        numberOfLines={1}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export default FButton;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 10,
    },
    borderStyle: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: 'transparant',
    },
    label: {
      ...fonts.medium,
      color: colors.white,
      textAlign: 'center',
    },
    borderLabelStyle: {
      color: colors.heading,
    },
    disabledContainer: {
      borderColor: colors.white,
    },
    disabledLabel: {
      color: colors.white,
    },
  });
