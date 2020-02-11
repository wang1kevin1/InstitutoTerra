import React from 'react';

import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'

import { WebView } from 'react-native-webview';

import { STRIPE } from './StripeSettings.js';

import { stripeCheckoutRedirectHTML } from './StripeCheckout.js';

export default class PaymentScreen extends React.Component {

  componentWillMount = () => {
    //set state parameters
    this.setState({
      treeNum: this.props.navigation.getParam('treeNum', 'treeNum')
    })
  }

  // navigate when success url is returned
  onSuccessHandler = () => {
    this.props.navigation.navigate('ThankYou', {
      treeNum: this.state.treeNum
    })
  };

  // navigate when cancelled url is returned
  onCanceledHandler = () => { this.props.navigation.goBack() };

  // Called everytime the URL stats to load in the webview
  onLoadStart = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.url === STRIPE.SUCCESS_URL) {
      this.onSuccessHandler();
      return;
    }
    if (nativeEvent.url === STRIPE.CANCELED_URL) {
      this.onCanceledHandler();
      return;
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {/* Displays Script payment page as in screen web page */}
        <WebView
          originWhitelist={['*']}
          source={{ html: stripeCheckoutRedirectHTML(this.state.treeNum) }}
          onLoadStart={this.onLoadStart}
        />
      </View>
    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: height,
    width: width,
    marginTop: height * 0.035,
  }
})