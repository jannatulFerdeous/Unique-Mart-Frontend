import type { AuthData } from "./types";

export const auth_data: AuthData = {
  loginTab: "Login",
  registerTab: "Register",

  login: {
    title: "Log in to Unique Mart",
    identifier: "Email address",
    password: "Password",
    forgot: "Forgot Password?",
    submit: "Log In",
    pending: "Logging in…",
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
    pending: "Creating your account…",
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
    divider: "or",
    pending: "Signing you in with Google…",
    unavailable: "Google sign-in isn't set up on this site yet. Use your email and password.",
  },

  showPassword: "Show password",
  hidePassword: "Hide password",

  signedInAs: "Signed in as",
  signOut: "Sign out",

  errors: {
    identifier: "Enter the email address on your account.",
    name: "Enter your name (2 to 50 characters).",
    email: "Enter a valid email address.",
    phone: "Enter your phone number.",
    password: "Enter a password.",
    min: "Passwords are at least 6 characters.",
    short: "Use at least 8 characters.",
    mismatch: "Passwords do not match.",
  },
};
