import React from "react";

import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    Text,
    Keyboard,
    View,
    ImageBackground,
} from "react-native";

import { Linking } from "expo";

import { Input, normalize } from "react-native-elements";

import { NavigationEvents } from "react-navigation";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { FontAwesome, Ionicons } from "@expo/vector-icons";

import COLORS from "../../assets/Colors.js";

import MenuBar from "./MenuBar.js";

import Auth from "@aws-amplify/auth";

import i18n from "i18n-js";

import * as CONSTANTS from "../utilities/Constants.js";

const background_image = require("../../assets/background/home/bg_home.png");

export default class HomeScreen extends React.Component {
    state = {
        isAuthenticated: false,
        flight: "",
        error: false,
    };

    // load background
    constructor(props) {
        super(props);
        this.selectBackground();
    }

    onChangeText(key, value) {
        this.setState({
            [key]: value,
        });
    }

    // selects a random background to be loaded
    selectBackground() {
        this.background = background_image;
    }

    // Opens up email to bug-report
    handleBugReports = () => {
        Linking.openURL(
            "mailto:bug-report@refloresta.app?body=" + CONSTANTS.BUG_REPORT
        );
    };

    // Checks if a user is logged in
    async checkAuth() {
        await Auth.currentAuthenticatedUser({ bypassCache: true })
            .then(() => {
                console.log("A user is logged in");
                this.setState({ isAuthenticated: true });
            })
            .catch((err) => {
                console.log("Nobody is logged in");
                this.setState({ isAuthenticated: false });
            });
    }

    // Check if the inputed flight number is valid
    checkNum() {
        let spaceBuffer = this.state.flight.replace(/\s+/g, "");

        this.setState({
            flight: spaceBuffer,
        });

        let charsIata = spaceBuffer.slice(0, 2).toUpperCase();
        let charsIcao = spaceBuffer.slice(0, 3).toUpperCase();

        console.log(charsIata);
        console.log(charsIcao);

        let numsIata = spaceBuffer.slice(2);
        let numsIcao = spaceBuffer.slice(3);

        console.log(numsIata);
        console.log(numsIcao);

        //process input as Iata or Icao depending on format
        if (isNaN(spaceBuffer.charAt(2))) {
            return this.icaoCall(charsIcao, numsIcao);
        } else {
            return this.iataCall(charsIata, numsIata);
        }
    }

    // checks for valid Iata
    iataCall(chars, nums) {
        fetch(
            `http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIata=${chars}&flightnumber=${nums}`,
            {
                method: "GET",
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    validNum: true,
                    data: responseJson[0],
                });

                console.log(this.state.data);

                if (!this.state.data) {
                    this.setState({ validNum: false });
                }

                return this.state.validNum;
            })
            .then((validNum) => {
                if (validNum) {
                    flightSearch.current.clear();
                    this.setState({ error: false });
                    this.props.navigation.navigate("FlightInfo", {
                        flightNum: this.state.flight,
                    });
                } else {
                    this.setState({ error: true });
                    flightSearch.current.shake();
                    flightSearch.current.clear();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // checks for valid Icao
    icaoCall(chars, nums) {
        fetch(
            `http://aviation-edge.com/v2/public/routes?key=760fd0-cefe7a&airlineIcao=${chars}&flightnumber=${nums}`,
            {
                method: "GET",
            }
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    validNum: true,
                    data: responseJson[0],
                });
                console.log(this.state.data);
                if (!this.state.data) {
                    this.setState({ validNum: false });
                }
                return this.state.validNum;
            })
            .then((validNum) => {
                if (validNum) {
                    flightSearch.current.clear();
                    this.setState({ error: false });
                    this.props.navigation.navigate("FlightInfo", {
                        flightNum: this.state.flight,
                    });
                } else {
                    this.setState({ error: true });
                    flightSearch.current.shake();
                    flightSearch.current.clear();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={this.background}
                    style={styles.imageBackground}
                >
                    <TouchableWithoutFeedback
                        style={styles.container}
                        onPress={Keyboard.dismiss}
                    >
                        <View style={styles.container}>
                            <View style={styles.containerTop}>
                                {/* Intro Text Body View */}
                                <View style={styles.appIntro}>
                                    <View>
                                        <Text
                                            style={styles.largeWhiteText}
                                            numberofLines={2}
                                        >
                                            A cada $6 uma árvore é plantada.
                                        </Text>
                                    </View>

                                    <Text style={styles.mediumWhiteText}>
                                        Faça sua doação e ajude a recuperar a
                                        Mata Atlântica da Fazenda do Bulcão.
                                    </Text>

                                    <View style={styles.bottomText}>
                                        <Text
                                            style={styles.smallWhiteText}
                                            numberOfLines={2}
                                        >
                                            Insira o número de vôo para iniciar
                                            ou
                                        </Text>

                                        <Text
                                            style={styles.linkWhiteText}
                                            numberOfLines={1}
                                        >
                                            doe sem número de vôo.
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.searchContainer}>
                                    {/* Enter flight number */}
                                    <Input
                                        containerStyle={styles.containerStyle}
                                        inputContainerStyle={
                                            styles.inputContainerStyle
                                        }
                                        inputStyle={styles.inputStyle}
                                        rightIcon={
                                            <Ionicons
                                                style={styles.searchIcon}
                                                name="md-arrow-forward"
                                                onPress={
                                                    (() => this.checkNum(),
                                                    () =>
                                                        this.props.navigation.navigate(
                                                            "CheckoutWithoutFlight"
                                                        ))
                                                }
                                            />
                                        }
                                        errorMessage={i18n.t(
                                            "Please enter a valid flight number"
                                        )}
                                        errorStyle={[
                                            {
                                                fontSize:
                                                    this.state.error == false
                                                        ? scale(3)
                                                        : scale(10),
                                            },
                                            {
                                                color:
                                                    this.state.error == false
                                                        ? "transparent"
                                                        : "red",
                                            },
                                        ]}
                                        autoCapitalize="characters"
                                        autoCorrect={false}
                                        ref={flightSearch}
                                        onChangeText={(value) =>
                                            this.onChangeText("flight", value)
                                        }
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </ImageBackground>
                <MenuBar navigation={this.props.navigation} />
            </View>
        );
    }
}

