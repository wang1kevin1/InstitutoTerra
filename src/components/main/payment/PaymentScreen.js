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

import Colors from '../../../assets/Colors.js';

export default class PaymentScreen extends React.Component {

  state = {
    isReady: false,
  }

  componentDidMount() {
    this.setState({
      treeNum: this.props.navigation.getParam('treeNum', 'treeNum'),
      isReady: true
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

  render() {
    const { isReady } = this.state

    return (
      <View style={styles.container}>
        {!isReady &&
          <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator color={Colors.lightblue} size='large' />
          </View>
        }
        {isReady &&
          <WebView
            originWhitelist={['*']}
            source={{ html: stripeCheckoutRedirectHTML(this.state.treeNum) }}
            onLoadStart={this.onLoadStart}
          />
        }
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    height: height,
    width: width,
    backgroundColor: Colors.white,
  },
})