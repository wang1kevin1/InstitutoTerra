import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'

import Colors from '../../assets/Colors'

export default class UserDashboardScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>UserDashboard</Text>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Settings')}
          style={styles.buttonStyle1}>
          <Text style={styles.buttonText1}>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('fInfo')}
          style={styles.buttonStyle1}>
          <Text style={styles.buttonText1}>
            Flight Info
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5059ae',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff'
  },
  buttonStyle1: {
    alignItems: 'center',
    backgroundColor: Colors.lightblue,
    padding: 14,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
})
