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

import { API } from 'aws-amplify'

import i18n from 'i18n-js'

import * as Constants from '../../utilities/Constants.js'

export default class ThankYouScreen extends React.Component {
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

  state = {
    isAuthenticated: 'false',
  }

  // Sends user to sign up or dashboard depending on Auth state
  handleUserRedirect() {
    if (this.state.isAuthenticated) {
      this.props.navigation.navigate('UserDashboard')
    } else {
      this.props.navigation.navigate('SignIn')
    }
  }

  // Checks if a user is logged in
  async checkAuth() {
    await Auth.currentAuthenticatedUser({ bypassCache: true })
      .then(user => {
        console.log('A user is logged in')
        this.setState(user)
        this.setState({ UserId: user.attributes.sub })
        this.setState({ isAuthenticated: true })
        this.getUserTrees()
      })
      .catch(err => {
        console.log('Nobody is logged in')
        this.setState({ isAuthenticated: false })
      })
  }

  // gets a user's tree count
  async getUserTrees() {
    const path = "/Users/object/" + this.state.UserId;

    await API.get("ZeroCarbonREST", path)
      .then(apiResponse => {
        this.setState({ apiResponse })
        console.log("response from getting user: " + apiResponse);
        this.setState({ TreesPlanted: apiResponse.TreesPlanted + this.state.treeNum})
        console.log(this.state.TreesPlanted)
        this.updateUserTrees()
      })
      .catch(e => {
        console.log(e);
      })
    }

  // updates a user's tree count
  async updateUserTrees() {
    let newUser = {
      body: {
        "UserId": this.state.UserId,
        "TreesPlanted": this.state.TreesPlanted,
      }
    }
    
    const path = "/Users";

    await API.put("ZeroCarbonREST", path, newUser)
      .then(apiResponse => {
        this.setState({apiResponse});
        console.log("Response from saving user: " + apiResponse);
      })
      .catch(e => {
      console.log(e);
    })
  }

  // Opens apps for users to share
  onShare = async () => {
    const message = 'I just donated ' + this.state.treeNum + ' tree(s)! You can too at ' + Constants.WEBSITE + '!'
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
  }

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
              <Text style={styles.midGreenText}>{i18n.t('Thank you!')}</Text>
            </View>
              <TouchableOpacity
                style={styles.bottomImage}
                onPress={() => this.onShare()}>
                <Image 
                  source={this.share}
                  style={styles.shareImage}
                />
                <Text style={styles.smallBlueText}>{i18n.t('SHARE')}</Text>
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