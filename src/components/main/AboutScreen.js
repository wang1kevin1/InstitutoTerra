import React from 'react'

import {
  StyleSheet,
  View,
  Text,
} from 'react-native'

import COLORS from '../../assets/Colors.js'

export default class AboutScreen extends React.Component {
  state = {
    //static variables
  }

  constructor(props) {
    super(props)
    //things that run while screen is mounting (import images here)
  }

  componentDidMount = {
    //functions that run after screen is mounted
  }

  FooBarFunction() {
    //functions
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>about page</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center"
  }
})

