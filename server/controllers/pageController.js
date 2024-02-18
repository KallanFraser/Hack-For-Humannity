const path = require('path');
const fs = require('fs');
const userModel = require('../database/models'); //imports the models from the database directory
const registrationChecks = require('../secureMethods/registrationChecks');
const createDefaultPhoto = require('../secureMethods/createProfileImage');

//Page redirects - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

exports.mainMenuPage = (req, res) => 
{
    res.sendFile(path.join(__dirname,'..', '..', 'client', 'htmlFiles','mainMenu.html')); 
};

exports.loginPage = (req, res) => 
{
    res.sendFile(path.join(__dirname, '..','..', 'client','htmlFiles', 'loginPage.html'));
};

exports.registerPage = (req,res) =>
{
    res.sendFile(path.join(__dirname, '..','..','client','htmlFiles','register.html'));
};

exports.profilePage = (req,res) =>
{
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'htmlFiles', 'myProfile.html'))
}

exports.classesPage = (req,res) =>
{
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'htmlFiles', 'myClasses.html'))
}

exports.friendsPage = (req,res) =>
{
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'htmlFiles','myFriends.html'))
}

exports.otherUsersProfile = (req, res) => 
{   
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'htmlFiles','otherUsersProfile.html')); 
};

// Actions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

exports.registeredAwaitingConfirmation = (req,res) =>
{
    res.sendFile(path.join(__dirname,'..','..','client','htmlFiles','registeredAwaitingConfirmation.html'))
};

exports.listOfMajors = (req,res) =>
{
    res.sendFile(path.join(__dirname, '..','src','listOfMajors.json'));
}

exports.listOfCollegeDomains = (req,res) =>
{
    res.sendFile(path.join(__dirname, '..','src','listOfCollegeDomains.json'));
}

// req = contains the object storing the data needed to register a new user
exports.registerUser = (req, res) => //exports the registerUser method
{
    let {firstName, lastName, email, password, graduationYear, major} = req.body; //extracts user data from the request body
    try 
    {
        if (!registrationChecks.authenticateEmail(String(email)))
        {
            //console.log('Invalid Email');
            throw new Error("Invalid email");
        }
        if (!registrationChecks.authenticateGraduationYear(parseInt(graduationYear,10))) 
        {
            //console.log('Invalid Grad Year');
            throw new Error("Invalid Grad year");
        }
        if(!registrationChecks.authenticatePassword(String(password)))
        {
            //console.log('Invalid Password');
            throw new Error("Invalid Password");
        }
        if(!registrationChecks.authenticateMajor(String(major)))
        {
            //console.log('Invalid Major');
            throw new Error("Invalid Major");
        }
        firstName = String(firstName);
        lastName = String(lastName);
        if(!registrationChecks.authenticateNames(firstName, lastName))
        {
            //console.log('Invalid Major');
            throw new Error("Invalid Names");
        }
        userModel.createUser(firstName, lastName, email, password, graduationYear, major) //calls the createUser method here from the models.js in /database
        .then((message) => //.then() method = promise is resolved = user is successfully created. Message param = contains the success message from the call
        {
            //res.redirect('/registeredAwaitingConfirmation');
            const imageName = email + '.png';
            const folderPath = path.join(__dirname, '..','userData','userProfilePictures')
            const fullPath = path.join(folderPath, imageName);
            createDefaultPhoto.createBlankProfilePhoto(600,600,fullPath);
            res.redirect('/login');
        })
        .catch((error) => //.catch() method = promise is rejected
        {
            console.error(error); // Error creating user: ...
        });
    } 
    catch (error) 
    {
        //console.log("Server Side Registration validation failed, try again")
        res.status(400).send(error.message);
    }
};

exports.listUsers = (req, res) => //function to listUsers, use for debugging
{
    userModel.getUsers((err, users) => 
    {
        if (err) 
        {
            res.status(500).send('Error retrieving users');
        } 
        else 
        {
            res.json(users); //sends the users in a JSON format
        }
    });
};

