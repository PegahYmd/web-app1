import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import { React, useState, useEffect } from "react";
import { Container, Toast } from "react-bootstrap/";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Navigation } from "./components/Navigation";
import {
  FrontOfficeLayout,
  BackOfficeLayout,
  AdminLayout,
  AddLayout,
  EditLayout,
  DefaultLayout,
  NotFoundLayout,
  LoadingLayout,
  LoginLayout,
} from "./components/PageLayout";

import MessageContext from "./messageCtx";
import API from "./API";
import PageManagement from "./components/PageManagement.jsx";
import DetailPage from "./components/DetailPage";
import PageForm from "./components/PageForm";

function App() {
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(true);

  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);

  // This state contains the user's info.
  const [user, setUser] = useState(null);

  // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
  const [loading, setLoading] = useState(false);

  // This state contains the list of films (it is initialized from a predefined array).
  const [pages, setPages] = useState([]);

  const [pagesFiltered, setpagesFiltered] = useState([]);

  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    let msg = "";
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const user = await API.getUserInfo(); // here you have the user info, if already logged in
        setUser(user);
        setLoggedIn(true);
        setLoading(false);
      } catch (err) {
        handleErrors(err); // mostly unauthenticated user, thus set not logged in
        setUser(null);
        setLoggedIn(false);
        setLoading(false);
      }
    };
    init();
  }, []);

  /**
   * This function handles the login process.
   * It requires a username and a password inside a "credentials" object.
   */
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      console.log("user", user);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  /**
   * This function handles the logout process.
   */
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setUser(null);
    setPages([]);
  };

  /**
   * Defining a structure for Filters
   * Each filter is identified by a unique name and is composed by the following fields:
   * - A label to be shown in the GUI
   * - An URL of the corresponding route (it MUST match /filter/<filter-key>)
   * - A filter function applied before passing the films to the FilmTable component
   */

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Container fluid className="App">
          <Navigation logout={handleLogout} user={user} loggedIn={loggedIn} />
          <Routes>
            <Route
              path="/"
              element={
                loading ? (
                  <LoadingLayout />
                ) : (
                  <DefaultLayout pages={pages} pagesFiltered={pagesFiltered} />
                )
              }
            >
              <Route
                index
                element={
                  loggedIn ? (
                    <FrontOfficeLayout
                      Pages={pages}
                      setPages={setPages}
                      dirty={dirty}
                      setDirty={setDirty}
                    />
                  ) : (
                    <FrontOfficeLayout
                      Pages={pages}
                      setPages={setPages}
                      dirty={dirty}
                      setDirty={setDirty}
                    />
                  )
                }
              />
              <Route
                path="page/:filterId"
                element={
                  loggedIn ? (
                    <BackOfficeLayout
                      Pages={pages}
                      setPages={setPages}
                      pagesFiltered={pagesFiltered}
                      setpagesFiltered={setpagesFiltered}
                      dirty={dirty}
                      setDirty={setDirty}
                    />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route path="form" element={<PageManagement />} />
              <Route path="detail" element={<DetailPage />} />
              <Route path="addit" element={<PageForm />} />
              <Route
                path="admin"
                element={
                  loggedIn ? (
                    <AdminLayout
                      Pages={pages}
                      setPages={setPages}
                      pagesFiltered={pagesFiltered}
                      setpagesFiltered={setpagesFiltered}
                      dirty={dirty}
                      setDirty={setDirty}
                    />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route
                path="add"
                element={
                  loggedIn ? <AddLayout /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="edit/:PageId"
                element={
                  loggedIn ? (
                    <EditLayout Pages={pages} setDirty={setDirty} />
                  ) : (
                    <Navigate replace to="/login" />
                  )
                }
              />
              <Route path="*" element={<NotFoundLayout />} />
            </Route>
            <Route
              path="/login"
              element={
                !loggedIn ? (
                  <LoginLayout login={handleLogin} />
                ) : (
                  <Navigate replace to="/" />
                )
              }
            />
          </Routes>
          <Toast
            show={message !== ""}
            onClose={() => setMessage("")}
            delay={4000}
            autohide
            bg="danger"
          >
            <Toast.Body>{message}</Toast.Body>
          </Toast>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
  );
}

export default App;
