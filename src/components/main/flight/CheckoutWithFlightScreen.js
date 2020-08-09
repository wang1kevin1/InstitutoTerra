import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import { verticalScale, moderateScale } from "react-native-size-matters";
import { List, ListItem, Left, Right } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Auth from "@aws-amplify/auth";
import i18n from "i18n-js";

import * as CONSTANTS from "../../utilities/Constants.js";
import COLORS from "../../../assets/Colors.js";
import MenuBar from "../MenuBar.js";

export default class CheckoutWithFlightScreen extends React.Component {
  state = {
    treeNum: 0,
    total_cost: 0,
  };

  componentDidMount = () => {
    let navigation_props = {
      tripIndex: this.props.navigation.getParam("isTwoWay", undefined),
      distance: this.props.navigation.getParam("distance", undefined),
      depCityName: this.props.navigation.getParam("depCityName", undefined),
      arrCityName: this.props.navigation.getParam("arrCityName", undefined),
      footprint: this.props.navigation.getParam("footprint", undefined),
      flightChars: this.props.navigation.getParam("flightChars", undefined),
      flightNums: this.props.navigation.getParam("flightNums", undefined),
    };

    this.setState(navigation_props);
  };

  //handle checkout redirect
  handleCheckout() {
    let navigation_props = {
      distance: this.state.distance,
      footprint: this.state.footprint,
      treeNum: this.state.treeNum,
      years: this.calcYears(),
      total_cost: this.state.total_cost,
      flightChars: this.state.flightChars,
      flightNums: this.state.flightNums,
    };

    if (this.state.treeNum != 0) {
      this.props.navigation.navigate("ReceiptWithFlight", navigation_props);
    }
  }

  // handle add
  handleAdd() {
    this.setState({
      treeNum: this.state.treeNum + 1,
      total_cost: this.state.total_cost + CONSTANTS.COST,
    });
  }

  // handle remove
  handleRemove() {
    if (this.state.treeNum != 0) {
      this.setState({
        treeNum: this.state.treeNum - 1,
        total_cost: this.state.total_cost - CONSTANTS.COST,
      });
    }
  }

  // Calculate years to neutralize emission footprint
  calcYears() {
    let tempY = this.state.footprint * 1000;
    let factor = this.state.treeNum * 18;
    tempY /= factor;
    return Math.round(tempY);
  }

  render() {
    const {
      flightChars,
      flightNums,
      treeNum,
      footprint,
      total_cost,
    } = this.state;

    const years = this.calcYears();

    return (
      <View style={styles.backDrop}>
        <View style={styles.innerView}>
          {/* Flight Number and Carbon Emissions */}
          <View>
            <Text>
              {i18n.t("Flight Number")} {flightChars} {flightNums}
            </Text>
            <Text>{footprint}</Text>
            <Text>{i18n.t("tons of CO2")}</Text>
          </View>

          {/* Number of Trees */}
          <View>
            <Text>{treeNum}</Text>
          </View>

          {/* Add or Remove Trees */}
          <View>
            {/* Minus Icon */}
            <View>
              <Ionicons
                name="ios-remove-circle"
                onPress={() => this.handleRemove()}
              />
            </View>
            {/* Add Icon */}
            <View>
              <Ionicons
                name="ios-add-circle"
                onPress={() => this.handleAdd()}
              />
            </View>

            <View>
              <Text>hello</Text>
            </View>
          </View>

          <View style={styles.hr}></View>

          {/* Number of Trees and Total Cost */}
          <View>
            <List>
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Number of Trees</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{treeNum}</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Total Cost</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>${total_cost}</Text>
                </Right>
              </ListItem>
            </List>
          </View>

          {/* Navigate to ReceiptWithFlight */}
          <View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.handleCheckout()}>
              <Text style={styles.submitLabel}>Checkout</Text>
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
  submitButton: {
    alignItems: "center",
    borderRadius: 10,
    padding: Math.round(verticalScale(10)),
    backgroundColor: COLORS.forestgreen,
  },
  submitLabel: {
    color: COLORS.sandy,
    fontSize: Math.round(moderateScale(20, 0.05)),
    fontFamily: "Poppins-bold",
    padding: Math.round(moderateScale(10, 0.0125)),
  },
  hr: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
});
