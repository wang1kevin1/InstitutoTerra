  
import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'

import Colors from '../../utilities/Colors'

export default class HomeScreen extends React.Component {
  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          onPress={() => this.handleRoute('SignIn')}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => this.handleRoute('UserDashboard')}
          style={styles.buttonStyle}>
          <Text style={styles.textStyle}>User Dashboard</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    padding: 20,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff'
  }
})