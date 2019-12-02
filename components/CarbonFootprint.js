import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DistanceEmissions from './DistanceEmissions';


class CarbonFootprint extends Component {
   state = {
      data: [],
      iata: ''
   }
   componentDidMount = () => {
      fetch('http://aviation-edge.com/v2/public/flights?key=760fd0-cefe7a&flightIata=EK247', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson[0].arrival.iataCode);
         this.setState({
            isLoading: false,
            data: responseJson[0],
            aircraftIata: responseJson[0].aircraft.iataCode,
            arrivalIata: responseJson[0].arrival.iataCode,
            departureIata: responseJson[0].departure.iataCode,
         })
         return [responseJson[0].arrival.iataCode, responseJson[0].departure.iataCode]
      }).then((IataCode) =>{
         this.getArrivalAirport(IataCode[0]);
         this.getDepartureAirport(IataCode[1]);
      })
      .catch((error) => {
         console.error(error);
      });
      this.getDistance()
   }

   getArrivalAirport(aIataCode){
       fetch(`https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${aIataCode}`,{
           method: 'GET'
       })
       .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson[0].nameAirport);
         this.setState({
            destinationName: responseJson[0].nameAirport,
            destinationLat: responseJson[0].latitudeAirport,
            destinationLong: responseJson[0].longitudeAirport
         })
      })
      .catch((error) => {
         console.error(error);
      });
   }
   getDepartureAirport(dIataCode){
      fetch(`https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${dIataCode}`,{
          method: 'GET'
      })
      .then((response) => response.json())
     .then((responseJson) => {
        console.log(responseJson[0].nameAirport);
        this.setState({
           departureName: responseJson[0].nameAirport,
           departureLat: responseJson[0].latitudeAirport,
           departureLong: responseJson[0].longitudeAirport,
        })
     })
     .catch((error) => {
        console.error(error);
     });

  }
  getDistance(){
     let x = this.state.destinationLat
     console.log("should have lat here")
     console.log(this.state.destinationLat)
     this.setState({
        distanceTraveled: x,
     })
  }

   render() {
      return (
         <View style={styles.container}>
            <View  height="15%">
            <Text padding='10%'>
               {this.state.aircraftIata}
            </Text>
            <Text>
               {this.state.arrivalIata}
               {this.state.destinationName}
               {this.state.destinationLat}
               {this.state.departureName}
                
            </Text>
            <Text>
               {this.state.distanceTraveled}
            </Text>
            <DistanceEmissions
               dLat={this.state.departureLat}
               dLong={this.state.departureLong}
               aLat={this.state.destinationLat}
               aLong={this.state.destinationLong}
            />
            </View>
         </View>
      )
   }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      height:  '15%',
    }
});
export default CarbonFootprint
