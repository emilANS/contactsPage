const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
let sql;
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(fileUpload());

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessState: 200
};

// Connecting to sqlite DB
const db = new sqlite3.Database("../passwords/passwordDataBase.db", sqlite3.OPEN_READWRITE,(err) => {
    if (err) return console.error(err.message);
});

app.use(cors(corsOptions));

// Creating the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Beginning of the Register algorithm



// variable let setPasswordExists for sending true or false to frontend
let setPasswordExists = null;

app.get("/register-database-verify-if-email-exists", (req, res) => {
  const userEmail = req.query.userEmail;

  sql = `SELECT id,username,password,email FROM users WHERE email == (?);`
  db.all(sql,[userEmail],(err,rows) => {

    if (err) return console.error(err.message);
    
    rows.forEach(row=>{
      if (Object.values(row).indexOf(userEmail)) {
        console.log("The user email already exists!")
        setPasswordExists = false;
      };
    });
  });
  setPasswordExists = null;
});

// Register verify if the account already exists
app.get("/register-database-verify", (req, res) => {
  const userName = req.query.userName;
  const userPassword = req.query.userPassword;
  const userEmail = req.query.userEmail;

  sql = `SELECT id,username,password,email FROM users WHERE username == (?) AND password == (?) AND email == (?);`
  db.all(sql,[userName,userPassword,userEmail],(err,rows) => {

      if (err) return console.error(err.message);
      
      rows.forEach(row=>{
          if (Object.values(row).indexOf(userName && userPassword && userEmail)) {
            console.log("User" , userName ,"credentials already exists!")
            console.log("This is the register information" , row)
            setPasswordExists = false;
          };
      });
  });
  setPasswordExists = null;
});

// send (true) if the credentials are not equal to others credentials
app.get("/register-database-send-true", (req, res) => {
  const userName = req.query.userName;
  const userPassword = req.query.userPassword;
  const userEmail = req.query.userEmail;

  sql = `SELECT id,username,password,email FROM users WHERE username != (?) AND password != (?) AND email != (?);`
  console.log("------------------------------- you are registering");

  

  db.all(sql,[userName,userPassword,userEmail],(err,rows) => {

      if (err) return console.error(err.message);

      if (rows.length === 0) {

        setPasswordExists = true;

      };
      
      rows.forEach(row=>{
        
          if (setPasswordExists === false) {
            return;
          };


          if (Object.values(row).indexOf(userName && userPassword && userEmail)) {
            setPasswordExists = true;
          };
        });
    });
});

// Register
app.get("/register-database", (req, res) => {
  const userName = req.query.userName;
  const userPassword = req.query.userPassword;
  const userEmail = req.query.userEmail;

  res.status(200).send(
  db.run(`INSERT INTO users(username,password,email) VALUES (?,?,?);`
  ,[userName,userPassword,userEmail],(err) => {
      if (err) return console.error(err.message);
  }));
});

// Send true or false to frontend
app.get("/send-true-false-frontend-if-credentials-ok", (req, res) => {
  setTimeout(() => {
  return res.send(setPasswordExists);}, "2000");
});

// End of the Register algorithm


// Beginning of the Login algorithm


// Verify if the credentials that user put in the inputs are correct
app.get("/verify-if-user-logged-put-the-correct-credentials", (req, res) => {
  const userName = req.query.userName;
  const userPassword = req.query.userPassword;
  const userEmail = req.query.userEmail;

  sql = `SELECT id,username,password,email FROM users WHERE username == (?) AND password == (?)  AND email == (?);`

  db.all(sql,[userName,userPassword,userEmail],(err,rows) => {

    if (err) return console.error(err.message);


    if (rows.length === 0) {

      let userAccountNoExists = true;

      res.send(userAccountNoExists);
    };

  });
});


