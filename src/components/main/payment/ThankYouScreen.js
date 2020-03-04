import * as React from 'react'

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Share
} from 'react-native'

import { FontAwesome, Feather } from '@expo/vector-icons';

import COLORS from '../../../assets/Colors.js';

import Footer from '../Footer.js';

import Auth from '@aws-amplify/auth';

const website = 'http://www.google.com/'

export default class ThankYouScreen extends React.Component {
  state = {
    isAuthenticated: 'false',

  }

  // load background
  constructor(props) {
    super(props)

    this.planet = require('../../../assets/planet.png')
    this.share = require('../../../assets/share.png')
  }

  componentDidMount = () => {
    this.setState({
      treeNum: this.props.navigation.getParam('treeNum', 'treeNum'),
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

  // Opens apps for users to share
  onShare = async () => {
    const message = 'I just donated ' + this.state.treeNum + ' tree(s)! You can too at ' + website + '!'
    try {
      const result = await Share.share({
        title: '#Refloresta',
        dialogTitle: '#Refloresta',
        subject: '#Refloresta',
        message: message
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Console.log(error.message);
    }
  };

  render() {
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
            <View style={styles.centerImage}>
              <Image 
                source={this.planet}
                style={styles.planetImage}
              />
              <Text style={styles.midGreenText}>Thank you!</Text>
            </View>
              <TouchableOpacity
                style={styles.bottomImage}
                onPress={() => this.onShare()}>
                <Image 
                  source={this.share}
                  style={styles.shareImage}
                />
                <Text style={styles.smallBlueText}>SHARE</Text>
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
  centerImage: {
    marginTop: height * 0.2,
    alignItems: 'center',
  },
  midGreenText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 16,
    color: COLORS.green,
  },
  bottomImage: {
    marginTop: height * 0.15,
    alignItems: 'center',
  },
  smallBlueText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 12,
    color: COLORS.lightblue,
  },
  navigationIcon: {
    color: COLORS.grey,
    fontSize: 30,
  },
  planetImage: {
    width: width * 0.4,
    aspectRatio: 1/1,
    resizeMode: 'contain'
  },
  shareImage: {
    width: width * 0.15,
    aspectRatio: 1/1,
    resizeMode: 'contain'
  }
});