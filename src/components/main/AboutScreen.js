import React from 'react'

import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  Dimensions,
} from 'react-native'

import COLORS from '../../assets/Colors.js'

import { Ionicons } from '@expo/vector-icons';

export default class AboutScreen extends React.Component {
  // load images and get props
  constructor(props) {
    super(props)

    this.props.navigation.getParam('color', 'color')

    this.icon_green = require('../../assets/icons/icon-green.png')
    this.icon_black = require('../../assets/icons/icon-black.png')

    this.terra_green = require('../../assets/terra/terra-green.png')
    this.terra_black = require('../../assets/terra/terra-black.png')

    this.about_1 = require('../../assets/background/about/about-1.png')
    this.about_2 = require('../../assets/background/about/about-2.png')
    this.about_3 = require('../../assets/background/about/about-3.png')
  }

  render() {
    if (this.props.navigation.getParam('color', 'color') == 'green') {
      return (
        <View style={styles.container}>
          <View style={styles.backContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.aboutText}>ABOUT INSTITUTO TERRA</Text>
              <Ionicons style={styles.navigationIcon} name="md-close" onPress={() => this.props.navigation.goBack()} />
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}>
              <View style={styles.mainContainer}>
                <Image source={this.icon_green} style={styles.logo} />
                <Image source={this.terra_green} style={styles.terra} />
                <View style={styles.whiteline} />
                <Text style={styles.normalText}>Since its creation in 1998, the Instituto Terra has had three focal principles:</Text>
              </View>
              <View style={styles.threePrinciples}>
                <View style={styles.numbers}>
                  <Text style={styles.numberText}>1</Text>
                  <Text style={styles.numberText}>2</Text>
                  <Text style={styles.numberText}>3</Text>
                </View>
                <View style={styles.descriptions}>
                  <Text style={styles.descText}>The recovery and restoration of its founding seat: the RPPN Bulcão farm.</Text>
                  <Text style={styles.descText}>The spreading of ecological values through educational pograms.</Text>
                  <Text style={styles.descText}>The recovery and restoration of rural properties in the valley of the Rio Doce.</Text>
                </View>
              </View>
              <Image source={this.about_1} style={styles.imageContainer1} />
              <View style={styles.greenBubbleContainer}>
                <Text style={styles.bubbleText}>In its 20 years of operation the Instituto Terra has successfully planted over 2.7 million trees.</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.normalText}>The revival of our ecosystem has brought back a great variety of animal species; 172
                species of birds, 33 species of mammals, 16 species of reptiles and 16 species of amphibians. Our vivarium has a capacity
                of producing 600,000 saplings a year and our laboratory guarantees us the technical knowlege to produce 297 species of
                trees native to our region.</Text>
              </View>
              <Image source={this.about_2} style={styles.imageContainer2} />
              <View style={styles.textContainer}>
                <Text style={styles.normalText}>In its educational role the Institute established the goal of disseminating its
                ecological values, mainly through tree complementary programs.</Text>
              </View>
              <View style={styles.greenBubbleContainer}>
                <Text style={styles.bubbleText}>More than 82,000 students, primarily from the regions of Rio Doce, have graduated from
                several courses and programs offered by the Institute.</Text>
              </View><View style={styles.textContainer}>
                <Text style={styles.normalText}>The 'Terrinha' project has the goal of making students between 11 and 13 years of age
                become conscious of ecological themes. 760 children partook in this program and will pass on the knowledge to their
                respective classrooms, indirectly affecting over 19,000 students in the region. Since 2005, 177 young agricultural technicians
              were trained in the recovery of decraded areas through a boarding program that lasts 1 year.</Text>
              </View>
              <Image source={this.about_3} style={styles.imageContainer3} />
              <View style={styles.normalText}>
                <Text style={styles.normalText}>The institute has recovered 1977 springs so far, this has increased water flow and provoked
                a systematic improvement in the productivity of approximately 49,425 hectares of land belonging to 1044 low income families.
                This project has become the main focus for the Institute.</Text>
              </View>
              <View style={styles.footer}>
              </View>
            </ScrollView>
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <View style={styles.darkBackContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.aboutText}>ABOUT INSTITUTO TERRA</Text>
              <Ionicons style={styles.navigationIcon} name="md-close" onPress={() => this.props.navigation.goBack()} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.mainContainer}>
                <Image source={this.icon_black} style={styles.logo} />
                <Image source={this.terra_black} style={styles.terra} />
                <View style={styles.whiteline} />
                <Text style={styles.greenNormalText}>Since its creation in 1998, the Instituto Terra has had three focal principles:</Text>
              </View>
              <View style={styles.threePrinciples}>
                <View style={styles.numbers}>
                  <Text style={styles.numberText}>1</Text>
                  <Text style={styles.numberText}>2</Text>
                  <Text style={styles.numberText}>3</Text>
                </View>
                <View style={styles.descriptions}>
                  <Text style={styles.descText}>The recovery and restoration of its founding seat: the RPPN Bulcão farm.</Text>
                  <Text style={styles.descText}>The spreading of ecological values through educational pograms.</Text>
                  <Text style={styles.descText}>The recovery and restoration of rural properties in the valley of the Rio Doce.</Text>
                </View>
              </View>
              <Image source={this.about_1} style={styles.imageContainer1} />
              <View style={styles.darkBubbleContainer}>
                <Text style={styles.bubbleText}>In its 20 years of operation the Instituto Terra has successfully planted over 2.7 million trees.</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.normalText}>The revival of our ecosystem has brought back a great variety of animal species; 172
                species of birds, 33 species of mammals, 16 species of reptiles and 16 species of amphibians. Our vivarium has a capacity
                of producing 600,000 saplings a year and our laboratory guarantees us the technical knowlege to produce 297 species of
                trees native to our region.</Text>
              </View>
              <Image source={this.about_2} style={styles.imageContainer2} />
              <View style={styles.textContainer}>
                <Text style={styles.normalText}>In its educational role the Institute established the goal of disseminating its
                ecological values, mainly through tree complementary programs.</Text>
              </View>
              <View style={styles.darkBubbleContainer}>
                <Text style={styles.bubbleText}>More than 82,000 students, primarily from the regions of Rio Doce, have graduated from
                several courses and programs offered by the Institute.</Text>
              </View><View style={styles.textContainer}>
                <Text style={styles.normalText}>The 'Terrinha' project has the goal of making students between 11 and 13 years of age
                become conscious of ecological themes. 760 children partook in this program and will pass on the knowledge to their
                respective classrooms, indirectly affecting over 19,000 students in the region. Since 2005, 177 young agricultural technicians
              were trained in the recovery of decraded areas through a boarding program that lasts 1 year.</Text>
              </View>
              <Image source={this.about_3} style={styles.imageContainer3} />
              <View style={styles.normalText}>
                <Text style={styles.normalText}>The institute has recovered 1977 springs so far, this has increased water flow and provoked
                a systematic improvement in the productivity of approximately 49,425 hectares of land belonging to 1044 low income families.
                This project has become the main focus for the Institute.</Text>
              </View>
              <View style={styles.footer}>
              </View>
            </ScrollView>
          </View>
        </View>
      )
    }
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: COLORS.lightgreen,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  backContainer: {
    backgroundColor: COLORS.green,
    top: height * .05,
    width: width,
    height: height,
    borderRadius: 25,
    padding: width * .03,
    flexDirection: "column"
  },
  darkBackContainer: {
    backgroundColor: COLORS.darkgrey,
    top: height * .05,
    width: width,
    height: height,
    borderRadius: 25,
    padding: width * .03,
    flexDirection: "column"
  },
  headerContainer: {
    backgroundColor: 'transparent',
    height: height * .05,
    marginLeft: width * 0.03,
    marginRight: width * 0.03,
    marginBottom: height * .02,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationIcon: {
    color: COLORS.white,
    fontSize: 30,
  },
  aboutText: {
    fontSize: 12,
    fontFamily: 'Montserrat',
    color: COLORS.white,
  },
  mainContainer: {
    backgroundColor: 'transparent',
    top: height * .02,
    alignItems: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logo: {
    width: width * .4,
    height: width * .4,
    resizeMode: 'stretch'
  },
  terra: {
    width: width * 0.8,
    height: height * 0.1,
    resizeMode: 'contain',
  },
  imageContainer1: {
    borderRadius: 25,
    width: width * .94,
    height: width * .63,
    resizeMode: 'stretch',
    padding: width * .05,
    marginBottom: height * .02
  },
  imageContainer2: {
    borderRadius: 25,
    width: width * .94,
    height: width * .71,
    resizeMode: 'stretch',
    padding: width * .05
  },
  imageContainer3: {
    borderRadius: 25,
    width: width * .94,
    height: width * .63,
    resizeMode: 'stretch',
    padding: width * .05,
    marginBottom: height * .02
  },
  headerBar: {
    height: height,
    backgroundColor: COLORS.green,
  },
  whiteline: {
    height: height * .03,
    borderTopColor: COLORS.white,
    borderTopWidth: 2,
    width: width * .9,
  },
  normalText: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    color: COLORS.white,
    textAlign: "center",
  },
  greenNormalText: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    color: COLORS.lightgreen,
    textAlign: "center",
  },
  bubbleText: {
    fontFamily: 'Montserrat-bold',
    fontSize: 15,
    color: COLORS.lightgreen,
    textAlign: "center",
  },
  textContainer: {
    padding: width * .05,
  },
  threePrinciples: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
    height: height * .3,
    paddingTop: height * .03,
    backgroundColor: "transparent"
  },
  numbers: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    height: height*0.25
  },
  numberText: {
    fontFamily: 'Montserrat',
    fontSize: 35,
    color: COLORS.white,
    textAlign: "center"
  },
  descriptions: {
    flex: 6,
    flexDirection: "column",
    justifyContent: "space-around",
    height: height*0.25
  },
  descText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: COLORS.white,
    textAlign: "left",
  },
  greenBubbleContainer: {
    padding: width * .05,
    backgroundColor: COLORS.darkgreen,
    borderRadius: 25,
  },
  darkBubbleContainer: {
    padding: width * .05,
    backgroundColor: COLORS.lightblack,
    borderRadius: 25,
  },
  footer: {
    backgroundColor: "transparent",
    width: width,
    height: height * .1
  }
})

