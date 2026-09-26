export type AuthData = {
  loginTab: string;
  registerTab: string;

  login: {
    title: string;
    identifier: string;
    password: string;
    forgot: string;
    submit: string;
    footer: string;
    footerLink: string;
  };

  register: {
    title: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    confirm: string;
    submit: string;
    footer: string;
    footerLink: string;
  };

  forgot: {
    title: string;
    body: string;
    email: string;
    submit: string;
    sent: string;
    back: string;
  };

  google: {
    signIn: string;
    signUp: string;
    divider: string;
    mock: string;
  };

  showPassword: string;
  hidePassword: string;

  note: string;
  signedInAs: string;
  signOut: string;

  errors: {
    identifier: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    short: string;
    mismatch: string;
  };
};
