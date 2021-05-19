import React from 'react'; 
import {Switch, Route} from 'react-router-dom'; 
import {auth, createUserDocument} from './Firestore';

import HomePage from './pages/HomePage/HomePage'; 
import SignInPage from './pages/SignInPage/SignInPage'
import NavBar from './Components/NavBar/NavBar';

class App extends React.Component {
constructor() {
  super(); 
  this.state = {
    currentUser : null
  }
}

unSubscribeFromAuth = null

componentDidMount() {
  this.unSubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
    if (userAuth) {
      const userRef = await createUserDocument(userAuth); 
      userRef.onSnapshot(snapshot => {
        this.setState({
          currentUser: {
            id: snapshot.id, 
            ...snapshot.data()
          }
        }, () => {
          console.log(this.state); 
        })
      })
    } else {
      this.setState({
        currentUser: null
      })
    }
  })
}

componentWillUnmount() {
  this.unSubscribeFromAuth(); 
}

  render() {
    return (
      <div>
        <NavBar currentUser = {this.state.currentUser}/>
        <Switch>
          <Route exact path = '/' component = {HomePage}/>
          <Route path = '/signin' component = {SignInPage}/>
        </Switch>
      </div>
    )
  }
}

export default App;
