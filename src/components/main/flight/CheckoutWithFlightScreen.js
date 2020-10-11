import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  PickerIOSComponent,
} from "react-native";

import { verticalScale, moderateScale } from "react-native-size-matters";
import { List, ListItem, Left, Right } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Auth from "@aws-amplify/auth";
import i18n from "i18n-js";

import * as CONSTANTS from "../../utilities/Constants.js";
import COLORS from "../../../assets/Colors.js";
import MenuBar from "../MenuBar.js";
import { withTheme } from "react-native-elements";

const tree = require("../../../assets/images/img_checkout_tree.png");

export default class CheckoutWithFlightScreen extends React.Component {
  state = {
    treeNum: 1,
    total_cost: CONSTANTS.COST,
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
    if (this.state.treeNum > 1) {
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

    if (tempY >= 1) {
      return Math.round(tempY);
    } else {
      return tempY.toFixed(2);
    }
  }

  getYears(years) {
    if (years > 1) {
      return `${years} years`;
    } else if (years === 1) {
      return `${years} year`;
    } else if (years < 0.08) {
      return `a few days`;
    } else {
      return `${years * 12} months`;
    }
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
            <Text style={styles.paragraph}>
              {i18n.t("Flight Number")} {flightChars} {flightNums}
            </Text>
            <Text style={styles.emissions}>{footprint}</Text>
            <Text style={styles.emissionsUnits}>{i18n.t("tons of CO2")}</Text>
          </View>

          {/* Number of Trees */}
          <View height={Math.round(moderateScale(150, 0.3))}>
            <Text style={styles.numTrees}>{treeNum}</Text>
          </View>

          {/* Add or Remove Trees */}
          <View style={styles.addRemoveView}>
            {/* Minus Icon */}
            <View style={styles.iconView}>
              <View style={{ marginRight: Math.round(moderateScale(30, 0.3)) }}>
                <Ionicons
                  style={styles.removeIcon}
                  name="ios-remove-circle"
                  onPress={() => this.handleRemove()}
                />
              </View>
              {/* Add Icon */}
              <View>
                <Ionicons
                  style={styles.addIcon}
                  name="ios-add-circle"
                  onPress={() => this.handleAdd()}
                />
              </View>
            </View>

            <View>
              <Text style={styles.paragraph}>
                {i18n.t("Your flight's CO2 emission will be neutralized in")}{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {this.getYears(years)}
                </Text>
              </Text>
            </View>
          </View>

          {/* Number of Trees and Total Cost */}

          <View style={styles.horizontal_line}></View>
          <View>
            <List>
              <ListItem>
                <Left>
                  <Text style={styles.paragraph}>Number of Trees</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{treeNum}</Text>
                </Right>
              </ListItem>
              <ListItem>
                <Left>
                  <Text style={styles.paragraph}>Total Cost</Text>
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
    justifyContent: "space-evenly",
    marginLeft: Math.round(moderateScale(105, 0.625)),
    marginRight: Math.round(moderateScale(20, 0.0625)),
    marginTop: Math.round(moderateScale(70, 0.0625)),
    marginBottom: Math.round(moderateScale(10, 0.25)),
  },
  addRemoveView: {
    flexDirection: "column",
    justifyContent: "center",
  },
  iconView: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: Math.round(verticalScale(20)),
  },
  oneBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  numTrees: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins-bold",
    fontSize: Math.round(moderateScale(70, 2)),
  },
  addIcon: {
    color: COLORS.forestgreen,
    fontSize: Math.round(moderateScale(50, 0.9)),
  },
  removeIcon: {
    color: COLORS.opaqueForestGreen,
    fontSize: Math.round(moderateScale(50, 0.9)),
  },
  paragraph: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(12, 1.5)),
  },
  emissions: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(40, 0.125)),
  },
  emissionsUnits: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(14, 0.625)),
  },
  horizontal_line: {
    borderBottomColor: COLORS.forestgreen,
    borderBottomWidth: 0.5,
  },
  itemValue: {
    color: COLORS.forestgreen,
    fontFamily: "Poppins-bold",
    fontSize: Math.round(moderateScale(14)),
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 10,
    padding: Math.round(verticalScale(10)),
    backgroundColor: COLORS.forestgreen,
  },
  submitLabel: {
    color: COLORS.sandy,
    fontSize: Math.round(moderateScale(20, 0.5)),
    fontFamily: "Poppins-bold",
    padding: Math.round(moderateScale(10, 0.125)),
  },
});
