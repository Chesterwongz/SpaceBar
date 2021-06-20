import { ThemeProvider, CssBaseline } from "@material-ui/core";
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
import TeamPage from "./pages/TeamPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { useState, useEffect } from "react";
import { onAuthStateChange } from "./FireStore";
import theme from "./utils/theme";
import { CurrentUserContext } from "./utils/Context";

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
            <Route
              exact
              path="/"
              render={() =>
                currentUser ? <Redirect to="/home" /> : <SignInPage />
              }
            />
            <Route exact path="/home" component={HomePage} />
            <Route path="/:projectID">
              <Layout>
                <Switch>
                  <Route path="/:projectID/board" component={BoardPage} />
                  <Route path="/:projectID/team" component={TeamPage} />
                  <Route
                    path="/:projectID/drawingboard"
                    component={DrawingBoardPage}
                  />
                  <Route
                    path="/:projectID/analytics"
                    component={AnalyticsPage}
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
