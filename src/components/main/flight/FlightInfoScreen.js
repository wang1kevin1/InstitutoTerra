import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
} from "react-native";

import { verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import * as CONSTANTS from "../../utilities/Constants.js";
import COLORS from "../../../assets/Colors.js";
import Auth from "@aws-amplify/auth";
import MenuBar from "../MenuBar.js";
import i18n from "i18n-js";

const background_image = require("../../../assets/background/flightInfo/bg_flightInfo.png");
const plane_image = require("../../../assets/icons/ic_plane.png");

export default class FlightInfoScreen extends React.Component {
  state = {
    iata: "",
    isReady: false,
    seatIndex: "Economy",
    tripIndex: false,
  };

  constructor(props) {
    super(props);
    this.background = background_image;
  }

  componentDidMount = () => {
    this.getFlight();
  };

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
          // console.log(response[2][0]);
          // console.log(response[1][0]);
          // console.log(`Response 0: \n${response}`);
          let makeArray = response[2][0].productionLine.split(" ");
          this.setState({
            arrCityIata: response[0][0].codeIataCity,
            arrLat: response[0][0].latitudeAirport,
            arrLong: response[0][0].longitudeAirport,
            arrAirportName: response[0][0].nameAirport,
            depCityIata: response[1][0].codeIataCity,
            depLat: response[1][0].latitudeAirport,
            depLong: response[1][0].longitudeAirport,
            depAirportName: response[1][0].nameAirport,
            planeModel: response[2][0].planeModel,
            planeMake: makeArray[0],
            airlineName: response[3][0].nameAirline,
          });
          // console.log(this.state.planeMake);
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
          // console.log(response[1][0]);
          // console.log(`Response 1: \n${response}`);
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
          // console.log(this.state.planeMake);
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
    // console.log(a);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // console.log(c);
    let d = earthRad * c;
    d = d.toFixed(2);
    // console.log(d);
    this.setState({
      distanceTraveled: d,
    });
  }

  //Calculate emissions using distance and seat class
  calcEmissions() {
    let dist = this.state.distanceTraveled;
    let seat = this.state.distanceTraveled;
    // console.log(seat);
    //Short Flight
    if (dist < 500) {
      dist *= CONSTANTS.CARBON_MULTIPLIERS.short;
    }
    //Medium Flight
    else if (dist < 1000) {
      //Economy seat
      if (this.state.seatIndex == "Economy") {
        dist *= CONSTANTS.CARBON_MULTIPLIERS.medium_economy;
      }
      //Business seat
      else if (
        this.state.seatIndex == "Business" ||
        this.state.seatIndex == "First Class"
      ) {
        dist *= CONSTANTS.CARBON_MULTIPLIERS.medium_business;
      }
    }
    //Long Flight
    else {
      //Economy Seat
      if (this.state.seatIndex == "Economy") {
        dist *= CONSTANTS.CARBON_MULTIPLIERS.long_economy;
        // console.log("Economy Long");
        // console.log(dist);
      }
      //Business Seat
      else if (this.state.seatIndex == "Business") {
        dist *= CONSTANTS.CARBON_MULTIPLIERS.long_business;
        // console.log("Business Long");
        // console.log(dist);
      }
      //First Class Seat
      else if (this.state.seatIndex == "First Class") {
        dist *= CONSTANTS.CARBON_MULTIPLIERS.long_first;
        // console.log("First Class Long");
        // console.log(dist);
      }
    }
    var emissions = Math.round(dist);
    emissions /= 1000;
    return emissions;
  }

  handleFlightClass(clss) {
    this.setState({
      seatIndex: clss,
    });
  }

  handleTabStyle(clss) {
    let style =
      this.state.seatIndex == clss
        ? styles.tabButtonActive
        : styles.tabButtonInActive;
    return style;
  }

  handleTabText(clss) {
    let style =
      this.state.seatIndex == clss
        ? styles.tabTextActive
        : styles.tabTextInActive;
    return style;
  }

  handleTripIndex() {
    if (this.state.tripIndex) {
      this.setState({ tripIndex: false });
      this.setState({ distanceTraveled: this.state.distanceTraveled / 2 });
    } else {
      this.setState({ tripIndex: true });
      this.setState({ distanceTraveled: this.state.distanceTraveled * 2 });
    }
  }

  render() {
    const {
      isReady,
      flightChars,
      flightNums,
      tripIndex,
      arrivalIata,
      departureIata,
      arrAirportName,
      depAirportName,
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

    const carbonEmissions = this.calcEmissions();

    if (!isReady) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignSelf: "center",
            justifyContent: "center",
          }}>
          <Text
            style={{
              color: COLORS.forestgreen,
              textAlign: "center",
              fontFamily: "Poppins-bold",
              fontSize: Math.round(moderateScale(30, 0.0625)),
            }}>
            Insert Loading Screen Here :)
          </Text>
        </View>
      );
    } else {
      return (
        <ImageBackground
          source={this.background}
          style={styles.background_image}>
          <View style={styles.backDrop}>
            <View style={styles.innerView}>
              {/* Flight Information */}
              <View style={styles.topInnerView}>
                <View style={styles.flightView}>
                  <Text style={styles.flightNumberLabel}>Flight Number</Text>
                  <Text style={styles.flightNumberText}>
                    {flightChars}
                    {flightNums}
                  </Text>
                  <Text style={styles.flightInfoText}>
                    {depCityName} ({depCityIata}) to {arrCityName} (
                    {arrCityIata}) via {airlineName}{" "}
                  </Text>
                </View>

                {/* Arrival Departure */}
                <View style={styles.itineraryView}>
                  <View style={styles.itineraryViewItem}>
                    <Text style={styles.itineraryLabel}>{depAirportName}</Text>
                    <Text style={styles.itineraryAirportCode}>
                      {departureIata}
                    </Text>
                  </View>

                  <View style={styles.plane_icon_view}>
                    <Ionicons name={"ios-airplane"} style={styles.plane_icon} />
                  </View>

                  <View style={styles.itineraryViewItem}>
                    <View style={styles.fixFlex}>
                      <Text style={styles.itineraryLabel}>
                        {arrAirportName}
                      </Text>
                      <Text style={styles.itineraryAirportCode}>
                        {arrivalIata}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* One Way or Two WAy*/}
                <View style={styles.seatIndexView}>
                  <View style={styles.seatIndexViewItem}>
                    <Text style={styles.seatIndexLabel}>One Way</Text>
                  </View>

                  <View style={styles.switchView}>
                    <Switch
                      trackColor={{
                        false: COLORS.sandy,
                        true: COLORS.sandy,
                      }}
                      onValueChange={() => this.handleTripIndex()}
                      value={this.state.tripIndex}
                      thumbColor={COLORS.forestgreen}
                      ios_backgroundColor={COLORS.sandy}
                      style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                    />
                  </View>

                  <View style={styles.seatIndexViewItem}>
                    <Text style={styles.seatIndexLabel}>Two Way</Text>
                  </View>
                </View>
              </View>

              {/* Tabs */}
              <View style={styles.midInnerView}>
                {/* Economy */}
                <TouchableOpacity
                  style={this.handleTabStyle("Economy")}
                  onPress={() => this.handleFlightClass("Economy")}>
                  <Text style={this.handleTabText("Economy")}>
                    {"Economy".toUpperCase()}
                  </Text>
                </TouchableOpacity>

                {/* Business */}
                <TouchableOpacity
                  style={this.handleTabStyle("Business")}
                  onPress={() => this.handleFlightClass("Business")}>
                  <Text style={this.handleTabText("Business")}>
                    {"Business".toUpperCase()}
                  </Text>
                </TouchableOpacity>

                {/* First Class  */}
                <TouchableOpacity
                  style={this.handleTabStyle("First")}
                  onPress={() => this.handleFlightClass("First")}>
                  <Text style={this.handleTabText("First")}>
                    {"First".toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Distance and Carbon Emission */}
              <View style={styles.bottomInnerView}>
                {/* Flight Distance */}
                <View style={styles.dataView}>
                  <Text style={styles.label}>Distance</Text>
                  <Text style={styles.dataText}>
                    {distanceTraveled}
                    <Text style={styles.unit_label}>{"km".toLowerCase()}</Text>
                  </Text>
                </View>

                {/* Carbon Emissions */}
                <View style={styles.dataView}>
                  <Text style={styles.label}>Carbon Emissions</Text>
                  <Text style={styles.dataText}>
                    {carbonEmissions}{" "}
                    <Text style={styles.unit_label}>tons of CO2</Text>
                  </Text>
                </View>

                {/* Proceed to Checkout */}
                <View style={styles.navigationView}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    disabled={this.state.isLoading}
                    onPress={() =>
                      this.props.navigation.navigate("CheckoutWithFlight", {
                        tripIndex: tripIndex,
                        depCityName: depCityName,
                        arrCityName: arrCityName,
                        distance: distanceTraveled,
                        footprint: carbonEmissions,
                        planeMake: planeMake,
                        planeModel: planeModel,
                        seatState: seatIndex,
                        flightChars: flightChars,
                        flightNums: flightNums,
                      })
                    }>
                    <Text style={styles.submitLabel}>Plant Trees</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <MenuBar navigation={this.props.navigation} />
          </View>
        </ImageBackground>
      );
    }
  }
}

