import React from 'react'

import * as Font from 'expo-font';

import {
  createSwitchNavigator, 
  createAppContainer,
} from 'react-navigation'

import { createStackNavigator } from 'react-navigation-stack'

// AuthStack
import SignUpScreen from './src/components/auth/SignUpScreen'
import SignInScreen from './src/components/auth/SignInScreen'
import ForgotPasswordScreen from './src/components/auth/ForgotPasswordScreen'
import SettingsScreen from './src/components/auth/SettingsScreen'

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

// Amplify imports and config
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
Amplify.configure(config)

// Auth stack
const AuthStackNavigator = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  ForgotPassword: ForgotPasswordScreen,
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
}, { headerMode: 'none' })

// Main stack
const MainStackNavigator = createStackNavigator({
  Home: HomeScreen,
  Flight: FlightStackNavigator, // FlightStack
  NoFlight: NoFlightStackNavigator, // NoFlightStack
  UserDashboard: UserDashboardScreen, // DashboardStack
  Settings: SettingsScreen, 
  Auth: AuthStackNavigator, // AuthStackNavigator
}, { headerMode: 'none' })

const AppSwitchNavigator = createSwitchNavigator({
  Main: MainStackNavigator, // the MainStack
})

const AppContainer = createAppContainer(AppSwitchNavigator)

export default class App extends React.Component {
  componentDidMount = () => {
    Font.loadAsync({
      'Montserrat': require('./src/assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-bold': require('./src/assets/fonts/Montserrat-Bold.ttf'),
      'Fago-black': require('./src/assets/fonts/Fago-Black.ttf'),
    });
  }

  render() {
    return(
      <AppContainer/>
    )
  }
}
