import React from "react";
import MainPageContacts from "./MainPageContacts";

const ProtectedRoute = () => {
  var getDataFromLoginPage = JSON.parse(localStorage.getItem("_isTrue"));
  //It will show Protected Route because the variable isVerified is a null, to change that make it true

  if ( getDataFromLoginPage === true) {
		return <MainPageContacts />
	};

  console.log("-----------------");
  console.log("getData is ",getDataFromLoginPage)
	console.log("-----------------");

	return <h1>You are not authorized to enter this page please login first!</h1>
};

export default ProtectedRoute;
