import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

type FCheckBoxInterface = {
  isChecked: boolean;
  checkboxClick: (index: number) => void;
  containerStyle?: ViewStyle;
  fixLabel?: boolean;
  label?: string;
  mandatory?: boolean;
  labelStyle?: TextStyle;
  contentStyle?: ViewStyle;
  items: FItem[];
  error: boolean;
  errorText?: string;
} & typeof defaultProps;

type FItem = {
  id: number;
  title: string;
  value: boolean;
};

const defaultProps = {
  isChecked: false,
};

const FCheckBox = (props: FCheckBoxInterface) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  console.log('props.items=>>>>', props.items);
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.fixLabel && (
        <Text style={[styles.label, props.labelStyle]}>
          {props.label}
          <Text style={styles.mandatory}>{props.mandatory && '*'}</Text>
        </Text>
      )}
      <View
        style={[
          styles.content,
          props.contentStyle,
          props.error && {borderColor: colors.red},
        ]}>
        {props.items?.map((item, index) => (
          <View style={styles.checkboxItem}>
            <TouchableOpacity
              style={[
                styles.CheckboxWrapper,
                item.value && styles.activeCheckbox,
              ]}
              onPress={() => props.checkboxClick(index)}>
              {item.value && <Feather name="check" style={styles.icon} />}
            </TouchableOpacity>
            <Text style={[styles.checkboxlabel]}>{item.title}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text style={styles.message}>{props.error ? props.errorText : ''}</Text>
      </View>
    </View>
  );
};

export default FCheckBox;

FCheckBox.defaultProps = defaultProps;

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
    checkboxlabel: {
      ...fonts.medium,
      color: colors.heading,
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
