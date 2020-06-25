import React from "react";

import {
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    Text,
    Keyboard,
    View,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
} from "react-native";

import { Input } from "react-native-elements";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import COLORS from "../../assets/Colors.js";

import MenuBar from "./MenuBar.js";

import Auth from "@aws-amplify/auth";

import i18n from "i18n-js";

const background_image = require("../../assets/background/home/bg_home.png");

export default class HomeScreen extends React.Component {
    state = {
        flight: "",
        error: false,
    };

    // load background
    constructor(props) {
        super(props);
        this.background = background_image;
    }

    onChangeText(key, value) {
        this.setState({
            [key]: value,
        });
    }

    // Opens up email to bug-report
    handleBugReports = () => {};

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
                    <KeyboardAvoidingView
                        behavior={Platform.OS == "ios" ? "padding" : "height"}
                        style={styles.container}
                        enabled="false"
                    >
                        <TouchableWithoutFeedback
                            style={styles.container}
                            onPress={Keyboard.dismiss}
                        >
                            <View style={styles.inner}>
                                <View style={styles.containerTop}>
                                    {/* Intro Text Body View */}
                                    <View>
                                        <Text
                                            style={styles.largeWhiteText}
                                            numberofLines={1}
                                        >
                                            A cada $6 uma
                                        </Text>

                                        <Text
                                            style={styles.largeWhiteText}
                                            numberofLines={1}
                                        >
                                            árvore é plantada.
                                        </Text>

                                        <Text style={styles.mediumWhiteText}>
                                            Faça sua doação e ajude a recuperar
                                            a Mata Atlântica da Fazenda do
                                            Bulcão.
                                        </Text>
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
                                            doe sem número de vôo{" "}
                                            <MaterialCommunityIcons
                                                name="chevron-double-right"
                                                style={styles.chevronIcon}
                                            ></MaterialCommunityIcons>
                                        </Text>
                                    </View>

                                    <View style={styles.searchContainer}>
                                        {/* Enter flight number */}
                                        <Input
                                            containerStyle={
                                                styles.containerStyle
                                            }
                                            inputContainerStyle={
                                                styles.inputContainerStyle
                                            }
                                            inputStyle={styles.inputStyle}
                                            rightIcon={
                                                <Ionicons
                                                    style={styles.searchIcon}
                                                    name="md-arrow-forward"
                                                    onPress={() =>
                                                        this.props.navigation.navigate(
                                                            "CheckoutWithoutFlight"
                                                        )
                                                    }
                                                />
                                            }
                                            errorMessage={i18n.t(
                                                "Please enter a valid flight number"
                                            )}
                                            errorStyle={[
                                                {
                                                    fontSize:
                                                        this.state.error ==
                                                        false
                                                            ? scale(3)
                                                            : scale(10),
                                                },
                                                {
                                                    color:
                                                        this.state.error ==
                                                        false
                                                            ? "transparent"
                                                            : "red",
                                                },
                                            ]}
                                            autoCapitalize="characters"
                                            autoCorrect={false}
                                            ref={flightSearch}
                                            onChangeText={(value) =>
                                                this.onChangeText(
                                                    "flight",
                                                    value
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </ImageBackground>
                <MenuBar navigation={this.props.navigation} />
            </View>
        );
    }
}

const flightSearch = React.createRef();

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
    imageBackground: {
        height: Math.round(scale(height)),
        width: width,
        backgroundColor: COLORS.black,
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
    },
    containerTop: {
        marginLeft: Math.round(moderateScale(120, 0.125)),
        marginRight: Math.round(moderateScale(20, 0.0625)),
        backgroundColor: "transparent",
    },
    largeWhiteText: {
        fontSize: Math.round(moderateScale(20, 0.05)),
        textAlign: "left",
        fontFamily: "Poppins-bold",
        color: COLORS.sandy,
    },
    mediumWhiteText: {
        color: COLORS.sandy,
        fontSize: Math.round(scale(18, 0.00125)),
        fontFamily: "Poppins-light",
        textAlign: "left",
    },
    smallWhiteText: {
        color: COLORS.sandy,
        fontSize: Math.round(scale(9, 0.625)),
        textAlign: "left",
        fontFamily: "Poppins-light",
    },
    linkWhiteText: {
        color: COLORS.sandy,
        fontSize: Math.round(scale(9, 0.625)),
        textDecorationLine: "underline",
        fontFamily: "Poppins-bold",
    },
    searchContainer: {
        marginTop: Math.round(verticalScale(35)),
    },
    containerStyle: {
        opacity: 0.95,
        backgroundColor: "transparent",
        borderColor: COLORS.sandy,
        borderWidth: Math.round(scale(3)),
        borderRadius: Math.round(scale(15)),
    },
    inputContainerStyle: {
        borderColor: "transparent",
    },
    inputStyle: {
        color: COLORS.sandy,
        fontFamily: "Poppins-bold",
        fontSize: Math.round(moderateScale(30, 0.0125)),
    },
    labelStyle: {
        color: COLORS.sandy,
        fontSize: Math.round(scale(20)),
    },
    searchIcon: {
        color: COLORS.sandy,
        fontSize: Math.round(scale(35)),
        textAlign: "center",
    },
    chevronIcon: {
        color: COLORS.sandy,
        textDecorationColor: "transparent",
        textAlignVertical: "center",
    },
});
