import React from 'react';

import { signInWithGoogle } from '../../Firestore';

class SignIn extends React.Component {
  render() {
    return (
      <div>
        <span>Sign in here</span>
            <button onClick={signInWithGoogle}>
              Sign in with Google
            </button>
          </div>
    );
  }
}

export default SignIn;