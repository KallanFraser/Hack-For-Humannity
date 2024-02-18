const express = require('express');
const router = express.Router(); //creates a router object called router
const pageController = require('../controllers/pageController'); // Import the controllers from pageController.js

//Pages - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/', pageController.loginPage) //This retrieves the handler page for the login page when the server is started

router.get('/login', pageController.loginPage); // This retrieves the handler function for the loginPage when the URL /login is called

router.get('/mainMenu', pageController.mainMenuPage); // This retrieves the handler function for the main menu page when the URL /mainMenu is called

router.get('/register', pageController.registerPage); // This retrieves the handler function for the registerPage when the URL /register is called

router.get('/myProfile', pageController.profilePage); // This retrieves the handler function for the registerPage when the URL /register is called

router.get('/myClasses', pageController.classesPage); // This retrieves the handler function for the registerPage when the URL /register is called

router.get('/myFriends', pageController.friendsPage); // This retrieves the handler function for the registerPage when the URL /register is called

//Actions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//router.get('/pullUserData', pageController.pullUserData);

//router.get('/registeredAwaitingConfirmation', pageController.registeredAwaitingConfirmation); // This retrieves the handler function for the registeredAwaitingConfrimation

router.get('/listOfMajors', pageController.listOfMajors); //this retrieves the handler function for returning the list of majors

router.get('/listOfCollegeDomains', pageController.listOfCollegeDomains); //this retrieves the handler function for returning the list of majors

router.post('/registerUser', pageController.registerUser);

router.post('/loginUser',pageController.loginRequest);

router.post('/addClass',pageController.addClasses);

router.post('/refreshCredentials',pageController.refreshCredentials);

router.post('/createPost',pageController.createPost);

router.get('/getRecentPosts',pageController.getRecentPosts); //For now its just 161, but will make POST with the class posts looking for 

router.post('/createReply',pageController.createReply);

router.post('/getReplies',pageController.getReplies);

router.post('/refreshPage',pageController.refreshPage);

//Friend section - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.post('/createFriendRequest',pageController.createFriendRequest);

router.get('/suggestFriends',pageController.suggestFriends); //for now its a get, in the future will be a post with userID for more accurate suggestions

router.post('/getFriendRequests',pageController.getFriendRequests);

router.post('/viewUsersProfile',pageController.viewUsersProfile);

router.get('/otherUsersProfile',pageController.otherUsersProfile);

router.post('/acceptFriendRequest',pageController.acceptFriendRequest);

router.post('/getUsersFriends',pageController.getUsersFriends);

//router.get('/users', pageController.listUsers);

module.exports = router; //exports router as a module for our server.js
