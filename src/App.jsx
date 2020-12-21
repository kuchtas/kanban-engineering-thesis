import React, { useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Auth, Hub } from "aws-amplify";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import history from "./history";
// CSS
import "./App.css";
import { ThemeProvider } from "@material-ui/core/styles";
import { globalTheme } from "./themes/globalTheme";
// components

// pages
import BoardList from "./pages/BoardList";
import BoardView from "./pages/BoardView";
import StatisticsView from "./pages/StatisticsView";
// GraphQl
import { User } from "./models/index";
//Redux
import store from "./store";
import { Provider } from "react-redux";
import TimelineView from "./pages/TimelineView";

function App() {
  // window.LOG_LEVEL = "DEBUG";
  useEffect(() => {
    Hub.listen("auth", () => {
      initUser();
    });
    loadUserFromLocalStorage();
  }, []);

  const initUser = async () => {
    const removeListener = Hub.listen("datastore", async (capsule) => {
      const {
        payload: { event, data },
      } = capsule;

      console.log("DataStore event", event, data);

      if (event === "ready") {
        console.log("initUser starting");
        Auth.currentAuthenticatedUser().then(async (data) => {
          const userQuery = await DataStore.query(User, (u) =>
            u.name("eq", data.attributes.email)
          );

          if (userQuery.length === 0) {
            const newUser = await DataStore.save(
              new User({
                cognitoID: data.username,
                name: data.attributes.email,
                boards: [],
                cards: [],
              })
            );
            store.dispatch({ type: "user/added", payload: newUser });
            localStorage.setItem("user", JSON.stringify(newUser));
          } else {
            store.dispatch({ type: "user/added", payload: userQuery[0] });
            localStorage.setItem("user", JSON.stringify(userQuery[0]));
          }
        });
      }
    });
    // Start the DataStore, this kicks-off the sync process.
    DataStore.start();
    return () => {
      removeListener();
    };
  };

  const loadUserFromLocalStorage = () => {
    try {
      const loadedUser = JSON.parse(localStorage.getItem("user"));
      store.dispatch({ type: "user/added", payload: loadedUser });
    } catch {
      Auth.signOut();
    }
  };

  return (
    <div id="app-root">
      <ThemeProvider theme={globalTheme}>
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route path="/home" component={BoardList} />
              <Route path="/board/:id" component={BoardView} exact={true} />
              <Route
                path="/board/:id/statistics"
                component={StatisticsView}
                exact={true}
              />
              <Route
                path="/board/:id/timeline"
                component={TimelineView}
                exact={true}
              />
            </Switch>
          </Router>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