// Login
app.get("/login", (req, res) => {
  const userName = req.query.userName;
  const userPassword = req.query.userPassword;
  const userEmail = req.query.userEmail;

  sql = `SELECT userIsAlreadyLogged,id,username,password,email FROM users WHERE username == (?) AND password == (?)  AND email == (?);`
  console.log("-------------------------------");
  db.all(sql,[userName,userPassword,userEmail],(err,rows) => {

      if (err) return console.error(err.message);
      rows.forEach(row=>{

          if (Object.values(row).indexOf(userName && userPassword && userEmail)) {
            
            if (row.userIsAlreadyLogged === 1) {

              setIsTrue = false;

              res.send(setIsTrue)

              return;
            };

            setIsTrue = true;

            res.send(setIsTrue);

            userAssignIdToContacts = row.id

            userAssignedUsername = row.username

            return;
          };
        });
    });
});


// End of the Login algorithm


// Beginning of the contacts functions in the database



// Assigning the contacts to the correspondent user
let userAssignIdToContacts = null;


app.get("/send-userName-to-frontend", (req, res) => {
  sqlSendUserNameToFrontend = `SELECT username FROM users WHERE id = (?);`

  let idFromBackend = parseInt(Object.values(req.query.idFromBackend || {}));

  db.all(sqlSendUserNameToFrontend,[idFromBackend],(err,rows) => {
    if (err) return console.error(err.message);
    rows.forEach(row=>{
        res.send(row.username);
    });
  });
});

// Sends id of the user to the frontend
app.get("/send-id-to-frontend", (req, res) => {
  res.send({id : userAssignIdToContacts});
});


let limitSend1WhenUserLoggedIn = 0;

// Sets 1 to userIsAlreadyLogged so the user when is already logged cant enter again
app.get("/send-1-when-user-logged-in", (req, res) => {
  sql = `UPDATE users SET userIsAlreadyLogged = (1) WHERE id = (?);`
  
  let idFromBackend = parseInt(Object.values(req.query.idFromBackend || {}));
  
  console.log("user id connected :", idFromBackend)

  limitSend1WhenUserLoggedIn++;
  
  
  res.status(200).send(
  db.run(sql,[idFromBackend],(err) => {
    if (err) return console.error(err.message);
  }));
  
  if (limitSend1WhenUserLoggedIn === 1) {
    limitSend1WhenUserLoggedIn = 0;
    return res.end()
  };

});


// Send 0 to database when user log out so the user can enter again
app.get("/send-0-when-user-logged-out", (req, res) => {
  sql = `UPDATE users SET userIsAlreadyLogged = (NULL) WHERE id = (?);`

  let idFromBackend = parseInt(Object.values(req.query.idFromBackend || {}));

  console.log("user id disconnected :",idFromBackend);

  res.status(200).send(
  db.run(sql,[idFromBackend],(err) => {
    if (err) return console.error(err.message);
  }));
});


// Saving new contacts to the database
app.get("/save-contacts-in-database", (req, res) => {
  const userName = req.query.userName;
  const email = req.query.email;
  const age = req.query.age;
  const address = req.query.address;
  const id = req.query.id;

  let parseIdFromBackendSessionStorage = parseInt(Object.values(req.query.parseIdFromBackendSessionStorage || {}));

  console.log("Contact id added", id)

  db.run(`INSERT INTO contacts_information(accessId,contactId,editSavedContact,userName,email,age,address) VALUES (?,?,?,?,?,?,?);`
  ,[parseIdFromBackendSessionStorage , id , 0 , userName , email , age , address],(err) => {
      if (err) return console.error(err.message);
      res.sendStatus(200)
  });

  let sql = `SELECT contactId FROM contacts_information WHERE contactId = (?);`

  db.all(sql,[id],(err,rows) => {
    if (err) return console.error(err.message);
    rows.forEach(row=>{
        contactIdForPutImageInDB = row.contactId;
    });
  });
});


let contactIdForPutImageInDB = null;


// Receiving image from frontend and then adding it to the contact in the Database
// See send-contacts-to-frontend-when-id-is-equal to more information about this part of the code
app.post("/send-image-to-backend", (req, res) => {
  const {data, name} = req.files.imageSendToBackend;


  if (data && name) {
    setTimeout(() => {
      res.status(204).send(
        db.run(`UPDATE contacts_information SET imageName = (?) , image = (?) WHERE contactId = (?);`
          ,[name , data , contactIdForPutImageInDB],(err) => {
              if (err) return console.error(err.message);
        }));
    }, "1000");

  };

});


