import React from 'react'

import {
  createSwitchNavigator, 
  createAppContainer,
} from 'react-navigation'

import { createStackNavigator } from 'react-navigation-stack'

// AuthStack
import AuthLoadingScreen from './src/components/auth/AuthLoadingScreen'
import SignUpScreen from './src/components/auth/SignUpScreen'
import SignInScreen from './src/components/auth/SignInScreen'
import ForgotPasswordScreen from './src/components/auth/ForgotPasswordScreen'
import SettingsScreen from './src/components/auth/SettingsScreen'

// DashboardStack
import HomeScreen from './src/components/user/HomeScreen'
import ProfileScreen from './src/components/user/ProfileScreen'

// Debug tool
import DebugScreen from './src/components/main/DebugScreen'

// Amplify imports and config
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
Amplify.configure(config)

const DashboardStackNavigator = createStackNavigator({
  Home: HomeScreen,
  Profile: ProfileScreen,
}, { headerMode: 'none' })

// Auth stack
const AuthStackNavigator = createStackNavigator({
  Debug: DebugScreen,
  SignUp: SignUpScreen,
  SignIn: SignInScreen,
  ForgotPassword: ForgotPasswordScreen,
  Settings: SettingsScreen,
}, { headerMode: 'none' })

const AppSwitchNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStackNavigator, // the AuthStack
  Dashboard: DashboardStackNavigator // DashboardStack
})

const App = createAppContainer(AppSwitchNavigator)

export default App
