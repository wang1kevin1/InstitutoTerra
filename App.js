import React from "react";

import * as Font from "expo-font";

import { Asset } from "expo-asset";

import { AppLoading } from "expo";

import { createAppContainer } from "react-navigation";

import { createStackNavigator } from "react-navigation-stack";

import { fromRight, fromBottom, fromTop } from "react-navigation-transitions";

// AuthStack
import SignUpScreen from "./src/components/auth/SignUpScreen_DEP";
import SignInScreen from "./src/components/auth/SignInScreen";
import ForgotPasswordScreen from "./src/components/auth/ForgotPasswordScreen";

//SettingsStack
import SettingsListScreen from "./src/components/auth/SettingsListScreen";
import SettingsNameScreen from "./src/components/auth/SettingsNameScreen";
import SettingsEmailScreen from "./src/components/auth/SettingsEmailScreen";
import SettingsPasswordScreen from "./src/components/auth/SettingsPasswordScreen";

// MainStack
import HomeScreen from "./src/components/main/HomeScreen";
import AboutScreen from "./src/components/main/AboutScreen";
import UserProfileScreen from "./src/components/user/UserProfileScreen";

// FlightStack
import FlightInfoScreen from "./src/components/main/flight/FlightInfoScreen";
import CarbonEmissionsScreen from "./src/components/main/flight/CarbonEmissionsScreen";
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

// handles screen transitions
const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  // Custom transitions go there
  if (prevScene && nextScene.route.routeName === "About") {
    return fromBottom(); // About page rolls up
  } else if (prevScene && nextScene.route.routeName === "Auth") {
    return fromTop(); // signin page drops down
  } else if (prevScene && nextScene.route.routeName === "UserProfile") {
    return fromTop(); // user profile drops down
  } else if (prevScene && nextScene.route.routeName === "Settings") {
    return null; // settings page just appears
  }
  return fromRight(); // every other page comes in from right side
};

// Auth stack
const AuthStackNavigator = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ForgotPassword: ForgotPasswordScreen,
  },
  { headerMode: "none" }
);

// Settings stack
// Auth stack
const SettingsStackNavigator = createStackNavigator(
  {
    SettingsList: SettingsListScreen,
    SettingsName: SettingsNameScreen,
    SettingsEmail: SettingsEmailScreen,
    SettingsPassword: SettingsPasswordScreen,
  },
  { headerMode: "none" }
);

// Flight Stack
const FlightStackNavigator = createStackNavigator(
  {
    FlightInfo: FlightInfoScreen,
    CarbonEmissions: CarbonEmissionsScreen,
    CheckoutWithFlight: CheckoutWithFlightScreen,
    ReceiptWithFlight: ReceiptWithFlightScreen,
  },
  {
    headerMode: "none",
    transitionConfig: () => fromRight(100),
  }
);

// NoFlight Stack
const NoFlightStackNavigator = createStackNavigator(
  {
    CheckoutWithoutFlight: CheckoutWithoutFlightScreen,
    ReceiptWithoutFlight: ReceiptWithoutFlightScreen,
  },
  {
    headerMode: "none",
    transitionConfig: () => fromRight(100),
  }
);

// Main stack
const MainStackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    About: AboutScreen,
    Flight: FlightStackNavigator, // FlightStack
    NoFlight: NoFlightStackNavigator, // NoFlightStack
    Payment: PaymentScreen,
    ThankYou: ThankYouScreen,
    UserProfile: UserProfileScreen,
    Settings: SettingsStackNavigator, // SettingsStack
    Auth: AuthStackNavigator, // AuthStackNavigator
  },
  {
    headerMode: "none",
    transitionConfig: (nav) => handleCustomTransition(nav),
  }
);

const AppContainer = createAppContainer(MainStackNavigator);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([require("./src/assets/background/home/bg_home.png")]),
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
