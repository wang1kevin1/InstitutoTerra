import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Dash from 'react-native-dash';

import COLORS from '../../../assets/Colors.js';

import MenuBar from '../MenuBar.js';

import Auth from '@aws-amplify/auth';

import i18n from 'i18n-js'

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

  // Sends user to sign up or profile depending on Auth state
  handleUserRedirect() {
    if (this.state.isAuthenticated) {
      this.props.navigation.navigate('UserProfile')
    } else {
      this.props.navigation.navigate('SignIn')
    }
  }

  handleStripePayment() {
    this.props.navigation.navigate('Payment', {
      treeNum: this.state.treeNum,
    })
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
              <Text style={styles.receiptTextLeft}>{i18n.t('TOTAL TREES')}</Text>
              <Text style={styles.receiptTextRight}>{treeNum}</Text>
            </View>
            <Dash style={styles.dashedLine} dashColor={COLORS.lightgrey} dashGap={0} />
            <View style={styles.textRow}>
              {/*Cost of transaction*/}
              <Text style={styles.receiptTextLeft}>{i18n.t('PRICE')}</Text>
              <Text style={styles.receiptTextRight}>${total_cost}</Text>
            </View>
          </View>
          {/*Navigate to checkout page*/}
          <TouchableOpacity
            style={styles.bottomGreenButton}
            onPress={() => this.handleStripePayment()}>
            <View style={styles.alignText}>
              <Text style={styles.buttonText}>{i18n.t('PAY WITH')} </Text>
              <Text style={styles.stripeText}> stripe</Text>
            </View>
          </TouchableOpacity>
        </View>
        <MenuBar navigation={this.props.navigation}/>
      </View>
    )
  }
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: height,
    width: width,
    backgroundColor: COLORS.white,
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
  },
  flightBlueText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: COLORS.lightblue,
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
    color: COLORS.darkgrey,
    fontSize: 12
  },
  receiptTextRight: {
    fontFamily: 'Montserrat-bold',
    color: COLORS.darkgrey,
    fontSize: 12
  },
  alignText: {
    justifyContent: 'center',
    flexDirection: 'row',
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
  stripeText: {
    fontFamily: 'Fago-black',
    color: COLORS.darkgrey,
    fontSize: 18,
    lineHeight: 18
  },
  navigationIcon: {
    color: COLORS.grey,
    fontSize: 30,
  },
});