const flightSearch = React.createRef();

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    imageBackground: {
        height: Math.round(scale(height)),
        width: width,
        backgroundColor: COLORS.black,
    },
    container: {
        flex: 1,
        flexDirection: "column",
        paddingRight: Math.round(scale(10)),
        backgroundColor: "transparent",
    },
    containerTop: {
        marginTop: Math.round(verticalScale(120)),
        marginBottom: Math.round(verticalScale(100)),
        marginLeft: Math.round(scale(105)),
        backgroundColor: "transparent",
    },
    bottomText: {
        marginTop: Math.round(verticalScale(15)),
    },
    largeWhiteText: {
        width: "100%",
        fontSize: Math.round(moderateScale(24, 0.125)),
        lineHeight: Math.round(verticalScale(40)),
        textAlign: "left",
        fontFamily: "Montserrat-bold",
        color: COLORS.sandy,
    },
    mediumWhiteText: {
        width: "100%",
        fontSize: Math.round(scale(21, 0.00125)),
        lineHeight: Math.round(verticalScale(40)),
        fontFamily: "Montserrat",
        textAlign: "left",
        color: COLORS.sandy,
    },
    smallWhiteText: {
        width: "100%",
        fontSize: Math.round(scale(12, 0.00625)),
        textAlign: "left",
        fontFamily: "Montserrat",
        color: COLORS.sandy,
    },
    linkWhiteText: {
        width: "100%",
        fontSize: Math.round(scale(12, 0.00625)),
        textDecorationLine: "underline",
        fontFamily: "Montserrat-bold",
        color: COLORS.sandy,
    },
    searchContainer: {
        marginTop: Math.round(verticalScale(35)),
    },
    containerStyle: {
        opacity: 0.95,
        paddingTop: Math.round(verticalScale(15)),
        borderWidth: Math.round(scale(3)),
        borderRadius: Math.round(scale(15)),
        borderColor: COLORS.sandy,
        backgroundColor: "transparent",
    },
    inputContainerStyle: {
        borderColor: "transparent",
    },
    inputStyle: {
        fontSize: Math.round(moderateScale(30, 0.0125)),
        fontWeight: "900",
        textAlignVertical: "center",
        color: COLORS.sandy,
    },
    labelStyle: {
        fontSize: Math.round(scale(20)),
        color: COLORS.sandy,
    },
    searchIcon: {
        fontSize: Math.round(scale(35)),
        textAlign: "center",
        color: COLORS.sandy,
    },
    chevronIcon: {
        fontSize: Math.round(scale(10)),
        textDecorationLine: "none",
        textAlignVertical: "center",
        color: COLORS.sandy,
    },
});
