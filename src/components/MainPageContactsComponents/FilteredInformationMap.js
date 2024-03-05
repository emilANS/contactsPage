import React from "react";
import Avatar from "react-avatar";
import axios from "axios";


const FilteredInformationMap = (data) => {

  let htmlBodyAddedContacts = [];
  
  let htmlBodySavedContacts = [];
  
  {data.filteredInformation.length !== 0 && data.showSearchedContact === true && data.filteredInformation && data.filteredInformation?.map(filteredContact => {

    const changeProperties = () => {

    /*  This if condition function is if numberOfTimesEditIsClicked is
        if one contact is being edited it will not edit another one   */
      if (data.numberOfTimesEditIsClicked === 2) {
        return;
      };
      
      // Here is set the value 2 every time changeProperties is clicked
      data.setNumberOfTimesEditIsClicked(2);

      // Convert the initial value of an empty image (null)... in a contact to false
      if (filteredContact.usedImage === null) {
        filteredContact.usedImage = false;
      };

  /* This many setUseState works for putting the new values
      in the contact when change properties is clicked  */
      data.setSubmittedUserName(filteredContact.usedUserName);
      
      data.setSubmittedEmail(filteredContact.usedEmail);
      
      data.setSubmittedAge(filteredContact.usedAge);
      
      data.setSubmittedAddress(filteredContact.usedAddress);
      
      // Makes filteredContact.edit true so the contact can be edited
      filteredContact.edit = true;
      
      // Forces update when the user finish of change properties so it can be displayed in screen
      data.forceUpdate();

      
      /* This if condition setEditedImage to false if imageWasUpdated is false
        so the image is not repeated in other contact */
        if (filteredContact.imageWasUpdated === false) {
          data.setEditedImage(false);
      };
      
    };


    const changeImage = (event) => {

      filteredContact.usedImage = false;

      // If user clicks cancel while uploading a file this prevents an error

      let imageHasValue = document.getElementById("input-change-image");
      
      if (imageHasValue.files.length === 0) {

        // This addSheet.map works for saving all the changes made by the user
        data.filteredInformation.map((editContact) => {
          if (editContact === editContact) {
            Object.assign(filteredContact, {usedImage : false , imageWasUpdated : false , evadeImageToBeDisplayedWhenNoImageIsUploaded : true})
          };
        });

        data.setUserHasSubmittedNoImage(true);

      } else if (imageHasValue.files.length) {

        data.setChangeImageAndSendToBackend(true);
        
        data.setEditedImage(URL.createObjectURL(event.target.files[0]));
    

        filteredContact.imageWasUpdated = true;

      };

      data.forceUpdate();

    };
    
    
    const deletePhoto = () => {
      // This works for deleting completely any sign of the anterior image
      filteredContact.usedImage = false;
      filteredContact.imageWasUpdated = false;
      filteredContact.containedImage = false;

      data.setImage(false);
      data.setEditedImage(false);


      // setSaveDeletePhoto true so when the user clicks the saveNewProperties button function can delete the photo and not delete the photo instantly
      data.setSaveDeleteImage(true);


      // ForceUpdate so when the image is deleted it shows the initials letters of the user name
      if (filteredContact.usedImage === false) {
        data.forceUpdate();
      };
    };
    

    if (filteredContact.usedImage === false && filteredContact.imageWasUpdated === true) {

      filteredContact.containedImage = data.editedImage;

      filteredContact.evadeImageToBeDisplayedWhenNoImageIsUploaded = false

    } else if (filteredContact.evadeImageToBeDisplayedWhenNoImageIsUploaded === true && filteredContact.usedImage === false) {

      filteredContact.containedImage = false;

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


      // SetNumberOfTimesEditIsClicked to 0 so the user can edit other contacts
      data.setNumberOfTimesEditIsClicked(0);
      

      // If user clicks cancel while uploading a file this prevents an error
      let imageHasValue = document.getElementById("input-change-image");


      if (imageHasValue.files.length) {

        // This addSheet.map works for saving all the changes made by the user
        data.filteredInformation.map((editContact) => {
          if (editContact === editContact) {
            Object.assign(filteredContact, {usedUserName : data.submittedUserName
              , usedEmail: data.submittedEmail , usedAge: data.submittedAge , usedAddress: data.submittedAddress , usedImage : data.editedImage 
              , evadeImageToBeDisplayedWhenNoImageIsUploaded : false , edit : false})
          };
        });

      } else if (imageHasValue.files.length === 0 && filteredContact.usedImage === false) {

        data.filteredInformation.map((editContact) => {
          if (editContact === editContact) {
            Object.assign(filteredContact, {usedUserName : data.submittedUserName
              , usedEmail: data.submittedEmail , usedAge: data.submittedAge , usedAddress: data.submittedAddress , usedImage : filteredContact.containedImage 
              , evadeImageToBeDisplayedWhenNoImageIsUploaded : true , edit : false})
          };
        });

      };


      // Force update so the changed settings are showed instantly
      data.forceUpdate();
      
      
      // Send changed properties to the database so it can be saved there
      axios.get("http://localhost:4000/save-new-properties-of-contact-in-database",{params: { editedUserName: filteredContact.usedUserName 
      , editedEmail : filteredContact.usedEmail , editedAge : filteredContact.usedAge , editedAddress : filteredContact.usedAddress 
      , SaveNewPropertiesId : filteredContact.id }})


      // If the user adds a image when creating the contact and then edit the image this prevents that when the user clicks edit contact and save the image don't disappear
      if (imageHasValue.files.length === 0 && filteredContact.usedImage !== false || filteredContact.usedImage !== null) {

        filteredContact.edit = false;

        event.preventDefault();

      }

      if (imageHasValue.files.length === 0 && data.userHasSubmittedNoImage === true) {
        
        axios.get("http://localhost:4000/delete-image-and-send-to-backend",{params: { id : filteredContact.id }});

        data.setUserHasSubmittedNoImage(false);

        event.preventDefault();

      };

      // if saveDeletePhoto equals true send to database the id and the image is deleted
      if (data.saveDeleteImage === true) {

        axios.get("http://localhost:4000/delete-image-and-send-to-backend",{params: { id : filteredContact.id }});

        // returns the original value of saveDeletePhoto
        data.setSaveDeleteImage(false);

      };


      // If usedImage and imageWasUpdated equals to false stop from sending to database the image because image was deleted
      if (filteredContact.usedImage === false && filteredContact.imageWasUpdated === false) {

        return;
        
      };


      if (imageHasValue.files.length && data.changeImageAndSendToBackend === true) {

        // Send id to backend of the new contact so it can be assigned his new image
        axios.get("http://localhost:4000/receive-id-from-frontend-for-change-image",{params: { id : filteredContact.id }});

        // Submit the form form-photo-change so it can be sended to backend
        document.getElementById("form-photo-change-send-to-backend").submit();
        
        data.setChangeImageAndSendToBackend(false);
      
      };

    };

    
    // This if condition updates the image in real time when the user changes it
    if (filteredContact.usedImage === false && filteredContact.imageWasUpdated === true) {
      
      filteredContact.usedImage = data.editedImage;

    } else if (filteredContact.evadeImageToBeDisplayedWhenNoImageIsUploaded === true && data.userHasSubmittedNoImage === true) {

      filteredContact.usedImage = false;

      filteredContact.evadeImageToBeDisplayedWhenNoImageIsUploaded = false;

    };

    console.log(filteredContact);

    /* filteredInformation && filteredInformation?.map((filteredContact) => {

      
    }) */

    htmlBodyAddedContacts.push (

    

      filteredContact.edit === false ?

      <div key={filteredContact}>
      
        <div className="contact-square">

          <div className="image-container">

            <Avatar src={filteredContact.usedImage} name={filteredContact.usedUserName} color="purple" round="30px"/>

          </div>

          {filteredContact.usedUserName === "" ? 
              void(0)
            :
            <div className="information-about-user">

            <h1 className="information-about-user-name-presentation">Name of the contact</h1>
            <h2 className="information-about-user-name">{filteredContact.usedUserName}</h2>

            </div>

            }

            {filteredContact.usedEmail === "" ? 
              void(0)
            :
            <div className="information-about-user">

            <h1 className="information-about-user-email-presentation">Email of the contact</h1>
            <h2 className="information-about-user-email">{filteredContact.usedEmail}</h2>

            </div>

            }

            {filteredContact.usedAge === "" ? 
              void(0)
            :
            <div className="information-about-user">

            <h1 className="information-about-user-age-presentation">Age of the contact</h1>
            <h2 className="information-about-user-age">{filteredContact.usedAge}</h2>
          

            </div>

            }

            {filteredContact.usedAddress === "" ? 
              void(0)
            :
            <div className="information-about-user">

            <h1 className="information-about-user-address-presentation">Address of the contact</h1>
            <h2 className="information-about-user-address">{filteredContact.usedAddress}</h2>
          

            </div>

            }

          <button className="contact-button" onClick={changeProperties}>Change properties of this contact</button>

          <div>

            <button className="contact-button" onClick={() => data.DeleteContact(filteredContact)}>Delete this Contact</button>
          
          </div>

        </div>
        
      </div>
      
      : // <=== double dot to continue ternary operator od editContact

      <div key={filteredContact}>


        <div className="contact-square">


            <div>
              {filteredContact.usedImage === false ? 

              <Avatar name={data.submittedUserName} color="purple" round="30px"/>
                
              : // <=== double dot to continue ternary operator od editContact

              <> 
              
              <Avatar src={filteredContact.usedImage} color="purple" round="30px"/>

              <div>
                
                <button className="delete-image-button" onClick={deletePhoto}>Delete Photo</button>
                  
              </div> 
              
              </>}
                
            </div>
            
          <form onSubmit={saveNewProperties} id="form-photo-change-send-to-backend" action="http://localhost:4000/change-image-and-send-to-backend" encType="multipart/form-data" method="post">
            

          <label className="upload-image-button">

            <input className="select-image-button" type="file" id="input-change-image" name="changeImageAndSendToBackendInput" onChange={changeImage}></input>
              Add Image

          </label>
              
          </form>

          <h1 className="information-about-contact-presentation-name">Name of the contact</h1>

          <input maxLength="29" className="input-change-properties" defaultValue={filteredContact.usedUserName} onChange={data.eventSubmittedUserName}></input>

          <h1 className="information-about-contact-presentation-email">Email of the contact</h1>

          <input maxLength="29" className="input-change-properties" defaultValue={filteredContact.usedEmail} onChange={data.eventSubmittedEmail}></input>

          <h1 className="information-about-contact-presentation-age">Age of the contact</h1>

          <input maxLength="29" className="input-change-properties" defaultValue={filteredContact.usedAge} onChange={data.eventSubmittedAge}></input>

          <h1 className="information-about-contact-presentation-address">Address of the contact</h1>

          <input maxLength="29" className="input-change-properties" defaultValue={filteredContact.usedAddress} onChange={data.eventSubmittedAddress}></input>
          
          {data.preventUserFromModifyingAndCreatingAEmptyContact === true && <h2 className="advert-message-empty-contact">Please don't create a empty contact</h2>}

          <input className="contact-button-save-properties" type="submit" form="form-photo-change-send-to-backend" value="Save New Properties" onClick={(event) => saveNewProperties(event, filteredContact)}/>
        

        </div>

    </div>
    )
  })}
  



    // Continue to FilteredSavedInformation Map




    {data.filteredSavedInformation.length !== 0 && data.showSearchedContact === true && data.filteredSavedInformation && data.filteredSavedInformation?.map((filteredContact) => {
    // Add new keys and values to the showSavedContacts object for changing images
    data.filteredSavedInformation.map((editContact) => {
      if (editContact === editContact) {
        Object.assign(filteredContact, {doesContactHaveSavedImageFromBackend : false , showImageInEditMode : false 
        , imageInEditMode : false , wasImageEditedMoreThanOneTime : false , wasImageDeleted : false , rowOfTheObject : null})
      };
    });

    
    // If image is different to null show the saved image when user enter his account
    if (filteredContact["hex(image)"] !== "") {
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
        data.setSubmittedUserName(filteredContact.userName);
        
        data.setSubmittedEmail(filteredContact.email);
        
        data.setSubmittedAge(filteredContact.age);
        
        data.setSubmittedAddress(filteredContact.address);
        

        // Makes contactProperties.edit true so the contact can be edited
        filteredContact.editSavedContact = 1;
        

        // Forces update when the user finish of change properties so it can be displayed in screen
        data.forceUpdate();

      };


      if (filteredContact.editSavedContact === 1) {
        filteredContact.showImageInEditMode = true;
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

          
          if (filteredContact["hex(image)"] !== "") {

            filteredContact.image = null;
        
            filteredContact.evadeImageFromRepeating = false;

            filteredContact["hex(image)"] = "";

            filteredContact.showImageInEditMode = true;

            filteredContact.doesContactHaveSavedImageFromBackend = false;

          };


        };

        
      };

        
      // Function to delete photo when the contact is in edit mode
      const deleteSavedPhoto = () => {

        // Converting image to false so the image on the contact picture is not displayed and others to their default value
        filteredContact.image = null;
        
        filteredContact.evadeImageFromRepeating = false;

        filteredContact["hex(image)"] = "";

        filteredContact.imageInEditMode = false;

        filteredContact.showImageInEditMode = false;

        // delete this if unnecessary
        filteredContact.doesContactHaveSavedImageFromBackend = false;
        

        // setSaveDeletePhoto true so when the user clicks the saveNewProperties button function can delete the photo and not delete the photo instantly
        data.setSaveDeleteImage(true);

        // set WasSavedImageDeleted to true because the image was deleted and it can be displayed the image as a deleted in the contact
        data.setWasSavedImageDeleted(true)

        // Force Update so the removed image can be displayed
        data.forceUpdate();

      };


      // if wasSavedImageDeleted is true modify the object value to true so the image can be displayed as deleted if not don't show the image as a deleted one
      if (data.wasSavedImageDeleted === true) {
        filteredContact.wasImageDeleted = true;
      } else {
        filteredContact.wasImageDeleted = false;
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


        filteredContact.editSavedContact = 0;

        
        // SetNumberOfTimesEditIsClicked to 0 so the user can edit other contacts
        data.setNumberOfTimesEditIsClicked(0);
        

        // Get the value of the input of type file input-change-image-saved-contacts
        let imageHasValue = document.getElementById("input-change-image-saved-contacts");
        

        if (imageHasValue.files.length) {

          // This showSavedContacts.map works for saving all the changes made by the user
          data.filteredSavedInformation.map((editContact) => {
            if (editContact === editContact) {
              Object.assign(filteredContact, {userName : data.submittedUserName
                , email: data.submittedEmail , age: data.submittedAge , address: data.submittedAddress
                , image : data.savedContactEditedImage
                , imageUrlReadyToBeShowed : false , evadeImageFromRepeating : true
              });
              };
          });

        } else if (imageHasValue.files.length === 0) {
          
          // This showSavedContacts.map works for saving all the changes made by the user
          data.filteredSavedInformation.map((editContact) => {
            if (editContact === editContact) {
              Object.assign(filteredContact, {userName : data.submittedUserName
                , email: data.submittedEmail , age: data.submittedAge , address: data.submittedAddress 
                , imageUrlReadyToBeShowed : false , evadeImageFromRepeating : false})
            };
          });

        };




        // This axios request gives the new properties of the contact in the database
        axios.get("http://localhost:4000/save-new-properties-of-contact-in-database",{params: { editedUserName: filteredContact.userName 
        , editedEmail : filteredContact.email , editedAge : filteredContact.age , editedAddress : filteredContact.address 
        , SaveNewPropertiesId : filteredContact.contactId }})
        



        // If these values are true delete the image that user choose and delete it in database
        if (imageHasValue.files.length === 0 && data.userHasSubmittedNoImage === true) {
          
          axios.get("http://localhost:4000/delete-image-and-send-to-backend",{params: { id : filteredContact.contactId }});

          data.setUserHasSubmittedNoImage(false);

          event.preventDefault();

        };


        // No Showing the image in edit properties of the contact to evade repetition in other contacts
        filteredContact.showImageInEditMode = false;

        data.setSavedContactEditedImage(false);


        if (filteredContact.wasImageEditedMoreThanOneTime === false && filteredContact.wasImageDeleted === true) {

          filteredContact.imageInEditMode = false;

          filteredContact.image = null;

          filteredContact.imageUrlReadyToBeShowed = false;

        }


        // if saveDeletePhoto equals true send to database the id and the image is deleted
        if (data.saveDeleteImage === true) {
          axios.get("http://localhost:4000/delete-image-and-send-to-backend",{params: { id : filteredContact.contactId }});

          // returns the origin value of saveDeletePhoto
          data.setSaveDeleteImage(false);

        };


        // If these values are the false or null stop the image from uploading because was deleted see line 442 for more information
        if (filteredContact.doesContactHaveSavedImageFromBackend === false && filteredContact.image === null) {

          return;

        };


        if (imageHasValue.files.length && data.changeImageAndSendToBackend === true) {
          // Send id to backend of the new contact so it can be assigned his new image
          axios.get("http://localhost:4000/receive-id-from-frontend-for-change-image",{params: { id : filteredContact.contactId }});

          // Submit the form form-photo-change so it can be sended to backend
          document.getElementById("form-photo-change-send-to-backend-saved-contacts").submit();

          console.log("EXECUTED !")

          data.setChangeImageAndSendToBackend(false);
        };
    

        data.forceUpdate();

        
      };

      
      // Convert wasImageEditedMoreThanOneTime to true so the image can be saved and be showed when image is edited again
      if (filteredContact.evadeImageFromRepeating === true) {
        filteredContact.wasImageEditedMoreThanOneTime = true;
      };

      // if Image is Different to null and showImageInEditMode equal true so the page can know if the image was edited more than one time see line 588
      if (filteredContact.image !== null && filteredContact.showImageInEditMode === true) {
        filteredContact.wasImageEditedMoreThanOneTime = true;
      };


      // Show image in edit mode so the user can see the image is uploading during the user is changing properties
      if (filteredContact.showImageInEditMode === true) {
        
       /*  filteredContact.wasImageEditedMoreThanOneTime = true; */

        if (filteredContact.wasImageEditedMoreThanOneTime === false && filteredContact.wasImageDeleted === false) {
          
          filteredContact.imageInEditMode = data.savedContactEditedImage;
          
        }else if (filteredContact.wasImageEditedMoreThanOneTime === true && filteredContact.wasImageDeleted === false && filteredContact.image !== null) {
          
          filteredContact.imageInEditMode = data.image;
          
        }else if (filteredContact.wasImageEditedMoreThanOneTime === true && filteredContact.imageInEditMode === null || filteredContact.image === null && filteredContact.wasImageDeleted === false) {
  
          filteredContact.imageInEditMode = data.savedContactEditedImage


        };


        // This if statement works when a saved contact have a image from server when you try to change the properties of the image it don't display
        if(filteredContact.wasImageEditedMoreThanOneTime === true && filteredContact.imageInEditMode === null 
          && filteredContact.image !== null && filteredContact["hex(image)"] === "" && data.savedContactEditedImage !== false
          )  /* Here the if statement continues */  {
          filteredContact.image = data.savedContactEditedImage;
        };

      };


      if (data.userHasSubmittedNoImage === true || filteredContact.image === false) {

        // Assigning no image when user no upload a image to the contact or deletes it
        filteredContact.imageUrlReadyToBeShowed = false;

        filteredContact.image = false;

        filteredContact.evadeImageFromRepeating = false;

      };
    
    // Showing the saved contact


    htmlBodySavedContacts.push(

  filteredContact.editSavedContact === 0 ?
  
      <div key={filteredContact}>

      <div className="contact-square">

      <div className="image-container">

        {filteredContact.doesContactHaveSavedImageFromBackend === false ?
        
          <Avatar src={filteredContact.image} name={filteredContact.userName} color="purple" round="30px"/>
        
        :
        
          <Avatar src={filteredContact.imageUrlReadyToBeShowed} name={filteredContact.userName} color="purple" round="30px"/>
        
        }

      </div>
      
      {filteredContact.userName === "" ? 
        void(0)
      :
      <div className="information-about-user">

      <h1 className="information-about-user-name-presentation">Name of the contact</h1>
      <h2 className="information-about-user-name">{filteredContact.userName}</h2>

      </div>

      }


      {filteredContact.email === "" ? 
        void(0)
      :
      <div className="information-about-user">

      <h1 className="information-about-user-email-presentation">Email of the contact</h1>
      <h2 className="information-about-user-email">{filteredContact.email}</h2>

      </div>

      }

      
      {filteredContact.age === "" ? 
        void(0)
      :
      <div className="information-about-user">

      <h1 className="information-about-user-age-presentation">Age of the contact</h1>
      
      <h2 className="information-about-user-age">{filteredContact.age}</h2>

      </div>

      }

      
      {filteredContact.address === "" ? 
        void(0)
      :
      <div className="information-about-user">

      <h1 className="information-about-user-address-presentation">Address of the contact</h1>

      <h2 className="information-about-user-address">{filteredContact.address}</h2>

      </div>

      }


      <button className="contact-button" onClick={changeProperties}>Change properties of this contact</button>

        <div>

          <button className="contact-button" onClick={() => data.DeleteContact(filteredContact)}>Delete this Contact</button>
        
        </div>

      </div>

    </div>

    : // <=== Double dot to continue ternary operator

    <div key={filteredContact}>

      <div className="contact-square">


        <div className="change-properties-contact-image">

        {filteredContact.doesContactHaveSavedImageFromBackend === false ?
        
        <>
            {
              // here is the error delete this when finish
              filteredContact.wasImageEditedMoreThanOneTime === true && filteredContact.image !== null ? 
              
              <><Avatar src={filteredContact.image}  color="purple" round="30px"/>
              <div>
                <button className="delete-image-button" onClick={deleteSavedPhoto}>Delete Photo</button> 
              </div>
            </>

              :

            filteredContact.imageInEditMode === false  ? 
            
            <Avatar name={data.submittedUserName} color="purple" round="30px"/>
            
            : // <=== Double dot to continue ternary operator
            
            <><Avatar src={filteredContact.imageInEditMode}  color="purple" round="30px"/>
              <div>
                <button className="delete-image-button" onClick={deleteSavedPhoto}>Delete Photo</button> 
              </div>
            </>

}
        
        </>
          
          :
          
          <>
            {
              
              filteredContact.image === null || filteredContact.image === false  ? 
              
              <Avatar name={data.submittedUserName} color="purple" round="30px"/>
              
              : // <=== Double dot to continue ternary operator
              
              <><Avatar src={filteredContact.imageUrlReadyToBeShowed}  color="purple" round="30px"/>
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

        <input maxLength="29" className="input-change-properties" defaultValue={filteredContact.userName} onChange={data.eventSubmittedUserName}></input>

        <h1 className="information-about-contact-presentation-email">Email of the contact</h1>

        <input maxLength="29" className="input-change-properties" defaultValue={filteredContact.email} onChange={data.eventSubmittedEmail}></input>

        <h1 className="information-about-contact-presentation-age">Age of the contact</h1>

        <input maxLength="29" className="input-change-properties" defaultValue={filteredContact.age} onChange={data.eventSubmittedAge}></input>

        <h1 className="information-about-contact-presentation-address">Address of the contact</h1>

        <input maxLength="29" className="input-change-properties" defaultValue={filteredContact.address} onChange={data.eventSubmittedAddress}></input>

      {data.preventUserFromModifyingAndCreatingAEmptyContact === true && <h2 className="advert-message-empty-contact">Please don't create a empty contact</h2>}

        <div>
          <input className="contact-button-save-properties" type="submit" value="Save new Properties" form="form-photo-change-send-to-backend-saved-contacts" onClick={(event) => saveNewProperties(event , filteredContact)} />
        </div>

      </div>

    </div>
    
    )})}
    
    return [htmlBodySavedContacts, htmlBodyAddedContacts];

}

export default FilteredInformationMap;
