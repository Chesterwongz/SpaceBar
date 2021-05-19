import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BoardPage from "./pages/BoardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import Layout from "./components/Layout.jsx";

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
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/board" component={BoardPage} />
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
