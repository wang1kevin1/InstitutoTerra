import { Auth } from 'aws-amplify'

export default class AccountUtil extends React.Component {
  state = {
    username: '',
    password: '',
    phone_number: '',
    email: '',
    authCode: '',
    user: {}
  }
  async signUp() {
    const { username, password, email, phone_number } = this.state
    await Auth.signUp({
      username,
      password,
      attributes: { email, phone_number }
    })
    console.log('sign up successful!')
  }
  async confirmSignUp() {
    const { username, authCode } = this.state
    await Auth.configSignignUp(username, authCode)
    console.log('confirm sign up successful!')
  }
  async resendSignUp() {
    const { username } = this.state
    await Auth.resendSignUp(username)
    console.log('confirm sign up resent!')
  }
  async signIn() {
    const { username, password  } = this.state
    const user = await Auth.signIn(username, password)
    this.setState({ user })
    console.log('sign in successful!')
  }
  async confirmSignIn() {
    const { user, authCode } = this.state
    await Auth.configSignignIn(user, authCode)
    console.log('user now successfully signed in to the app!!')
  }
  async signOut() {
    await Auth.signOut()
    console.log('user now successfully signed out of the app!!')
  }
  async changePassword() {
    await Auth.currentAuthenticatedUser()
    .then(user => {
        return Auth.changePassword(user, 'oldPassword', 'newPassword');
    })
    console.log('successfully changed password!!')
  }
  async forgotPassword() {
    await Auth.forgotPassword(username)
    await Auth.forgotPasswordSubmit(username, code, new_password)
    console.log('successfully changed new password!!')
  }
}