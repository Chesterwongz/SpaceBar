import React from 'react'; 
import { Link } from 'react-router-dom';

import {auth} from '../..//Firestore'; 

const NavBar = ({currentUser}) => (
    <div> 
        {currentUser? (
        <button onClick={() => auth.signOut()}>
          SIGN OUT
        </button>
        ) : (
        <Link to = '/signin'>
            SignIn
        </Link>   
        )}
    </div>
)

export default NavBar; 