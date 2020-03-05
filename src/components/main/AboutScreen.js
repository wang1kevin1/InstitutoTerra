import React from 'react'

import {

  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  Dimensions

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
            <ScrollView>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/icon.png')}/>
              <Image source={require('../../assets/terra/terra-white.png')} style = {styles.terrawhite}/>
            </View>
            <View style={styles.whiteline}/>
            </ScrollView> 
          </View>
        

    )
  }
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.lightgreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    backgroundColor: COLORS.green,
    top: height * 0.05,
    alignItems:'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },         
      
  terrawhite: {
    flex: 1,
    width: width * 0.8,
    height: height * 0.1,
    resizeMode:'contain',
  },

  headerBar: {
    height: height * 0.08,
    backgroundColor: COLORS.green,
  },

  whiteline: {
    borderBottomColor: COLORS.white,
    borderBottomWidth: 2,
  }

})

