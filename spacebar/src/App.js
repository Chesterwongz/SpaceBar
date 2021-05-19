import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BoardPage from "./pages/BoardPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout.js";

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
        {/* <AppBar color="primary">
          <Toolbar variant="dense">
            <Button color="inherit" href="/">
              Home
            </Button>
            <Button color="inherit" href="/board">
              Board
            </Button>
          </Toolbar>
        </AppBar> */}
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
