import React from 'react'

import * as Font from 'expo-font'

import { Asset } from 'expo-asset'

import { AppLoading } from 'expo'

import {
  createSwitchNavigator, 
  createAppContainer,
} from 'react-navigation'

import { createStackNavigator } from 'react-navigation-stack'

// AuthStack
import SignUpScreen from './src/components/auth/SignUpScreen'
import SignInScreen from './src/components/auth/SignInScreen'
import ForgotPasswordScreen from './src/components/auth/ForgotPasswordScreen'

//SettingsStack
import SettingsListScreen from './src/components/auth/SettingsListScreen'
import SettingsNameScreen from './src/components/auth/SettingsNameScreen'
import SettingsEmailScreen from './src/components/auth/SettingsEmailScreen'
import SettingsPasswordScreen from './src/components/auth/SettingsPasswordScreen'

// DashboardStack
import UserDashboardScreen from './src/components/user/UserDashboardScreen'

// MainStack head
import HomeScreen from './src/components/main/HomeScreen'

// FlightStack
import FlightInfoScreen from './src/components/main/flight/FlightInfoScreen'
import CarbonEmissionsScreen from './src/components/main/flight/CarbonEmissionsScreen'
import CheckoutWithFlightScreen from './src/components/main/flight/CheckoutWithFlightScreen'
import ReceiptWithFlightScreen from './src/components/main/flight/ReceiptWithFlightScreen'

// NoFlightStack
import CheckoutWithoutFlightScreen from './src/components/main/noFlight/CheckoutWithoutFlightScreen'
import ReceiptWithoutFlightScreen from './src/components/main/noFlight/ReceiptWithoutFlightScreen'

// PaymentStack
import PaymentScreen from './src/components/main/payment/PaymentScreen'
import ThankYouScreen from './src/components/main/payment/ThankYouScreen'

// Amplify imports and config
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
Amplify.configure(config)


import awsmobile from './aws-exports'
Amplify.configure(awsmobile)

// Language stores
import * as English from './src/components/utilities/languages/English.json'
import * as Nederlands from './src/components/utilities/languages/Nederlands.json'
import * as Espanol from './src/components/utilities/languages/Espanol.json'
import * as Portugues from './src/components/utilities/languages/Portugues.json'

import * as Localization from 'expo-localization'

import i18n from 'i18n-js'

// Set the key-value pairs for the different languages
i18n.translations = {
  en: English,
  nl: Nederlands,
  es: Espanol,
  pt: Portugues,
}

// Set the locale once at start of app.
i18n.locale = Localization.locale;

// Fallback if language missing.
i18n.fallbacks = true;

// Auth stack
const AuthStackNavigator = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  ForgotPassword: ForgotPasswordScreen,
}, { headerMode: 'none' })

// Settings stack
// Auth stack
const SettingsStackNavigator = createStackNavigator({
  SettingsList: SettingsListScreen,
  SettingsName: SettingsNameScreen,
  SettingsEmail: SettingsEmailScreen,
  SettingsPassword: SettingsPasswordScreen
}, { headerMode: 'none' })

// Flight Stack
const FlightStackNavigator = createStackNavigator({
  FlightInfo: FlightInfoScreen,
  CarbonEmissions: CarbonEmissionsScreen,
  CheckoutWithFlight: CheckoutWithFlightScreen,
  ReceiptWithFlight: ReceiptWithFlightScreen,
}, { headerMode: 'none' })

// NoFlight Stack
const NoFlightStackNavigator = createStackNavigator({
  CheckoutWithoutFlight: CheckoutWithoutFlightScreen,
  ReceiptWithoutFlight: ReceiptWithoutFlightScreen,
}, { headerMode: 'none' })

// Main stack
const MainStackNavigator = createStackNavigator({
  Home: HomeScreen,
  Flight: FlightStackNavigator, // FlightStack
  NoFlight: NoFlightStackNavigator, // NoFlightStack
  Payment: PaymentScreen,
  ThankYou: ThankYouScreen,
  UserDashboard: UserDashboardScreen, // DashboardStack
  Settings: SettingsStackNavigator, // SettingsStack
  Auth: AuthStackNavigator, // AuthStackNavigator
}, { headerMode: 'none' })

const AppSwitchNavigator = createSwitchNavigator({
  Main: MainStackNavigator, // the MainStack
})

const AppContainer = createAppContainer(AppSwitchNavigator)

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./src/assets/background/home/home-1.png'), 
        require('./src/assets/background/home/home-2.png'),
        require('./src/assets/background/home/home-3.png'),
        require('./src/assets/background/home/home-4.png'),
        require('./src/assets/background/home/home-5.png'),
      ]),
      Font.loadAsync({
        'Montserrat': require('./src/assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-bold': require('./src/assets/fonts/Montserrat-Bold.ttf'),
        'Fago-black': require('./src/assets/fonts/Fago-Black.ttf'),
      })
    ])
  };

  _handleLoadingError = error => {
    console.warn(error);
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return(
        <AppContainer/>
      )
    }
  }
}
