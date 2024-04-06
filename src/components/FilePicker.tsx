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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

type FilePickerInterface = {
  containerStyle?: ViewStyle;
  fileSelected: (file: any) => void;
  fixLabel?: boolean;
  label?: string;
  placeholder?: string;
  subLabel?: string;
  mandatory?: boolean;
  labelStyle?: TextStyle;
  contentStyle?: ViewStyle;
  error: boolean;
  errorText?: string;
} & typeof defaultProps;

const defaultProps = {};

const FilePicker = (props: FilePickerInterface) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});

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
        props.fileSelected(response.assets);
      }
      // setFilePath(response);
      // setValue('profilePhoto', response.assets[0], {
      //   shouldValidate: true,
      //   shouldDirty: true,
      // });
    });
  };
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.fixLabel && (
        <Text style={[styles.label, props.labelStyle]}>
          {props.label}
          <Text style={styles.subLabel}>{props.subLabel}</Text>
          <Text style={styles.mandatory}>{props.mandatory && '*'}</Text>
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.content,
          props.contentStyle,
          props.error && {borderColor: colors.red},
        ]}
        onPress={() => imageLibrary()}>
        <Feather name="upload" style={styles.icon} />
        <Text style={[styles.placeholderLabel]}>{props.placeholder}</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.message}>{props.error ? props.errorText : ''}</Text>
      </View>
    </View>
  );
};

export default FilePicker;

FilePicker.defaultProps = defaultProps;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    icon: {
      color: colors.primary,
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
    subLabel: {
      ...fonts.subHeading,
      color: colors.heading,
    },
    placeholderLabel: {
      ...fonts.medium,
      color: colors.primary,
    },
    mandatory: {
      color: colors.error,
    },
    content: {
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: colors.primary,
      borderStyle: 'dashed',
    },
    message: {
      ...fonts.regular,
      color: colors.red,
      marginLeft: 5,
      marginTop: 8,
    },
  });
