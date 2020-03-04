import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'

import { FontAwesome, Feather } from '@expo/vector-icons';

import Dash from 'react-native-dash';

import COLORS from '../../../assets/Colors.js';

import Footer from '../Footer.js';

import Auth from '@aws-amplify/auth';

import * as Constants from '../../utilities/Constants.js'

export default class CheckoutWithoutFlightScreen extends React.Component {
  state = {
    isAuthenticated: 'false',
    data: [],
    treeNum: 0,
    total_cost: 0,
    color: COLORS.grey
  }

  componentDidMount = () => {
    this.checkAuth()
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

  // handle color variants
  colorVariant() {
    switch (this.state.treeNum) {
      case 0:
        return (COLORS.grey)
      case 1:
        return (COLORS.greygreen1)
      case 2:
        return (COLORS.greygreen2)
      case 3:
        return (COLORS.greygreen3)
      case 4:
        return (COLORS.greygreen4)
      default:
        return (COLORS.lightgreen)
    }
  }

  //handle checkout redirect
  handleCheckout() {
    if (this.state.treeNum != 0) {
      this.props.navigation.navigate('ReceiptWithoutFlight', {
        treeNum: this.state.treeNum,
        total_cost: this.state.total_cost,
      })
    }
  }

  // handle add
  handleAdd() {
    this.setState({
      treeNum: this.state.treeNum + 1,
      total_cost: this.state.total_cost + Constants.COST
    })
  }

  // handle remove
  handleRemove() {
    if (this.state.treeNum != 0) {
      this.setState({
        treeNum: this.state.treeNum - 1,
        total_cost: this.state.total_cost - Constants.COST
      })
    }
  }

  render() {
    const {
      treeNum,
      total_cost,
    } = this.state;

    const color = this.colorVariant()

    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.buttonBarNav}>
            {/*Navigation Buttons*/}
            <Feather style={styles.navigationIcon} name="home"
              onPress={() => this.props.navigation.navigate('Home')} />
            <FontAwesome style={styles.navigationIcon} name="user-circle-o"
              onPress={() => this.handleUserRedirect()} />
          </View>
          <View style={styles.topText}>
            {/*CO2 footprint*/}
            <Text style={styles.bigGreyText}></Text>
            <View style={styles.alignSubScript}>
              <Text style={styles.midGreyText}></Text>
              <Text style={{ fontSize: 10, lineHeight: 30, color: COLORS.darkgrey }}></Text>
            </View>
          </View>
          <View style={styles.iterateGroup}>
            {/*Subtract tree*/}
            <TouchableOpacity
              style={[styles.iterators, { backgroundColor: (this.state.treeNum == 0) ? COLORS.grey : COLORS.lightgreen }]}
              onPress={() => this.handleRemove()}>
              <Feather style={[styles.iteratorIcon, { color: (this.state.treeNum == 0) ? COLORS.white : COLORS.lightblue }]} name="minus" />
            </TouchableOpacity>
            {/*Tree counter*/}
            <View style={[styles.treeCounter, { backgroundColor: color }]}>
              <Text style={styles.treeCountText}>{treeNum}</Text>
            </View>
            {/*Add tree*/}
            <TouchableOpacity
              style={[styles.iterators, { backgroundColor: COLORS.lightgreen }]}
              onPress={() => this.handleAdd()}>
              <Feather style={[styles.iteratorIcon, { color: COLORS.lightblue }]} name="plus" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomText}>
            {/*Years to neutralize carbon footprint*/}
            <Text style={styles.midBlueText}></Text>
            <Text style={styles.bigBlueText}></Text>
          </View>
          <Dash style={styles.dashedLine} dashColor={COLORS.lightgrey} dashGap={5} />
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
            style={[styles.bottomGreenButton, { backgroundColor: (this.state.treeNum == 0) ? COLORS.grey : COLORS.lightgreen }]}
            onPress={() => this.handleCheckout()}>
            <Text style={styles.buttonText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
        <Footer color='white' navigation={this.props.navigation}/>
      </View>
    )
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    height: height,
    width: width
  },
  containerTop: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: height * 0.06,
    marginBottom: height * 0.10,
    backgroundColor: COLORS.white,
  },
  buttonBarNav: {
    flexDirection: 'row',
    height: height * 0.05,
    justifyContent: 'space-between',
    marginBottom: height * 0.05,
  },
  topText: {
    alignItems: 'center',
  },
  bottomText: {
    alignItems: 'center',
  },
  alignSubScript: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  midBlueText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: COLORS.lightblue,
    alignItems: 'center',
    lineHeight: 30
  },
  bigBlueText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 25,
    color: COLORS.lightblue,
    lineHeight: 30
  },
  midGreyText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: COLORS.darkgrey,
    lineHeight: 25
  },
  bigGreyText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 20,
    color: COLORS.darkgrey,
    lineHeight: 25
  },
  iterateGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.25,
  },
  iterators: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.10,
    aspectRatio: 1/1
  },
  iteratorIcon: {
    fontSize: 25,
  },
  treeCounter: {
    marginLeft: width * 0.20,
    marginRight: width * 0.20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.30,
    aspectRatio: 3/4,
    borderRadius: 25,
  },
  treeCountText: {
    fontFamily: 'Montserrat-bold',
    color: COLORS.white,
    fontSize: 50
  },
  receiptContainer: {
    marginBottom: height * 0.08
  },
  receiptTextLeft: {
    fontFamily: 'Montserrat',
    color: COLORS.darkgrey,
    fontSize: 12
  },
  receiptTextRight: {
    fontFamily: 'Montserrat-bold',
    color: COLORS.darkgrey,
    fontSize: 12
  },
  dashedLine: {
    width: '100%',
    height: 1,
    marginTop: height * 0.02,
    marginBottom: height * 0.02
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: COLORS.lightgreen,
    height: height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-bold',
    color: COLORS.darkgrey,
    fontSize: 12
  },
  navigationIcon: {
    color: COLORS.grey,
    fontSize: 30,
  },
});

