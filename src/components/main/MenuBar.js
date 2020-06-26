import React from "react";

import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";

import COLORS from "../../assets/Colors.js";
import { Row } from "native-base";
import { colors } from "react-native-elements";
import i18n from "i18n-js";
import { NavigationEvents } from "react-navigation";
import Auth from "@aws-amplify/auth";

export default class MenuBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
        };

        this.back = require("../../assets/icons/ic_back.png");
        this.home = require("../../assets/icons/ic_home.png");
        this.reflorestaLogo = require("../../assets/logos/logo_reloresta_vertical.png");
        this.login = require("../../assets/icons/ic_profile.png");
        this.institutoTerraLogo = require("../../assets/logos/logo_IT_vertical.png");
    }

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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.greenSpacer} />
                    <Image
                        source={this.reflorestaLogo}
                        style={styles.reflorestaLogoContainer}
                    />
                    <NavigationEvents
                        onWillFocus={() => {
                            this.checkAuth();
                        }}
                    />
                    {/* isAuthenticated: false */}
                    {!this.state.isAuthenticated && (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                                this.props.navigation.navigate("SignIn")
                            }
                            style={styles.navstyle}
                        >
                            <View style={styles.iconContainer}>
                                <Image
                                    source={this.login}
                                    style={styles.login}
                                />
                                <Text style={styles.menutext}>login</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    {/* isAuthenticated: true */}
                    {this.state.isAuthenticated && (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                                this.props.navigation.navigate("UserProfile")
                            }
                            style={styles.navstyle}
                        >
                            <View style={styles.iconContainer}>
                                <Image
                                    source={this.login}
                                    style={styles.login}
                                />
                                <Text style={styles.menutext}>profile</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.props.navigation.navigate("Home")}
                        style={styles.navstyle}
                    >
                        <View style={styles.iconContainer}>
                            <Image source={this.home} style={styles.house} />
                            <Text style={styles.menutext}>home</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => this.props.navigation.goBack()}
                        style={styles.navstyle}
                    >
                        <View style={styles.iconContainer}>
                            <Image source={this.back} style={styles.exit} />
                            <Text style={styles.menutext}>back</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.clearSpace} />
                <View style={styles.bottomContainer}>
                    <Image
                        source={this.institutoTerraLogo}
                        style={styles.institutoTerraLogoContainer}
                    />
                </View>
            </View>
        );
    }
}

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        bottom: 0,
        height: height,
        width: width * 0.25,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        backgroundColor: COLORS.forestgreen,
    },

    topContainer: {
        backgroundColor: "transparent",
        flex: 2,
        flexDirection: "column",
        width: width * 0.25,
        justifyContent: "space-between",
        alignItems: "center",
    },

    clearSpace: {
        flex: 1,
        backgroundColor: "transparent",
        width: width * 0.25,
    },

    bottomContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        height: height * 0.2,
        width: width * 0.25,
        marginBottom: height * 0.05,
        flex: 1,
    },

    greenSpacer: {
        backgroundColor: COLORS.forestgreen,
        width: width * 0.25,
        height: height * 0.03,
    },

    reflorestaLogoContainer: {
        width: width * 0.13,
        height: width * 0.26,
        resizeMode: "stretch",
        padding: width * 0.05,
    },

    login: {
        width: width * 0.06,
        height: width * 0.06,
        resizeMode: "stretch",
    },

    house: {
        width: width * 0.07,
        height: width * 0.06,
        resizeMode: "stretch",
    },

    exit: {
        width: width * 0.06,
        height: width * 0.07,
        resizeMode: "stretch",
    },

    menutext: {
        fontFamily: "Poppins",
        color: COLORS.sandy,
    },

    iconContainer: {
        width: width * 0.25,
        height: width * 0.12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },

    institutoTerraLogoContainer: {
        width: width * 0.1,
        height: height * 0.2,
        resizeMode: "contain",
    },

    navstyle: {
        flexDirection: "column",
        alignItems: "center",
    },
});
