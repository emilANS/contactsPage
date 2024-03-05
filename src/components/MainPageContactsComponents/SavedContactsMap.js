import React from "react";
import axios from "axios";
import Avatar from "react-avatar";


const SavedContactsMap = (data) => {
    
    let htmlBodySavedContacts = [];

    {data.showSearchedContact === false &&

    data.showSavedContacts && data.showSavedContacts?.map(savedContactProperties => {

      

      // Add new keys and values to the showSavedContacts object for changing images
      data.showSavedContacts.map((editContact) => {
        if (editContact === editContact) {
          Object.assign(savedContactProperties, {doesContactHaveSavedImageFromBackend : false , showImageInEditMode : false 
          , imageInEditMode : false , wasImageEditedMoreThanOneTime : false , wasImageDeleted : false , rowOfTheObject : null})
        };
      });

      
      // If image is different to null show the saved image when user enter his account
      if (savedContactProperties["hex(image)"] !== "") {
        // Assigning a image URL to each contacts so it can be displayed in the user contacts
        for (let lengthOfTheObject = 0; lengthOfTheObject < Object.keys(data.showSavedContacts).length; lengthOfTheObject++) {

          // Add to imageUrlReadyToBeShowed a image from the backend corresponding the number of the contact so the image is displayed in the correct contact
          data.showSavedContacts[lengthOfTheObject].imageUrlReadyToBeShowed = Object.values(data.hexImageConvertedToNormalImage[lengthOfTheObject] || {}).toString();

          // This works for the program to know if the contact have a saved image from backend
          data.showSavedContacts[lengthOfTheObject].doesContactHaveSavedImageFromBackend = true;

          // Assigning the position where the object is so the image is not replaced
          data.showSavedContacts[lengthOfTheObject].rowOfTheObject = lengthOfTheObject;

        };
      };


      // This function works for adding the value false when image is equal to null so the imageUrlReadyToBeShowed can be used and not add unnecessary values
      for (let lengthOfTheObject = 0; lengthOfTheObject < Object.keys(data.showSavedContacts).length; lengthOfTheObject++) {

        if (data.showSavedContacts[lengthOfTheObject].image === null) {

            data.showSavedContacts[lengthOfTheObject].imageUrlReadyToBeShowed = false;

        };

      };

      
      const changeProperties = () => {

      /*  This if condition function is if numberOfTimesEditIsClicked is
          if one contact is being edited it will not edit another one   */
          if (data.numberOfTimesEditIsClicked === 2) {
            return;
          };
          
          // Here is set the value 2 every time changeProperties is clicked
          data.setNumberOfTimesEditIsClicked(2);

          
          /* This many setsUseState works for putting the new values
          in the contact when change properties is clicked  */
          data.setSubmittedUserName(savedContactProperties.userName);
          
          data.setSubmittedEmail(savedContactProperties.email);
          
          data.setSubmittedAge(savedContactProperties.age);
          
          data.setSubmittedAddress(savedContactProperties.address);
          

          // Makes contactProperties.edit true so the contact can be edited
          savedContactProperties.editSavedContact = 1;
          

          // Forces update when the user finish of change properties so it can be displayed in screen
          data.forceUpdate();

        };


        if (savedContactProperties.editSavedContact === 1) {
          savedContactProperties.showImageInEditMode = true;
        };

        
        const changeImage = (event) => {

          // Get the value of the input in the form for know if the user has uploaded a image
          let imageHasValue = document.getElementById("input-change-image-saved-contacts");

          if (imageHasValue.files.length === 0) {

            // This is set to true because user has submitted no image
            data.setUserHasSubmittedNoImage(true);

          } else if (imageHasValue.files.length) {
            
            data.setChangeImageAndSendToBackend(true);

            data.setSavedContactEditedImage(URL.createObjectURL(event.target.files[0]));

            // set WasSavedImageDeleted to false because a image was added so the image will not be showed as deleted
            data.setWasSavedImageDeleted(false);

            // Fix this !!!

            
            // If there is a saved image in the contacts change this properties
            if (savedContactProperties["hex(image)"] !== "") {

              savedContactProperties.image = null;
          
              savedContactProperties.evadeImageFromRepeating = false;

              savedContactProperties["hex(image)"] = "";

              savedContactProperties.showImageInEditMode = true;

              savedContactProperties.doesContactHaveSavedImageFromBackend = false;

            };


          };

          
        };

          
        // Function to delete photo when the contact is in edit mode
        const deleteSavedPhoto = () => {

          // Converting image to false so the image on the contact picture is not displayed and others to their default value
          savedContactProperties.image = null;
          
          savedContactProperties.evadeImageFromRepeating = false;

          savedContactProperties["hex(image)"] = "";

          savedContactProperties.imageInEditMode = false;

          savedContactProperties.showImageInEditMode = false;

          // delete this if unnecessary
          savedContactProperties.doesContactHaveSavedImageFromBackend = false;
          

          // setSaveDeletePhoto true so when the user clicks the saveNewProperties button function can delete the photo and not delete the photo instantly
          data.setSaveDeleteImage(true);

          // set WasSavedImageDeleted to true because the image was deleted and it can be displayed the image as a deleted in the contact
          data.setWasSavedImageDeleted(true)

          // Force Update so the removed image can be displayed
          data.forceUpdate();

        };


        // if wasSavedImageDeleted is true modify the object value to true so the image can be displayed as deleted if not don't show the image as a deleted one
        if (data.wasSavedImageDeleted === true) {
          savedContactProperties.wasImageDeleted = true;
        } else {
          savedContactProperties.wasImageDeleted = false;
        };
      


        const saveNewProperties = (event) => {

          if (data.submittedUserName === "" && data.submittedAge === "" && data.submittedAddress === ""
        && data.submittedEmail === "") {

          data.setPreventUserFromModifyingAndCreatingAEmptyContact(true);

          event.preventDefault();

          return;

        } else {

          data.setPreventUserFromModifyingAndCreatingAEmptyContact(false);

        };

          savedContactProperties.editSavedContact = 0;

          
          // SetNumberOfTimesEditIsClicked to 0 so the user can edit other contacts
          data.setNumberOfTimesEditIsClicked(0);
          

          // Get the value of the input of type file input-change-image-saved-contacts
          let imageHasValue = document.getElementById("input-change-image-saved-contacts");
          

          if (imageHasValue.files.length) {

            // This showSavedContacts.map works for saving all the changes made by the user
            data.showSavedContacts.map((editContact) => {
              if (editContact === editContact) {
                Object.assign(savedContactProperties, {userName : data.submittedUserName
                  , email: data.submittedEmail , age: data.submittedAge , address: data.submittedAddress
                  , image : data.savedContactEditedImage
                  , imageUrlReadyToBeShowed : false , evadeImageFromRepeating : true
                });
                };
            });

          } else if (imageHasValue.files.length === 0) {
            
            // This showSavedContacts.map works for saving all the changes made by the user
            data.showSavedContacts.map((editContact) => {
              if (editContact === editContact) {
                Object.assign(savedContactProperties, {userName : data.submittedUserName
                  , email: data.submittedEmail , age: data.submittedAge , address: data.submittedAddress 
                  , imageUrlReadyToBeShowed : false , evadeImageFromRepeating : false})
              };
            });

          };




          // This axios request gives the new properties of the contact in the database
          axios.get("http://localhost:4000/save-new-properties-of-contact-in-database",{params: { editedUserName: savedContactProperties.userName 
          , editedEmail : savedContactProperties.email , editedAge : savedContactProperties.age , editedAddress : savedContactProperties.address 
          , SaveNewPropertiesId : savedContactProperties.contactId }})
          



          // If these values are true delete the image that user choose and delete it in database
          if (imageHasValue.files.length === 0 && data.userHasSubmittedNoImage === true) {
            
            axios.get("http://localhost:4000/delete-image-and-send-to-backend",{params: { id : savedContactProperties.contactId }});

            data.setUserHasSubmittedNoImage(false);

            event.preventDefault();

          };


          // No Showing the image in edit properties of the contact to evade repetition in other contacts
          savedContactProperties.showImageInEditMode = false;

          data.setSavedContactEditedImage(false);


          // If image is deleted and edited more than one time change these properties so the image is not repeated 
          if (savedContactProperties.wasImageEditedMoreThanOneTime === false && savedContactProperties.wasImageDeleted === true) {

            savedContactProperties.imageInEditMode = false;

            savedContactProperties.image = null;

            savedContactProperties.imageUrlReadyToBeShowed = false;

          }


          // if saveDeletePhoto equals true send to database the id and the image is deleted
          if (data.saveDeleteImage === true) {
            axios.get("http://localhost:4000/delete-image-and-send-to-backend",{params: { id : savedContactProperties.contactId }});

            // returns the origin value of saveDeletePhoto
            data.setSaveDeleteImage(false);

          };


          // If these values are the false or null stop the image from uploading because was deleted see line 442 for more information
          if (savedContactProperties.doesContactHaveSavedImageFromBackend === false && savedContactProperties.image === null) {

            return;

          };


          if (imageHasValue.files.length && data.changeImageAndSendToBackend === true) {
            // Send id to backend of the new contact so it can be assigned his new image
            axios.get("http://localhost:4000/receive-id-from-frontend-for-change-image",{params: { id : savedContactProperties.contactId }});

            // Submit the form form-photo-change so it can be sended to backend
            document.getElementById("form-photo-change-send-to-backend-saved-contacts").submit();

            console.log("EXECUTED !")

            data.setChangeImageAndSendToBackend(false);
          };
      

          data.forceUpdate();

          
        };

        
        // Convert wasImageEditedMoreThanOneTime to true so the image can be saved and be showed when image is edited again
        if (savedContactProperties.evadeImageFromRepeating === true) {
          savedContactProperties.wasImageEditedMoreThanOneTime = true;
        };

        // if Image is Different to null and showImageInEditMode equal true so the page can know if the image was edited more than one time see line 588
        if (savedContactProperties.image !== null && savedContactProperties.showImageInEditMode === true) {
          savedContactProperties.wasImageEditedMoreThanOneTime = true;
        };


        // Show image in edit mode so the user can see the image is uploading during the user is changing properties
        if (savedContactProperties.showImageInEditMode === true) {
          
         /*  savedContactProperties.wasImageEditedMoreThanOneTime = true; */

          if (savedContactProperties.wasImageEditedMoreThanOneTime === false && savedContactProperties.wasImageDeleted === false) {
            
            savedContactProperties.imageInEditMode = data.savedContactEditedImage;
            
          }else if (savedContactProperties.wasImageEditedMoreThanOneTime === true && savedContactProperties.wasImageDeleted === false && savedContactProperties.image !== null) {
            
            savedContactProperties.imageInEditMode = data.image;
            
          }else if (savedContactProperties.wasImageEditedMoreThanOneTime === true && savedContactProperties.imageInEditMode === null || savedContactProperties.image === null && savedContactProperties.wasImageDeleted === false) {
    
            savedContactProperties.imageInEditMode = data.savedContactEditedImage


          };


          // This if statement works when a saved contact have a image from server when you try to change the properties of the image it don't display
          if(savedContactProperties.wasImageEditedMoreThanOneTime === true && savedContactProperties.imageInEditMode === null 
            && savedContactProperties.image !== null && savedContactProperties["hex(image)"] === "" && data.savedContactEditedImage !== false
            )  /* Here the if statement continues */  {
            savedContactProperties.image = data.savedContactEditedImage;
          };

        };


        if (data.userHasSubmittedNoImage === true || savedContactProperties.image === false) {

          // Assigning no image when user no upload a image to the contact or deletes it
          savedContactProperties.imageUrlReadyToBeShowed = false;

          savedContactProperties.image = false;

          savedContactProperties.evadeImageFromRepeating = false;

        };
      
      // Showing the saved contact


      htmlBodySavedContacts.push(

    savedContactProperties.editSavedContact === 0 ?
    
    <div key={savedContactProperties}>

      <div className="contact-square">

      {data.preventUserFromModifyingAndCreatingAEmptyContact === true && <h2>Please don't create a empty contact</h2>}

      <div className="image-container">

        {savedContactProperties.doesContactHaveSavedImageFromBackend === false ?
        
          <Avatar src={savedContactProperties.image} name={savedContactProperties.userName} color="purple" round="30px"/>
        
        :
        
          <Avatar src={savedContactProperties.imageUrlReadyToBeShowed} name={savedContactProperties.userName} color="purple" round="30px"/>
        
        }

      </div>
      
      {savedContactProperties.userName === "" ? 
        void(0)

      :

      <div className="information-about-user">

      <h1 className="information-about-user-name-presentation">Name of the contact</h1>
      <h2 className="information-about-user-name">{savedContactProperties.userName}</h2>

      </div>

      }


      {savedContactProperties.email === "" ? 
        void(0)
        
      :

      <div className="information-about-user">

      <h1 className="information-about-user-email-presentation">Email of the contact</h1>
      <h2 className="information-about-user-email">{savedContactProperties.email}</h2>

      </div>

      }

      
      {savedContactProperties.age === "" ? 
        void(0)

      :
      
      <div className="information-about-user">

      <h1 className="information-about-user-age-presentation">Age of the contact</h1>
      
      <h2 className="information-about-user-age">{savedContactProperties.age}</h2>

      </div>

      }

      
      {savedContactProperties.address === "" ? 
        void(0)

      :

      <div className="information-about-user">

      <h1 className="information-about-user-address-presentation">Address of the contact</h1>

      <h2 className="information-about-user-address">{savedContactProperties.address}</h2>

      </div>

      }


      <button className="contact-button" onClick={changeProperties}>Change properties of this contact</button>

        <div>

          <button className="contact-button" onClick={() => data.DeleteContact(savedContactProperties)}>Delete this Contact</button>
        
        </div>

      </div>

    </div>

    : // <=== Double dot to continue ternary operator

    <div key={savedContactProperties}>

      <div className="contact-square">


        <div className="change-properties-contact-image">


        {savedContactProperties.doesContactHaveSavedImageFromBackend === false ?
        
        <>
            {
              // here is the error delete this when finish
              savedContactProperties.wasImageEditedMoreThanOneTime === true && savedContactProperties.image !== null ? 
              
              <><Avatar src={savedContactProperties.image}  color="purple" round="30px"/>
              <div>
                <button className="delete-image-button" onClick={deleteSavedPhoto}>Delete Photo</button> 
              </div>
            </>

              : // <=== Double dot to continue ternary operator

            savedContactProperties.imageInEditMode === false  ? 
            
            <Avatar name={data.submittedUserName} color="purple" round="30px"/>
            
            : // <=== Double dot to continue ternary operator
            
            <><Avatar src={savedContactProperties.imageInEditMode}  color="purple" round="30px"/>
              <div>
                <button className="delete-image-button" onClick={deleteSavedPhoto}>Delete Photo</button> 
              </div>
            </>

            }
        
        </>
          
        : // <=== Double dot to continue ternary operator
        
        <>
            {
              
              savedContactProperties.image === null || savedContactProperties.image === false  ? 
              
              <Avatar name={data.submittedUserName} color="purple" round="30px"/>
              
              : // <=== Double dot to continue ternary operator
              
              <><Avatar src={savedContactProperties.imageUrlReadyToBeShowed}  color="purple" round="30px"/>
                <div>
                  <button className="delete-image-button" onClick={deleteSavedPhoto}>Delete Photo</button> 
                </div>
              </>
            }

          </>
        }

        </div>

        <form id="form-photo-change-send-to-backend-saved-contacts" action="http://localhost:4000/change-image-and-send-to-backend" encType="multipart/form-data" method="post">
                
          <label className="upload-image-button">

              <input className="select-image-button" id="input-change-image-saved-contacts" type="file" name="changeImageAndSendToBackendInput" onChange={changeImage}></input>
              Add Image
              
          </label>
                  
        </form>

        <h1 className="information-about-contact-presentation-name">Name of the contact</h1>

        <input maxLength="29" className="input-change-properties" defaultValue={savedContactProperties.userName} onChange={data.eventSubmittedUserName}></input>

        <h1 className="information-about-contact-presentation-email">Email of the contact</h1>

        <input maxLength="29" className="input-change-properties" defaultValue={savedContactProperties.email} onChange={data.eventSubmittedEmail}></input>

        <h1 className="information-about-contact-presentation-age">Age of the contact</h1>

        <input maxLength="29" className="input-change-properties" defaultValue={savedContactProperties.age} onChange={data.eventSubmittedAge}></input>

        <h1 className="information-about-contact-presentation-address">Address of the contact</h1>

        <input maxLength="29" className="input-change-properties" defaultValue={savedContactProperties.address} onChange={data.eventSubmittedAddress}></input>

        {data.preventUserFromModifyingAndCreatingAEmptyContact === true && <h2 className="advert-message-empty-contact">Please don't create a empty contact</h2>}

        <div>
          <input className="contact-button-save-properties" type="submit" value="Save new Properties" form="form-photo-change-send-to-backend-saved-contacts" onClick={(event) => saveNewProperties(event , savedContactProperties)} />
        </div>

      </div>

    </div>
    

    )})}
    
    return htmlBodySavedContacts;
}

export default SavedContactsMap;