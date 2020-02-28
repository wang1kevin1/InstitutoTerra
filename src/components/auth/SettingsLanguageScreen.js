import React from 'react'

import {
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  View,
  Dimensions,
  AsyncStorage
} from 'react-native'

import SettingsList from 'react-native-settings-list';

import Constants from 'expo-constants';

import Colors from '../../assets/Colors';

export default class SettingsLanguageScreen extends React.Component {
  state = {
    language: 'English',
  }

  // Persistant storage of language
  storeLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('@language', language)
      console.log('stored language', language)
    } catch (e) {
      console.log('Error saving language')
    }
  }

  // client side set language
  setLanguage (lang) {
    this.setState({language: lang})
    this.storeLanguage(lang)
    this.props.navigation.goBack()
  }

  render() {
    return (
      <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
            <View style={{ borderBottomWidth: 1, backgroundColor: Colors.lightgrey, borderColor: Colors.lightgrey, marginTop: Constants.statusBarHeight }}>
            </View>
            <View style={styles.container}>
              <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
                <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                  {/* ENGLISH */}
                  <SettingsList.Item
                    title='English'
                    onPress={() => { this.setLanguage('English') }}
                  />
                  {/* FRENCH */}
                  <SettingsList.Item
                    title='Français'
                    onPress={() => { this.setLanguage('Français') }}
                  />
                  {/* DUTCH */}
                  <SettingsList.Item
                    title='Nederlands'
                    onPress={() => { this.setLanguage('Nederlands') }}
                  />
                  {/* PORTUGUESE (BRAZIL) */}
                  <SettingsList.Item
                    title='Português (Brasil)'
                    onPress={() => { this.setLanguage('Português (Brasil)') }}
                  />
                  {/* PORTUGUESE (PORTUGAL) */}
                  <SettingsList.Item
                    title='Português (Portugal)'
                    onPress={() => { this.setLanguage('Português (Portugal)') }}
                  />
                </SettingsList>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    flexDirection: 'column',
    height: height,
    width: width
  },
  containerSetting: {
    flex: 1,
    backgroundColor: Colors.lightgreen,
    justifyContent: 'center',
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.lightblue,
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.lightgreen,
  },
  itemStyle: {
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: 'transparent'
  },
  iconStyle1: {
    color: Colors.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
    flex: 0.1
  },
  iconStyle2: {
    color: Colors.grey,
    fontSize: 20,
    marginRight: 15,
    marginLeft: 15,
    flex: 0.1
  },
  iconStyle3: {
    color: Colors.lightblue,
    fontSize: 30,
    marginRight: 15,
    marginLeft: 15,
    alignSelf: 'center'
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
  buttonStyle2: {
    alignItems: 'center',
    backgroundColor: Colors.lightgreen,
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText2: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.lightblue,
  },
  messageText1: {
    marginTop: 200,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkgrey,
    alignContent: 'center'
  },
})