exports.loginRequest = (req, res) =>
{
    let {email, password} = req.body; //extracts user data from the request body

    userModel.getUserByEmail(email,(error, userJson) =>
    {
        if (error)
        {
            console.error('Error retrieiving user via email:', error.message);
        }
        else //retrieval was successful
        {
            parsedData = JSON.parse(userJson);
            passwordConfirm = parsedData.password;
            if (password === passwordConfirm)
            {
                const credentials = parsedData;

                const filePath = path.join(__dirname, '..','..','client','loggedInUsersFiles','credentials.json');
                fs.writeFile(filePath, JSON.stringify(credentials, null, 2), (err) => 
                {
                    if (err) 
                    {
                        console.error('Error writing to credentials file:', err);
                    } 
                    else 
                    {
                        console.log('Credentials saved to', filePath);
                    }
                });
                const sourcePath = path.join(__dirname, '..','userData','userProfilePictures',(email+'.png'));

                const destinationPath = path.join(__dirname, '..','..','client','loggedInusersFiles','usersProfilePicture.png');

                fs.copyFile(sourcePath, destinationPath, (err) => 
                {
                    if (err) 
                    {
                        console.error('Error copying file:', err);
                    }
                    console.log('File copied successfully!');
                });

                res.redirect('/mainMenu');
            }
            else
            {
                console.error('Error with password match', error.message);
            }
        }
    });
};

exports.addClasses = (req,res) =>
{
    let {email, classAdded} = req.body;
    userModel.addClass(String(email),String(classAdded))
    .then((resolve) => 
        {
            //const newReq = {body: email};
            //exports.refreshCredentials(newReq,res);
            res.status(200).json({ message: "Class One successfully added for user." });
        })
    .catch((reject) => 
        {
            console.log("Error updating class One for user")
            console.error(reject); // Error updating users class One in database
        });
};

exports.refreshCredentials = (req,res) =>
{
    let {email} = req.body;

    userModel.getUserByEmail(String(email), (error, userJson) => 
    {
        if (error) 
        {
            console.error('Error retrieving user:', error);
            res.status(500).json({ message: 'Error retrieving user' });
        } 
        else 
        {
            const parsedData = JSON.parse(userJson);
            const credentials = parsedData;
            const filePath = path.join(__dirname, '..', '..', 'client', 'loggedInUsersFiles', 'credentials.json');

            fs.writeFile(filePath, JSON.stringify(credentials, null, 2), (err) => 
            {
                if (err) 
                {
                    console.error('Error writing to credentials file:', err);
                    res.status(500).json({ message: 'Error writing to file' });
                } 
                else 
                {
                    console.log('Credentials saved to', filePath);
                    res.status(200).json({ message: 'Credentials refreshed successfully' });
                }
            });
        }
    });
};

exports.createPost = (req,res) =>
{
    let {userID, title, text} = req.body;

    userModel.createPost(userID,title,text,null,(err,postID) =>
    {
        if (err) 
        {
            console.error('Error creating post:', err);
        } 
        else 
        {
            console.log('Post created with ID:', postID);
        }
    })
};

exports.getRecentPosts = (req,res)=>
{
    userModel.getRecentPosts((err,posts) =>
    {
        if (err)
        {
            console.error('Error fetching recent posts:',err);
        }
        else
        {
            console.log('Recent posts sucessfully retrieved', posts);
            res.json(posts);
        }
    })
};

exports.createReply = (req,res)=>
{
    let {postID, userID, content} = req.body;

    userModel.insertReply(postID, userID, content, null,(err,replyID)=>
    {
        if (err)
        {
            console.error('Error creating reply:', err);
        }
        else
        {
            console.log('Reply created for post ID:', postID);
        }
    })
};

exports.getReplies = (req,res)=>
{
    let {postID} = req.body;

    userModel.getRepliesByPostID(postID, (err,replies) =>
    {
        if (err)
        {
            console.error('Error retrieving replies from post',err);
        }
        else
        {
            res.json(replies);
        }
    })
};

//big security vulnerability but no time, fix later
exports.refreshPage = (req,res) =>
{
    const pageUrl = req.body.url; // URL from the request body
    res.redirect(pageUrl); //redirecting
}

