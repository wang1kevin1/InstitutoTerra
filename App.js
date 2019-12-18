import React from 'react'

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

// Main stack
import HomeScreen from './src/components/main/HomeScreen'
import FlightInfoScreen from './src/components/calc/FlightInfo'
import CarbonEmissionsScreen from './src/components/calc/CarbonEmissions'

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

// Main stack
const MainStackNavigator = createStackNavigator({
  Home: HomeScreen,
  FlightInfo: FlightInfoScreen,
  CarbonEmissions: CarbonEmissionsScreen,
  UserDashboard: UserDashboardScreen, // DashboardStack
  Settings: SettingsScreen, 
  Auth: AuthStackNavigator, // AuthStackNavigator
}, { headerMode: 'none' })

const AppSwitchNavigator = createSwitchNavigator({
  Main: MainStackNavigator, // the MainStack
})

const App = createAppContainer(AppSwitchNavigator)

export default App
