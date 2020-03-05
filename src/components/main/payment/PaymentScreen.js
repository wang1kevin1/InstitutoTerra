import React from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from 'react-native'

import Constants from 'expo-constants';

import { WebView } from 'react-native-webview';

import { STRIPE } from './StripeSettings.js';

import { stripeCheckoutRedirectHTML } from './StripeCheckout.js';

import { MaterialIcons } from '@expo/vector-icons';

import COLORS from '../../../assets/Colors.js';

export default class PaymentScreen extends React.Component {

  state = {
    isReady: false,
  }

  componentDidMount() {
    this.setState({
      treeNum: this.props.navigation.getParam('treeNum', 'treeNum'),
    })
  }

  // navigate when success url is returned
  onSuccessHandler = () => {
    this.props.navigation.navigate('ThankYou', {
      treeNum: this.state.treeNum
    })
  };

  // navigate when cancelled url is returned
  onCanceledHandler = () => { 
    this.props.navigation.goBack() 
  };

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

  onLoad() {
    setTimeout(() => {this.setState({isReady: true})}, 8000)
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{ html: stripeCheckoutRedirectHTML(this.state.treeNum) }}
          onLoadStart={this.onLoadStart}
          onLoadEnd={() => {this.onLoad()}}
        />
      {!this.state.isReady && (
        <View style={styles.containerLoading}>
          <MaterialIcons name="payment" style={styles.loadingIcon} />
          <ActivityIndicator color={COLORS.lightblue} size='large' />
        </View>
      )}
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
    marginTop: Constants.statusBarHeight
  },
  containerLoading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.white,
  },
  loadingIcon: {
    color: COLORS.lightblue,
    fontSize: 120,
    textAlign: 'center'
  },
})