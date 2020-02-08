import React from 'react';

import { WebView } from 'react-native-webview';

import { STRIPE } from './StripeSettings.js';

import { stripeCheckoutRedirectHTML } from './StripeCheckout.js';

export default class PaymentScreen extends React.Component {

  componentDidMount = () => {
    //set state parameters
    this.setState({
      treeNum: this.props.navigation.getParam('treeNum', 'treeNum'),
    })
  }

  // navigate when success url is returned
  onSuccessHandler = () => { this.props.navigation.navigate('Home') };

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
    const { treeNum } = this.state

    return (
      // Displays Script payment page as in screen web page
      <WebView
        originWhitelist={['*']}
        source={{ html: stripeCheckoutRedirectHTML(treeNum) }}
        onLoadStart={this.onLoadStart}
      />
    );
  }

};
