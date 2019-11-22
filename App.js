import React from 'react'
import { View, TouchableOpacity } from 'react-native'

import {
  createSwitchNavigator, createAppContainer
} from 'react-navigation'

import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'

import { Ionicons } from '@expo/vector-icons'

// Auth stack screen imports
import AuthLoadingScreen from './src/components/auth/AuthLoadingScreen'
import SignUpScreen from './src/components/auth/SignUpScreen'
import SignInScreen from './src/components/auth/SignInScreen'
import ForgotPasswordScreen from './src/components/auth/ForgotPasswordScreen'
import SettingsScreen from './src/components/auth/SettingsScreen'

// App stack screen imports
import HomeScreen from './src/components/user/HomeScreen'
import ProfileScreen from './src/components/user/ProfileScreen'

// Main app screen imports
import DebugScreen from './src/components/main/DebugScreen'

// Amplify imports and config
import Amplify from '@aws-amplify/core'
import config from './aws-exports'
Amplify.configure(config)

// Configurations and options for the AppTabNavigator
const configurations = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons style={{ fontSize: 26, color: tintColor }} name='ios-home' />
      )
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons style={{ fontSize: 26, color: tintColor }} name='ios-person' />
      )
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Ionicons style={{ fontSize: 26, color: tintColor }} name='ios-settings' />
      )
    }
  }
}

const options = {
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  navigationOptions: {
    tabBarVisible: true
  },
  tabBarOptions: {
    showLabel: true,
    activeTintColor: '#fff',
    inactiveTintColor: '#fff9',
    style: {
      backgroundColor: '#f16f69'
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 12,
      marginTop: 12
    },
    indicatorStyle: {
      height: 0
    },
    showIcon: true
  }
}

// Bottom App tabs
const AppTabNavigator = createMaterialTopTabNavigator(configurations, options)

// Making the common header title dynamic in AppTabNavigator
AppTabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index]
  const headerTitle = routeName
  return {
    headerTitle
  }
}

const AppStackNavigator = createStackNavigator({
  Header: {
    screen: AppTabNavigator,
    // Set the header icon
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ paddingHorizontal: 10 }}>
            <Ionicons size={24} name='md-menu' />
          </View>
        </TouchableOpacity>
      )
    })
  }
})

// to be removed (app drawer)
const AppDrawerNavigator = createDrawerNavigator({
  Tabs: AppStackNavigator, // defined above
  Home: HomeScreen,
  Profile: ProfileScreen,
  Settings: SettingsScreen
})

// Auth stack
const AuthStackNavigator = createStackNavigator({
  Debug: {
    screen: DebugScreen,
    navigationOptions: () => ({
      title: 'Debug Screen', // for the header screen
      headerBackTitle: 'Back'
    })
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: () => ({
      title: 'Create a new account'
    })
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: () => ({
      title: 'Log in to your account'
    })
  },
  ForgotPassword: {
    screen: ForgotPasswordScreen,
    navigationOptions: () => ({
      title: 'Create a new password'
    })
  },
}, { headerMode: 'none' })

const AppSwitchNavigator = createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Auth: AuthStackNavigator, // the Auth stack
  App: AppDrawerNavigator // to be removed
})

const App = createAppContainer(AppSwitchNavigator)

export default App
