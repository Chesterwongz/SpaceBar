import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BoardPage from "./pages/BoardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import DrawingBoardPage from "./pages/DrawingBoardPage.jsx";
import Layout from "./components/Layout.jsx";
import SignInPage from "./pages/SignInPage"
import {useState, useEffect} from 'react'; 
import {onAuthStateChange} from "./FireStore"; 
import {CurrentUserContext} from "./Context";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#d5f4e6",
      main: "#80ced6",
      dark: "#618685",
    },
    secondary: {
      main: "#fefbd8",
    },
  },
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: "400",
    fontWeightRegular: "500",
    fontWeightMedium: "600",
    fontWeigthBold: "700",
  },
});

function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  useEffect(() => {
      const unsubscribe = onAuthStateChange(setCurrentUser); 
      return () => {
        unsubscribe(); 
      }; 
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CurrentUserContext.Provider value = {currentUser}>
          <Layout>
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/board" component={BoardPage} />
              <Route path="/drawingboard" component={DrawingBoardPage} />
              <Route exact path="/signin" component={SignInPage} />
            </Switch>
          </Layout>
        </CurrentUserContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
