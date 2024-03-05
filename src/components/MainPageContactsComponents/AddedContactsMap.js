import React from "react";
import axios from "axios";
import Avatar from "react-avatar";

const AddedContactsMap = (data) => {

  let htmlBodyAddedContacts = [];

  {
    data.showSearchedContact === false &&

    data.addSheet.map(addSheetProperties => {

      const changeProperties = () => {

      /*  This if condition function is if numberOfTimesEditIsClicked is
          if one contact is being edited it will not edit another one   */
        if (data.numberOfTimesEditIsClicked === 2) {
          return;
        };
        
        // Here is set the value 2 every time changeProperties is clicked
        data.setNumberOfTimesEditIsClicked(2);

        // Convert the initial value of an empty image (null)... in a contact to false
        if (addSheetProperties.usedImage === null) {
          addSheetProperties.usedImage = false;
        };

    /* This many setUseState works for putting the new values
        in the contact when change properties is clicked  */
        data.setSubmittedUserName(addSheetProperties.usedUserName);
        
        data.setSubmittedEmail(addSheetProperties.usedEmail);
        
        data.setSubmittedAge(addSheetProperties.usedAge);
        
        data.setSubmittedAddress(addSheetProperties.usedAddress);
        
        // Makes addSheetProperties.edit true so the contact can be edited
        addSheetProperties.edit = true;
        
        // Forces update when the user finish of change properties so it can be displayed in screen
        data.forceUpdate();

        
        /* This if condition setEditedImage to false if imageWasUpdated is false
          so the image is not repeated in other contact */
          if (addSheetProperties.imageWasUpdated === false) {
            data.setEditedImage(false);
        };
        
      };


      const changeImage = (event) => {

        addSheetProperties.usedImage = false;

        // If user clicks cancel while uploading a file this prevents an error

        let imageHasValue = document.getElementById("input-change-image");
        
        if (imageHasValue.files.length === 0) {

          // This addSheet.map works for saving all the changes made by the user
          data.addSheet.map((editContact) => {
            if (editContact === editContact) {
              Object.assign(addSheetProperties, {usedImage : false , imageWasUpdated : false , evadeImageToBeDisplayedWhenNoImageIsUploaded : true})
            };
          });

          data.setUserHasSubmittedNoImage(true);

        } else if (imageHasValue.files.length) {

          data.setChangeImageAndSendToBackend(true);
          
          data.setEditedImage(URL.createObjectURL(event.target.files[0]));
      

          addSheetProperties.imageWasUpdated = true;

        };

        data.forceUpdate();

      };
      
      
      const deletePhoto = () => {
        // This works for deleting completely any sign of the anterior image
        addSheetProperties.usedImage = false;
        addSheetProperties.imageWasUpdated = false;
        addSheetProperties.containedImage = false;

        data.setImage(false);
        data.setEditedImage(false);


        // setSaveDeletePhoto true so when the user clicks the saveNewProperties button function can delete the photo and not delete the photo instantly
        data.setSaveDeleteImage(true);


        // ForceUpdate so when the image is deleted it shows the initials letters of the user name
        if (addSheetProperties.usedImage === false) {
          data.forceUpdate();
        };
      };
      

      /* If image was updated and image is deleted change these properties so the image is not repeated */
      if (addSheetProperties.usedImage === false && addSheetProperties.imageWasUpdated === true) {

        addSheetProperties.containedImage = data.editedImage;

        addSheetProperties.evadeImageToBeDisplayedWhenNoImageIsUploaded = false

      } else if (addSheetProperties.evadeImageToBeDisplayedWhenNoImageIsUploaded === true && addSheetProperties.usedImage === false) {

        addSheetProperties.containedImage = false;

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
          data.addSheet.map((editContact) => {
            if (editContact === editContact) {
              Object.assign(addSheetProperties, {usedUserName : data.submittedUserName
                , usedEmail: data.submittedEmail , usedAge: data.submittedAge , usedAddress: data.submittedAddress , usedImage : data.editedImage 
                , evadeImageToBeDisplayedWhenNoImageIsUploaded : false , edit : false})
            };
          });

        } else if (imageHasValue.files.length === 0 && addSheetProperties.usedImage === false) {

          data.addSheet.map((editContact) => {
            if (editContact === editContact) {
              Object.assign(addSheetProperties, {usedUserName : data.submittedUserName
                , usedEmail: data.submittedEmail , usedAge: data.submittedAge , usedAddress: data.submittedAddress , usedImage : addSheetProperties.containedImage 
                , evadeImageToBeDisplayedWhenNoImageIsUploaded : true , edit : false})
            };
          });

        };


        // Force update so the changed settings are showed instantly
        data.forceUpdate();
        
        
        // Send changed properties to the database so it can be saved there
        axios.get("http://localhost:4000/save-new-properties-of-contact-in-database",{params: { editedUserName: addSheetProperties.usedUserName 
        , editedEmail : addSheetProperties.usedEmail , editedAge : addSheetProperties.usedAge , editedAddress : addSheetProperties.usedAddress 
        , SaveNewPropertiesId : addSheetProperties.id }})


        // If the user adds a image when creating the contact and then edit the image this prevents that when the user clicks edit contact and save the image don't disappear
        if (imageHasValue.files.length === 0 && addSheetProperties.usedImage !== false || addSheetProperties.usedImage !== null) {

          addSheetProperties.edit = false;

          event.preventDefault();

        }

        if (imageHasValue.files.length === 0 && data.userHasSubmittedNoImage === true) {
          
          axios.get("http://localhost:4000/delete-image-and-send-to-backend",{params: { id : addSheetProperties.id }});

          data.setUserHasSubmittedNoImage(false);

          event.preventDefault();

        };

        // if saveDeletePhoto equals true send to database the id and the image is deleted
        if (data.saveDeleteImage === true) {

          axios.get("http://localhost:4000/delete-image-and-send-to-backend",{params: { id : addSheetProperties.id }});

          // returns the original value of saveDeletePhoto
          data.setSaveDeleteImage(false);

        };


        // If usedImage and imageWasUpdated equals to false stop from sending to database the image because image was deleted
        if (addSheetProperties.usedImage === false && addSheetProperties.imageWasUpdated === false) {

          return;
          
        };


        if (imageHasValue.files.length && data.changeImageAndSendToBackend === true) {

          // Send id to backend of the new contact so it can be assigned his new image
          axios.get("http://localhost:4000/receive-id-from-frontend-for-change-image",{params: { id : addSheetProperties.id }});

          // Submit the form form-photo-change so it can be sended to backend
          document.getElementById("form-photo-change-send-to-backend").submit();
          
          data.setChangeImageAndSendToBackend(false);
        
        };

      };

      
      // This if condition updates the image in real time when the user changes it
      if (addSheetProperties.usedImage === false && addSheetProperties.imageWasUpdated === true) {
        
        addSheetProperties.usedImage = data.editedImage;

      } else if (addSheetProperties.evadeImageToBeDisplayedWhenNoImageIsUploaded === true && data.userHasSubmittedNoImage === true) {

        addSheetProperties.usedImage = false;

        addSheetProperties.evadeImageToBeDisplayedWhenNoImageIsUploaded = false;

      };
      

      htmlBodyAddedContacts.push (

      

        addSheetProperties.edit === false ?

        <div key={addSheetProperties}>

          <div className="contact-square">

            <div className="image-container">

            <Avatar src={addSheetProperties.usedImage} name={addSheetProperties.usedUserName} color="purple" round="30px"/>
            
            </div>

            {addSheetProperties.usedUserName === "" ? 
              void(0)
            :
            
            <div className="information-about-user">

            <h1 className="information-about-user-name-presentation">Name</h1>
            <h2 className="information-about-user-name">{addSheetProperties.usedUserName}</h2>

            </div>

            }

            {addSheetProperties.usedEmail === "" ? 
              void(0)
            :

            <div className="information-about-user">

            <h1 className="information-about-user-email-presentation">Email</h1>
            <h2 className="information-about-user-email">{addSheetProperties.usedEmail}</h2>

            </div>

            }

            {addSheetProperties.usedAge === "" ? 
              void(0)
            :

            <div className="information-about-user">

            <h1 className="information-about-user-age-presentation">Age</h1>
            <h2 className="information-about-user-age">{addSheetProperties.usedAge}</h2>
          

            </div>

            }

            {addSheetProperties.usedAddress === "" ? 
              void(0)
            :

            <div className="information-about-user">

            <h1 className="information-about-user-address-presentation">Address</h1>
            <h2 className="information-about-user-address">{addSheetProperties.usedAddress}</h2>
          

            </div>

            }
        

            <button className="contact-button" onClick={changeProperties}>Change properties of this contact</button>

            <div>

              <button className="contact-button" onClick={() => data.DeleteContact(addSheetProperties)}>Delete this Contact</button>
            
            </div>

          </div>
          
        </div>
        
        : // <=== double dot to continue ternary operator od editContact

        <div key={addSheetProperties}>

          <div className="contact-square">

              <div className="change-properties-contact-image">
                
                

                {addSheetProperties.usedImage === false ? 

                <Avatar name={data.submittedUserName} color="purple" round="30px"/>
                  
                : // <=== double dot to continue ternary operator od editContact

                <> 
                
                <Avatar src={addSheetProperties.usedImage} round="30px"/>

                <div>
                  
                  <button className="delete-image-add-contact" onClick={deletePhoto}>Delete Photo</button>
                    
                </div> 
                
                </>}
                  
              </div>
              
            <form onSubmit={saveNewProperties} id="form-photo-change-send-to-backend" action="http://localhost:4000/change-image-and-send-to-backend" encType="multipart/form-data" method="post">
              
              <label className="upload-image-button">

              <input type="file" id="input-change-image" name="changeImageAndSendToBackendInput" onChange={changeImage}></input>
                
              Add Image

              </label>

            </form>

            <h1 className="information-about-contact-presentation-name">Name of the contact</h1>

            <input maxLength="29" className="input-change-properties" defaultValue={addSheetProperties.usedUserName} onChange={data.eventSubmittedUserName}></input>

            <h1 className="information-about-contact-presentation-email">Email of the contact</h1>

            <input maxLength="29" className="input-change-properties" defaultValue={addSheetProperties.usedEmail} onChange={data.eventSubmittedEmail}></input>

            <h1 className="information-about-contact-presentation-age">Age of the contact</h1>

            <input maxLength="29" className="input-change-properties" defaultValue={addSheetProperties.usedAge} onChange={data.eventSubmittedAge}></input>

            <h1 className="information-about-contact-presentation-address">Address of the contact</h1>

            <input maxLength="29" className="input-change-properties" defaultValue={addSheetProperties.usedAddress} onChange={data.eventSubmittedAddress}></input>
            
            {data.preventUserFromModifyingAndCreatingAEmptyContact === true && <h2 className="advert-message-empty-contact">Please don't create a empty contact</h2>}

            <input className="contact-button-save-properties" type="submit" form="form-photo-change-send-to-backend" value="Save New Properties" onClick={(event) => saveNewProperties(event, addSheetProperties)}/>
          
          </div>

      </div>
      )
    })}

    return htmlBodyAddedContacts

};

export default AddedContactsMap;
