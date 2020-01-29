import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native'

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Dash from 'react-native-dash';

import Colors from '../../../assets/Colors.js';

import Footer from '../../utilities/Footer.js';

import Auth from '@aws-amplify/auth';

export default class ReceiptWithoutFlightScreen extends React.Component {
  state = {
    isAuthenticated: 'false',
    data: [],
  }

  componentDidMount = () => {
    //set state parameters
    this.setState({
      treeNum: this.props.navigation.getParam('treeNum', 'treeNum'),
      total_cost: this.props.navigation.getParam('total_cost', 'total_cost'),
    })
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

  render() {
    const {
      treeNum,
      total_cost,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.buttonBarNav}>
            {/*Navigation Buttons*/}
            <Ionicons style={styles.navigationIcon} name="md-arrow-back"
              onPress={() => this.props.navigation.goBack()} />
            <FontAwesome style={styles.navigationIcon} name="user-circle-o"
              onPress={() => this.handleUserRedirect()} />
          </View>
          <View style={styles.receiptContainer}>
            <View style={styles.textRow}>
              {/*Total trees donated in transaction*/}
              <Text style={styles.receiptTextLeft}>TOTAL TREES</Text>
              <Text style={styles.receiptTextRight}>{treeNum}</Text>
            </View>
            <Dash style={styles.dashedLine} dashColor={Colors.lightgrey} dashGap={0} />
            <View style={styles.textRow}>
              {/*Cost of transaction*/}
              <Text style={styles.receiptTextLeft}>PRICE</Text>
              <Text style={styles.receiptTextRight}>${total_cost}</Text>
            </View>
          </View>
          {/*Navigate to checkout page*/}
          <TouchableOpacity
            style={styles.bottomGreenButton}
            onPress={() => this.props.navigation.navigate('AndroidPay')}>
            <View style={styles.alignText}>
              <Text style={styles.buttonText}>PAY WITH </Text>
              <Text style={styles.stripeText}> stripe</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Footer color='white' />
      </View>
    )
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: height,
    width: width,
    backgroundColor: Colors.white,
  },
  containerTop: {
    paddingLeft: width * 0.05,
    paddingRight: width * 0.05,
    paddingTop: height * 0.06,
    marginBottom: height * 0.10,
    backgroundColor: Colors.white,
  },
  buttonBarNav: {
    flexDirection: 'row',
    height: height * 0.05,
    justifyContent: 'space-between',
  },
  flightBlueText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: Colors.lightblue,
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 30
  },
  receiptContainer: {
    paddingTop: height * 0.20,
    paddingBottom: height * 0.325,
    justifyContent: 'center',
  },
  dashedLine: {
    width: '100%',
    height: 1,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
    marginBottom: height * 0.02
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
  alignText: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomGreenButton: {
    borderRadius: 10,
    backgroundColor: Colors.lightgreen,
    height: height * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-bold',
    color: Colors.darkgrey,
    fontSize: 12
  },
  stripeText: {
    fontFamily: 'Fago-black',
    color: Colors.darkgrey,
    fontSize: 18,
    lineHeight: 18
  },
  navigationIcon: {
    color: Colors.grey,
    fontSize: 30,
  },
});
