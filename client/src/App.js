import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Navbar from "./components/navbar.component.js";
import ClassifiedsList from "./components/classifieds-list.component";
import EditClassified from "./components/edit-classified.component";
import CreateClassified from "./components/create-classified.component";
import CreateUser from "./components/create-user.component";
import Register from "./components/register.component";
import Activate from "./components/activate.component";
import Login from "./components/login.component";
import ForgetPassword from "./components/forget-password.component";
import ResetPassword from "./components/reset-password.component";
import Profile from "./components/profile.component";
require('dotenv').config();

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Route path="/" exact component={ClassifiedsList} />
        <Route path="/edit/:id" component={EditClassified} />
        <Route path="/create" component={CreateClassified} />
        <Route path="/user" component={CreateUser} />
        <Route path="/profile" component={Profile} />
        <Route path="/login" component={Login} />
        <Route path="/users/password/forget" component={ForgetPassword} />
        <Route path="/users/password/reset/:token" component={ResetPassword} />
        <Route path="/register" component={Register} />
        <Route path="/users/activate/:token" component={Activate} />
      </div>
    </Router>
  );
}

export default App;
