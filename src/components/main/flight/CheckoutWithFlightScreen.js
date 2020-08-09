import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import Auth from "@aws-amplify/auth";
import i18n from "i18n-js";

import * as CONSTANTS from "../../utilities/Constants.js";
import COLORS from "../../../assets/Colors.js";
import MenuBar from "../MenuBar.js";

export default class CheckoutWithFlightScreen extends Component {
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
    const color = this.colorVariant();

    return (
      <View style={styles.backDrop}>
        <View style={styles.innerView}>
          <Text>Hello World</Text>
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
});
