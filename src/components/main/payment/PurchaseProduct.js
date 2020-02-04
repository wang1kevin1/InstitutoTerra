import React from 'react';

import { WebView } from 'react-native-webview';

import { STRIPE } from '../../utilities/stripeSettings.js';

import { stripeCheckoutRedirectHTML } from '../../utilities/stripeCheckout.js';

import {
  Alert,
} from 'react-native'

export default class PurchaseProduct extends React.Component{

  // TODO: this should come from some service/state store
  state = {
    user: { 
      id: 'someID' 
    },
  }

  onSuccessHandler = () => { };

  onCanceledHandler = () => { this.props.navigation.navigate('Home') };

  // Called everytime the URL stats to load in the webview
  onLoadStart = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.url === STRIPE.SUCCESS_URL) {
      this.onSuccessHandler();
      return;
    }
    if (nativeEvent.url === STRIPE.CANCELED_URL) {
      this.onCanceledHandler();
    }
  };

  render() {
    const {user} = this.state
  if (!user) {
    return null;
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: stripeCheckoutRedirectHTML(user.id) }}
      onLoadStart={this.onLoadStart}
    />
  );
  }
  
};
