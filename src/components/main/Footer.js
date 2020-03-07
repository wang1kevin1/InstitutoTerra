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

import i18n from 'i18n-js'

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      color: '',
    }

    this.terra_green = require('../../assets/terra/terra-green.png')
    this.terra_white = require('../../assets/terra/terra-white.png')
  }

  handleNavigation() {
    if (this.props.color == 'green') {
      this.props.navigation.navigate('About', {
        color: 'green',
      })
    } else {
      this.props.navigation.navigate('About', {
        color: 'black',
      })
    }
  }

  render() {
    if (this.props.color == 'green') {
      console.log(this.props)
      return (
        <View style={styles.footerGreen}>
          <Text style={styles.footerTxtGreen}>{i18n.t('made possible with')}</Text>
          <TouchableOpacity 
            onPress={() => this.handleNavigation()}>
            <Image
              source={this.terra_green}
              style={styles.image}
            />
          </TouchableOpacity>
        </View >
      )
    }
    else {
      return (
        <View style={styles.footerWhite}>
          <Text style={styles.footerTxtWhite}>{i18n.t('made possible with')}</Text>
          <TouchableOpacity
            onPress={() => this.handleNavigation()}>
            <Image
              source={this.terra_white}
              style={styles.image}
            />
          </TouchableOpacity>
        </View >
      )
    }
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  footerWhite: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0,
    height: height * 0.14,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.lightgrey,
  },
  footerTxtWhite: {
    fontSize: 10,
    fontWeight: 'normal',
    color: COLORS.black,
  },
  footerGreen: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0,
    height: height * 0.14,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: COLORS.green,
  },
  footerTxtGreen: {
    fontSize: 10,
    fontWeight: 'normal',
    color: COLORS.white,
  },
  image: {
    width: width * 0.5,
    height: height * 0.05, 
    marginTop: '1%', 
    resizeMode: 'contain' 
  }
})