import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
  SafeAreaView,
} from "react-native";
import { verticalScale, moderateScale } from "react-native-size-matters";
import { List, ListItem, Left, Right } from "native-base";
import COLORS from "../../../assets/Colors.js";
import MenuBar from "../MenuBar.js";
import Auth from "@aws-amplify/auth";
import i18n from "i18n-js";

const leaf = require("../../../assets/images/img_receipt_leaf.png");

export default class ReceiptWithFlightScreen extends React.Component {
  state = {
    data: [],
  };

  componentDidMount = () => {
    //set state parameters
    this.setState({
      distance: this.props.navigation.getParam("distance", "distanceTraveled"),
      footprint: this.props.navigation.getParam("footprint", "carbonEmissions"),
      treeNum: this.props.navigation.getParam("treeNum", "treeNum"),
      years: this.props.navigation.getParam("years", "years"),
      total_cost: this.props.navigation.getParam("total_cost", "total_cost"),
      flightChars: this.props.navigation.getParam("flightChars", "chars"),
      flightNums: this.props.navigation.getParam("flightNums", "nums"),
    });
  };

  handleStripePayment() {
    this.props.navigation.navigate("Payment", {
      treeNum: this.state.treeNum,
    });
  }

  render() {
    const {
      distance,
      footprint,
      treeNum,
      years,
      total_cost,
      flightChars,
      flightNums,
    } = this.state;
    return (
      <View style={styles.backDrop}>
        <View style={styles.innerView}>
          <View style={styles.topInnerView}>
            <Text style={styles.flightNumberLabel}>
              Flight Number {""}
              <Text style={{ fontFamily: "Poppins-bold" }}>
                {flightChars} {flightNums}
              </Text>
            </Text>
            <Text style={styles.header}>
              The first step was taken. The rest is up to us!
            </Text>
            <Image source={leaf} style={styles.leaf_img} />
          </View>
          <View style={styles.bottomInnerView}>
            <List>
              {/* Flight Distance */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Flight Distance (km)</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{distance}</Text>
                </Right>
              </ListItem>
              {/* Carbon FootPrint */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>
                    Carbon Footprint{"\n"}(Metric Tons)
                  </Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{footprint}</Text>
                </Right>
              </ListItem>
              {/* Number of planted Trees */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Planted Trees</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{treeNum}</Text>
                </Right>
              </ListItem>
              {/* Years To Compensation*/}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Years to Compensate</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{years}</Text>
                </Right>
              </ListItem>
              {/* Donation Amount */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Donation Amount</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>${total_cost}</Text>
                </Right>
              </ListItem>
            </List>
            {/* Pay With Stripe Button */}
            <TouchableOpacity
              onPress={() => this.handleStripePayment()}
              disabled={this.state.isLoading}
              style={styles.submitButton}>
              <Text style={styles.submitLabel}>Pay With Stripe</Text>
            </TouchableOpacity>
          </View>
        </View>
        <MenuBar navigation={this.props.navigation} />
      </View>
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
    marginTop: Math.round(moderateScale(70, 0.0625)),
    marginBottom: Math.round(moderateScale(30, 0.25)),
  },
  topInnerView: {
    flex: 1,
    justifyContent: "space-evenly",
    // backgroundColor: "black",
  },
  bottomInnerView: {
    flex: 1,
    justifyContent: "space-evenly",
    // backgroundColor: "red",
  },
  flightNumberLabel: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(17, 0.0625)),
    marginBottom: Math.round(verticalScale(5)),
  },
  header: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins-bold",
    fontSize: Math.round(moderateScale(18, 0.0625)),
    paddingBottom: Math.round(verticalScale(10)),
  },
  leaf_img: {
    width: "100%",
    height: verticalScale(200),
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: verticalScale(17),
    },
    shadowOpacity: 0.53,
    shadowRadius: verticalScale(12),
  },
  itemTitle: {
    color: COLORS.forestgreen,
    fontSize: Math.round(moderateScale(14, 0.125)),
    fontFamily: "Poppins",
  },
  itemValue: {
    color: COLORS.forestgreen,
    fontSize: Math.round(moderateScale(14, 0.125)),
    fontFamily: "Poppins-bold",
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 10,
    padding: Math.round(verticalScale(10)),
    marginTop: Math.round(verticalScale(20)),
    backgroundColor: COLORS.forestgreen,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  submitLabel: {
    color: COLORS.sandy,
    fontSize: Math.round(moderateScale(20, 0.05)),
    padding: Math.round(moderateScale(10, 0.0125)),
    fontFamily: "Poppins-bold",
  },
});
