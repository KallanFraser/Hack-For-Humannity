const database = require('./database'); // Imports the database js file in this directory

//createUser = create a user record in the database
/*function createUser(firstName, lastName, email, password, graduationYear, major) //method to create a user for the database
{
    const sql = `INSERT INTO users (firstName, lastName, email, password, graduationYear, major) VALUES (?, ?, ?, ?, ?, ?)`;
    // ? placeholders = to insert the values provided as parameters to the function

    database.run(sql, [firstName, lastName, email, password, graduationYear, major], function(err) 
    // calls the run method on the database object executing the sql statement from above
    {
        if (err) 
        {
            console.error(err.message);
            console.log("Email already in use"); //I am assuming here that this is the error, but would most likely be the most common case
        }
        console.log("New User Registered Under Email: ",email);
        console.log('User Count In Database: ${this.lastID}');
    });
}*/
function createUser(firstName, lastName, email, password, graduationYear, major) 
{
    return new Promise((resolve, reject) => 
    {
      const sql = `INSERT INTO users (firstName, lastName, email, password, graduationYear, major, class1, class2, class3, class4, class5) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, NULL)`;

  
      database.run(sql, [firstName, lastName, email, password, graduationYear, major], function(err) 
      {
        if (err) 
        {
          console.error(err.message);
          reject("Error creating user: " + err.message); //I am assuming here that this is the error, but would most likely be the most common case
        } 
        else 
        {
          console.log("New User Registered Under Email: ", email);
          console.log(`User Count In Database: ${this.lastID}`);
          resolve("User created successfully");
        }
      });
    });
  }
  

// Purpose of the callback argument = to allow the function to pass the results back to the caller once the database operation has finished.
function getUsers(callback) 
{
    //Future note, should probably not return the entire database if this ever gets too large!
    const sql = `SELECT * FROM users`; // * = retrieves every record stored in the users table.

    // all  = method to select all users in the database object that match the query
    // Since our query has no parameters, we pass an empty array
    database.all(sql, [], (err, rows) => 
    {
        if (err) 
        {
            callback(err, null);
        } 
        else 
        {
            // err section of the callback = null to indicate no error
            // row section of the callback returns all the rows of the Users
            callback(null, rows);
        }
    });
}

// Email argument = provides the email argument to find the row that matches to get the User
// callback argument = waits for the db query to finish and returns the results
function findUserByEmail(email, callback) 
{
    // * = selects all the columns of which matche the email argument.
    // ? = placeholder for email arg
    const sqlQuery = 'SELECT * FROM users WHERE email = ?';

    // we then execute the sql query inserted with the email arg through our database
    // (err, row) => is a callback that will be executed after the database operation is completed for the function calling this function
    // row = will store the user found by the email
    database.get(sqlQuery, [String(email)], (err, row) => 
    {
        if (err) //No user found for email or other error
        {
            callback(err, null); // returns an error and a null for the row return
        } 
        else //A user account with an email is found
        {
            callback(null, row); // returns no error and a row containing the users data that matche the email address argument
        }
    });
}

function getUserByEmail(email, callback) 
{
    database.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => 
    {
        if (err) 
        {
            callback(err, null);
        } 
        else 
        {
            callback(null, JSON.stringify(row));
        }
    });
}

function getPasswordByEmail(email, callback) 
{
    const sqlQuery = 'SELECT password FROM users WHERE email = ?';

    database.get(sqlQuery, [email], (err, row) => 
    {
        if (err) //no row / password found for the email entered or error so return false
        {
            callback(err, null);
        } 
        else //password found or not found so return result
        {
            const password = row ? row.password : null; //if row is true, return the row.password column, else return null
            callback(null, password);
        }
    });
}

