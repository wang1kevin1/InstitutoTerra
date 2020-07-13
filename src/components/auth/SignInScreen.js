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
import { BorderlessButton } from 'react-native-gesture-handler';

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

  handleSignIn = () => {
    if((this.state.email.trim()=='') || (this.state.password.trim()==''))
      Alert.alert("One more fields are empty");
    else 
      this.signIn();
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
          <TouchableWithoutFeedback
            style={styles.container}
            onPress={Keyboard.dismiss}>
              <Container style={styles.infoContainer}>
                <View style={styles.container1}>
                  {/* Email */}
                  <Item style={styles.itemStyle}>
                    <Input
                      style={styles.input}
                      placeholder={"E-mail"}
                      placeholderTextColor={COLORS.forestgreen}
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
                    <Input
                      style={styles.input}
                      placeholder={"Senha"}
                      placeholderTextColor={COLORS.forestgreen}
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref='SecondInput'
                      onChangeText={value => this.onChangeText('password', value)}
                    />
                  </Item>
                  {/* Sign Up Text */}
                  <Text style={styles.buttonText2}>Novo usuário?{" "}
                    <Text 
                      onPress={() => this.props.navigation.navigate('SignUp')}
                      style={styles.buttonText2link}>Crie uma conta 
                    </Text>
                    {" "}»
                  </Text>
                  {/* Forgot Password Text */}
                  <Text style={styles.buttonText2}>Esqueceu sua senha?{" "}
                    <Text
                      onPress={() => this.props.navigation.navigate('ForgotPassword')}
                      style={styles.buttonText2link}>Recupere aqui
                    </Text>
                    {" "}»
                  </Text>
                  {/* Loading ActivityIndicator */}
                </View>  
                <KeyboardAvoidingView style={styles.container2} behavior='position' enabled>
                  {/* Sign In Button */}
                  <TouchableOpacity
                    onPress={()=>this.handleSignIn()}
                    disabled={this.state.isLoading}
                    style={styles.buttonStyle1}>
                  {!this.state.isLoading &&
                    <Text style={styles.buttonText1}>
                      Entrar
                    </Text>
                  }
                  {this.state.isLoading &&
                    <View>
                      <ActivityIndicator color={COLORS.sandy} size='large' animating={this.state.isLoading} />
                    </View>
                  }
                  </TouchableOpacity>
                </KeyboardAvoidingView>
              </Container>
          </TouchableWithoutFeedback>
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
    backgroundColor: COLORS.sandy,
    justifyContent: 'center',
    flexDirection: 'column',
  },

  container1: {
    flex: 2,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: 5,
  },

  container2: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },

  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'normal',
    color: COLORS.forestgreen,
  },

  infoContainer: {
    width: width*.75,
    position: 'absolute',
    left: width*.25,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  itemStyle: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderBottomColor: COLORS.forestgreen,
    borderBottomWidth: 1,
  },

  buttonStyle1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.forestgreen,
    width: width*.65,
    height: width*.2,
    borderRadius: 10,
    marginBottom: 30,
  },

  buttonText1: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: COLORS.white,
  },

  buttonText2: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.forestgreen,
    fontFamily: 'Poppins',
    marginBottom: 5,
  },

  buttonText2link: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: COLORS.forestgreen,
  }
})