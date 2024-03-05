import React, {useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import RegisterPageCss from "../styleCss/RegisterPageCss.css"

import { IoPerson, IoAtSharp, IoKeySharp} from "react-icons/io5";

const RegisterPage = () => {
  
  const [userName, setUserName] = useState("");

  const [userPassword, setUserPassword] = useState("");
  
  const [userEmail, setUserEmail] = useState("");

  let [passwordExists, setPasswordExists] = useState(null);

  let [redirectToLoginPage, setRedirectToLoginPage] = useState(null);

  localStorage.setItem("_redirectToLoginPage", redirectToLoginPage);

  let [trueFalseSubmitButton, setTrueFalseSubmitButton] = useState(true);

  let [userTypedCredentials, setUserTypedCredentials] = useState(null);

  let [correctEmail, setCorrectEmail] = useState(null);

  let [hasPasswordNumbers, setHasPasswordNumbers] = useState(null);

  let [hasPasswordSpecialCharacters, setHasPasswordSpecialCharacters] = useState(null);

  let [hasPasswordLess6Characters, setHasPasswordLess6Characters] = useState(null);

  let [showPassword, setShowPassword] = useState(false);
  
  const eventUserName = (event) => {
    setUserName(event.target.value);
  };
  const eventUserPassword = (event) => {
    setUserPassword(event.target.value);
  };
  const eventUserEmail = (event) => {
    setUserEmail(event.target.value);
  };

  function hasNumber(password) {
    return /\d/.test(password);
  };

  function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  };


  const sendUserToLoginPage = () => {
    window.location.replace("/")
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    setTrueFalseSubmitButton(false)

    if (userName.length === 0 || userPassword.length === 0 || userEmail.length === 0){
      console.log("the inputs are empty");
      setUserTypedCredentials(false);
      setTrueFalseSubmitButton(true);
      return;
    } else {
      setUserTypedCredentials(null);
    };
    
    if (hasNumber(userPassword) === true){
      setHasPasswordNumbers(null);
    } else {
      setHasPasswordNumbers(false);
      console.log("The password has no numbers!");
      console.log(hasNumber);
      setTrueFalseSubmitButton(true);
      return;
    };

    if (containsSpecialChars(userPassword) === true){
      setHasPasswordSpecialCharacters(null);
    } else {
      setHasPasswordSpecialCharacters(false);
      console.log("Password don't have special characters")
      console.log(containsSpecialChars);
      setTrueFalseSubmitButton(true);
      return;
    };

    if (userPassword.length < 6){
      setHasPasswordLess6Characters(false);
      console.log("Password don't have more than 6 characters!");
      setTrueFalseSubmitButton(true);
      return;
    } else {
      setHasPasswordLess6Characters(null);
    };


    // This if statement makes that you cant write at the final of a email
    if (userEmail.endsWith("@gmail.com") && userEmail.length > 10){
      // here the code continues
      setCorrectEmail(true);
    } else {
      setUserTypedCredentials(null);
      setCorrectEmail(false);
      setTrueFalseSubmitButton(true);
      return;
    };

    axios.get("http://localhost:4000/register-database-verify-if-email-exists",{params: { userEmail: userEmail }}).then((res) => {
      console.log(res);
    });

    axios.get("http://localhost:4000/register-database-verify",{params: { userName: userName, userPassword: userPassword, userEmail: userEmail}}).then((res) => {
      console.log(res);
    });

    axios.get("http://localhost:4000/register-database-send-true",{params: { userName: userName, userPassword: userPassword, userEmail: userEmail}}).then((res) => {
      console.log(res);
    });

    axios.get("http://localhost:4000/send-true-false-frontend-if-credentials-ok").then((res) => {
      console.log(res);
      if (Object.values(res).includes(false)) {
        setPasswordExists(false);
      };

      if (passwordExists === false) {
        return;
      };

      if (Object.values(res).includes(true)) {
        setPasswordExists(true);
        axios.get("http://localhost:4000/register-database",{params: { userName: userName, userPassword: userPassword, userEmail: userEmail}}).then((res) => {
          console.log(res);
        });
      };
    });
    
  };

  if (redirectToLoginPage === true) {
    redirectToLoginPage = null;
    return window.location.replace("/");
  };

  console.log(passwordExists);

  const showPasswordFunction = () => {
    setShowPassword(true);
    setShowPassword(!showPassword);
  };

  return (

    <div>

      <div className="navigation-bar-register">

        <h3 className="welcome-text-register">Welcome to your Contact Page</h3>

        <button onClick={sendUserToLoginPage} className="send-to-login-button">Go to Login Page</button>

      </div>

      <div className="register-square">

      <h1 className="register-presentation" >Register Page</h1>

      <h4 className="register-information-about-credentials" >Please make sure that your password contains 1 number, 1 special character and a length of 6 characters</h4>

      <IoPerson className="person-icon-register"/>
      
      <input className="register-input" onChange={eventUserName} placeholder="Your username"></input>

      <IoKeySharp className="key-icon-register"/>

      {showPassword === false ? <input className="register-input" type="password" onChange={eventUserPassword} placeholder="Your password"></input> : <input className="register-input" onChange={eventUserPassword} placeholder="Your password"></input>}
      
      <IoAtSharp className="sharp-icon-register"/>

      <input className="register-input" type="email" onChange={eventUserEmail} placeholder="Your Email"></input>


        
        {trueFalseSubmitButton === true ? <button className="register-page-register-button" onClick={handleSubmit}>Create Account</button> : <div className="loader-registration"></div>}

        <button className="show-password-page-register-button" onClick={showPasswordFunction}>Show Password</button>

      <Link className="link-to-login" to="/">Go to login page</Link>
      

      </div>

      <div>
        {userTypedCredentials === false && <h2 className="advertence-message-register-page" >You don't have fill the input boxes</h2>}

        {userTypedCredentials === true && <h2 className="advertence-message-register-page" >You have created Your account successfully</h2>}

        {correctEmail === false && <h2 className="advertence-message-register-page" >You don't have typed a correct email please verify that contains @gmail.com at the end</h2>}

        {hasPasswordNumbers === false && <h2 className="advertence-message-register-page" >Please make sure that your password have one number and special character like myPassword1#</h2>}

        {hasPasswordSpecialCharacters === false && <h2 className="advertence-message-register-page" >Please make sure that your password have one special character and a number like myPassword1#</h2>}

        {hasPasswordLess6Characters === false && <h2 className="advertence-message-register-page" >Please make sure that your password have 6 characters</h2>}

        {passwordExists === false ? <> <h2 className="advertence-message-register-page" >This account credentials or email already exists, refreshing page!....</h2>{setTimeout(() => {window.location.reload(false);}, "5000")} </> : void(0)}

        {passwordExists === true && <> <h2 className="advertence-message-register-page" >You have created your account!</h2> {setRedirectToLoginPage(true)} </>}

      </div>

    </div>
    
  )
};

export default RegisterPage;
