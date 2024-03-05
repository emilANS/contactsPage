import React, { useState, useReducer , useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import FilteredInformationMap from "./MainPageContactsComponents/FilteredInformationMap";

import SavedContactsMap from "./MainPageContactsComponents/SavedContactsMap";

import AddedContactsMap from "./MainPageContactsComponents/AddedContactsMap";

import MainPageContactsCss from "../styleCss/MainPageContactsCss.css"

const MainPageContactsTest = () => {

  // useStates

  let [showUserNameInPresentation, setShowUserNameInPresentation] = useState();

  // Where all the contact information is stored
  let [addSheet, setAddSheet] = useState([]);

  // Where all the saved contacts information is stored
  let [showSavedContacts, setShowSavedContacts] = useState([]);

  // Id sended from backend to work with the database when the user log in and log out
  let [idFromBackend, setIdFromBackend] = useState(null);

  // Temporary id to each contact added to the list
  let [temporaryId, setTemporaryId] = useState(uuidv4());

  // Number of times edit is clicked so a contact cant be changed when one is being changed
  let [numberOfTimesEditIsClicked, setNumberOfTimesEditIsClicked] = useState(0);

  // This works for force the update of a certain part of the page
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  
  // This useState limits the map method go to line 257 to more information!
  let [limitMapMethod, setLimitMapMethod] = useState(false);
  
  // The useState where the hexadecimal value of the image is
  let [hexImage , setHexImage] = useState(null);

  // The useState where the hexadecimal value is converted in image
  let [hexImageConvertedToNormalImage, setHexImageConvertedToNormalImage] = useState([]);

  let [image, setImage] = useState(null);

  let [editedImage, setEditedImage] = useState(false);
  let [savedContactEditedImage,setSavedContactEditedImage] = useState(false);
  let [wasSavedImageDeleted, setWasSavedImageDeleted] = useState(false);

  let [userHasSubmittedNoImage, setUserHasSubmittedNoImage] = useState(false);

  let [saveDeleteImage, setSaveDeleteImage] = useState(false);

  let [changeImageAndSendToBackend, setChangeImageAndSendToBackend] = useState(false);

  let [userName, setUserName] = useState("");
  let [submittedUserName, setSubmittedUserName] = useState("");

  let [email, setEmail] = useState("");
  let [submittedEmail, setSubmittedEmail] = useState("");

  let [age, setAge] = useState("");
  let [submittedAge, setSubmittedAge] = useState("");

  let [address, setAddress] = useState("");
  let [submittedAddress, setSubmittedAddress] = useState("");

  let [inputsEmptyDeleteMessage, setInputsEmptyDeleteMessage] = useState(false);

  let [preventUserFromModifyingAndCreatingAEmptyContact, setPreventUserFromModifyingAndCreatingAEmptyContact] = useState(false);

  let [preventUserFromDisconnecting, setPreventUserFromDisconnecting] = useState(false);
  
  let [preventUserFromDisconnectingWhenContactIsCreated, setPreventUserFromDisconnectingWhenContactIsCreated] = useState(null);

  let containInputs = userName + email + age + address;



  let [searchBarText, setSearchBarText] = useState("");
  
  let [containedSearchBarText, setContainedSearchBarText] = useState("");
  
  let [filteredInformation, setFilteredInformation] = useState([]);
  
  let [filteredSavedInformation, setFilteredSavedInformation] = useState([]);

  let [noContactsFounded, setNoContactsFounded] = useState(false);

  let [showSearchedContact, setShowSearchedContact] = useState(false);

  let [wasSearchedClickedMoreThanOneTime, setWasSearchedClickedMoreThanOneTime] = useState(false);

  let [atLeastOneCheckboxNeedsToBeMarked, setAtLeastOneCheckboxNeedsToBeMarked] = useState(false);

  // Creating events for each useState

  const eventUserName = (event) => {
    setUserName(event.target.value);
  };

  const eventSubmittedUserName = (event) => {
    setSubmittedUserName(event.target.value);
  };

  const eventAge = (event) => {
    setAge(event.target.value);
  };

  const eventSubmittedAge = (event) => {
    setSubmittedAge(event.target.value);
  };

  const eventAddress = (event) => {
    setAddress(event.target.value);
  };

  const eventSubmittedAddress = (event) => {
    setSubmittedAddress(event.target.value);
  };

  const eventEmail = (event) => {
    setEmail(event.target.value);
  };

  const eventSubmittedEmail = (event) => {
    setSubmittedEmail(event.target.value);
  };
  


  const eventSearchBarPrompt = (event) => {
    setSearchBarText(event.target.value);
  }

  console.log("contained",containedSearchBarText)


  // This is the arrow function for searching in the contacts for a specific profile
  const handleSearchBar = () => {

    
    

    // This works for showing the content of the text in the search bar in the html
    setContainedSearchBarText(searchBarText);


    // Search by Name
    if (document.getElementById("checkBoxName").checked === true) {

      // Filter addSheet for searching by user name
      const filterAddedContacts = addSheet.filter((filteredContact) => {
  
        if (filteredContact.usedUserName.toLowerCase() === searchBarText.toLowerCase()) {
  
          setShowSearchedContact(true);
          
          return filteredContact.usedUserName;
        };
        
  
      });
  
      // Filter showSavedContacts for searching by user name
      const filterSavedContacts = showSavedContacts.filter((filteredSavedContact) => {
        
         if (filteredSavedContact.userName.toLowerCase() === searchBarText.toLowerCase()) {
           
           setShowSearchedContact(true);
  
           return filteredSavedContact.userName;
           
          };
  
        });
        
        
        /* Set the information to the filtered useStates */
        setFilteredInformation(filterAddedContacts);
        
        setFilteredSavedInformation(filterSavedContacts);

    };



    // Search by Address
    if (document.getElementById("checkBoxAddress").checked === true) {

      // Filter addSheet for searching by address
      const filterAddedContacts = addSheet.filter((filteredContact) => {
  
        if (filteredContact.usedAddress === searchBarText) {
  
          setShowSearchedContact(true);
          
          return filteredContact.usedAddress;
        };
        
  
      });
  
      // Filter showSavedContacts for searching by address
      const filterSavedContacts = showSavedContacts.filter((filteredSavedContact) => {
        
         if (filteredSavedContact.address === searchBarText) {
           
           setShowSearchedContact(true);
  
           return filteredSavedContact.address;
           
          };
  
        });
        
        /* Set the information to the filtered useStates */
        setFilteredInformation(filterAddedContacts);
        
        setFilteredSavedInformation(filterSavedContacts);

    };


    // Search by Email
    if (document.getElementById("checkBoxEmail").checked === true) {

      // Filter addSheet for searching by email
      const filterAddedContacts = addSheet.filter((filteredContact) => {
  
        if (filteredContact.usedEmail === searchBarText) {
  
          setShowSearchedContact(true);
          
          return filteredContact.usedEmail;
        };
        
  
      });
  
      // Filter showSavedContacts for searching by email
      const filterSavedContacts = showSavedContacts.filter((filteredSavedContact) => {
        
         if (filteredSavedContact.email === searchBarText) {
           
           setShowSearchedContact(true);
  
           return filteredSavedContact.email;
           
          };
  
        });
  
  
        /* Set the information to the filtered useStates */
        setFilteredInformation(filterAddedContacts);
        
        setFilteredSavedInformation(filterSavedContacts);

    };

    if (filteredInformation.length !== 0 || filteredSavedInformation !== 0) {

      /* If the length of the list of filtered information is not equal to zero then changing the useState to false */

      setNoContactsFounded(false);
    };

    /* every time searched is clicked this turns into true */
    setWasSearchedClickedMoreThanOneTime(true);
    
  };
  
  useEffect(() => {

    if (wasSearchedClickedMoreThanOneTime === true && filteredInformation.length === 0 && filteredSavedInformation.length === 0) {

      setNoContactsFounded(true);
  
    };

  }, [noContactsFounded, filteredInformation, filteredSavedInformation, wasSearchedClickedMoreThanOneTime]);


  const receivingCheckBoxesValues = () => {

    if (document.getElementById("checkBoxName").checked === false && document.getElementById("checkBoxAddress").checked === false &&
    document.getElementById("checkBoxEmail").checked === false) {

      document.getElementById("checkBoxName").checked = true;

      setAtLeastOneCheckboxNeedsToBeMarked(true);

    } else if (atLeastOneCheckboxNeedsToBeMarked === true) {

      setAtLeastOneCheckboxNeedsToBeMarked(false);

    };

  };



  const showAllContactsAgain = () => {
    
    setFilteredInformation([]);

    setShowSearchedContact(false);

    setWasSearchedClickedMoreThanOneTime(false);

    setNoContactsFounded(false);

  };
  
  
  
  // Arrow Function for uploading photos and prepare it to send it to backend as binary
  const onImageChange = (event) => {

    // Image upload function
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    };
    
    
    if (event.target.files.length === 0) {
      setImage(null);
    };

  };


  // This deletes image in the creator of contacts section
  const deleteImageInCreatorOfContacts = () => {

    setImage(null);

    setTimeout(() => {
      document.getElementById("input-image").value = "";
    }, "800");

  };

  
  // Receiving the username of the user from backend to show it in the presentation of the page
  axios.get("http://localhost:4000/send-userName-to-frontend",{params: { idFromBackend : idFromBackend }}).then((res) => {
    setShowUserNameInPresentation(res.data);
  });


  // Getting the id again when the page is refreshed with sessionStorage getItem and JSON.parse
  let getIdFromBackendSessionStorage = sessionStorage.getItem("_res.dataIdFromBackend");
  
  let parseIdFromBackendSessionStorage = JSON.parse(getIdFromBackendSessionStorage);
  
  // Sends again the saved contacts to frontend when the page is reloaded
  let wasPageRefreshed = window.performance.navigation

  useEffect(() => {
    // if the page was refreshed send contacts again from the database
    if (wasPageRefreshed.type !== 0) {

      axios.get("http://localhost:4000/send-contacts-to-correspondent-user-when-refresh-to-frontend",{params: { parseIdFromBackendSessionStorage : parseIdFromBackendSessionStorage }}).then((res) => {
        setIdFromBackend(parseIdFromBackendSessionStorage);
      
        setShowSavedContacts(res.data);
      });

    };

    // If the page was not refreshed yet continue sending the contacts from the database
    if (wasPageRefreshed.type === 0) {
      // Receiving from backend the saved contacts from the database
      // Executing the process of SELECT in the database in base of the changed id
      axios.get("http://localhost:4000/send-contacts-to-frontend-when-id-is-equal",{params: {  }}).then((res) => {
        setShowSavedContacts(res.data);
      });

      axios.get("http://localhost:4000/send-id-to-frontend",{params: {  }}).then((res) => {
        setIdFromBackend(res.data);

        sessionStorage.setItem("_res.dataIdFromBackend", JSON.stringify(res.data))
      });

    };
  }, []);


  // Executing this function when the user closes the page so the database knows if the user leaved the page
  

  if (preventUserFromDisconnecting !== true) {
    onbeforeunload = () => {
      axios.get("http://localhost:4000/send-0-when-user-logged-out",{params: { idFromBackend : idFromBackend }});
    };
  };

  
  // Url to send user back to home page and put the user is logged to 0
  let LogOutUser = (event) => {

    if (preventUserFromDisconnectingWhenContactIsCreated === true) {
      
      event.preventDefault();
      
    } else {
      
      axios.get("http://localhost:4000/send-0-when-user-logged-out",{params: { idFromBackend : idFromBackend }});
      
    };
    
    
  };
  
  
  // Send 1 to database so the user cant enter if he have the account already logged
  axios.get("http://localhost:4000/send-1-when-user-logged-in",{params: { idFromBackend : idFromBackend }});


  // Adding a contact function
  const handleSubmit = (event) => {

    // This if statement prevent user from disconnecting when submits a image 
    if (image !== null) {
      setPreventUserFromDisconnecting(true);
    };

    // If image is equal to null prevent the form from submitting an image to database
    if (image === null || image === false) {
      event.preventDefault();
    };

    // When the user add a empty contact this will alert about the action of the user
    if (!containInputs.replace(/\s/g, '').length === true) {
      setInputsEmptyDeleteMessage(true);
      return;
    } else if (!containInputs.replace(/\s/g, '').length === false) {
      setInputsEmptyDeleteMessage(false);
    };

    // Adding an id to a contact
    let id = uuidv4();
    setTemporaryId(id);
    
    
    // Adding the information that the user gave to addSheet so it can be displayed
    setAddSheet([...addSheet, {usedUserName: userName , showUsernameInPhoto : submittedUserName , usedEmail: email ,
      usedAge: age , usedAddress: address , usedImage : image , imageWasUpdated : false , edit : false
      , evadeImageToBeDisplayedWhenNoImageIsUploaded : false , containedImage : null , id: temporaryId}]);

    // Restarting all values of inputs to it default value so the user can enter new contacts
    setImage(null);
    
    setUserName("");
    setEmail("");
    setAge("");
    setAddress("");
    
    setTimeout(() => {
      document.getElementById("input-image").value = "";
    }, "800");
    
    document.getElementById("input-add-sheet-userName").value = "";
    document.getElementById("input-add-sheet-email").value = "";
    document.getElementById("input-add-sheet-age").value = "";
    document.getElementById("input-add-sheet-address").value = "";

    // Sending contacts information to backend so it can be saved
    axios.get("http://localhost:4000/save-contacts-in-database",{params: { userName: userName , email: email , age: age , address: address , id : temporaryId , parseIdFromBackendSessionStorage : parseIdFromBackendSessionStorage }});

    setPreventUserFromDisconnectingWhenContactIsCreated(true);

    setTimeout(() => {

      setPreventUserFromDisconnectingWhenContactIsCreated(false);

    }, "2000");

  };
  

  
  useEffect(() => {
    if (image === null) {
      setPreventUserFromDisconnecting(false);
    };
  }, [preventUserFromDisconnecting])


  // Button to close the zero text pop up in the page
  const deleteZeroSubmittedInputText = () => {
    setInputsEmptyDeleteMessage(false);
  };


  console.log("filteredInformation",filteredInformation);

  console.log("savedFiltered", filteredSavedInformation);

  // Delete contact Function
  const DeleteContact = (selectedContact) => {

    axios.get("http://localhost:4000/delete-contact-and-send-to-database",{params: { deleteWithId : selectedContact.id , deleteSavedContactId : selectedContact.contactId }})


    // Deleting recently created contacts
    setAddSheet(addSheet.filter(contactProperties => contactProperties !== selectedContact));


    // Deleting saved contacts
    setShowSavedContacts(showSavedContacts.filter(contactProperties => contactProperties !== selectedContact));


    // Deleting filtered contacts
    setFilteredSavedInformation(filteredSavedInformation.filter(contactProperties => contactProperties !== selectedContact))


    // Deleting filtered contacts
    setFilteredInformation(filteredInformation.filter(contactProperties => contactProperties !== selectedContact))


    // Deleting images so they are not displayed again
    hexImageConvertedToNormalImage[selectedContact.rowOfTheObject] = false;

    hexImageConvertedToNormalImage[selectedContact.rowOfTheObject] = {imageUrl : showSavedContacts[selectedContact.rowOfTheObject + 1]?.imageUrlReadyToBeShowed};
    
  };


  // If statement to make the map work only one time and not lag the page
  if (limitMapMethod === false) {
    showSavedContacts && showSavedContacts?.map(hex => {
      // Store in useState hexImage the hex of the assigned contact
      setHexImage(hex["hex(image)"]);

      // Limit this map Method so it run only once
      setLimitMapMethod(true);
    });
  };


  // UseEffect for converting the hex data into the image that is going to be displayed in the saved contacts
  useEffect(() => {

    showSavedContacts && showSavedContacts?.map((rawHexImage) => {

      // Convert the string to bytes
      var bytes = new Uint8Array(rawHexImage["hex(image)"]?.length / 2);
      
      // For loop for extracting hex
      for (var i = 0; i < rawHexImage["hex(image)"]?.length; i += 2) {
      bytes[i / 2] = parseInt(rawHexImage["hex(image)"]?.substring(i, i + 2), 16);
    };

    // Make a Blob from the bytes
    var blob = new Blob([bytes], {type: 'image/bmp'});
    
    // Creating new image variable to store the Url of the image
    var hexConvertedIntoImageInsideUseEffect = new Image();

    // Set a useState with the image and store it
    setHexImageConvertedToNormalImage((prev => [... prev, { imageUrl : hexConvertedIntoImageInsideUseEffect.src = URL.createObjectURL(blob)}]));
    
    });
    
  }, [hexImage]);



  return (
      <div>
        
        <div className="navigation-bar-contacts">

        <h1 className="presentation">Welcome to your contact list, {showUserNameInPresentation}</h1>
 
        </div>



          <div className={wasSearchedClickedMoreThanOneTime === false ? "search-function-square" : "changed-search-function-square"}>
            
              <div>
                <Link to="/" onClick={LogOutUser}>Sign out account</Link>
              </div>

            <h1 className="search-bar-presentation">Search Bar:</h1>

            <div>


            <input className="search-bar-input" placeholder="search your contacts here" onChange={eventSearchBarPrompt}></input>
            <button className="search-button" onClick={handleSearchBar}>Search</button>

            {atLeastOneCheckboxNeedsToBeMarked === true && <h4>You cant mark all checkboxes as empty...</h4>}

            <h3 className="searchByName">Search By Name</h3>
            
            <input type="checkbox" id="checkBoxName" onChange={receivingCheckBoxesValues} defaultChecked={true}></input>

            <h3 className="searchByAddress">Search By Address</h3>

            <input type="checkbox" id="checkBoxAddress" onChange={receivingCheckBoxesValues}></input>

            <h3 className="searchByEmail">Search By email</h3>

            <input type="checkbox" id="checkBoxEmail" onChange={receivingCheckBoxesValues}></input>
            
            <br></br>
            
          </div>

          <button className="show-contacts-again-search" onClick={showAllContactsAgain}>Show all contacts</button>

          <br></br>

          </div>

          {wasSearchedClickedMoreThanOneTime === false && noContactsFounded === false ? 
          
          <div className="add-contact-container">

          <h1 className="add-contacts-message">Add your Contacts here!</h1>

          <div className="add-contact-image-container">

            {image === null ? <Avatar name={userName} color="purple" round="30px"/> : <Avatar src={image} color="purple" round="30px"/>} 



            <form id="main-form" action="http://localhost:4000/send-image-to-backend" encType="multipart/form-data" method="post">
              
              <label className="upload-image-button">
                  
                <input id="input-image" type="file" name="imageSendToBackend" onChange={onImageChange}/>
                Add Image

              </label>
              
            </form>


              
          </div>
          

          {image !== null || false ? <> <br></br> <button className="delete-image-add-contact" onClick={deleteImageInCreatorOfContacts}>Delete Image</button> </> : void(0)}
          

            <div>

              <input maxLength="29" id="input-add-sheet-userName" onChange={eventUserName} placeholder="Type Name of the contact"></input>
              <input maxLength="29" className="secondary-inputs" id="input-add-sheet-email" onChange={eventEmail} placeholder="Type Email of the contact"></input>
              <input maxLength="29" className="secondary-inputs" id="input-add-sheet-age" onChange={eventAge} placeholder="Type Age of the contact"></input>
              <input maxLength="29" className="secondary-inputs" id="input-add-sheet-address" onChange={eventAddress} placeholder="Type Address of the contact"></input>

            </div>
            
            <input className="add-contact-button" type="submit" form="main-form" value="Add Contact!" onClick={handleSubmit}></input>
          
          </div>


          : // <=== Double dot to continue ternary operator

          <h1 className="searched-contacts-result">Searched Contacts with <br></br>{containedSearchBarText}:</h1>
          
          }

        {noContactsFounded === true && <h2 className="no-contacts-founded-message">There are no contacts with that information</h2>}


        {inputsEmptyDeleteMessage === true && <> <h1 className="empty-inputs-add-contact">You have created a contact with zero values</h1>
        <button className="add-contact-button" onClick={deleteZeroSubmittedInputText}>I Understand, delete this message</button> </> }


        {/* here */}

        <FilteredInformationMap filteredInformation={filteredInformation} showSearchedContact={showSearchedContact}

        setPreventUserFromModifyingAndCreatingAEmptyContact={setPreventUserFromModifyingAndCreatingAEmptyContact} preventUserFromModifyingAndCreatingAEmptyContact={preventUserFromModifyingAndCreatingAEmptyContact}

        DeleteContact={DeleteContact} filteredSavedInformation={filteredSavedInformation} showSavedContacts={showSavedContacts}

        setEditedImage={setEditedImage} editedImage={editedImage} setImage={setImage} image={image}

        submittedUserName={submittedUserName} setSubmittedUserName={setSubmittedUserName} 
        
        submittedEmail={submittedEmail} setSubmittedEmail={setSubmittedEmail}

        submittedAge={submittedAge} setSubmittedAge={setSubmittedAge}
        
        submittedAddress={submittedAddress} setSubmittedAddress={setSubmittedAddress}

        userHasSubmittedNoImage={userHasSubmittedNoImage} setUserHasSubmittedNoImage={setUserHasSubmittedNoImage}
        
        changeImageAndSendToBackend={changeImageAndSendToBackend} setChangeImageAndSendToBackend={setChangeImageAndSendToBackend}

        savedContactEditedImage={savedContactEditedImage} setSavedContactEditedImage={setSavedContactEditedImage}
        
        wasSavedImageDeleted={wasSavedImageDeleted} setWasSavedImageDeleted={setWasSavedImageDeleted}

        saveDeleteImage={saveDeleteImage} setSaveDeleteImage={setSaveDeleteImage}
        
        numberOfTimesEditIsClicked={numberOfTimesEditIsClicked} setNumberOfTimesEditIsClicked={setNumberOfTimesEditIsClicked}
        
        hexImageConvertedToNormalImage={hexImageConvertedToNormalImage} setHexImageConvertedToNormalImage={setHexImageConvertedToNormalImage}
        
        forceUpdate={forceUpdate} eventSubmittedUserName={eventSubmittedUserName}

        eventSubmittedEmail={eventSubmittedEmail} eventSubmittedAge={eventSubmittedAge} eventSubmittedAddress={eventSubmittedAddress} />

        
        {noContactsFounded === false ? 

        <div>
        
        {/* Here savedContactsMap is showed */}

        <SavedContactsMap showSavedContacts={showSavedContacts}

        setPreventUserFromModifyingAndCreatingAEmptyContact={setPreventUserFromModifyingAndCreatingAEmptyContact} preventUserFromModifyingAndCreatingAEmptyContact={preventUserFromModifyingAndCreatingAEmptyContact}

        submittedUserName={submittedUserName} setSubmittedUserName={setSubmittedUserName} 
        
        submittedEmail={submittedEmail} setSubmittedEmail={setSubmittedEmail}

        submittedAge={submittedAge} setSubmittedAge={setSubmittedAge}
        
        submittedAddress={submittedAddress} setSubmittedAddress={setSubmittedAddress}

        userHasSubmittedNoImage={userHasSubmittedNoImage} setUserHasSubmittedNoImage={setUserHasSubmittedNoImage}
        
        changeImageAndSendToBackend={changeImageAndSendToBackend} setChangeImageAndSendToBackend={setChangeImageAndSendToBackend}

        savedContactEditedImage={savedContactEditedImage} setSavedContactEditedImage={setSavedContactEditedImage}
        
        wasSavedImageDeleted={wasSavedImageDeleted} setWasSavedImageDeleted={setWasSavedImageDeleted}

        saveDeleteImage={saveDeleteImage} setSaveDeleteImage={setSaveDeleteImage}
        
        numberOfTimesEditIsClicked={numberOfTimesEditIsClicked} setNumberOfTimesEditIsClicked={setNumberOfTimesEditIsClicked}
        
        showSearchedContact={showSearchedContact} setShowSearchedContact={setShowSearchedContact}
        
        hexImageConvertedToNormalImage={hexImageConvertedToNormalImage} setHexImageConvertedToNormalImage={setHexImageConvertedToNormalImage}
        
        forceUpdate={forceUpdate} DeleteContact={DeleteContact} eventSubmittedUserName={eventSubmittedUserName}

        eventSubmittedEmail={eventSubmittedEmail} eventSubmittedAge={eventSubmittedAge} eventSubmittedAddress={eventSubmittedAddress}/>


        {/* Here AddedContactsMap is showed */}

        <AddedContactsMap addSheet={addSheet} setImage={setImage} image={image}

        setEditedImage={setEditedImage} editedImage={editedImage}

        submittedUserName={submittedUserName} setSubmittedUserName={setSubmittedUserName} 

        submittedEmail={submittedEmail} setSubmittedEmail={setSubmittedEmail}

        submittedAge={submittedAge} setSubmittedAge={setSubmittedAge}

        submittedAddress={submittedAddress} setSubmittedAddress={setSubmittedAddress}

        userHasSubmittedNoImage={userHasSubmittedNoImage} setUserHasSubmittedNoImage={setUserHasSubmittedNoImage}

        changeImageAndSendToBackend={changeImageAndSendToBackend} setChangeImageAndSendToBackend={setChangeImageAndSendToBackend}

        savedContactEditedImage={savedContactEditedImage} setSavedContactEditedImage={setSavedContactEditedImage}

        wasSavedImageDeleted={wasSavedImageDeleted} setWasSavedImageDeleted={setWasSavedImageDeleted}

        setPreventUserFromModifyingAndCreatingAEmptyContact={setPreventUserFromModifyingAndCreatingAEmptyContact} preventUserFromModifyingAndCreatingAEmptyContact={preventUserFromModifyingAndCreatingAEmptyContact}

        saveDeleteImage={saveDeleteImage} setSaveDeleteImage={setSaveDeleteImage}

        numberOfTimesEditIsClicked={numberOfTimesEditIsClicked} setNumberOfTimesEditIsClicked={setNumberOfTimesEditIsClicked}

        showSearchedContact={showSearchedContact} setShowSearchedContact={setShowSearchedContact}

        hexImageConvertedToNormalImage={hexImageConvertedToNormalImage} setHexImageConvertedToNormalImage={setHexImageConvertedToNormalImage}

        forceUpdate={forceUpdate} DeleteContact={DeleteContact} eventSubmittedUserName={eventSubmittedUserName}

        eventSubmittedEmail={eventSubmittedEmail} eventSubmittedAge={eventSubmittedAge} eventSubmittedAddress={eventSubmittedAddress} />
        
        </div>

        : // <=== double dot to continue ternary operator
        
        void(0)
        
        }

        


      </div>
      
  )
};

export default MainPageContactsTest;
