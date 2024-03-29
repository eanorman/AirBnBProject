import React from "react";

import "./index.css";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider, Modal } from "./context/Modal";
import App from "./App";

import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";
import { Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import SpotPage from "./components/SpotPage/SpotPage";
import CreateSpot from "./components/CreateSpot/CreateSpot";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import ManageSpots from "./components/ManageSpots/ManageSpots";
import UpdateSpot from "./components/UpdateSpot/UpdateSpot";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
function Root() {
  return (
    <ModalProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Modal />
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route path="/spots/new">
              <CreateSpot />
            </Route>
            <Route path='/spots/:spotId/edit'>
                <UpdateSpot />
            </Route>
            <Route path='/spots/current'>
              <ManageSpots />
            </Route>
            <Route path="/spots/:spotId">
              <SpotPage />
            </Route>
          </Switch>
        </BrowserRouter>
      </Provider>
    </ModalProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
