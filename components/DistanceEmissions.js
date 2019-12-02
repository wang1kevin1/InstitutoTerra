import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { ConsoleLogger } from '@aws-amplify/core'


class DistanceEmissions extends Component {
   state = {
      data: [],
      iata: ''
   }
   componentDidMount = () =>{
      this.setState({
         distance: this.getDistance(),
      })
      console.log("lats should be here")
      console.log(this.props.dLat)
   }

   getDistance = () =>{
     var x = this.props.dLong
     console.log(x)
     return x;
  }
   render() {
      return (
         <View style={styles.container}>
            <View  height="15%">
            <Text>
               {this.props.dLong}
            </Text>
            <Text>
               test
            </Text>
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
export default DistanceEmissions