const styles = StyleSheet.create({
  background_image: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  backDrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  // Content Wrapper
  innerView: {
    flex: 1,
    flexDirection: "column",
    marginLeft: Math.round(moderateScale(105, 0.625)),
    marginRight: Math.round(moderateScale(20, 0.0625)),
    marginBottom: Math.round(moderateScale(30, 0.0625)),
    marginTop: Math.round(moderateScale(80, 0.0625)),
  },

  // Top Inner View
  topInnerView: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: Math.round(verticalScale(15)),
  },
  flightView: {
    flex: 0.6,
  },
  flightNumberLabel: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(16, 0.0625)),
  },
  flightNumberText: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins-bold",
    fontSize: Math.round(moderateScale(40, 0.0625)),
  },
  flightInfoText: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(16, 0.0625)),
  },

  // itinerary View
  itineraryView: {
    flex: 1 / 3,
    flexDirection: "row",
    alignItems: "center",
  },
  plane_icon_view: {
    flex: 1,
  },
  plane_icon: {
    color: COLORS.lightSandy,
    textAlign: "center",
    fontSize: Math.round(moderateScale(35, 0.0625)),
  },
  itineraryViewItem: {
    flex: 1,
    flexDirection: "column",
  },
  itineraryLabel: {
    color: COLORS.lightSandy,
    textAlign: "center",
    fontSize: Math.round(moderateScale(14, 0.0625)),
  },
  itineraryAirportCode: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    textAlign: "center",
    fontSize: Math.round(moderateScale(40, 0.0625)),
  },
  // Seat Index View
  seatIndexView: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
  },
  switchView: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  seatIndexViewItem: {
    flex: 1,
    flexDirection: "column",
  },
  seatIndexLabel: {
    color: COLORS.lightSandy,
    textAlign: "center",
    fontSize: Math.round(moderateScale(14, 0.0625)),
  },
  // Mid Inner View
  midInnerView: {
    flex: 1 / 9,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: COLORS.lightSandy,
    marginBottom: Math.round(verticalScale(30)),
  },
  tabTextActive: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(12, 0.3)),
  },
  tabButtonActive: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    backgroundColor: COLORS.opaqueGreyForestGreen,
  },
  tabTextInActive: {
    color: COLORS.opaqueForestGreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(12, 0.3)),
  },
  tabButtonInActive: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  // Bottom Inner View
  bottomInnerView: {
    flex: 1,
  },
  label: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(14, 0.0625)),
  },
  dataText: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(40, 0.0625)),
  },
  unit_label: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(18, 0.0625)),
  },
  dataView: {
    flex: 1,
  },
  navigationView: {
    flex: 1,
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 10,
    padding: Math.round(verticalScale(10)),
    backgroundColor: COLORS.lightSandy,
  },
  submitLabel: {
    color: COLORS.forestgreen,
    fontSize: Math.round(moderateScale(20, 0.05)),
    padding: Math.round(moderateScale(10, 0.0125)),
    fontFamily: "Poppins-bold",
  },
});