exports.createFriendRequest = (req,res) =>
{
    const friendUserID = req.body.id;

    const filePath = '../client/loggedInUsersFiles/credentials.json';

    fs.readFile(filePath, 'utf8', (err, data) => 
    {
        if (err) 
        {
            console.error(err);
            return;
        }
        try 
        {
            const jsonData = JSON.parse(data);
            const userID = jsonData.id;
            
            userModel.createFriendRequest(userID, friendUserID, (err,requestID)=>
            {
                if (err)
                {
                    console.error('Error creating friend Request:', err);
                }
                else
                {
                    console.log('Friend request created for user ID:', userID);
                    res.json(requestID);
                }
            })
        } 
        catch (err) 
        {
            console.error('Error parsing JSON:', err);
        }
    });
};

exports.suggestFriends = (req,res) =>
{
    const filePath = '../client/loggedInUsersFiles/credentials.json';

    fs.readFile(filePath, 'utf8', (err, data) => 
    {
        if (err) 
        {
            console.error(err);
            return;
        }
        try 
        {
            const jsonData = JSON.parse(data);
            const id = jsonData.id;

            userModel.getRecentUsers(id, (err,rows)=>
            {
                if (err)
                {
                    console.error('Error creating friend suggestions:', err);
                }
                else
                {
                    console.log('Friend suggestions acquired');
                    res.json(rows);
                }
            })
        } 
        catch (err) 
        {
            console.error('Error parsing JSON:', err);
        }
    });
};

exports.getFriendRequests = (req,res)=>
{
    let {userID} = req.body;

    userModel.getFriendRequests(userID,(err,rows)=>
    {
        if (err)
        {
            console.error('Error getting friend Requests:', err);
        }
        else
        {
            console.log('Friend requests acquired');
            res.json(rows);
        }
    })
};

exports.viewUsersProfile = (req,res) =>
{
    const email = req.body.id; //for some dumbass retarded reason this is how we access the email from the req body.

    userModel.getUserByEmail(email,(error, userJson) =>
    {
        if (error)
        {
            console.error('Error retrieiving user via email:', error.message);
        }
        else //retrieval was successful
        {
            parsedData = JSON.parse(userJson);
            const credentials = parsedData;

            const filePath = path.resolve(__dirname, '..', '..', 'client', 'loggedInUsersFiles', 'otherUser.json');

            // Write the JSON string to the file
            fs.writeFile(filePath, JSON.stringify(credentials, null, 2), (err) => 
            {
                if (err) 
                {
                    console.error('Error writing to otherUsers File:', err);
                } 
                else 
                {
                    console.log('Other Users file saved to', filePath);
                }
            });
            //res.redirect('/mainMenu');
            res.json({ message: 'User profile retrieved successfully', data: credentials });
        }
    });
};

exports.acceptFriendRequest = (req,res) =>
{    
    const friendUserID = req.body.requestID;

    const filePath = '../client/loggedInUsersFiles/credentials.json';

    fs.readFile(filePath, 'utf8', (err, data) => 
    {
        if (err) 
        {
            console.error(err);
            return;
        }
        try 
        {
            const jsonData = JSON.parse(data);
            const userID = jsonData.id;

            console.log('About to make the following user IDs friends');
            console.log(userID);
            console.log(friendUserID);
            
            userModel.acceptFriendRequest(userID, friendUserID, (err,suc) =>
            {
                if (err)
                {
                    console.error('Error creating friend Request:', err);
                }
                else
                {
                    console.log('Friend request aceepted for user ID:', userID);
                    res.json(friendUserID);
                }
            })
        } 
        catch (err) 
        {
            console.error('Error parsing JSON:', err);
        }
    });
};

exports.getUsersFriends = (req,res) =>
{    
    const userID = req.body.userID;

    userModel.getUsersFriends(userID, (err,rows) =>
    {
        if (err)
        {
            console.error('Error retrieving users Friends:', err);
        }
        else
        {
            res.json(rows); 
        }
    })
};


/*
exports.pullUserData = (req,res) =>
{
    let {email, password} = req.body;
    
    userModel.getUserByEmail(email,(error, userJson) =>
    {
        if (error)
        {
            console.error('Error retrieiving user via email:', error.message);
        }
        else //retrieval was successful
        {
            const passwordConfirm = userJson.password;
            if (password === passwordConfirm)
            {
                res.json(JSON.parse(userJson));
                //return the JSON file to the html with the users datas
                //do not forget the users picture
            }
            else
            {
                console.error('Error with password match', error.message);
            }
        }
    });
    
};
*/