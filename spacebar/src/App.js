import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { onAuthStateChange } from "./FireStore";
import AnalyticsPage from "./pages/AnalyticsPage";
import HangoutPage from "./pages/HangoutPage.jsx";
import BoardPage from "./pages/BoardPage.jsx";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import TeamPage from "./pages/TeamPage";
import { CurrentUserContext } from "./utils/Context";
import theme from "./utils/theme";
import RoadmapPage from "./pages/RoadmapPage.jsx";

import AccountPage from "./pages/AccountPage.jsx";


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
            <Route exact path="/account" component={AccountPage} />
            <Route path="/:projectID">
              <Layout>
                <Switch>
                  <Route path="/:projectID/board" component={BoardPage} />
                  <Route path="/:projectID/team" component={TeamPage} />
                  <Route path="/:projectID/hangout" component={HangoutPage} />
                  <Route
                    path="/:projectID/analytics"
                    component={AnalyticsPage}
                  />
                  <Route path="/:projectID/roadmap" component={RoadmapPage} />
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
