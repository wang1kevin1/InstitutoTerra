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

export default class CarbonEmissionsScreen extends React.Component {
  state = {
    data: [],
    iata: '',
    treeNum: 1,
    cost: 1.50,
  }

  //load fonts
  _cacheResourcesAsync = () => {
    return Font.loadAsync({
      'Montserrat': require('../../assets/fonts/Montserrat-Regular.ttf'),
      'Montserrat-bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
    });
  }

  componentDidMount = () => {
    //set state parameters
    this.setState({
      distance: this.props.navigation.getParam('distance', 'distanceTraveled'),
      planeMake: this.props.navigation.getParam('planeMake', 'Make'),
      planeModel: this.props.navigation.getParam('planeModel', 'Model'),
      seatState: this.props.navigation.getParam('seatState', 'state'),
      flightChars: this.props.navigation.getParam('flightChars', 'chars'),
      flightNums: this.props.navigation.getParam('flightNums', 'nums'),
      cost: this.state.treeNum * 1.50
    })
    this.calcEmissions();
  }

  //Calculate emissions using distance and seat class
  //Calculate years to neutralize emission footprint
  calcEmissions() {
    let temp = this.props.navigation.getParam('distance', 'distanceTraveled');
    tempD = Math.round(temp);
    tempF = tempD / 1000;
    tempY = Math.round(tempF * 5 / this.state.treeNum);
    this.setState({
      footprint: tempF,
      years: tempY
    })
  }

  render() {
    const {
      flightChars,
      flightNums,
      treeNum,
      footprint,
      cost,
      years
    } = this.state;

    this._cacheResourcesAsync
    
    return (
      <SafeAreaView style={styles.containerTop}>
        <View style={styles.semicontainer}>
          <View style={styles.topBar}>
            <TouchableOpacity>
              <Text>&#8592;</Text>
            </TouchableOpacity>
            {/*Flight number*/}
            <Text style={styles.midBlueText}>FLIGHT {flightChars} {flightNums}</Text>
            {/*Sign-inbutton*/}
            <TouchableOpacity 
              style={styles.buttonSignIn} 
              onPress={() => this.props.navigation.navigate('SignIn')}>
            </TouchableOpacity>
          </View>
          <View style={styles.topText}>
            {/*CO2 footprint*/}
            <Text style={styles.bigGreyText}>{footprint}</Text>
            <View style={styles.alignSubScript}>
              <Text style={styles.midGreyText}>METRIC TONS CO</Text>
              <Text style={{ fontSize: 10, lineHeight: 37, color: Colors.darkgrey }}>2</Text>
            </View>
          </View>
          <View style={styles.iterateGroup}>
            {/*Subtract tree*/}
            <TouchableOpacity 
              style={styles.iterators} 
              onPress={() => this.setState({ treeNum: this.state.treeNum - 1, cost: this.state.cost - 1.50 })}>
              <Text>&#8722;</Text>
            </TouchableOpacity>
            {/*Tree counter*/}
            <View style={styles.treeCounter}>
              <Text style={styles.treeCountText}>{treeNum}</Text>
            </View>
            {/*Add tree*/}
            <TouchableOpacity 
              style={styles.iterators} 
              onPress={() => this.setState({ treeNum: this.state.treeNum + 1, cost: this.state.cost + 1.50 })}>
              <Text>&#43;</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomText}>
            {/*Years to neutralize carbon footprint*/}
            <Text style={styles.midBlueText}>YEARS TO NEUTRALIZE</Text>
            <Text style={styles.bigBlueText}>{years}</Text>
          </View>
          <Dash style={styles.dashedLine} dashColor={Colors.lightgrey} dashGap={5} />
          <View style={styles.receiptContainer}>
            <View style={styles.textRow}>
              {/*Total trees donated in transaction*/}
              <Text style={styles.receiptTextLeft}>TOTAL TREES:</Text>
              <Text style={styles.receiptTextRight}>{treeNum}</Text>
            </View>
            <View style={styles.textRow}>
              {/*Cost of transaction*/}
              <Text style={styles.receiptTextLeft}>PRICE:</Text>
              <Text style={styles.receiptTextRight}>{cost}</Text>
            </View>
          </View>
          {/*Navigate to checkout page*/}
          <TouchableOpacity 
            style={styles.bottomGreenButton}>
            <Text style={styles.buttonText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  containerTop: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Colors.lightgreen,
  },
  semicontainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flex: 1,
    marginTop: '10%',
    paddingTop: '5%',
    paddingBottom: '15%',
    backgroundColor: Colors.white,
  },
  receiptContainer: {
    //  paddingRight: '5%',
  },
  topBar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '20%'
  },
  alignSubScript: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  midBlueText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: Colors.lightblue,
    justifyContent: 'center',
    alignItems: 'center',
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
  bigGreyText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 30,
    color: Colors.darkgrey
  },
  bottomGreenButton: {
    borderRadius: 5,
    backgroundColor: Colors.lightgreen,
    height: '40%',
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
    marginTop: '20%',
    marginBottom: '10%'
  },
  topText: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  bottomText: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  iterateGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginBottom: '25%'
  },
  iterators: {
    width: '3%',
    borderRadius: 5,
    backgroundColor: Colors.lightgreen,
    justifyContent: 'center',
    alignItems: 'center',
    height: '20%',
    width: '10%',
  },
  treeCounter: {
    marginLeft: '20%',
    marginRight: '20%',
    backgroundColor: Colors.darkgrey,
    justifyContent: 'center',
    alignItems: 'center',
    height: '95%',
    width: '30%',
    borderRadius: 25
  },
  treeCountText: {
    fontFamily: 'Montserrat-bold',
    color: Colors.white,
    fontSize: 50
  },
  buttonSignIn: {
    backgroundColor: Colors.darkgrey,
    height: 40,
    width: 40,
    borderRadius: 120,
    borderColor: Colors.lightgreen,
    borderWidth: 2,
  },
});

