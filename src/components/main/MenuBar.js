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

export default class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          color: '',
        }
    
    //  Require the pictures you will be using in the menuBar. assets not updated yet. 
    //   this.terra_green = require('../../assets/terra/terra-green.png')
    //   this.terra_white = require('../../assets/terra/terra-white.png')
    }

    

    render() {
      return(
        <View style={styles.container}>
          <View style={styles.topContainer}/>
          <View style={styles.clearSpace}/>
          <View style={styles.bottomContainer}/>
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
      backgroundColor: 'red',
      flex: 2,
      flexDirection: 'column',
      width: width*.25,
      opacity: .1,
    },

    clearSpace: {
      flex: 1,
      backgroundColor: 'yellow',
      width: width*.25,
      opacity: .1,
    },

    bottomContainer: {
      backgroundColor: 'blue',
      height: height*.2,
      width: width*.25,
      flex: 1,
      opacity: .1,
    }

})