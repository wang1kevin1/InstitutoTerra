import React from 'react';

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
      // Displays Script payment page as in screen web page
      <WebView
        originWhitelist={['*']}
        source={{ html: stripeCheckoutRedirectHTML(this.state.treeNum) }}
        onLoadStart={this.onLoadStart}
      />
    );
  }

};
