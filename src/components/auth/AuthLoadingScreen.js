import React from 'react'

import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native'

import Colors from '../../utilities/Colors'

import Auth from '@aws-amplify/auth'

export default class AuthLoadingScreen extends React.Component {
  state = {
    userToken: null
  }
  async componentDidMount () {
    await this.loadApp()
  }

  // Get the logged in users and remember them
  loadApp = async () => {
    await Auth.currentAuthenticatedUser()
    .then(user => {
      this.setState({userToken: user.signInUserSession.accessToken.jwtToken})
    })
    .catch(err => console.log(err))
    this.props.navigation.navigate(this.state.userToken ? 'Dashboard' : 'Auth')
  }
  
  render() {
    return (
      <View style={styles.container}> 
        <ActivityIndicator size="large" color={Colors.lightblue} />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
})