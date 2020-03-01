import React from 'react'

import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

import COLORS from '../../assets/Colors.js';

import Auth from '@aws-amplify/auth';

export default class SettingsNameScreen extends React.Component {
  state = {
    isLoading: false,
    name: '',
    email: '',
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  // Change user name
  changeName = async () => {
    const { name } = this.state
    Keyboard.dismiss()
    this.setState({ isLoading: true })
    await Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.updateUserAttributes(user, { 'name': name });
      })
      .then(data => {
        this.setState({ isLoading: false })
        console.log('Name changed successfully', data)
        this.props.navigation.goBack()
      })
      .catch(err => {
        this.setState({ isLoading: false })
        if (!err.message) {
          console.log('Error changing name: ', err)
          Alert.alert('Error changing name: ', err)
        } else {
          console.log('Error changing name: ', err.message)
          Alert.alert('Error changing name: ', err.message)
        }
      })
  }

  render() {
      return (
        <SafeAreaView style={styles.containerSetting}>
          <KeyboardAvoidingView style={styles.containerSetting} behavior='padding' enabled>
            <TouchableWithoutFeedback style={styles.containerSetting} onPress={Keyboard.dismiss}>
              <View style={styles.containerSetting}>
                <Container style={styles.infoContainer}>
                    <View style={styles.containerSetting}>
                      {/* Name */}
                      <Item style={styles.itemStyle}>
                        <Ionicons style={styles.iconStyle1} name="ios-person" />
                        <Input
                          style={styles.input}
                          placeholder='Name'
                          placeholderTextColor={COLORS.lightblue}
                          returnKeyType='go'
                          autoCapitalize='none'
                          autoCorrect={false}
                          onChangeText={value => this.onChangeText('name', value)}
                        />
                      </Item>
                      {/* Confirm Button */}
                      <TouchableOpacity
                        onPress={() => this.changeName()}
                        disabled={this.state.isLoading}
                        style={styles.buttonStyle1}>
                        <Text style={styles.buttonText1}>
                          Save Changes
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
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
  }

const styles = StyleSheet.create({
  containerSetting: {
    flex: 1,
    backgroundColor: COLORS.lightgreen,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.lightblue,
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: COLORS.lightgreen,
  },
  itemStyle: {
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderColor: 'transparent'
  },
  iconStyle1: {
    color: COLORS.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
    flex: 0.1
  },
  buttonStyle1: {
    alignItems: 'center',
    backgroundColor: COLORS.lightblue,
    padding: 14,
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
})