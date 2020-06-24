import React from 'react'

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons'

import COLORS from '../../assets/Colors.js'

import Auth from '@aws-amplify/auth'

import MenuBar from '../main/MenuBar'

import i18n from 'i18n-js'

export default class SignInScreen extends React.Component {
  state = {
    email: '',
    password: '',
    isLoading: false,
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Sign in users with Auth
  async signIn() {
    const { email, password } = this.state
    Keyboard.dismiss()
    this.setState({ isLoading: true })
    await Auth.signIn(email, password)
      .then(user => {
        this.setState({ user })
        this.setState({ isLoading: false })
        this.props.navigation.navigate('Home')
      })
      .catch(err => {
        this.setState({ isLoading: false })
        if (!err.message) {
          console.log('Error when signing in: ', err)
          Alert.alert(i18n.t('Error when signing in: '), err)
        } else {
          console.log('Error when signing in: ', err.message)
          Alert.alert(i18n.t('Error when signing in: '), err.message)
        }
      })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}>
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  {/* Email */}
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle} name="ios-mail" />
                    <Input
                      style={styles.input}
                      placeholder={i18n.t('Email')}
                      placeholderTextColor={COLORS.lightblue}
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      keyboardType={'email-address'}
                      onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                      onChangeText={value => this.onChangeText('email', value)}
                    />
                  </Item>
                  {/* Password */}
                  <Item style={styles.itemStyle}>
                    <Ionicons style={styles.iconStyle} name="ios-lock" />
                    <Input
                      style={styles.input}
                      placeholder={i18n.t('Password')}
                      placeholderTextColor={COLORS.lightblue}
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref='SecondInput'
                      onChangeText={value => this.onChangeText('password', value)}
                    />
                  </Item>
                  {/* Sign In Button */}
                  <TouchableOpacity
                    onPress={() => this.signIn()}
                    disabled={this.state.isLoading}
                    style={styles.buttonStyle1}>
                    <Text style={styles.buttonText1}>
                      {i18n.t('Sign In')}
                    </Text>
                  </TouchableOpacity>
                  {/* Sign Up Text */}
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    style={styles.buttonStyle2}>
                    <Text style={styles.buttonText2}>
                      {i18n.t('New User? Create an Account!')}
                    </Text>
                  </TouchableOpacity>
                  {/* Forgot Password Text */}
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('ForgotPassword')}
                    style={styles.buttonStyle2}>
                    <Text style={styles.buttonText2}>
                      {i18n.t('Forgot Password?')}
                    </Text>
                  </TouchableOpacity>
                  {/* Loading ActivityIndicator */}
                  {this.state.isLoading &&
                    <View>
                      <ActivityIndicator color={COLORS.lightblue} size='large' animating={this.state.isLoading} />
                    </View>
                  }
                </View>
              </Container>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <MenuBar navigation = {this.props.navigation}/>
      </SafeAreaView>
    )
  }
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({

  backgroundContainer: {
    width: width,
    height: height,
    backgroundColor: COLORS.sandy,
    justifyContent: 'flex-end'
  },

  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.lightblue,
  },
  infoContainer: {
    width: width*.75,
    position: 'absolute',
    left: width*.25,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'yellow',
  },
  itemStyle: {
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderColor: 'transparent'
  },
  iconStyle: {
    color: COLORS.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
    flex: 0.1
  },
  buttonStyle1: {
    alignItems: 'center',
    backgroundColor: COLORS.forestgreen,
    padding: 14,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  buttonStyle2: {
    alignItems: 'center',
    backgroundColor: COLORS.lightgreen,
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText2: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.lightblue,
  },
})