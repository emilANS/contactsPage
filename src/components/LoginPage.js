import React, { useState } from "react"
import { Link } from "react-router-dom";
import axios from "axios";

import { IoPerson, IoAtSharp, IoKeySharp} from "react-icons/io5";

import "../styleCss/LoginPageCss.css"

const LoginPage = () => {

  // UseStates
  const [userName, setUserName] = useState("");

  const [userPassword, setUserPassword] = useState("");

  const [userEmail, setUserEmail] = useState("");

  let [isTrue, setIsTrue] = useState(null);

  let [showUserThatIsAlreadyLoggedIn, setShowUserThatIsAlreadyLoggedIn] = useState(null);

  let [userHasSubmitNoExistingCredentials, setUserHasSubmitNoExistingCredentials] = useState(false);

  let [showPassword, setShowPassword] = useState(false);

  let [showUserWaitMessage, setShowUserWaitMessage] = useState(false);

  let [showUserThatInputsAreEmptyMessage, setShowUserThatInputsAreEmptyMessage] = useState(false);

  localStorage.setItem("_isTrue", isTrue);

  var getDataFromRegisterPage = JSON.parse(localStorage.getItem("_redirectToLoginPage"));

  const eventUserName = (event) => {
    setUserName(event.target.value);
  };
  const eventUserPassword = (event) => {
    setUserPassword(event.target.value);
  };
  const eventUserEmail = (event) => {
    setUserEmail(event.target.value);
  };

  onbeforeunload = () => {
    localStorage.clear();
  };


  const sendUserToRegisterPage = () => {

    window.location.replace("/register")

  };


  const verifyCredentials = () => {

    
    localStorage.clear();


    if (document.getElementById("login-input-username").value === "" || document.getElementById("login-input-password").value === "" || document.getElementById("login-input-email").value === "") {
      
      setShowUserThatInputsAreEmptyMessage(true);
      
      setUserHasSubmitNoExistingCredentials(false);

      setShowUserWaitMessage(false);

      return;

    } else {

      setShowUserThatInputsAreEmptyMessage(false);

    };

    if (userHasSubmitNoExistingCredentials === true) {

      setUserHasSubmitNoExistingCredentials(false);

    };

    setShowUserThatIsAlreadyLoggedIn(null);

    setShowUserWaitMessage(true);
    
    
    setTimeout(() => {
      axios.get("http://localhost:4000/verify-if-user-logged-put-the-correct-credentials",{params: { userName: userName, userPassword: userPassword, userEmail: userEmail, setIsTrue: setIsTrue }}).then((res) => {
        if (Object.values(res).includes(true)) {
          setUserHasSubmitNoExistingCredentials(true);
        };
      });
    }, "1000")
    

    setTimeout(() => {
      axios.get("http://localhost:4000/login",{params: { userName: userName, userPassword: userPassword, userEmail: userEmail, setIsTrue: setIsTrue }}).then((res) => {
        if (Object.values(res).includes(true)) {
          setIsTrue(true);

          window.location.replace("/main-page-contacts");
        } else {
          setShowUserThatIsAlreadyLoggedIn(true);
        };
      });
    }, "2000")

};

const showPasswordFunction = () => {
  setShowPassword(true);
  setShowPassword(!showPassword);
};

console.log("showUserThatInputsAreEmptyMessage",showUserThatInputsAreEmptyMessage)

console.log("userHasSubmitNoExistingCredentials",userHasSubmitNoExistingCredentials)

console.log("showUserWaitMessage", showUserWaitMessage)

return  (
  <body className="login-body">
    <div className="principal-div">

      <div className="navigation-bar">

        <h3 className="welcome-text">Welcome to your Contact Page</h3>

        <button onClick={sendUserToRegisterPage} className="register-button">Go to Register Page</button>
      </div>
    
      <div className="login-square">

        <h1 className="login-presentation">Login</h1>

        <IoPerson className="person-icon"/>

        <input onChange={eventUserName} className="login-input" id="login-input-username" placeholder="Your Username" />

        <IoKeySharp  className="key-icon"/>

        {showPassword === false ? <input type="password"  onChange={eventUserPassword} className="login-input" id="login-input-password" placeholder="Your password"></input> : <input onChange={eventUserPassword} className="login-input" id="login-input-password" placeholder="Your password"></input>}

        <IoAtSharp className="sharp-icon" />

        <input type="email" onChange={eventUserEmail} className="login-input" id="login-input-email" placeholder="Your email" />

        <button className="login-button" onClick={verifyCredentials}>Login</button>
        
        <button className="show-password-button" onClick={showPasswordFunction}>Show Password</button>

        <div className="link-div">

          <Link className="link-to-register" to="/register">Don't have an account register here!</Link>

        </div>

        {showUserThatInputsAreEmptyMessage === true && showUserWaitMessage === false && <h2 className="advertence-message" >Please complete first the inputs</h2>}

        {isTrue === true && showUserThatIsAlreadyLoggedIn === null && <h2 className="advertence-message" >You have login Successfully!</h2>}

        {isTrue === false && showUserThatInputsAreEmptyMessage === false && <p className="advertence-message" >Your credentials are Incorrect. Please try again</p>}

        {showUserThatIsAlreadyLoggedIn === true && <h3 className="advertence-message" >You are already logged into the page</h3>}

        {userHasSubmitNoExistingCredentials === true && isTrue === null && showUserThatIsAlreadyLoggedIn === null && showUserThatInputsAreEmptyMessage === false && <h2 className="advertence-message" >This account don't exist</h2>}

        {showUserWaitMessage === true && isTrue === null && showUserThatIsAlreadyLoggedIn === null && userHasSubmitNoExistingCredentials === false && showUserThatInputsAreEmptyMessage === false && <div className="loader" ></div>}

        {getDataFromRegisterPage === true && isTrue === null && <h2 className="advertence-message" >You have created your account!</h2> }

      </div>

    </div>

  </body>
)
};

export default LoginPage;
