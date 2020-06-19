import React from 'react'

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import COLORS from '../../assets/Colors.js'
import { Row } from 'native-base';
import { colors } from 'react-native-elements';
import i18n from 'i18n-js'
import { NavigationEvents } from 'react-navigation'
import Auth from '@aws-amplify/auth'


export default class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          color: '',
          isAuthenticated: false,
          error: false,
        }
      
       this.voltar = require('../../assets/voltar.png')
       this.inicio = require('../../assets/inicio.png')
       this.rfrt = require('../../assets/rfrt.png')
       this.login = require('../../assets/login.png')
       this.logo = require('../../assets/sidelogo.png')

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

    render() {
      return(
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.greenSpacer}/>
            <Image
              source = {this.rfrt}
              style = {styles.menurfrt} />
            <NavigationEvents onWillFocus={() => { this.checkAuth()}}/>
            {/* isAuthenticated: false */}
            { !this.state.isAuthenticated && 
              <TouchableOpacity activeOpacity={0.9}
                onPress={() => this.props.navigation.navigate('SignIn')}
                style = {styles.navstyle}>
                <View style={styles.iconContainer}>
                  <Image
                    source = {this.login}
                    style = {styles.login}/>
                  <Text style = {styles.menutext}>
                    login
                  </Text>
                </View>
              </TouchableOpacity>
            }
            {/* isAuthenticated: true */} 
            { this.state.isAuthenticated &&
              <TouchableOpacity activeOpacity={0.9}
                onPress={() => this.props.navigation.navigate('UserProfile')}
                style={styles.navstyle}>
                <View style={styles.iconContainer}>
                  <Image
                    source={this.login}
                    style={styles.login}/>
                  <Text style = {styles.menutext}>
                    profile
                  </Text>
                </View>
              </TouchableOpacity>
            }
            <TouchableOpacity activeOpacity = {0.9}>
              <View style = {styles.iconContainer}>
                <Image
                  source = {this.inicio}
                  style = {styles.house} />
                <Text style = {styles.menutext}>
                  início
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity = {0.9}>
            <View style={styles.iconContainer}>
            <Image
              source = {this.voltar}
              style = {styles.exit} />
            <Text style = {styles.menutext}>
              voltar
            </Text>
            </View>
            </TouchableOpacity>
          </View>
          <View style={styles.clearSpace}/>
          <View style={styles.bottomContainer}>
            <Image
            source = {this.logo}
            style = {styles.sidelogo}/>
          </View>
        </View>
      )
    }

}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create ({

    container: {
      position: 'absolute',
      left: 0,  
      bottom: 0,
      height: height,
      width: width * .25,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'column',
      backgroundColor: COLORS.forestgreen,

    },

    topContainer: {
      backgroundColor: 'transparent',
      flex: 2,
      flexDirection: 'column',
      width: width*.25,
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    clearSpace: {
      flex: 1,
      backgroundColor: 'transparent',
      width: width*.25,
    },

    bottomContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      height: height*.2,
      width: width*.25,
      flex: 1,
    },

    greenSpacer: {
      backgroundColor: COLORS.forestgreen,
      width: width*.25,
      height: height*.03
    },

    menurfrt: {
      width: width*.18,
      height: width*.32, 
      resizeMode: 'stretch',
      padding: width*.05
    },

    login: {
      width: width*.07,
      height: width*.07,
      resizeMode: 'stretch'
    },

    house: {
      width: width*.08,
      height: width*.07,
      resizeMode: 'stretch'
    },

    exit: {
      width: width*.07,
      height: width*.07,
      resizeMode: 'stretch'
    },

    menutext: {
      fontFamily: 'Poppins',
      color: COLORS.sandy
    },

    iconContainer: {
      width: width*.25,
      height: width*.12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },

    sidelogo: {
      width: width*.1,
      height: height*.2,
      resizeMode: 'contain'
    },

    navstyle: {
      flexDirection: 'column',
      alignItems: 'center'
    }

})