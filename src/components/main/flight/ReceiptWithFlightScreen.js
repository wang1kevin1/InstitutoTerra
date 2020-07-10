import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { Ionicons, FontAwesome } from "@expo/vector-icons";

import Dash from "react-native-dash";

import COLORS from "../../../assets/Colors.js";

import MenuBar from "../MenuBar.js";

import Auth from "@aws-amplify/auth";

import i18n from "i18n-js";

export default class ReceiptWithFlightScreen extends React.Component {
  state = {
    isAuthenticated: "false",
    data: [],
  };

  componentDidMount = () => {
    //set state parameters
    this.setState({
      tripIndex: this.props.navigation.getParam("tripIndex", "tripIndex"),
      depCityName: this.props.navigation.getParam(
        "depCityName",
        "departureCity"
      ),
      arrCityName: this.props.navigation.getParam("arrCityName", "arrivalCity"),
      footprint: this.props.navigation.getParam("footprint", "carbonEmissions"),
      treeNum: this.props.navigation.getParam("treeNum", "treeNum"),
      years: this.props.navigation.getParam("years", "years"),
      total_cost: this.props.navigation.getParam("total_cost", "total_cost"),
      flightChars: this.props.navigation.getParam("flightChars", "chars"),
      flightNums: this.props.navigation.getParam("flightNums", "nums"),
    });
    this.checkAuth();
  };

  // Checks if a user is logged in
  async checkAuth() {
    await Auth.currentAuthenticatedUser({ bypassCache: true })
      .then(() => {
        console.log("A user is logged in");
        this.setState({ isAuthenticated: true });
      })
      .catch((err) => {
        console.log("Nobody is logged in");
        this.setState({ isAuthenticated: false });
      });
  }

  // Sends user to sign up or profile depending on Auth state
  handleUserRedirect() {
    if (this.state.isAuthenticated) {
      this.props.navigation.navigate("UserProfile");
    } else {
      this.props.navigation.navigate("SignIn");
    }
  }

  handleStripePayment() {
    this.props.navigation.navigate("Payment", {
      treeNum: this.state.treeNum,
    });
  }
}
