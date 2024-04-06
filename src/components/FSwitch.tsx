import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

type FSwitchInterface = {
  switchClick: () => void;
  containerStyle?: ViewStyle;
  fixLabel?: boolean;
  label?: string;
  value: boolean;
  mandatory?: boolean;
  labelStyle?: TextStyle;
  checkedValue: string;
  unCheckedValue: string;
  contentStyle?: ViewStyle;
  error: boolean;
  errorText?: string;
} & typeof defaultProps;

const defaultProps = {
  value: true,
};

const FSwitch = (props: FSwitchInterface) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.fixLabel && (
        <Text style={[styles.label, props.labelStyle]}>
          {props.label}
          <Text style={styles.mandatory}>{props.mandatory && '*'}</Text>
        </Text>
      )}
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={props.value ? colors.primary : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={props.switchClick}
          value={props.value}
        />
        <Text style={styles.switchLabel}>
          {props.value ? props?.checkedValue : props?.unCheckedValue}
        </Text>
      </View>
      <View>
        <Text style={styles.message}>{props.error ? props.errorText : ''}</Text>
      </View>
    </View>
  );
};

export default FSwitch;

FSwitch.defaultProps = defaultProps;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    CheckboxWrapper: {
      width: 25,
      height: 25,
      borderWidth: 1,
      borderColor: colors.blue,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeCheckbox: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    icon: {
      color: colors.white,
      fontSize: 25,
    },
    container: {
      flex: 1,
    },
    label: {
      ...fonts.medium,
      color: colors.heading,
      marginBottom: 8,
    },
    switchLabel: {
      ...fonts.medium,
      color: colors.heading,
    },
    switchContainer: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    mandatory: {
      color: colors.error,
    },
    content: {
      padding: 4,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    checkboxItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    message: {
      ...fonts.regular,
      color: colors.red,
      marginLeft: 5,
      marginTop: 8,
    },
  });
