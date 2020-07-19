import React from "react";

import * as Font from "expo-font";

import { Asset } from "expo-asset";

import { AppLoading } from "expo";

import { createAppContainer } from "react-navigation";

import { createStackNavigator } from "react-navigation-stack";

// AuthStack
import SignUpScreen from "./src/components/auth/SignUpScreen";
import SignInScreen from "./src/components/auth/SignInScreen";
import ForgotPasswordScreen from "./src/components/auth/ForgotPasswordScreen";

//SettingsStack
import SettingsListScreen from "./src/components/auth/SettingsListScreen";
import SettingsNameScreen from "./src/components/auth/SettingsNameScreen";
import SettingsEmailScreen from "./src/components/auth/SettingsEmailScreen";
import SettingsPasswordScreen from "./src/components/auth/SettingsPasswordScreen";

// MainStack
import HomeScreen from "./src/components/main/HomeScreen";
import UserProfileScreen from "./src/components/user/UserProfileScreen";

// FlightStack
import FlightInfoScreen from "./src/components/main/flight/FlightInfoScreen";
import CheckoutWithFlightScreen from "./src/components/main/flight/CheckoutWithFlightScreen";
import ReceiptWithFlightScreen from "./src/components/main/flight/ReceiptWithFlightScreen";

// NoFlightStack
import CheckoutWithoutFlightScreen from "./src/components/main/noFlight/CheckoutWithoutFlightScreen";
import ReceiptWithoutFlightScreen from "./src/components/main/noFlight/ReceiptWithoutFlightScreen";

// PaymentStack
import PaymentScreen from "./src/components/main/payment/PaymentScreen";
import ThankYouScreen from "./src/components/main/payment/ThankYouScreen";

// Amplify imports and config for Cognito
import Amplify from "@aws-amplify/core";
import config from "./aws-exports";
Amplify.configure(config);

// Amplify imports and config for Database
import awsmobile from "./aws-exports";
Amplify.configure(awsmobile);

// Language stores
import * as English from "./src/components/utilities/languages/English.json";
import * as Nederlands from "./src/components/utilities/languages/Nederlands.json";
import * as Espanol from "./src/components/utilities/languages/Espanol.json";
import * as Portugues from "./src/components/utilities/languages/Portugues.json";
import * as French from "./src/components/utilities/languages/French.json";

// Language localization imports
import * as Localization from "expo-localization";
import i18n from "i18n-js";

// Set the key-value pairs for the different languages
i18n.translations = {
  en: English,
  nl: Nederlands,
  es: Espanol,
  pt: Portugues,
  fr: French,
};

// default fallback is English
i18n.defaultLocale = "en";

// Set the locale once at start of app.
i18n.locale = Localization.locale;

// Fallback if language missing.
i18n.fallbacks = true;

const AppStackNavigator = createStackNavigator(
  {
    Home: HomeScreen, // Main Stack
    UserProfile: UserProfileScreen,

    FlightInfo: FlightInfoScreen, // Flight Stack
    CheckoutWithFlight: CheckoutWithFlightScreen,
    ReceiptWithFlight: ReceiptWithFlightScreen,

    CheckoutWithoutFlight: CheckoutWithoutFlightScreen, // NoFlight Stack
    ReceiptWithoutFlight: ReceiptWithoutFlightScreen,

    Payment: PaymentScreen, // Payment Stack
    ThankYou: ThankYouScreen,

    SettingsList: SettingsListScreen, // Settings Stack
    SettingsName: SettingsNameScreen,
    SettingsEmail: SettingsEmailScreen,
    SettingsPassword: SettingsPasswordScreen,

    SignIn: SignInScreen, // Auth Stack
    SignUp: SignUpScreen,
    ForgotPassword: ForgotPasswordScreen,
  },
  {
    headerMode: "none",
  }
);

const AppContainer = createAppContainer(AppStackNavigator);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./src/assets/background/home/bg_home.png"),
        require("./src/assets/background/flightInfo/bg_flightInfo.png"),
      ]),
      Font.loadAsync({
        Montserrat: require("./src/assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-bold": require("./src/assets/fonts/Montserrat-Bold.ttf"),
        "Fago-black": require("./src/assets/fonts/Fago-Black.ttf"),
        "Gilroy-bold": require("./src/assets/fonts/Gilroy-Bold.ttf"),
        Poppins: require("./src/assets/fonts/Poppins-Medium.ttf"),
        "Poppins-bold": require("./src/assets/fonts/Poppins-Bold.ttf"),
        "Poppins-light": require("./src/assets/fonts/Poppins-Light.ttf"),
      }),
    ]);
  };

  _handleLoadingError = (error) => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return <AppContainer />;
    }
  }
}
