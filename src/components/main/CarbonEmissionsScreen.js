import React from 'react'

import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native'

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Dash from 'react-native-dash';

import Colors from '../../assets/Colors.js';

import Footer from '../utilities/Footer.js';

import Auth from '@aws-amplify/auth';

// cost per tree
const cost = 6;

export default class CarbonEmissionsScreen extends React.Component {
  state = {
    isAuthenticated: 'false',
    data: [],
    iata: '',
    treeNum: 0,
    total_cost: 0,
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
    })
    this.checkAuth()
    this.calcEmissions()
  }

  // Checks if a user is logged in
  async checkAuth() {
    await Auth.currentAuthenticatedUser({ bypassCache: true })
      .then(() => {
        console.log('A user is logged in')
        this.setState({ isAuthenticated: true })
      })
      .catch(err => {
        console.log('Nobody is logged in')
        this.setState({ isAuthenticated: false })
      })
  }

  // Sends user to sign up or dashboard depending on Auth state
  handleUserRedirect() {
    if (this.state.isAuthenticated) {
      this.props.navigation.navigate('UserDashboard')
    } else {
      this.props.navigation.navigate('SignIn')
    }
  }

  // handle add
  handleAdd() {
    this.setState({
      treeNum: this.state.treeNum + 1, 
      total_cost: this.state.total_cost + cost 
    })
  }

  // handle remove
  handleRemove() {
    if(this.state.treeNum != 0) {
      this.setState({
        treeNum: this.state.treeNum - 1, 
        total_cost: this.state.total_cost - cost 
      })
    }
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
      total_cost,
      years
    } = this.state;
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.semicontainer}>
          <View style={styles.topBar}>
            {/*Navigation Buttons*/}
            <Ionicons style={styles.navigationIcon} name="md-arrow-back" 
              onPress={() => this.props.navigation.goBack()} />
            <Text style={styles.midBlueText}>FLIGHT {flightChars} {flightNums}</Text>
            <FontAwesome style={styles.navigationIcon} name="user-circle-o"
                onPress={() => this.handleUserRedirect()} />
          </View>
          <View style={styles.topText}>
            {/*CO2 footprint*/}
            <Text style={styles.bigGreyText}>{footprint}</Text>
            <View style={styles.alignSubScript}>
              <Text style={styles.midGreyText}>METRIC TONS CO</Text>
              <Text style={{ fontSize: 10, lineHeight: 30, color: Colors.darkgrey }}>2</Text>
            </View>
          </View>
          <View style={styles.iterateGroup}>
            {/*Subtract tree*/}
            <TouchableOpacity 
              style={styles.iterators} 
              onPress={() => this.handleRemove()}>
              <Text>&#8722;</Text>
            </TouchableOpacity>
            {/*Tree counter*/}
            <View style={styles.treeCounter}>
              <Text style={styles.treeCountText}>{treeNum}</Text>
            </View>
            {/*Add tree*/}
            <TouchableOpacity 
              style={styles.iterators} 
              onPress={() => this.handleAdd()}>
              <Text>&#43;</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomText}>
            {/*Years to neutralize carbon footprint*/}
            <Text style={styles.midBlueText}>YEARS TO NEUTRALIZE</Text>
            {(years != Infinity) &&
              <Text style={styles.bigBlueText}>{years}</Text>
            }
            {(years == Infinity) &&
              <Text style={styles.bigBlueText}>&#x2014;</Text>
            }
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
              <Text style={styles.receiptTextRight}>${total_cost}</Text>
            </View>
          </View>
          {/*Navigate to checkout page*/}
          <TouchableOpacity 
            style={styles.bottomGreenButton}>
            <Text style={styles.buttonText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
        <Footer color='white' />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.97,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  semicontainer: {
    justifyContent: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    marginTop: '10%',
    paddingTop: '25%',
    paddingBottom: '5%',
    backgroundColor: Colors.white,
  },
  receiptContainer: {
    //  paddingRight: '5%',
  },
  topBar: {
    justifyContent: 'space-between',
    height: '10%',
    flexDirection: 'row',
    marginBottom: '5%',
    marginTop: '8%'
  },
  alignSubScript: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  midBlueText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: Colors.lightblue,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 30
  },
  bigBlueText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 25,
    color: Colors.lightblue,
    lineHeight: 30
  },
  midGreyText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: Colors.darkgrey,
    lineHeight: 25
  },
  bigGreyText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 20,
    color: Colors.darkgrey,
    lineHeight: 25
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: Colors.lightgreen,
    height: '13%',
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
    marginBottom: '5%'
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
    height: '40%',
    marginBottom: '3%'
  },
  iterators: {
    borderRadius: 5,
    backgroundColor: Colors.lightgreen,
    justifyContent: 'center',
    alignItems: 'center',
    height: '25%',
    width: '10%',
  },
  treeCounter: {
    marginLeft: '20%',
    marginRight: '20%',
    backgroundColor: Colors.darkgrey,
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    width: '30%',
    borderRadius: 25,
  },
  treeCountText: {
    fontFamily: 'Montserrat-bold',
    color: Colors.white,
    fontSize: 50
  },
  navigationIcon: {
    color: Colors.grey,
    fontSize: 30,
  },
});

