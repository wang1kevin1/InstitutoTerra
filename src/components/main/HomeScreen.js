import React from "react";

import {
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Text,
  Keyboard,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Input } from "react-native-elements";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import COLORS from "../../assets/Colors.js";

import MenuBar from "./MenuBar.js";

import i18n from "i18n-js";

const background_image = require("../../assets/background/home/bg_home.png");

export default class HomeScreen extends React.Component {
  state = {
    flight: "",
    error: false,
  };

  // load background
  constructor(props) {
    super(props);
    this.background = background_image;
  }

  onChangeText(key, value) {
    this.setState({ [key]: value });
  }

  // checks for valid Iata
  iataCall(chars, nums) {
    fetch(
      `http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIata=${chars}&flightnumber=${nums}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          validNum: true,
          data: responseJson[0],
        });

        console.log(this.state.data);

        if (!this.state.data) {
          this.setState({ validNum: false });
        }

        return this.state.validNum;
      })
      .then((validNum) => {
        if (validNum) {
          flightSearch.current.clear();
          this.setState({ error: false });
          this.props.navigation.navigate("FlightInfo", {
            flightNum: this.state.flight,
          });
        } else {
          this.setState({ error: true });
          flightSearch.current.shake();
          flightSearch.current.clear();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // checks for valid Icao
  icaoCall(chars, nums) {
    fetch(
      `http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIcao=${chars}&flightnumber=${nums}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          validNum: true,
          data: responseJson[0],
        });
        console.log(this.state.data);
        if (!this.state.data) {
          this.setState({ validNum: false });
        }
        return this.state.validNum;
      })
      .then((validNum) => {
        if (validNum) {
          flightSearch.current.clear();
          this.setState({ error: false });
          this.props.navigation.navigate("FlightInfo", {
            flightNum: this.state.flight,
          });
        } else {
          this.setState({ error: true });
          flightSearch.current.shake();
          flightSearch.current.clear();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : null}
          enabled="false"
          style={styles.container}>
          <ImageBackground
            source={this.background}
            style={styles.imageBackground}>
            <View>
              <View style={styles.textContainer}>
                {/* Intro Text Body View */}
                <View>
                  <Text style={styles.largeWhiteText} numberofLines={1}>
                    A cada $6 uma
                  </Text>

                  <Text style={styles.largeWhiteText} numberofLines={1}>
                    árvore é plantada.
                  </Text>

                  <Text style={styles.mediumWhiteText}>
                    Faça sua doação e ajude a recuperar a Mata Atlântica da
                    Fazenda do Bulcão.
                  </Text>

                  <Text style={styles.smallWhiteText} numberOfLines={2}>
                    Insira o número de vôo para iniciar ou
                  </Text>

                  <Text style={styles.linkWhiteText} numberOfLines={1}>
                    doe sem número de vôo{" "}
                    <MaterialCommunityIcons
                      name="chevron-double-right"
                      style={styles.chevronIcon}
                      onPress={() =>
                        this.props.navigation.navigate("CheckoutWithoutFlight")
                      }></MaterialCommunityIcons>
                  </Text>
                </View>

                <View style={styles.searchContainer}>
                  {/* Enter flight number */}
                  <Input
                    containerStyle={styles.containerStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    rightIcon={
                      <Ionicons
                        style={styles.searchIcon}
                        name="md-arrow-forward"
                        onPress={() =>
                          this.props.navigation.navigate(
                            "CheckoutWithoutFlight"
                          )
                        }
                      />
                    }
                    errorMessage={i18n.t("Please enter a valid flight number")}
                    errorStyle={[
                      {
                        fontSize:
                          this.state.error == false ? scale(3) : scale(10),
                      },
                      {
                        color:
                          this.state.error == false ? "transparent" : "red",
                      },
                    ]}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    ref={flightSearch}
                    onChangeText={(value) => this.onChangeText("flight", value)}
                  />
                </View>
              </View>
            </View>
            <MenuBar navigation={this.props.navigation} />
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const flightSearch = React.createRef();

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: Math.round(scale(height)),
    width: width,
    backgroundColor: COLORS.black,
  },
  container: {
    flex: 1,
    flexDirection: "column",

    backgroundColor: "transparent",
  },
  textContainer: {
    marginLeft: Math.round(moderateScale(130, 0.0625)),
    marginRight: Math.round(moderateScale(5, 0.0625)),
    backgroundColor: "transparent",
  },
  largeWhiteText: {
    fontSize: Math.round(moderateScale(24, 0.05)),
    fontFamily: "Poppins-bold",
    color: COLORS.sandy,
  },
  mediumWhiteText: {
    color: COLORS.sandy,
    fontSize: Math.round(scale(20, 0.00125)),
    fontFamily: "Poppins-light",
  },
  smallWhiteText: {
    color: COLORS.sandy,
    fontSize: Math.round(scale(9, 0.625)),
    fontFamily: "Poppins-light",
  },
  linkWhiteText: {
    color: COLORS.sandy,
    fontSize: Math.round(scale(9, 0.625)),
    fontFamily: "Poppins-bold",
    textDecorationLine: "underline",
  },
  searchContainer: {
    marginTop: Math.round(verticalScale(35)),
  },
  containerStyle: {
    opacity: 0.95,
    width: moderateScale(220, 0.5),
    shadowRadius: 5,
    shadowOpacity: 0.7,
    shadowColor: COLORS.black,
    shadowOffset: { width: 5, height: 1 },
    backgroundColor: "transparent",
    borderColor: COLORS.sandy,
    borderWidth: Math.round(scale(3)),
    borderRadius: Math.round(scale(15)),
  },
  inputContainerStyle: {
    paddingTop: verticalScale(15),
    borderBottomColor: "transparent",
  },
  inputStyle: {
    color: COLORS.sandy,
    fontFamily: "Poppins-bold",
    fontSize: Math.round(moderateScale(30, 0.0125)),
  },
  labelStyle: {
    color: COLORS.sandy,
    fontSize: Math.round(scale(20)),
  },
  searchIcon: {
    color: COLORS.sandy,
    textAlign: "center",
    fontSize: Math.round(scale(35)),
  },
  chevronIcon: {
    color: COLORS.sandy,
    textAlignVertical: "center",
    textDecorationColor: "transparent",
  },
});
