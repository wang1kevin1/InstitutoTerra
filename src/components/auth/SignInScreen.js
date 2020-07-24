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
  Input,
  Row
} from 'native-base'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import COLORS from '../../assets/Colors.js'

import Auth from '@aws-amplify/auth'

import MenuBar from '../main/MenuBar'

import i18n from 'i18n-js'

import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

import { Header } from 'react-native/Libraries/NewAppScreen'

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
    if ((this.state.email.trim() == '') || (this.state.password.trim() == ''))
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
        <View style={styles.container}>
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={Keyboard.dismiss}>
          <View style={styles.container}>
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
                  onPress={() => this.props.navigation.navigate('SignUp')}>
                  <Text
                    style={styles.buttonText2link}>Crie uma conta{" "}
                  </Text>
                  <MaterialCommunityIcons
                    color={COLORS.forestgreen}
                    name='chevron-double-right'
                    />
                </Text>
                {" "}
              </Text>
              {/* Forgot Password Text */}
              <Text style={styles.buttonText2}>Esqueceu sua senha?{" "}
                <Text
                  activeOpacity={0.8}
                  onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                  <Text
                    style={styles.buttonText2link}>Recupere aqui{" "}</Text>
                  <MaterialCommunityIcons
                    name='chevron-double-right'
                    color={COLORS.forestgreen}
                    />
                </Text>
                {" "}
              </Text>
            </View>
            <KeyboardAvoidingView
              keyboardVerticalOffset={offset}
              style={styles.container2}
              behavior="position">
              {/* Sign In Button */}
              <TouchableOpacity
                onPress={() => this.handleSignIn()}
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
          <MenuBar navigation={this.props.navigation}/>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const offset = (Platform.OS == 'android') ? -20 : 0;

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({

  backgroundContainer: {
    minHeight: Math.round(Dimensions.get('window').height),
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
    paddingHorizontal: Math.round(moderateScale(5, 0.625)),
  },

  container2: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },

  input: {
    color: COLORS.forestgreen,
    fontFamily: 'Poppins'
  },

  infoContainer: {
    width: width * .75,
    position: 'absolute',
    left: width * .25,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Math.round(moderateScale(10, 0.625)),
    backgroundColor: 'transparent',
    top: 0,
  },
  itemStyle: {
    marginBottom: Math.round(verticalScale(20)),
    backgroundColor: 'transparent',
    borderBottomColor: COLORS.forestgreen,
    borderBottomWidth: 1,
  },

  buttonStyle1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.forestgreen,
    width: width * .65,
    height: width * .2,
    borderRadius: 10,
    marginBottom: Math.round(verticalScale(30))
  },

  buttonText1: {
    fontSize: Math.round(scale(20, 0.00125)),
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: COLORS.white,
  },

  buttonText2: {
    fontSize: Platform.OS == "ios" ? Math.round(scale(12, 0.00125)) : Math.round(scale(10, 0.00125)),
    fontWeight: 'normal',
    color: COLORS.forestgreen,
    fontFamily: 'Poppins',
    marginBottom: Math.round(verticalScale(5)),
  },

  buttonText2link: {
    fontSize: Platform.OS == "ios" ? Math.round(scale(12, 0.00125)) : Math.round(scale(10, 0.00125)),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: COLORS.forestgreen,
  }

})