// receive id from frontend and use it to change image in database
app.get("/receive-id-from-frontend-for-change-image", (req, res) => {
  const id = req.query.id;
  
  idForChangeImage = id;

  res.sendStatus(200);
});


let idForChangeImage = null


// Change image in backend when user changes image of his contacts
app.post("/change-image-and-send-to-backend", (req, res) => {
  const {data, name} = req.files.changeImageAndSendToBackendInput;


  if (data && name) {
    setTimeout(() => {
      res.status(204).send(
        db.run(`UPDATE contacts_information SET imageName = (?) , image = (?) WHERE contactId = (?);`
          ,[name , data , idForChangeImage],(err) => {
              if (err) return console.error(err.message);
        }));
    }, "1000");

  };

});


// Delete image from contact
app.get("/delete-image-and-send-to-backend", (req, res) => {
  const id = req.query.id;

  setTimeout(() => {
    res.status(200).send(
      db.run(`UPDATE contacts_information SET imageName = (NULL) , image = (NULL) WHERE contactId = (?);`
        ,[id],(err) => {
          if (err) return console.error(err.message);
      }));
  },"1000")
});


// Deleting contact from the database
app.get("/delete-contact-and-send-to-database", (req, res) => {
  const deleteWithId = req.query.deleteWithId;
  const deleteSavedContactId = req.query.deleteSavedContactId;

  console.log("deleteWithId", deleteWithId);

  console.log("saved", deleteSavedContactId)

  sql = `DELETE FROM contacts_information WHERE contactId = (?)`

  res.status(200).send(
  db.run(sql,[deleteWithId || deleteSavedContactId],(err) => {
    if (err) return console.error(err.message);
  }));
});


// Saving new settings for the contact in the database
app.get("/save-new-properties-of-contact-in-database", (req, res) => {
  const editedUserName = req.query.editedUserName;
  const editedEmail = req.query.editedEmail;
  const editedAge = req.query.editedAge;
  const editedAddress = req.query.editedAddress;
  const SaveNewPropertiesId = req.query.SaveNewPropertiesId;
  
  sql = `UPDATE contacts_information SET userName = (?) , email = (?) , age = (?) , address = (?) WHERE contactId = (?);`
  
  res.status(200).send(
    db.run(sql,[editedUserName , editedEmail , editedAge , editedAddress , SaveNewPropertiesId],(err) => {
      if (err) return console.error(err.message);
    })

  )
  
  console.log("The contact has been updated to new values!");
});


// This resets the contacts sended to the frontend so it cant be an error
let resetSendContactsToFrontend = false;


// Sending to the variable currentUserContacts all the databaseContacts of the correspondent user
sqlSendContacts = `SELECT hex(image),accessId,contactId,editSavedContact,userName,email,age,address,image FROM contacts_information WHERE accessId = (?);`

if (resetSendContactsToFrontend === true) {
  resetSendContactsToFrontend = false;
  return;
};


// the error is because the id is assigned to the anterior contact!


if (resetSendContactsToFrontend === false) {
  
  // Saving new settings for the contact in the database
  app.get("/send-contacts-to-frontend-when-id-is-equal", (req, res) => {
    db.all(sqlSendContacts,[userAssignIdToContacts],(err,rows) => {
      if (err) return console.error(err.message);

      res.send(rows);

      resetSendContactsToFrontend = true;
    });
  }); 

};

// Sending to the correspondent user the saved contacts when refresh the page
app.get("/send-contacts-to-correspondent-user-when-refresh-to-frontend", (req, res) => {

  let parseIdFromBackendSessionStorage = parseInt(Object.values(req.query.parseIdFromBackendSessionStorage || {}));

  db.all(sqlSendContacts,[parseIdFromBackendSessionStorage],(err,rows) => {
    if (err) return console.error(err.message);

    res.send(rows)
  });

}); 
