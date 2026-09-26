import type { AuthData } from "./types";

export const auth_data: AuthData = {
  loginTab: "Login",
  registerTab: "Register",

  login: {
    title: "Log in to Unique Mart",
    identifier: "Enter your email or phone number",
    password: "Password",
    forgot: "Forgot Password?",
    submit: "Log In",
    footer: "Don't have an account?",
    footerLink: "Register Here",
  },

  register: {
    title: "Create a Unique Mart account",
    name: "Name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    confirm: "Confirm Password",
    submit: "Sign Up",
    footer: "Already have an account?",
    footerLink: "Login Here",
  },

  forgot: {
    title: "Forgot your password?",
    body: "Enter the email on your account and we will send a reset link once sign-in is connected.",
    email: "Email",
    submit: "Send reset link",
    sent: "Nothing was sent — password reset needs a backend. This screen is here so the link from the login form goes somewhere real.",
    back: "Back to login",
  },

  google: {
    signIn: "Sign in with Google",
    signUp: "Sign up with Google",
    divider: "or",
    mock: "Placeholder — this does not contact Google yet.",
  },

  showPassword: "Show password",
  hidePassword: "Hide password",

  note: "Accounts are kept in this browser on this device. Nothing is sent anywhere, no password is stored, and the Google button is a placeholder that does not contact Google — all of it until sign-in is connected to the store.",
  signedInAs: "Signed in as",
  signOut: "Sign out",

  errors: {
    identifier: "Enter your email or phone number.",
    name: "Enter your name.",
    email: "Enter a valid email address.",
    phone: "Enter your phone number.",
    password: "Enter a password.",
    short: "Use at least 8 characters.",
    mismatch: "Passwords do not match.",
  },
};
