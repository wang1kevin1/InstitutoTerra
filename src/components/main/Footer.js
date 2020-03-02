import React from 'react'

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';

import COLORS from '../../assets/Colors.js'

import i18n from 'i18n-js'

const terra_greentxt = require('../../assets/footer/terra-green.png')

const terra_whitetxt = require('../../assets/footer/terra-white.png')

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
    };
  }

  render() {
    if (this.props.color == 'green') {
      return (
        <View style={styles.footerGreen}>
          <Text style={styles.footerTxtGreen}>{i18n.t('made possible with')}</Text>
          <TouchableOpacity onPress={() => Alert.alert('About Section')}>
            <Image
              source={terra_whitetxt}
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
          <TouchableOpacity onPress={() => Alert.alert('About Section')}>
            <Image
              source={terra_greentxt}
              style={styles.image}
            />
          </TouchableOpacity>
        </View >
      )
    }
  }
}

export default Footer

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