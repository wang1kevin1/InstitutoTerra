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
              style={{ width: 151, height: 13, marginTop: 9, resizeMode: 'contain' }}
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
              style={{ width: 151, height: 13, marginTop: 9, resizeMode: 'contain' }}
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
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 30,
    justifyContent: 'flex-end',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderColor: Colors.lightgrey,
    borderBottomWidth: 0
  },
  footerTxtWhite: {
    fontSize: 10,
    fontWeight: 'normal',
    color: Colors.black,
  },
  footerGreen: {
    alignItems: 'center',
    backgroundColor: Colors.green,
    padding: 30,
    justifyContent: 'flex-end',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderColor: Colors.green,
    borderBottomWidth: 0
  },
  footerTxtGreen: {
    fontSize: 10,
    fontWeight: 'normal',
    color: Colors.white,
  },
})