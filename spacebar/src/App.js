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
import DrawingBoardPage from "./pages/DrawingBoardPage.jsx";
import HomePage from "./pages/HomePage";
import ScrumBoardPage from "./pages/ScrumBoardPage.jsx";
import SignInPage from "./pages/SignInPage";
import TeamPage from "./pages/TeamPage";
import { CurrentUserContext } from "./utils/Context";
import theme from "./utils/theme";

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
                  <Route path="/:projectID/board" component={ScrumBoardPage} />
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
