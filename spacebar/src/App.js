import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
  CssBaseline,
} from "@material-ui/core";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import BoardPage from "./pages/BoardPage.jsx";
import DrawingBoardPage from "./pages/DrawingBoardPage.jsx";
import Layout from "./components/Layout.jsx";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import { useState, useEffect } from "react";
import { onAuthStateChange } from "./FireStore";
import { CurrentUserContext } from "./utils/Context";

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
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <CurrentUserContext.Provider value={currentUser}>
          <Switch>
            <Route exact path="/" component={SignInPage} />
            <Route exact path="/home" component={HomePage} />
            <Route path="/:projectID">
              <Layout>
                <Switch>
                  <Route path="/:projectID/board" component={BoardPage} />
                  <Route
                    path="/:projectID/drawingboard"
                    component={DrawingBoardPage}
                  />
                  <Redirect from="/:projectID" to="/:projectID/board" />
                </Switch>
              </Layout>
            </Route>
          </Switch>
        </CurrentUserContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
