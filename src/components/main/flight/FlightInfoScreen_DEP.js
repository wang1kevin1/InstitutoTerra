import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";

import Dash from "react-native-dash";

import COLORS from "../../../assets/Colors.js";

import MenuBar from "../MenuBar.js";

import Auth from "@aws-amplify/auth";

import i18n from "i18n-js";

console.log(process.env.REACT_APP_API_KEY);

export default class FlightInfoScreen extends React.Component {
  state = {
    isAuthenticated: "false",
    iata: "",
    isReady: false,
    seatIndex: "Economy",
    tripIndex: 1,
  };

  componentDidMount = () => {
    this.checkAuth();
    this.getFlight();
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

  /* Fetch route data using flight number*/
  getFlight() {
    let buffer = this.props.navigation.getParam("flightNum", "numCode");
    let charsIata = buffer.slice(0, 2).toUpperCase();
    let charsIcao = buffer.slice(0, 3).toUpperCase();
    let numsIata = buffer.slice(2);
    let numsIcao = buffer.slice(3);
    if (isNaN(buffer.charAt(2))) {
      return this.callIcao(charsIcao, numsIcao);
    } else {
      return this.callIata(charsIata, numsIata);
    }
  }

  //Fetch flight information using Iata flight number
  callIata(chars, nums) {
    fetch(
      `http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIata=${chars}&flightnumber=${nums}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson[0],
          airlineIata: responseJson[0].airlineIata,
          arrivalIata: responseJson[0].arrivalIata,
          departureIata: responseJson[0].departureIata,
          planeReg: responseJson[0].regNumber,
          flightChars: chars,
          flightNums: nums,
        });
        return [
          this.state.arrivalIata,
          this.state.departureIata,
          this.state.planeReg,
          this.state.airlineIata,
        ];
      })
      .then((Codes) => {
        this.getPortsPlanes(Codes);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Fetch flight Information using Icao flight number
  callIcao(chars, nums) {
    fetch(
      `http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIcao=${chars}&flightnumber=${nums}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          data: responseJson[0],
          airlineIata: responseJson[0].airlineIata,
          arrivalIata: responseJson[0].arrivalIata,
          departureIata: responseJson[0].departureIata,
          planeReg: responseJson[0].regNumber,
          flightChars: chars,
          flightNums: nums,
        });
        return [
          this.state.arrivalIata,
          this.state.departureIata,
          this.state.planeReg,
          this.state.airlineIata,
        ];
      })
      .then((Codes) => {
        this.getPortsPlanes(Codes);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Fetch departure/arrival airports, airline, and airplane information */
  getPortsPlanes(Codes) {
    if (Codes[2]) {
      let arrAirportCall = fetch(
        `https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${Codes[0]}`
      );
      let depAirportCall = fetch(
        `https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${Codes[1]}`
      );
      let planeCall = fetch(
        `https://aviation-edge.com/v2/public/airplaneDatabase?key=760fd0-cefe7a&numberRegistration=${Codes[2][0]}`
      );
      let airlineCall = fetch(
        `https://aviation-edge.com/v2/public/airlineDatabase?key=760fd0-cefe7a&codeIataAirline=${Codes[3]}`
      );
      Promise.all([arrAirportCall, depAirportCall, planeCall, airlineCall])
        .then((values) => Promise.all(values.map((value) => value.json())))
        .then((response) => {
          console.log(response[2][0]);
          console.log(response[1][0]);
          let makeArray = response[2][0].productionLine.split(" ");
          this.setState({
            arrCityIata: response[0][0].codeIataCity,
            arrLat: response[0][0].latitudeAirport,
            arrLong: response[0][0].longitudeAirport,
            depCityIata: response[1][0].codeIataCity,
            depLat: response[1][0].latitudeAirport,
            depLong: response[1][0].longitudeAirport,
            planeModel: response[2][0].planeModel,
            planeMake: makeArray[0],
            airlineName: response[3][0].nameAirline,
          });
          console.log(this.state.planeMake);
          this.getDistance();
          return [this.state.arrCityIata, this.state.depCityIata];
        })
        .then((IataCodes) => {
          this.getCities(IataCodes);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // if no plane info
    else {
      let arrAirportCall = fetch(
        `https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${Codes[0]}`
      );
      let depAirportCall = fetch(
        `https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${Codes[1]}`
      );
      let airlineCall = fetch(
        `https://aviation-edge.com/v2/public/airlineDatabase?key=760fd0-cefe7a&codeIataAirline=${Codes[3]}`
      );
      Promise.all([arrAirportCall, depAirportCall, airlineCall])
        .then((values) => Promise.all(values.map((value) => value.json())))
        .then((response) => {
          console.log(response[1][0]);
          this.setState({
            arrCityIata: response[0][0].codeIataCity,
            arrLat: response[0][0].latitudeAirport,
            arrLong: response[0][0].longitudeAirport,
            depCityIata: response[1][0].codeIataCity,
            depLat: response[1][0].latitudeAirport,
            depLong: response[1][0].longitudeAirport,
            planeModel: "N/A",
            planeMake: "",
            airlineName: response[2][0].nameAirline,
          });
          console.log(this.state.planeMake);
          this.getDistance();
          return [this.state.arrCityIata, this.state.depCityIata];
        })
        .then((IataCodes) => {
          this.getCities(IataCodes);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  /* Fetch arrival/departure city information */
  getCities(IataCodes) {
    let arrCityCall = fetch(
      `https://aviation-edge.com/v2/public/cityDatabase?key=760fd0-cefe7a&codeIataCity=${IataCodes[0]}`
    );
    let depCityCall = fetch(
      `https://aviation-edge.com/v2/public/cityDatabase?key=760fd0-cefe7a&codeIataCity=${IataCodes[1]}`
    );
    Promise.all([arrCityCall, depCityCall])
      .then((values) => Promise.all(values.map((value) => value.json())))
      .then((response) => {
        this.setState({
          arrCityName: response[0][0].nameCity,
          depCityName: response[1][0].nameCity,
          isReady: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Calculate distance between arrival and departure airports */
  getDistance() {
    let earthRad = 6731;
    let latDiff = ((this.state.arrLat - this.state.depLat) * Math.PI) / 180;
    let longDiff = ((this.state.arrLong - this.state.depLong) * Math.PI) / 180;

    let latArr = (this.state.arrLat * Math.PI) / 180;
    let latDep = (this.state.depLat * Math.PI) / 180;
    let a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.sin(longDiff / 2) *
        Math.sin(longDiff / 2) *
        Math.cos(latArr) *
        Math.cos(latDep);
    console.log(a);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log(c);
    let d = earthRad * c;
    d = d.toFixed(2);
    console.log(d);
    this.setState({
      distanceTraveled: d,
    });
  }

  render() {
    const {
      isReady,
      flightChars,
      flightNums,
      tripIndex,
      arrCityName,
      depCityName,
      arrCityIata,
      depCityIata,
      planeModel,
      airlineName,
      planeMake,
      distanceTraveled,
      seatIndex,
    } = this.state;

    if (!isReady) {
      return (
        <View style={styles.containerLoading}>
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}>
            <Ionicons name="ios-paper-plane" style={styles.loadingIcon} />
            <Text
              style={[
                styles.loadingText,
                {
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "5%",
                },
              ]}>
              {i18n.t("RETRIEVING FLIGHT")}
            </Text>
            <ActivityIndicator
              color={COLORS.lightblue}
              size="large"
              animating={!isReady}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.containerTop}>
            <View style={styles.buttonBarNav}>
              {/*Navigation Buttons*/}
              <Feather
                style={styles.navigationIcon}
                name="home"
                onPress={() => this.props.navigation.navigate("Home")}
              />
              <FontAwesome
                style={styles.navigationIcon}
                name="user-circle-o"
                onPress={() => this.handleUserRedirect()}
              />
            </View>
            <View style={styles.buttonBarTop}>
              {/*Route Option Buttons*/}
              <View
                style={[
                  styles.leftGreenButton,
                  { opacity: this.state.tripIndex == 1 ? 1 : 0.5 },
                ]}>
                <TouchableOpacity
                  onPress={() => this.setState({ tripIndex: 1 })}>
                  <Text style={styles.buttonText}>{i18n.t("ONE WAY")}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.rightGreenButton,
                  { opacity: this.state.tripIndex == 2 ? 1 : 0.5 },
                ]}>
                <TouchableOpacity
                  onPress={() => this.setState({ tripIndex: 2 })}>
                  <Text style={styles.buttonText}>{i18n.t("ROUND TRIP")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/*Flight Number*/}
            <Text style={styles.smallBlueText}>{i18n.t("FLIGHT NUMBER")}</Text>
            <Text style={styles.bigBlueText}>
              {flightChars} {flightNums}
            </Text>
            <View style={styles.planeInfoText}>
              {/*Departure and arrival city & IATA*/}
              <Text style={styles.midGreyText}>
                {depCityName}({depCityIata}) {i18n.t("to")} {arrCityName}(
                {arrCityIata}){" "}
              </Text>
              <Text style={styles.midGreyText}>
                {i18n.t("via")} {airlineName}
              </Text>
            </View>
            <View style={styles.buttonBarBottom}>
              {/*Seat class selector*/}
              <View
                style={[
                  styles.leftGreenButton,
                  { opacity: this.state.seatIndex == "Economy" ? 1 : 0.5 },
                ]}>
                <TouchableOpacity
                  onPress={() => this.setState({ seatIndex: "Economy" })}>
                  <Text style={styles.buttonText}>{i18n.t("ECONOMY")}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.middleGreenButton,
                  { opacity: this.state.seatIndex == "Business" ? 1 : 0.5 },
                ]}>
                <TouchableOpacity
                  onPress={() => this.setState({ seatIndex: "Business" })}>
                  <Text style={styles.buttonText}>{i18n.t("BUSINESS")}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.rightGreenButton,
                  { opacity: this.state.seatIndex == "First Class" ? 1 : 0.5 },
                ]}>
                <TouchableOpacity
                  onPress={() => this.setState({ seatIndex: "First Class" })}>
                  <Text style={styles.buttonText}>{i18n.t("FIRST CLASS")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Dash
              style={styles.dashedLine}
              dashColor={COLORS.lightgrey}
              dashGap={0}
            />
            <View style={styles.receiptContainer}>
              {/*More flight information*/}
              <View style={styles.textRow}>
                <Text style={styles.receiptTextLeft}>{i18n.t("FLIGHT")}</Text>
                {/* Departure to Arrival */}
                {tripIndex == 1 && (
                  <Text style={styles.receiptTextRight}>
                    {depCityName} &#10230; {arrCityName}
                  </Text>
                )}
                {tripIndex == 2 && (
                  <Text style={styles.receiptTextRight}>
                    {depCityName} &#10231; {arrCityName}
                  </Text>
                )}
              </View>
              <View style={styles.textRow}>
                <Text style={styles.receiptTextLeft}>{i18n.t("DISTANCE")}</Text>
                {/*Distance of flight*/}
                <Text style={styles.receiptTextRight}>
                  {distanceTraveled * this.state.tripIndex} km
                </Text>
              </View>
              <View style={styles.textRow}>
                <Text style={styles.receiptTextLeft}>{i18n.t("AIRPLANE")}</Text>
                {/*Type of plane*/}
                <Text style={styles.receiptTextRight}>
                  {planeMake} {planeModel}
                </Text>
              </View>
              <View style={styles.textRow}>
                <Text style={styles.receiptTextLeft}>{i18n.t("CLASS")}</Text>
                {/*Class of seat*/}
                <Text style={styles.receiptTextRight}>{seatIndex}</Text>
              </View>
            </View>
            {/*Navigate to next screen*/}
            <TouchableOpacity
              style={styles.bottomGreenButton}
              onPress={() =>
                this.props.navigation.navigate("CheckoutWithFlight", {
                  tripIndex: tripIndex,
                  depCityName: depCityName,
                  arrCityName: arrCityName,
                  distance: distanceTraveled * this.state.tripIndex,
                  footprint: carbonEmissions,
                  planeMake: planeMake,
                  planeModel: planeModel,
                  seatState: seatIndex,
                  flightChars: flightChars,
                  flightNums: flightNums,
                })
              }>
              <Text style={styles.buttonText}>
                {i18n.t("CALCULATE CARBON FOOTPRINT")}
              </Text>
            </TouchableOpacity>
          </View>
          <MenuBar navigation={this.props.navigation} />
        </View>
      );
    }
  }
}

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    height: height,
    width: width,
    backgroundColor: COLORS.white,
  },
  loadingIcon: {
    color: COLORS.lightblue,
    fontSize: 120,
    textAlign: "center",
  },
  loadingText: {
    marginTop: "5%",
    fontFamily: "Montserrat-bold",
    fontSize: 12,
    color: COLORS.lightblue,
    textAlign: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.white,
    height: height,
    width: width,
  },
  containerTop: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: height * 0.06,
    marginBottom: height * 0.1,
    backgroundColor: COLORS.white,
  },
  buttonBarNav: {
    flexDirection: "row",
    height: height * 0.05,
    justifyContent: "space-between",
    marginBottom: height * 0.05,
  },
  buttonBarTop: {
    flexDirection: "row",
    height: height * 0.04,
    justifyContent: "center",
    width: "66%",
  },
  buttonBarBottom: {
    flexDirection: "row",
    height: height * 0.04,
    justifyContent: "center",
  },
  leftGreenButton: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    marginRight: 3,
    backgroundColor: COLORS.lightgreen,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  middleGreenButton: {
    backgroundColor: COLORS.lightgreen,
    marginRight: 3,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightGreenButton: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: COLORS.lightgreen,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  planeInfoText: {
    paddingBottom: height * 0.03,
  },
  smallBlueText: {
    marginTop: "5%",
    fontFamily: "Montserrat",
    fontSize: 12,
    color: COLORS.lightblue,
  },
  bigBlueText: {
    fontFamily: "Montserrat-bold",
    fontSize: 30,
    color: COLORS.lightblue,
  },
  midGreyText: {
    fontFamily: "Montserrat",
    fontSize: 15,
    color: COLORS.darkgrey,
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: COLORS.lightgreen,
    height: height * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Montserrat-bold",
    color: COLORS.darkgrey,
    fontSize: 12,
  },
  receiptContainer: {
    marginBottom: height * 0.1125,
  },
  receiptTextLeft: {
    fontFamily: "Montserrat",
    color: COLORS.darkgrey,
    fontSize: 12,
  },
  receiptTextRight: {
    fontFamily: "Montserrat-bold",
    color: COLORS.darkgrey,
    fontSize: 12,
  },
  dashedLine: {
    width: "100%",
    height: 1,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  navigationIcon: {
    color: COLORS.grey,
    fontSize: 30,
  },
});
