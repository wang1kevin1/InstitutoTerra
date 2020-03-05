import React from 'react'

import {

  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  Dimensions,
  TouchableWithoutFeedback

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

  }

  FooBarFunction() {
    //functions
  }

  render() {
    return (
          <View style={styles.container}>
            <View style={styles.backContainer}>
              <View style={styles.headerContainer}>
              <Text style={styles.aboutText}>ABOUT INSTITUTO TERRA</Text>
              </View>
              <ScrollView>
                <View style = {styles.mainContainer}>
                  <Image source = {require('../../assets/icon.png')} style = {styles.logo}/>
                  <Image source = {require('../../assets/terra/terra-white.png')} style = {styles.terrawhite}/>
                  <View style = {styles.whiteline}/>
                  <Text style={styles.normalText}>Since its creation in 1998, the Instituto Terra has had three focal principles:</Text>
                </View>
                <View style = {styles.threePrinciples}>
                  <View style = {styles.numbers}>
                    <Text style = {styles.numberText}>1</Text>
                    <Text style = {styles.numberText}>2</Text>
                    <Text style = {styles.numberText}>3</Text>
                  </View>
                  <View style = {styles.descriptions}>
                    <Text style = {styles.descText}>The recovery and restoration of its founding seat: the RPPN Bulcão farm.</Text>
                    <Text style = {styles.descText}>The spreading of ecological values through educational pograms.</Text>
                    <Text style = {styles.descText}>The recovery and restoration of rural properties in the valley of the Rio Doce.</Text>
                  </View>
                </View>
                <View style = {styles.darkBubbleContainer}>
                  <Text style = {styles.bubbleText}>In its 20 years of operation the Instituto Terra has successfully planted over 2.7 million trees.</Text>
                </View>
                <View style = {styles.textContainer}>
                  <Text style = {styles.normalText}>The revival of our ecosystem has brought back a great variety of animal species; 172
                  species of birds, 33 species of mamals, 16 species of reptiles and 16 species of amphibians. Our vivarium has a capacity
                  of producing 600,000 saplings a year and our laboratory guarantees us the technical knowlege to produce 297 species of
                  trees native to our region.</Text>
                </View>
              </ScrollView> 
            </View>
          </View>
    )
  }
}

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({

  container: {
    height: height,
    width: width,
    backgroundColor: COLORS.lightgreen,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  backContainer: {
    backgroundColor: COLORS.green,
    top: height*.05,
    height: height,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: width*.03,
    flexDirection: "column"
  },

  headerContainer: {
    backgroundColor: 'transparent',
    height: height*.05,
  },

  aboutText: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    color: COLORS.white,
    textAlign: "left"
  },

  mainContainer: {
    backgroundColor: COLORS.green,
    top: height*.05,
    alignItems:'center',
    paddingBottom: height*.03
  }, 
  
  logo: {
    width: width*.4,
    height: width*.4,
    resizeMode:'contain'
  },
      
  terrawhite: {
    width: width * 0.8,
    height: height * 0.1,
    resizeMode:'contain',
  },

  headerBar: {
    height: height * 0.08,
    backgroundColor: COLORS.green,
  },

  whiteline: {
    height: height*.03,
    borderTopColor: COLORS.white,
    borderTopWidth: 2,
    width: width*.9,
  },

  normalText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
  },

  bubbleText: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    color: COLORS.lightgreen,
    textAlign: "center",
  },

  textContainer: {
    padding: width*.05,
  },

  threePrinciples: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
    height: height * .3,
    paddingTop: height*.03,
    backgroundColor: "transparent"
  },

  numbers: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around"
  },

  numberText: {
    fontFamily: 'Montserrat',
    fontSize: 32,
    color: COLORS.white,
    textAlign: "center"
  },

  descriptions: {
    flex: 6,
    flexDirection: "column",
    justifyContent: "space-around"
  },
  
  descText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: COLORS.white,
    textAlign: "left",
  },

  darkBubbleContainer: {
    padding: width*.05,
    backgroundColor: COLORS.darkgreen,
    borderRadius: 25,
  }

})

