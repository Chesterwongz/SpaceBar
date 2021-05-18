import { AppBar, Toolbar, Button } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage";
import KanbanBoard from "./components/KanbanBoard";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#d5f4e6",
      main: "#80ced6",
      dark: "#618685"
    },
    secondary: {
      main: '#fefbd8'
    }
  },
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: '400',
    fontWeightRegular: '500',
    fontWeightMedium: '600',
    fontWeigthBold:'700'
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar color="primary">
          <Toolbar variant="dense">
            <Button color="inherit" href="/">
              Home
            </Button>
            <Button color="inherit" href="/board">
              Board
            </Button>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/board" component={KanbanBoard} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
