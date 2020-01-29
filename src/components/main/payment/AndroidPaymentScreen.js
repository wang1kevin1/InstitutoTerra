import React from 'react';

import { WebView } from 'react-native-webview';

export default class AndroidPaymentScreen extends React.Component {
  render() {
    return (
      <WebView
        source={{ uri: 'https://infinite.red' }}
        style={{ marginTop: 20 }}
      />
    );
  }
}