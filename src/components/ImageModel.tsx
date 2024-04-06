import React from 'react';
import {StyleSheet, View, Modal, TouchableOpacity, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';

type ImageModelInterface = {
  isVisible: boolean;
  onRequestClose: () => void;
  optionClick: (id: number) => void;
} & typeof defaultProps;

const defaultProps = {
  isVisible: false,
};

const ImageModel = (props: ImageModelInterface) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  return (
    <Modal
      transparent
      animationType={'slide'}
      visible={props.isVisible}
      onRequestClose={props.onRequestClose}>
      <TouchableOpacity style={styles.container} onPress={props.onRequestClose}>
        <View style={styles.modalView}>
          <Text style={styles.header}>Select Image</Text>
          <View style={styles.separator} />
          <TouchableOpacity
            style={{
              alignItems: 'center',
            }}
            onPress={() => props.optionClick(1)}>
            <Text style={styles.label}>Take Photo</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={{
              alignItems: 'center',
            }}
            onPress={() => props.optionClick(2)}>
            <Text style={styles.label}>Choose From Library </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
            }}
            onPress={() => props.onRequestClose()}>
            <Text style={styles.label}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ImageModel;

ImageModel.defaultProps = defaultProps;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      backgroundColor: colors.WHITE_COLOR,
      borderRadius: 10,
      padding: 10,
      margin: 10,
    },
    label: {
      ...fonts.medium(14),
      marginVertical: 5,
      // textAlign: 'left',
      color: colors.BLACK_COLOR,
      // marginLeft: 3,
    },
    header: {
      ...fonts.medium(14),
      marginVertical: 10,
      textAlign: 'center',
      color: colors.GRAY44_COLOR,
    },
    separator: {
      height: 0.3,
      backgroundColor: colors.PRIMARY_COLOR,
      marginVertical: 10,
    },
  });
