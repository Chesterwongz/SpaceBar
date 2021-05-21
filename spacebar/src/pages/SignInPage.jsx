import React from 'react'; 
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';
import {uiConfig} from '../FireStore';

const SignInPage = () => (
    <div>
        <StyledFirebaseAuth uiConfig = {uiConfig} firebaseAuth = {firebase.auth()}/>
    </div>
);

export default SignInPage; 