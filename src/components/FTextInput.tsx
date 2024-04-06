import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {CountryPicker} from 'react-native-country-codes-picker';

interface CProps {
  placeholder: string;
  value: string;
  fixLabel?: boolean;
  label?: string;
  onTextChange: (text: string) => void;
  textInputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  secureTextEntry?: boolean;
  leftIconName?: string;
  rightIconName?: string;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: any;
  keyboardType?: any;
  error: boolean;
  errorText?: string;
  maxLength?: number;
  editable?: boolean;
  onRightButtonClick?: () => void;
  onFocus?: () => void;
  type?: string;
  clearClick?: () => void;
  labelStyle?: TextStyle;
  autoFocus?: boolean;
  mandatory?: boolean;
  returnKeyType: string;
  isMobile?: boolean;
  countryCode?: string;
  setCountryCode?: (text: string) => void;
}

const defaultProps = {
  autoCapitalize: 'none',
  keyboardType: 'default',
  editable: true,
  autoFocus: false,
  mandatory: false,
  returnKeyType: 'done',
  isMobile: false,
};

const FTextInput = (props: CProps) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});

  const [show, setShow] = useState(false);
  const [countryCodeFlag, setCountryCodeFlag] = useState('🇮🇳');

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
        {props.leftIconName && (
          <View style={styles.leftIconContainer}>
            <Feather
              name={props.leftIconName}
              size={23}
              color={colors.primary}
            />
          </View>
        )}
        {props.isMobile && (
          <TouchableOpacity
            onPress={() => setShow(true)}
            style={styles.countryCodeWrp}>
            <Text style={styles.flag}>
              {props.countryCode} {countryCodeFlag}
            </Text>
          </TouchableOpacity>
        )}
        <TextInput
          placeholder={props.placeholder}
          value={props.value}
          placeholderTextColor={colors.primary}
          style={[
            styles.input,
            props.textInputStyle,
            props.multiline && {height: 125, textAlignVertical: 'top'},
          ]}
          onChangeText={text => props.onTextChange(text)}
          secureTextEntry={props.secureTextEntry}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          autoCapitalize={props.autoCapitalize}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          editable={props.editable}
          autoCorrect={false}
          onFocus={() => props.onFocus && props.onFocus()}
          autoFocus={props.autoFocus}
          returnKeyType={props.returnKeyType}
        />
        {props.type == 'search' && props.value && (
          <MaterialIcons
            name="cancel"
            size={20}
            color={colors.heading}
            onPress={() => props.clearClick && props.clearClick()}
          />
        )}
        {props.rightIconName && (
          <View style={styles.rightIconContainer}>
            <Feather
              name={props.rightIconName}
              size={23}
              color={colors.heading}
              onPress={() =>
                props.onRightButtonClick && props.onRightButtonClick()
              }
            />
          </View>
        )}
      </View>
      {/* {props.error ? ( */}
      <View>
        <Text style={styles.message}>{props.error ? props.errorText : ''}</Text>
      </View>
      {/* ) : null} */}
      <CountryPicker
        lang="en"
        show={show}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={item => {
          console.log('item', item);
          props.setCountryCode(item.dial_code);
          setCountryCodeFlag(item.flag);
          setShow(false);
        }}
      />
    </View>
  );
};
FTextInput.defaultProps = defaultProps;
export default FTextInput;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      borderWidth: 1,
      borderRadius: 8,
      borderColor: colors.black,
      padding: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      ...fonts.medium,
      height: 45,
      paddingHorizontal: 10,
      flex: 1,
    },
    leftIconContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      // borderRightWidth: 1,
    },
    message: {
      ...fonts.regular,
      color: colors.red,
      marginLeft: 5,
      marginTop: 8,
    },
    rightIconContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    label: {
      ...fonts.medium,
      color: colors.heading,
      marginBottom: 8,
    },
    mandatory: {
      color: colors.error,
    },
    countryCodeWrp: {
      height: 48,
      // backgroundColor: colors.white,
      padding: 10,
      // borderColor: Colors.INPUT_BORDER_COLOR,
      // borderWidth: 1,
      borderRadius: 8,
      marginRight: 10,
      flex: 0.4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    flag: {
      fontSize: 20,
      color: colors.black,
    },
  });
