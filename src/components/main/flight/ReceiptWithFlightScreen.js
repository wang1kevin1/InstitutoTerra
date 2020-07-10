import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Form, Item, Input, Label } from "native-base";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Dash from "react-native-dash";
import COLORS from "../../../assets/Colors.js";
import MenuBar from "../MenuBar.js";
import Auth from "@aws-amplify/auth";
import i18n from "i18n-js";
import { SafeAreaView } from "react-navigation";

const leaf = require("../../../assets/images/img_receipt_leaf_nobg.png");

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

  render() {
    const {
      tripIndex,
      depCityName,
      arrCityName,
      footprint,
      treeNum,
      years,
      total_cost,
      flightChars,
      flightNums,
    } = this.state;
    return (
      <SafeAreaView style={styles.backDrop}>
        <View style={styles.innerView}>
          <Text
            style={{
              color: COLORS.forestgreen,
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: Math.round(moderateScale(16, 0.0625)),
            }}>
            Flight Number {""}
            <Text style={{ fontFamily: "Poppins-bold" }}>
              {flightChars} {flightNums}
            </Text>
          </Text>
          <Text
            style={{
              color: COLORS.forestgreen,
              textAlign: "center",
              fontFamily: "Poppins-bold",
              fontSize: Math.round(moderateScale(18, 0.0625)),
              marginTop: Math.round(verticalScale(20)),
            }}>
            The first step was taken. The rest is up to us!
          </Text>
          <Image source={leaf} style={styles.leaf_img} />
        </View>
        <MenuBar navigation={this.props.navigation} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  backDrop: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.sandy,
  },
  innerView: {
    flex: 1,
    flexDirection: "column",
    marginLeft: Math.round(moderateScale(105, 0.625)),
    marginRight: Math.round(moderateScale(20, 0.0625)),
    marginBottom: Math.round(moderateScale(10, 0.0625)),
    marginTop: Math.round(moderateScale(20, 0.0625)),
  },
  leaf_img: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 30,
    },
    shadowOpacity: 0.53,
    shadowRadius: 20,
  },
});
