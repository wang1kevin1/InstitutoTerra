import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native'

import { AppLoading } from 'expo';

import Dash from 'react-native-dash';

import * as Font from 'expo-font';

import Colors from "../../assets/Colors.js"

console.log(process.env.REACT_APP_API_KEY)

export default class FlightInfoScreen extends React.Component {
  state = {
    iata: '',
    isLoading: true,
    isReady: false,
    seatIndex: 'Economy',
    tripIndex: 1,
  }

  /*Load fonts*/
  _cacheResourcesAsync = () => {
    return Font.loadAsync({
      'Montserrat': require('../../assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
    });
  }

  componentDidMount = () => {
    this.getFlight()
  }

  /* Fetch route data using flight number*/
  getFlight() {
    let chars = this.props.navigation.getParam('flightNum', 'numCode').slice(0, 2).toUpperCase();
    let nums = this.props.navigation.getParam('flightNum', 'numCode').slice(2).toUpperCase();
    fetch(`http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIata=${chars}&flightnumber=${nums}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson[0],
          airlineIata: responseJson[0].airlineIata,
          arrivalIata: responseJson[0].arrivalIata,
          departureIata: responseJson[0].departureIata,
          planeReg: responseJson[0].regNumber[0],
          flightChars: chars,
          flightNums: nums,
        })
        return [this.state.arrivalIata, this.state.departureIata, this.state.planeReg, this.state.airlineIata]
      }).then((Codes) => {
        this.getPortsPlanes(Codes);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Fetch departure/arrival airports, airline, and airplane information */
  getPortsPlanes(Codes) {
    let arrAirportCall = fetch(`https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${Codes[0]}`);
    let depAirportCall = fetch(`https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${Codes[1]}`);
    let planeCall = fetch(`https://aviation-edge.com/v2/public/airplaneDatabase?key=760fd0-cefe7a&numberRegistration=${Codes[2]}`);
    let airlineCall = fetch(`https://aviation-edge.com/v2/public/airlineDatabase?key=760fd0-cefe7a&codeIataAirline=${Codes[3]}`)
    Promise.all([arrAirportCall, depAirportCall, planeCall, airlineCall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(response => {
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
        })
        console.log(this.state.planeMake);
        this.getDistance();
        return [this.state.arrCityIata, this.state.depCityIata]
      }).then((IataCodes) => {
        this.getCities(IataCodes);
      }).catch((error) => {
        console.error(error);
      });
  }

  /* Fetch arrival/departure city information */
  getCities(IataCodes) {
    let arrCityCall = fetch(`https://aviation-edge.com/v2/public/cityDatabase?key=760fd0-cefe7a&codeIataCity=${IataCodes[0]}`)
    let depCityCall = fetch(`https://aviation-edge.com/v2/public/cityDatabase?key=760fd0-cefe7a&codeIataCity=${IataCodes[1]}`)
    Promise.all([arrCityCall, depCityCall])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(response => {
        this.setState({
          arrCityName: response[0][0].nameCity,
          depCityName: response[1][0].nameCity,
          isReady: true,
        })
      }).catch((error) => {
        console.error(error);
      });
  }

  /* Calculate distance between arrival and departure airports */
  getDistance() {
    let earthRad = 6731;
    let latDiff = (this.state.arrLat - this.state.depLat) * Math.PI / 180;
    let longDiff = (this.state.arrLong - this.state.depLong) * Math.PI / 180;

    let latArr = this.state.arrLat * Math.PI / 180;
    let latDep = this.state.depLat * Math.PI / 180;
    let a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.sin(longDiff / 2) * Math.sin(longDiff / 2) * Math.cos(latArr) * Math.cos(latDep);
    console.log(a);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log(c);
    let d = earthRad * c;
    d = d.toFixed(2);
    console.log("should have distance here")
    console.log(d)
    this.setState({
      distanceTraveled: d,
    });
  }

  render() {
    const {
      isReady,
      flightChars,
      flightNums,
      arrCityName,
      depCityName,
      arrCityIata,
      depCityIata,
      planeModel,
      airlineName,
      planeMake,
      distanceTraveled,
      seatIndex
    } = this.state;

    if (!isReady)
      return (
        /*Loading view*/
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isLoading: false })}
          onError={console.warn}
        />
      )
    return (
      <SafeAreaView style={styles.containerTop}>
          <View style={styles.buttonBarTop}>
            {/*Route Option Buttons*/}
            <TouchableOpacity 
              style={styles.leftGreenButton} 
              onPress={() => this.setState({ tripIndex: 1 })}>
              <Text style={styles.buttonText}>ONE WAY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightGreenButtton} onPress={() => this.setState({ tripIndex: 2 })}>
              <Text style={styles.buttonText}>ROUNDTRIP</Text>
            </TouchableOpacity>
          </View>
          {/*Flight Number*/}
          <Text style={styles.smallBlueText}>FLIGHT NUMBER:</Text>
          <Text style={styles.bigBlueText}>{flightChars} {flightNums}</Text>
          <View style={styles.planeInfoText}>
            {/*Departure and arrival city & IATA*/}
            <Text style={styles.midGreyText}>{depCityName}({depCityIata}) to {arrCityName}({arrCityIata}) </Text>
            <Text style={styles.midGreyText}>via {airlineName} {planeMake} {planeModel}</Text>
          </View>
          <View style={styles.buttonBarBottom}>
            {/*Seat class selector*/}
            <TouchableOpacity style={styles.leftGreenButton} onPress={() => this.setState({ seatIndex: 'Economy' })}>
              <Text style={styles.buttonText}>ECONOMY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.middleGreenButtton} onPress={() => this.setState({ seatIndex: 'Business' })}>
              <Text style={styles.buttonText}>BUSINESS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightGreenButtton} onPress={() => this.setState({ seatIndex: 'First Class' })}>
              <Text style={styles.buttonText}>FIRST CLASS</Text>
            </TouchableOpacity>
          </View>
          <Dash style={styles.dashedLine} dashColor={Colors.lightgrey} dashGap={5} />
          <View style={styles.receiptContainer}>
            {/*More flight information*/}
            <View style={styles.textRow}>
              <Text style={styles.receiptTextLeft}>FLIGHT:</Text>
              {/*Arrival to Departure*/}
              <Text style={styles.receiptTextRight}>{depCityName} &#8594; {arrCityName}</Text>
            </View>
            <View style={styles.textRow}>
              <Text style={styles.receiptTextLeft}>DISTANCE:</Text>
              {/*Distance of flight*/}
              <Text style={styles.receiptTextRight}>{distanceTraveled} km</Text>
            </View>
            <View style={styles.textRow}>
              <Text style={styles.receiptTextLeft}>AIRPLANE:</Text>
              {/*Type of plane*/}
              <Text style={styles.receiptTextRight}>{planeMake} {planeModel}</Text>
            </View>
            <View style={styles.textRow}>
              <Text style={styles.receiptTextLeft}>CLASS:</Text>
              {/*Class of seat*/}
              <Text style={styles.receiptTextRight}>{seatIndex}</Text>
            </View>
          </View>
          {/*Navigate to next screen*/}
          <TouchableOpacity
            style={styles.bottomGreenButton}
            onPress={() => this.props.navigation.navigate('CarbonEmissions', {
              distance: distanceTraveled,
              planeMake: planeMake,
              planeModel: planeModel,
              seatState: seatIndex,
              flightChars: flightChars,
              flightNums: flightNums,
            })}>
            <Text style={styles.buttonText}>CALCULATE CARBON EMMISSIONS</Text>
          </TouchableOpacity>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  containerTop: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    flex: 1,
    marginTop: '10%',
    paddingTop: '25%',
    paddingBottom: '15%',
    backgroundColor: Colors.white,
  },
  containerBottom: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  receiptContainer: {
    //  paddingRight: '5%',
  },

  planeInfoText: {
    paddingTop: '0%',
    paddingBottom: '3%',
  },
  smallBlueText: {
    marginTop: '5%',
    fontFamily: 'Montserrat',
    fontSize: 12,
    color: Colors.lightblue,
  },
  bigBlueText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 30,
    color: Colors.lightblue
  },
  midGreyText: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    color: Colors.darkgrey,
  },
  buttonBarTop: {
    flexDirection: 'row',
    height: '8%',
    justifyContent: 'center',
    width: '50%',
    marginTop: '3%'
  },
  buttonBarBottom: {
    flexDirection: 'row',
    height: '8%',
    justifyContent: 'center',
    marginTop: '3%',
  },
  leftGreenButton: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    marginRight: 3,
    backgroundColor: Colors.lightgreen,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleGreenButtton: {
    backgroundColor: Colors.lightgreen,
    marginRight: 3,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightGreenButtton: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: Colors.lightgreen,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: Colors.lightgreen,
    height: '16%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-bold',
    color: Colors.darkgrey,
    fontSize: 12
  },
  receiptTextLeft: {
    fontFamily: 'Montserrat',
    color: Colors.darkgrey,
    fontSize: 12
  },
  receiptTextRight: {
    fontFamily: 'Montserrat-bold',
    color: Colors.darkgrey,
    fontSize: 12
  },
  dashedLine: {
    width: '100%',
    height: 1,
    marginTop: '10%',
    marginBottom: '10%'
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
  }
});