import React from 'react';

import { WebView } from 'react-native-webview';

import { STRIPE } from '../../utilities/stripeSettings.js';

import { stripeCheckoutRedirectHTML } from '../../utilities/stripeCheckout.js';

import {
  Alert,
} from 'react-native'

export default class PurchaseProduct extends React.Component{

  componentDidMount = () => {
    //set state parameters
    this.setState({
      treeNum: this.props.navigation.getParam('treeNum', 'treeNum'),
    })
  }

  state = {
    user: { 
      id: 'someID' 
    },
  }

  onSuccessHandler = () => { this.props.navigation.navigate('Home') };

  onCanceledHandler = () => { this.props.navigation.navigate.goBack() };

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
    const {user, treeNum} = this.state
  if (!user) {
    return null;
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: stripeCheckoutRedirectHTML(user.id, treeNum) }}
      onLoadStart={this.onLoadStart}
    />
  );
  }
  
};
