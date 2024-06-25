import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageProps,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {AppImages} from 'assets/image';

type ImageInterface = {
  source: ImageSourcePropType;
  imageStyle?: ImageStyle;
  resizeMode?: ImageResizeMode;
} & typeof defaultProps;

const defaultProps = {
  source: AppImages.noImg.source,
  // imageStyle: styles.imageStyle,
  resizeMode: 'cover',
};

const ImageComp = (props: ImageInterface) => {
  const {colors, fonts} = useTheme();
  const styles = Styles({colors, fonts});
  const [isLoading, setIsLoading] = useState(
    props.source && props.source.uri && typeof props.source.uri == 'string'
      ? true
      : false,
  );
  // console.log('props.source', props.source);
  return (
    <View>
      <Image
        source={
          typeof props.source.uri == 'string'
            ? props.source
            : AppImages.noImg.source
        }
        style={props.imageStyle}
        resizeMode={props.resizeMode}
        onLoadStart={() => {
          // console.log('On Load Start');
        }}
        onLoadEnd={() => {
          // console.log('On Load End');
          setIsLoading(false);
        }}
        onError={({nativeEvent: {error}}) => {
          // console.log('On Error', error);
          setIsLoading(false);
          // setImgUrl(AppImages.noImg.source);
          // setIsError(true);
        }}
        onLoad={({
          nativeEvent: {
            source: {width, height},
          },
        }) => {
          setIsLoading(false);
        }}
        defaultSource={AppImages.noImg.source}
      />
      {isLoading && (
        <ActivityIndicator
          style={styles.loader}
          size="small"
          color={colors.primary}
        />
      )}
    </View>
  );
};

ImageComp.defaultProps = defaultProps;

export default ImageComp;

const Styles = ({colors, fonts}: any) =>
  StyleSheet.create({
    imageStyle: {
      height: 'auto',
      position: 'relative',
    },
    loader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });
