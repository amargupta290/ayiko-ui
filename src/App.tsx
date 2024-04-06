/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {AppNavigation} from 'navigations';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Provider} from 'react-redux';
import {store} from 'store';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const colors = {
    ...DefaultTheme.colors,
    primary: '#0084EC',
    buttonPrimary: '#2196F3',
    background: '#F7F7F7',
    card: 'rgb(255, 255, 255)',
    text: '#000000',
    heading: '#454545',
    subHeading: '#696969',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
    white: '#FFFFFF',
    black: '#000000',
    error: '#c13c50',
    shadow: 'rgba(0, 0, 0, 0.15)',
    title: '#272727',
    red: '#FF0100',
    green: '#10c300',
    gray: '#d3d3d3',
    dot: '#d9d9d9',
    yellow: '#ead51b',
    borderColor: '#CCCCCC',
  };

  const MyTheme = {
    ...DefaultTheme,
    dark: false,
    colors,
    fonts: {
      regular: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontWeight: 'normal',
        color: colors.text,
        fontSize: 16,
        textTransform: 'capitalize',
      },
      medium: {
        fontFamily: 'SF-Pro-Text-Medium',
        fontWeight: '500',
        fontSize: 20,
        color: colors.text,
        // textTransform: 'capitalize',
      },
      bold: {
        fontFamily: 'SF-Pro-Text-Bold',
        fontWeight: '600',
        color: colors.text,
        fontSize: 16,
        textTransform: 'capitalize',
      },
      heavy: {
        fontFamily: 'SF-Pro-Text-Heavy',
        fontWeight: '700',
        fontSize: 24,
        color: colors.text,
        textTransform: 'capitalize',
      },
      title: {
        fontFamily: 'SF-Pro-Text-Bold',
        fontWeight: '700',
        fontSize: 20,
        color: colors.text,
        // textTransform: 'capitalize',
      },
      heading: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontWeight: '500',
        fontSize: 24,
        color: colors.text,
        // textTransform: 'capitalize',
      },
      subHeading: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontWeight: 'normal',
        fontSize: 15,
        color: colors.text,
        // textTransform: 'capitalize',
      },
      description: {
        fontFamily: 'SF-Pro-Text-Regular',
        fontWeight: 'normal',
        fontSize: 10,
        color: colors.text,
        textTransform: 'capitalize',
      },
    },
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const MyStatusBar = ({backgroundColor, ...props}: any) => (
    <View style={[styles.statusBar, {backgroundColor}]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        {/* <StatusBar translucent backgroundColor="transparent" /> */}
        {/* <SafeAreaView style={backgroundStyle}> */}
        {/* <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        /> */}
        {/* <MyStatusBar
          backgroundColor={colors.primary}
          barStyle="light-content"
        /> */}
        <NavigationContainer theme={MyTheme}>
          <AppNavigation />
        </NavigationContainer>
        {/* </SafeAreaView> */}
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#79B45D',
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});
