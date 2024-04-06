import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import {useTheme} from '@react-navigation/native';

type ListLoaderInterface = {isLoading: boolean} & typeof defaultProps;

const defaultProps = {
  isLoading: false,
};

const ListLoader = (props: ListLoaderInterface) => {
  const {colors} = useTheme();
  return (
    <>
      {props.isLoading && (
        <View style={styles.activityIndicatorWrapper}>
          <View style={styles.activityIndicatorContent}>
            <ActivityIndicator
              animating={props.isLoading}
              size="large"
              color={colors.primary}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ListLoader;

ListLoader.defaultProps = defaultProps;

const styles = StyleSheet.create({
  activityIndicatorWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorContent: {
    // backgroundColor: 'rgba(100,100,100,0.4)',
    padding: 50,
    borderRadius: 10,
  },
});
