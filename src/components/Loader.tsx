import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';

type LoaderInterface = {isLoading: boolean} & typeof defaultProps;

const defaultProps = {
  isLoading: false,
};

const Loader = (props: LoaderInterface) =>
  // <Modal
  //   transparent
  //   animationType={'none'}
  //   visible={props.isLoading}
  //   onRequestClose={() => {}}>
  props.isLoading ? (
    <View style={styles.modalBackground}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator
          animating={props.isLoading}
          size="large"
          color="#4B64AF"
        />
        {/* <Image
          source={AppImages.delivery.source}
          style={[
            AppImages.delivery.style,
            {backgroundColor: 'transparent', borderRadius: 10},
          ]}
          resizeMode="contain"
        /> */}
      </View>
    </View>
  ) : (
    <View></View>
  );
// </Modal>

export default Loader;

Loader.defaultProps = defaultProps;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    width: Dimensions.get('window').width,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    elevation: 5,
    zIndex: 100,
    // alignItems: 'center',
    // flexDirection: 'column',
    // justifyContent: 'space-around',
    // alignSelf: 'center',
    // alignContent: 'center',
    // backgroundColor: '#000000BB',
  },
  activityIndicatorWrapper: {
    // backgroundColor: Colors.WHITE_COLOR,
    height: 140,
    width: 140,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ImageWrapper: {
    height: 200,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
