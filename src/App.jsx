import React, { useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Auth, Hub } from "aws-amplify";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import history from './history';
// CSS
import "./App.css";
// components

// pages
import About from "./pages/About";
import BoardList from "./pages/BoardList";
import BoardView from "./pages/BoardView";
// GraphQl
import { User } from "./models/index";
//Redux
import store from './store';
import { Provider } from "react-redux";

function App() {
  const baseUrl = process.env.PUBLIC_URL;
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
      store.dispatch({ type: "user/added", payload: loadedUser});
    } catch {
      Auth.signOut();
    }
  };
  /////////////////////////////////////////////////////////////////////////////// over this line is to be recycled in real version

  return (
    <div id="app-root">
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route path={baseUrl + "/home"} component={BoardList} />
            <Route
              path={baseUrl + "/board/:id"}
              component={BoardView}
              exact={true}
            />
            <Route path={baseUrl + "/about"} component={About} exact={true} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;