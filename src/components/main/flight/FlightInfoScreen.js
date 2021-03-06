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
    isTwoWay: false,
  };

  constructor(props) {
    super(props);
    this.background = background_image;
  }

  /* 
    handleFakeData() will be DEP once we get API calls
    use this.getFlight() below instead
  */
  componentDidMount = () => {
    this.handleFakeData();
    // this.getFlight();
  };

  // Remove post Dev
  handleFakeData() {
    let fakeData = {
      isReady: true,
      flightChars: "UA",
      flightNums: "949",
      arrivalIata: "SFO",
      departureIata: "LHR",
      arrAirportName: "San Francisco International",
      depAirportName: "Heathrow",
      arrCityName: "San Francisco",
      depCityName: "London",
      arrCityIata: "SFO",
      depCityIata: "LON",
      planeModel: "777",
      airlineName: "United Airlines",
      planeMake: "Boeing",
      distanceTraveled: 5000,
    };

    this.setState(fakeData);
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

  handleIsTwoWay() {
    if (this.state.isTwoWay) {
      this.setState({ isTwoWay: false });
    } else {
      this.setState({ isTwoWay: true });
    }
  }

  render() {
    const {
      isReady,
      flightChars,
      flightNums,
      isTwoWay,
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
              <View style={styles.flightView}>
                <Text style={styles.flightNumberLabel}>Flight Number</Text>
                <Text style={styles.flightNumberText}>
                  {flightChars}
                  {flightNums}
                </Text>
                <Text style={styles.flightInfoText}>
                  {depCityName} ({depCityIata}) to {arrCityName} ({arrCityIata})
                  via {airlineName}{" "}
                </Text>
              </View>

              {/* FLIGHT CONTEXT */}
              <View>
                {/* Arrival Departure  Airport Names*/}
                <View style={styles.itineraryView}>
                  <View style={styles.itineraryViewItem}>
                    <View>
                      <Text style={styles.itineraryLabel}>
                        {depAirportName}
                      </Text>
                    </View>
                  </View>

                  {/* <View style={styles.plane_icon_view}></View> */}

                  <View style={styles.itineraryViewItem}>
                    <View>
                      <Text style={styles.itineraryLabel}>
                        {arrAirportName}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Arrival Departure Airport Iata Codes*/}
                <View style={styles.itineraryView}>
                  <View style={styles.itineraryViewItem}>
                    <Text style={styles.itineraryAirportCode}>
                      {departureIata}
                    </Text>
                  </View>

                  <Ionicons name={"ios-airplane"} style={styles.plane_icon} />

                  <View style={styles.itineraryViewItem}>
                    <View>
                      <Text style={styles.itineraryAirportCode}>
                        {arrivalIata}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* One Way or Two Way*/}
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
                    onValueChange={() => this.handleIsTwoWay()}
                    value={this.state.isTwoWay}
                    thumbColor={COLORS.forestgreen}
                    ios_backgroundColor={COLORS.sandy}
                    style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
                  />
                </View>

                <View style={styles.seatIndexViewItem}>
                  <Text style={styles.seatIndexLabel}>Two Way</Text>
                </View>
              </View>

              {/* Tabs */}
              <View style={styles.tabView}>
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
              {/* Flight Distance */}
              <View style={styles.dataView}>
                <Text style={styles.label}>Distance</Text>
                <Text style={styles.dataText}>
                  {isTwoWay == true ? distanceTraveled * 2 : distanceTraveled}
                  <Text style={styles.unit_label}>{"km".toLowerCase()}</Text>
                </Text>
              </View>

              {/* Carbon Emissions */}
              <View style={styles.dataView}>
                <Text style={styles.label}>Carbon Emissions</Text>
                <Text style={styles.dataText}>
                  {isTwoWay == true ? carbonEmissions * 2 : carbonEmissions}
                  <Text style={styles.unit_label}>tons of CO2</Text>
                </Text>
              </View>

              {/* Proceed to Checkout */}
              <View>
                <TouchableOpacity
                  style={styles.submitButton}
                  disabled={this.state.isLoading}
                  onPress={() =>
                    this.props.navigation.navigate("CheckoutWithFlight", {
                      isTwoWay: isTwoWay,
                      depCityName: depCityName,
                      arrCityName: arrCityName,
                      distance: distanceTraveled,
                      footprint: carbonEmissions,
                      flightChars: flightChars,
                      flightNums: flightNums,
                    })
                  }>
                  <Text style={styles.submitLabel}>Plant Trees</Text>
                </TouchableOpacity>
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
    height: "100%",
    backgroundColor: COLORS.black,
  },
  backDrop: {
    height: "100%",
    backgroundColor: "transparent",
  },

  // Content Wrapper
  innerView: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    marginLeft: Math.round(moderateScale(105, 0.625)),
    marginRight: Math.round(moderateScale(20, 0.0625)),
    marginTop: Math.round(moderateScale(70, 0.25)),
    marginBottom: Math.round(moderateScale(40, 0.25)),
  },

  flightNumberLabel: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(14, 0.0625)),
  },
  flightNumberText: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins-bold",
    fontSize: Math.round(moderateScale(40, 0.0625)),
  },
  flightInfoText: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(14, 0.0625)),
  },

  // itinerary View
  itineraryView: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: Math.round(verticalScale(10)),
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

  // Tab Inner View
  tabView: {
    width: "100%",
    height: "5%",
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: COLORS.lightSandy,
    marginTop: Math.round(verticalScale(10)),
    marginBottom: Math.round(verticalScale(10)),
  },
  tabButtonActive: {
    flex: 1,
    paddingLeft: 7,
    height: "100%",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: COLORS.opaqueGreyForestGreen,
  },
  tabTextActive: {
    color: COLORS.forestgreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(12, 0.3)),
  },
  tabButtonInActive: {
    flex: 1,
    height: "100%",
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  tabTextInActive: {
    color: COLORS.opaqueForestGreen,
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(12, 0.3)),
  },

  // Bottom
  label: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(14, 0.0625)),
  },
  dataText: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(30, 0.0625)),
  },
  unit_label: {
    color: COLORS.lightSandy,
    fontFamily: "Poppins",
    fontSize: Math.round(moderateScale(14, 0.0625)),
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
    fontFamily: "Poppins-bold",
    padding: Math.round(moderateScale(10, 0.0125)),
  },
});
