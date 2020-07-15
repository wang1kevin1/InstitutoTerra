import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import { verticalScale, moderateScale } from "react-native-size-matters";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import * as CONSTANTS from "../../utilities/Constants.js";
import COLORS from "../../../assets/Colors.js";
import Auth from "@aws-amplify/auth";
import MenuBar from "../MenuBar.js";
import i18n from "i18n-js";

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

  //Calculate emissions using distance and seat class
  calcEmissions() {
    let dist = this.state.distanceTraveled;
    let seat = this.state.distanceTraveled;
    console.log(seat);
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
        console.log("Economy Long");
        console.log(dist);
      }
      //Business Seat
      else if (this.state.seatIndex == "Business") {
        dist *= CONSTANTS.CARBON_MULTIPLIERS.long_business;
        console.log("Business Long");
        console.log(dist);
      }
      //First Class Seat
      else if (this.state.seatIndex == "First Class") {
        dist *= CONSTANTS.CARBON_MULTIPLIERS.long_first;
        console.log("First Class Long");
        console.log(dist);
      }
    }
    var emissions = Math.round(dist);
    emissions /= 1000;
    return emissions;
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

    const carbonEmissions = this.calcEmissions();

    return (
      <SafeAreaView style={styles.backDrop}>
        <View style={styles.innerView}>
          <View style={styles.topInnerView}>
            <Text>Hello</Text>
          </View>

          {/* Tabs */}
          <View style={styles.midInnerView}>
            {/* Economy */}
            <TouchableOpacity
              onPress={() => this.setState({ seatIndex: "Economy" })}>
              <Text>{"ECONOMY".toUpperCase()}</Text>
            </TouchableOpacity>

            {/* Bussiness */}
            <TouchableOpacity
              onPress={() => this.setState({ seatIndex: "Business" })}>
              <Text>{"Business".toUpperCase()}</Text>
            </TouchableOpacity>

            {/* First Class  */}
            <TouchableOpacity
              onPress={() => this.setState({ seatIndex: "First Class" })}>
              <Text>{"FIRSTCLASS".toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomInnerView}>
            <Text>Hello</Text>
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
    flex: 4 / 10,
    backgroundColor: "red",
  },
  midInnerView: {
    flex: 1 / 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderRadius: 10,
    backgroundColor: "blue",
  },
  bottomInnerView: {
    flex: 5 / 10,
    backgroundColor: "green",
  },
});