function addClass(email, classText) 
{
  console.log(email, classText);
  return new Promise((resolve, reject) => 
  {
      // Query to find the first non-null class column and ensure entry does not already exist
      const selectSql = `SELECT 
                              CASE 
                                  WHEN class1 IS NULL THEN 'class1'
                                  WHEN class2 IS NULL THEN 'class2'
                                  WHEN class3 IS NULL THEN 'class3'
                                  WHEN class4 IS NULL THEN 'class4'
                                  WHEN class5 IS NULL THEN 'class5'
                                  ELSE NULL
                              END AS firstNullColumn,
                              (class1 = ? OR class2 = ? OR class3 = ? OR class4 = ? OR class5 = ?) AS classExists
                          FROM users WHERE email = ?`;

      database.get(selectSql, [classText, classText, classText, classText, classText, email], (err, row) => 
      {
          if (err) 
          {
              console.error(err.message);
              reject("Error finding non-null class column: " + err.message);
          } 
          else if (row && row.firstNullColumn && !row.classExists) 
          {
              // Updarte db if parameters are met
              const updateSql = `UPDATE users SET ${row.firstNullColumn} = ? WHERE email = ?`;
              database.run(updateSql, [classText, email], function(err) 
              {
                  if (err) 
                  {
                      console.error(err.message);
                      reject("Error updating class: " + err.message);
                  } 
                  else 
                  {
                      if (this.changes > 0) 
                      {
                          console.log(`Class updated for user with email: ${email}`);
                          resolve("Class updated successfully");
                      } 
                      else 
                      {
                          console.log(`No user found with email: ${email}`);
                          reject("No user found with the specified email");
                      }
                  }
              });
          } 
          else 
          {
              console.log(`Cannot add class '${classText}' for user with email: ${email} as it already exists or all columns are filled`);
              reject(`Cannot add class '${classText}' as it already exists or all columns are filled`);
          }
      });
  });
}

function getClassesByEmail(email) 
{
  return new Promise((resolve, reject) => 
  {
    const sql = `SELECT class1, class2, class3, class4, class5 FROM users WHERE email = ?`; // Query to select the classes for a user with a specific email

    database.get(sql, [email], (err, row) => 
    {
      if (err) 
      {
        console.error(err.message);
        reject("Error retrieving classes: " + err.message);
      } 
      else 
      {
        if (row) 
        {
          console.log(`Classes retrieved for user with email: ${email}`);
          resolve(row); // Resolve with the row containing the classes
        } 
        else 
        {
          console.log(`No user found with email: ${email}`);
          reject("No user found with the specified email");
        }
      }
    });
  });
}

function createPost(userID, title, content, imageBuffer, callback) 
{
    const sql = `INSERT INTO posts (id, title, content, image) VALUES (?, ?, ?, ?)`;

    database.run(sql, [userID, title, content, imageBuffer], function(err) 
    {
        if (err) 
        {
            console.error('Error creating post:', err.message);
            callback(err);
        } 
        else 
        {
            console.log('Post created with postID:', this.lastID);
            callback(null, this.lastID); // Return the last inserted postID
        }
    });
}

function getRecentPosts(callback) 
{
    const sql = `SELECT * FROM posts ORDER BY created_at DESC LIMIT 20`;

    database.all(sql, [], (err, rows) => 
    {
        if (err) 
        {
            console.error('Error fetching posts:', err.message);
            callback(err);
        } 
        else 
        {
            callback(null, rows); // Return the rows as a JSON object
        }
    });
}

function insertReply(postID, userID, content, image = null, callback)
{
    const sql = `INSERT INTO replies (postID, id, content, image) VALUES (?, ?, ?, ?)`;

    database.run(sql, [postID, userID, content, image], function(err) 
    {
        if (err) 
        {
            callback(err);
        } 
        else 
        {
            callback(null, this.lastID); // Return the last inserted postID
        }
    });
}

function getRepliesByPostID(postID, callback) 
{
    const sql = `SELECT * FROM replies WHERE postID = ?`;

    database.all(sql, [postID], (err, rows) => 
    {
        if (err) 
        {
            callback(err, null);
        } 
        else 
        {
            callback(null, rows);
        }
    });
}

function createFriendRequest(senderID, receiverID, callback)
{
    const sql = `INSERT INTO friendRequests (senderID, receiverID, status) VALUES (?, ?, 'pending')`;

    database.run(sql, [senderID, receiverID], (err) => 
    {
        if (err) 
        {
            callback(err, null);
        } 
        else 
        {
            callback(null, { requestID: this.lastID });
        }
    });
};

/*
function getRecentUsers(callback) 
{
    const sql = `SELECT * FROM users ORDER BY id DESC LIMIT 10`;

    database.all(sql, [], (err, rows) => 
    {
        if (err) 
        {
            callback(err, null);
        } 
        else 
        {
            callback(null, rows);
        }
    });
};
*/

