import React, { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Auth, Hub } from "aws-amplify";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// CSS
import "./App.css";
// components
import Navigation from "./components/Navigation";
// pages
import About from "./pages/About";
// GraphQl
import { User } from "./models/index";

function App() {
  // window.LOG_LEVEL = "DEBUG";
  const [user, setUser] = useState("");
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
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
          } else {
            setUser(userQuery[0]);
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

  useEffect(() => {
    console.log("after setting user", user);
  }, [user]);

  const loadUserFromLocalStorage = () => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch {
      Auth.signOut();
    }
  };
  /////////////////////////////////////////////////////////////////////////////// over this line is to be recycled in real version

  return (
    <div id="app-root">
      <Navigation />
      <Router>
        <Switch>
          <Route path="/about">
            <About user={user} />
          </Route>
          <Route path="/users"></Route>
          <Route path="/"></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;