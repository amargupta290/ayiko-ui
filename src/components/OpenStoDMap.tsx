import React, {Component} from 'react';
import {Button} from 'react-native';
import openMap from 'react-native-open-maps';

export default class OpenStoDMap extends Component {
  _openGoogleMap() {
    openMap({
      source: '37.865101, -119.538330',
      destination: '37.7833, -122.4167',
    });
  }

  render() {
    return <Button title="Open Google Maps" onPress={this._openGoogleMap} />;
  }
}
