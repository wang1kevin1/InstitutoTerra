import React from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Container, Item, Input } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../assets/Colors.js";
import Auth from "@aws-amplify/auth";
import MenuBar from "../main/MenuBar.js";
import { API } from "aws-amplify";
import i18n from "i18n-js";

export default class SignUpScreen extends React.Component {
  state = {
    userSub: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    isLoading: false,
    hidePassword1: true,
    hidePassword2: true,
    apiResponse: null,
    UserId: "",
  };

  handleChangeUserId = (event) => {
    this.setState({ UserId: event });
  };

  onChangeText(key, value) {
    this.setState({
      [key]: value,
    });
  }

  // toggles secure text password
  handleHidePassword = () => {
    if (this.state.hidePassword) {
      this.setState({ hidePassword: false });
    } else {
      this.setState({ hidePassword: true });
    }
  };

  // checks for password match
  handleSignUp = () => {
    if (this.state.password !== this.state.password_confirmation) {
      Alert.alert(i18n.t("Passwords do not match"));
    } else {
      this.signUp();
    }
  };

  // Sign up user with AWS Amplify Auth
  async signUp() {
    Keyboard.dismiss();
    this.setState({ isLoading: true });
    await Auth.signUp({
      username: this.state.email,
      password: this.state.password,
      attributes: {
        email: this.state.email,
        name: this.state.name,
      },
    })
      .then((data) => {
        // grab user unique sub
        // console.log("sign up successful with result:", data);
        this.setState({ data });
        this.setState({ userSub: data.userSub });
        // console.log(this.state.userSub);
        Alert.alert(i18n.t("An email has been sent to confirm your sign up"));
        this.saveUser();
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        if (!err.message) {
          // console.log("Error when signing up: ", err);
          Alert.alert(i18n.t("Error when signing up: "), err);
        } else {
          // console.log("Error when signing up: ", err.message);
          Alert.alert(i18n.t("Error when signing up: "), err.message);
        }
      });
  }

  // adds user to Amplify database
  async saveUser() {
    let newUser = {
      body: {
        UserId: this.state.userSub,
        TreesPlanted: 0,
      },
    };

    const path = "/Users";

    // Use the API module to save the note to the database
    await API.put("ZeroCarbonREST", path, newUser)
      .then((apiResponse) => {
        this.setState({ apiResponse });
        // console.log("Response from saving user: " + apiResponse);
        this.setState({ isLoading: false });
        this.props.navigation.navigate("SignIn");
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS == "ios" ? "padding" : null}
          enabled="false">
          <View style={styles.backDrop}>
            <View style={styles.container}></View>
            <MenuBar navigation={this.props.navigation} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  backDrop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: Math.round(scale(height)),
    width: width,
    backgroundColor: COLORS.signUpBkg,
  },
  keyboardView: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
