import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BoardPage from "./pages/BoardPagev3.jsx";
import DrawingBoardPage from "./pages/DrawingBoardPage.jsx";
import Layout from "./components/Layout.jsx";
import SignInPage from "./pages/SignInPage";
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
      <Router>
        <CurrentUserContext.Provider value={currentUser}>
          <Switch>
            <Route exact path="/" component={SignInPage} />
            <Layout>
              <Route path="/board" component={BoardPage} />
              <Route path="/drawingboard" component={DrawingBoardPage} />
            </Layout>
          </Switch>
        </CurrentUserContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
