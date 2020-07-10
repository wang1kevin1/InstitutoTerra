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

const leaf = require("../../../assets/images/img_receipt_leaf_nobg.png");

export default class ReceiptWithFlightScreen extends React.Component {
  state = {
    isAuthenticated: "false",
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
      distance,
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
              {/* List Item 1 */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Flight Distance (km)</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{distance}</Text>
                </Right>
              </ListItem>
              {/* List Item 2 */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>
                    Tons of CO
                    <Text
                      style={{
                        fontSize: moderateScale(7, 0.125),
                        lineHeight: 1,
                      }}>
                      2
                    </Text>
                  </Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{footprint}</Text>
                </Right>
              </ListItem>
              {/* List Item 3 */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Planted Trees</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{treeNum}</Text>
                </Right>
              </ListItem>
              {/* List Item 4 */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Years to Compensate</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>{years}</Text>
                </Right>
              </ListItem>
              {/* List Item 5 */}
              <ListItem>
                <Left>
                  <Text style={styles.itemTitle}>Donation Amount</Text>
                </Left>
                <Right>
                  <Text style={styles.itemValue}>${total_cost}</Text>
                </Right>
              </ListItem>
            </List>
            {/* SignUp Button */}
            <TouchableOpacity
              onPress={() => this.handleStripePayment()}
              disabled={this.state.isLoading}
              style={styles.submitButton}>
              {/* Not Loading Hide ActivityIndicator */}
              {!this.state.isLoading && (
                <Text style={styles.submitLabel}>Pay With Stripe</Text>
              )}
              {/* Show Loading ActivityIndicator */}
              {this.state.isLoading && (
                <View styles={styles.loading}>
                  <ActivityIndicator
                    color={COLORS.sandy}
                    size="large"
                    animating={this.state.isLoading}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
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
    marginBottom: Math.round(moderateScale(15, 0.0625)),
    marginTop: Math.round(moderateScale(20, 0.0625)),
  },
  topInnerView: {
    flex: 1 / 2,
    marginBottom: verticalScale(10),
  },
  bottomInnerView: {
    flex: 1 / 2,
    marginTop: verticalScale(30),
  },
  flightNumberLabel: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(16, 0.0625)),
  },
  header: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins-bold",
    fontSize: Math.round(moderateScale(18, 0.0625)),
    marginTop: Math.round(verticalScale(20)),
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
  itemTitle: {
    color: COLORS.forestgreen,
    fontSize: Math.round(moderateScale(11, 0.125)),
    fontFamily: "Poppins",
  },
  itemValue: {
    color: COLORS.forestgreen,
    fontSize: Math.round(moderateScale(11, 0.125)),
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
