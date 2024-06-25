import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import CheckBox from './CheckBox';
import Label from './Label';
import TitleComp from './TitleComp';

export default function SelectAble({selected, onSelect, item}) {
  const {label, subLabel} = item;
  return (
    <View style={styles.container}>
      <TitleComp heading={label} />
      <View style={styles.innerContainer}>
        <View style={{flex: 1, paddingVertical: scale(10)}}>
          <Label text={subLabel} style={{fontSize: scale(13)}} />
        </View>
        <View style={{flex: 1, alignItems: 'flex-end'}}>
          <CheckBox
            onPress={() => onSelect && onSelect(item)}
            isChecked={selected}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {flex: 1, paddingVertical: scale(20)},
  paddingHorizontal: {
    paddingHorizontal: scale(20),
  },
});
