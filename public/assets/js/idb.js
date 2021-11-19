//! this file will manage the IndexedDB connection

let db; //* this 'global' (for this scope only) variable will hold the db conncection
const dbName = 'pizza_hunt'; //* db to connect or to create if it does not exist
const initialVer = 1; //* db version, used to determine if the db's structure has changed between connections.
//* establish a connection to IndexedDB database; request will act as a listener for the DB when we .open() it
const request = indexedDB.open(dbName, initialVer);

//! This is a listener to handle the event of a change that needs to be made to the database's structure. IndexedDB
//* infers that a change needs to be made when the database is first connected or if the version number changes.
//* This onupgradeneeded event will emit the first time we run the code and create the new_pizza object store.
//* The event won't run again unless we delete the database from the browser or we change the version number in
//* the .open() method to a value of 2, indicating that our database needs an update.
//* When this event executes, we store a locally scoped connection to the database and use the .createObjectStore()
//* method to create the object store that will hold the pizza data. With IndexedDB, we have a veritable blank
//* slate—we'll have to establish all of the rules for working with the database.
//* For that reason, when we create the new_pizza object store, we also instruct that store to have an auto
//* incrementing index for each new set of data we insert. Otherwise we'd have a hard time retrieving data.
//! db listener
request.onupgradeneeded = function (event) {
   const db = event.target.result; //* saves a reference to the db
   //* creates object store (table) called 'new_pizza', set it to have an auto increment 'primary key'
   db.createObjectStore('new_pizza', { autoIncrement: true });
};

//! db listener
//* With this first event handler, onsuccess, we set it up so that when we finalize the connection to the database,
//* we can store the resulting database object to the global variable db we created earlier. This event will also
//* emit every time we interact with the database, so every time it runs we check to see if the app is connected
//* to the internet network. If so, we'll execute the uploadPizza() function.
//* upon successful
request.onsuccess = function (event) {
   //* when db is successfully created with this object store (from onupgradedneede event above) or simply
   //* established a connection, save reference to db in global variable
   db = event.target.result;

   //* check if app is online; if yes, run uploadPizza() function to send all local db data to api
   if (navigator.onLine) {
      uploadPizza();
   }
};

//! db listener
//*  inform us if anything ever goes wrong with the database interaction
request.onerror = function (event) {
   console.log(event.target.errorCode);
};

//! this function will be submitted EACH TIME we attemp to submit a new pizza AND there is NO CONNECTION TO THE INTERNET network
//* This saveRecord() function will be used in the add-pizza.js file's form submission function if the fetch() function's .catch()
//* method is executed
//! Remember, the fetch() function's .catch() method is only executed on network failure!
function saveRecord(record) {
   const transaction = db.transaction(['new_pizza'], 'readwrite'); //* open a new transaction with the database with R/W permissions
   const pizzaObjectStore = transaction.objectStore('new_pizza'); //* access the object store for 'new_pizza'
   pizzaObjectStore.add(record); //* add record to pizza object store
}

//! this function will collect all the data from the new_pizza object store in IndexedDB and POST it to the server
function uploadPizza() {
   const transaction = db.transaction(['new_pizza'], 'readwrite'); //* open a new transaction with the database with R/W permissions
   const pizzaObjectstore = transaction.objectStore('new_pizza'); //* access the object store for 'new_pizza'

   //* get all records from store
   //! .getAll() is an asynchronous method
   const getAll = pizzaObjectstore.getAll(); //* send call to async method to get all data from IndexedDB store
   getAll.onsuccess = function () {
      //! if there is data in indexedDB's store, we send it to the api server
      if (getAll.result.length > 0) {
         fetch('/api/pizzas', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
               Accept: 'application/json, text/plain, *.*',
               'Content-Type': 'application/json',
            },
         })
            .then(response => response.json())
            .then(serverResponse => {
               if (serverResponse.message) {
                  throw new Error(serverResponse);
               }
               const transaction = db.transaction(['new_pizza'], 'readwrite'); //* open one more transaction
               const pizzaObjectstore = transaction.objectStore('new_pizza');
               pizzaObjectstore.clear(); //* clear all items in the store
               alert('All saved pizza data has been submitted to the server');
            })
            .catch(err => {
               console.log(err);
            });
      }
   };
}

//! eventListener to check if the browser regains internet connection (the browser comes back online)
window.addEventListener('online', uploadPizza);