function getRecentUsers(currentUserID, callback) {
    const sql = `
        SELECT * 
        FROM users 
        WHERE id != ? AND 
            id NOT IN (SELECT friend_id FROM friends WHERE user_id = ?) AND 
            id NOT IN (SELECT receiverID FROM friendRequests WHERE senderID = ? AND status = 'pending') AND 
            id NOT IN (SELECT senderID FROM friendRequests WHERE receiverID = ? AND status = 'pending')
        ORDER BY id DESC 
        LIMIT 10
    `;

    database.all(sql, [currentUserID, currentUserID, currentUserID, currentUserID], (err, rows) => 
    {
        if (err) 
        {
            callback(err, null);
        } 
        else 
        {
            callback(null, rows);
        }
    });
}


function getFriendRequests(userID, callback)
{
    const sql = `
        SELECT u.* 
        FROM users u 
        JOIN friendRequests fr ON u.id = fr.senderID 
        WHERE fr.receiverID = ? AND fr.status = 'pending'
    `;
    console.log('Looking for friends for user ID of : ');
    console.log(userID);

    database.all(sql, [userID], (err, rows) => 
    {
        if (err) 
        {
            callback(err, null);
        } 
        else 
        {
            callback(null, rows);
        }
    });
};

function acceptFriendRequest(senderID, receiverID, callback) 
{
    database.run("BEGIN TRANSACTION;", (err) => 
    {
        if (err) 
        {
            return callback(new Error("Transaction begin error: " + err.message), null);
        }

        // Update the status in the friendRequests table
        const updateQuery = `UPDATE friendRequests SET status = 'accepted' WHERE senderID = ? AND receiverID = ?`;
        database.run(updateQuery, [senderID, receiverID], (err) => 
        {
            if (err) 
            {
                callback(new Error("Error updating friend request: " + err.message), null);

                // Rollback the transaction in case of error
                return database.run("ROLLBACK;", (rollbackErr) => 
                {
                    if (rollbackErr) 
                    {
                        console.error("Transaction rollback error:", rollbackErr.message);
                    }
                });
            }

            // Insert new friendship into friends table
            const insertQuery = `INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)`;
            database.run(insertQuery, [senderID, receiverID, receiverID, senderID], (err) => 
            {
                if (err) 
                {
                    callback(new Error("Error inserting new friendship: " + err.message), null);

                    // Rollback the transaction in case of error
                    return database.run("ROLLBACK;", (rollbackErr) => 
                    {
                        if (rollbackErr) 
                        {
                            console.error("Transaction rollback error:", rollbackErr.message);
                        }
                    });
                }

                // Commit transaction
                database.run("COMMIT;", (err) => 
                {
                    if (err) 
                    {
                        callback(new Error("Transaction commit error: " + err.message), null);
                    } 
                    else 
                    {
                        // Success message
                        const updateQuery = `UPDATE friendRequests SET status = 'accepted' 
                                                WHERE (senderID = ? AND receiverID = ?) 
                                                OR (senderID = ? AND receiverID = ?)`;
                    
                        database.run(updateQuery, [senderID, receiverID, receiverID, senderID], (err) => 
                        {
                            if (err) 
                            {
                                console.error('Error accepting friend request:', err.message);
                                callback(err,null);
                            } 
                            else 
                            {
                                callback(null, "Friend request accepted and friendship created successfully.");
                            }
                        });
                    }
                });
            });
        });
    });
}

function getUsersFriends(userID, callback) 
{
    const sql = `
        SELECT u.* 
        FROM users u
        JOIN friends f ON u.id = f.friend_id 
        WHERE f.user_id = ?
        UNION
        SELECT u.* 
        FROM users u
        JOIN friends f ON u.id = f.user_id 
        WHERE f.friend_id = ?
    `;
    database.all(sql, [userID, userID], (err, rows) => 
    {
        if (err) 
        {
            callback(err, null);
        } 
        else 
        {
            callback(null, rows);
        }
    });
}



//This shit is getting long af, should probablly clean up and export each function if have time
module.exports = {getUsersFriends, acceptFriendRequest, getFriendRequests, getRecentUsers, createFriendRequest, getRepliesByPostID, insertReply, getRecentPosts,createPost,getClassesByEmail,addClass,getUserByEmail,getPasswordByEmail, createUser, getUsers, findUserByEmail }; //exports the createUser and getUsers method for our pageController.js file