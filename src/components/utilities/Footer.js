import React from 'react'

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';

import Colors from '../../assets/Colors'

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
          <Text style={styles.footerTxtGreen}>made possible with</Text>
          <TouchableOpacity onPress={() => Alert.alert('About Section')}>
            <Image
              source={terra_whitetxt}
              style={{ width: 200, height: 20, marginTop: 9, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        </View >
      )
    }
    else {
      return (
        <View style={styles.footerWhite}>
          <Text style={styles.footerTxtWhite}>made possible with</Text>
          <TouchableOpacity onPress={() => Alert.alert('About Section')}>
            <Image
              source={terra_greentxt}
              style={{ width: 200, height: 20, marginTop: 9, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        </View >
      )
    }
  }
}

export default Footer

const styles = StyleSheet.create({
  footerWhite: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0,
    height: '15%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.lightgrey,
  },
  footerTxtWhite: {
    fontSize: 10,
    fontWeight: 'normal',
    color: Colors.black,
  },
  footerGreen: {
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0,
    height: '15%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.green,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.green,
  },
  footerTxtGreen: {
    fontSize: 10,
    fontWeight: 'normal',
    color: Colors.white,
  },
})