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
import { Form, Item, Input, Label } from "native-base";
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
    hidePassword: true,
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.backDrop}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS == "ios" ? "position" : null}
            enabled="false">
            <View style={styles.container}>
              <Text style={styles.header}>Olá!</Text>
              <Text style={styles.paragraph}>
                Excepteur commodo deserunt eu ad labore labore qui ullamco
                cillum consectetur incididunt eiusmod Lorem. Sunt do ipsum id
                officia officia.
              </Text>
              <Form style={styles.formContainer}>
                <Item style={styles.itemStyle}>
                  <Input
                    placeholder="Full Name"
                    placeholderTextColor={COLORS.forestgreen}
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={(event) => {
                      this.refs.SecondInput._root.focus();
                    }}
                    onChangeText={(value) => this.onChangeText("name", value)}
                  />
                </Item>
                <Item style={styles.itemStyle}>
                  <Input
                    placeholder="Email"
                    placeholderTextColor={COLORS.forestgreen}
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType={"email-address"}
                    ref="SecondInput"
                    onSubmitEditing={(event) => {
                      this.refs.ThirdInput._root.focus();
                    }}
                    onChangeText={(value) => this.onChangeText("email", value)}
                  />
                </Item>
                <Item style={styles.itemStyle}>
                  <Input
                    placeholder="Password"
                    placeholderTextColor={COLORS.forestgreen}
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={this.state.hidePassword}
                    ref="ThirdInput"
                    onSubmitEditing={(event) => {
                      this.refs.FourthInput._root.focus();
                    }}
                    onChangeText={(value) =>
                      this.onChangeText("password", value)
                    }
                  />
                </Item>
                <Item style={styles.itemStyle}>
                  <Input
                    placeholder="Confirm Password"
                    placeholderTextColor={COLORS.forestgreen}
                    style={styles.input}
                    returnKeyType="go"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={this.state.hidePassword}
                    ref="FourthInput"
                    onChangeText={(value) =>
                      this.onChangeText("password_confirmation", value)
                    }
                  />
                </Item>
              </Form>
            </View>
          </KeyboardAvoidingView>
          <MenuBar navigation={this.props.navigation} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  backDrop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
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
    marginTop: Math.round(verticalScale(50)),
    marginLeft: Math.round(moderateScale(110, 0.625)),
    marginRight: Math.round(moderateScale(20, 0.0625)),
  },
  formContainer: {
    marginTop: Math.round(verticalScale(10)),
  },
  itemStyle: {
    marginLeft: 0,
    marginBottom: Math.round(verticalScale(10)),
    borderColor: COLORS.forestgreen,
    borderWidth: Math.round(moderateScale(10, 0.0625)),
  },
  header: {
    color: COLORS.forestgreen,
    fontSize: Math.round(moderateScale(50, 0.05)),
    fontFamily: "Poppins-bold",
  },
  paragraph: {
    color: COLORS.forestgreen,
    fontSize: Math.round(scale(20, 0.00125)),
    fontFamily: "Poppins-light",
  },
});
