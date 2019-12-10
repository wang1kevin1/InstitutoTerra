import React, { Component } from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import Colors from "../utilities/Colors.js"

class CarbonFootprint extends Component {
   state = {
      iata: '',
      isLoading: true
   }
   componentDidMount = () => {
      fetch('http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIata=UA&flightnumber=510', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson[0]);
         this.setState({
            isLoading: false,
            data: responseJson[0],
            airlineIata: responseJson[0].airlineIata,
            arrivalIata: responseJson[0].arrivalIata,
            departureIata: responseJson[0].departureIata,
         })
         return [this.state.arrivalIata, this.state.departureIata]
      }).then((IataCodes) =>{
         this.getAirports(IataCodes);
      })
      .catch((error) => {
         console.error(error);
      });
   }

   getAirports(IataCode){
      let arrAirportCall = fetch(`https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${IataCode[0]}`);
      let arrCityCall = fetch(`https://aviation-edge.com/v2/public/cityDatabase?key=760fd0-cefe7a&codeIataCity=${IataCode[0]}`)
      let depAirportCall = fetch(`https://aviation-edge.com/v2/public/airportDatabase?key=760fd0-cefe7a&codeIataAirport=${IataCode[1]}`);
      let depCityCall = fetch(`https://aviation-edge.com/v2/public/cityDatabase?key=760fd0-cefe7a&codeIataCity=${IataCode[1]}`)

      Promise.all([arrAirportCall, depAirportCall,  arrCityCall, depCityCall])
         .then(values => Promise.all(values.map(value => value.json())))
         .then(response => {
            this.setState({
               arrCityIata: response[0][0].codeIataCity,
               arrCityName: response[2][0].nameCity,
               arrLat: response[0][0].latitudeAirport,
               arrLong: response[0][0].longitudeAirport,
               depCityIata: response[1][0].codeIataCity,
               depCityName: response[3][0].nameCity,
               depLat: response[1][0].latitudeAirport,
               depLong: response[1][0].longitudeAirport
            })
            console.log(response[2])
            console.log(this.state.arrCityName);
            console.log(this.state.depCityIata);
            this.getDistance();  
         });
   }
   toRad(x){
      let pi = Math.PI;
      return x * (pi/180);
     }
  getDistance(){
     let earthRad = 6731;
     let latDiff = this.toRad(this.state.arrLat - this.state.depLat);
     let longDiff = this.toRad(this.state.arrLong - this.state.depLong);
     let latArr  = this.state.arrLat;
     let latDep = this.state.depLat
     let a = Math.sin(latDiff/2) * Math.sin(latDiff/2) + Math.sin(longDiff/2)*Math.sin(longDiff/2) * Math.cos(latArr) * Math.cos(latDep);
     let c = 2 *  Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     let d =  Math.round(earthRad * c);
     console.log("should have distance here")
     console.log(d)
     this.setState({
        distanceTraveled: d,
     });
  }
  

   render() {
      return (
         <SafeAreaView>
            <View style={styles.container}>
               <View  height="15%">
                  <Text padding='10%'>
                     Flight Number: from {this.state.depCityName} to {this.state.arrCityName}
                  </Text>
                  <Text>
                     This trip was over {this.state.distanceTraveled} km
                  </Text>
               </View>
            </View>
         </SafeAreaView>
      )
   }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: Colors.white,
    }
});
export default CarbonFootprint
