const sqlite3 = require('sqlite3').verbose();
//Verbose() = provides more detailed logging of the operations the SQLite engine is performing = useful for debugging purposes 

const database = new sqlite3.Database('./database/userDatabase.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => 
{
    if (err) 
    {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

/*
First Line =                             Asks SQLite to run a SQL statement. 
id INTEGER PRIMARY KEY AUTOINCREMENT, =  Defines a column id that is an integer, serves as the primary key, and auto-increments with each new record.
firstName TEXT NOT NULL, =               Defines a firstName column that stores text and cannot be null.
lastName TEXT NOT NULL, =                Defines a lastName column similar to firstName.
email TEXT NOT NULL UNIQUE, =            Defines an email column that must be unique across all records and cannot be null.
password TEXT NOT NULL, =                Defines a password column that stores text and cannot be null.
graduationYear INTEGER, =                Defines a graduationYear column to store integer values.
major TEXT) =                            Defines a major column to store text.
*/
database.run(`CREATE TABLE IF NOT EXISTS users 
    (id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    graduationYear INTEGER,
    major TEXT,
    class1 TEXT,
    class2 TEXT,
    class3 TEXT,
    class4 TEXT,
    class5 TEXT
)`, (err) => 
{
    if (err) 
    {
        console.error(err.message);
    } 
    else 
    {
        console.log('Users table loaded');
    }
});


//id = USERS ID
database.run(`CREATE TABLE IF NOT EXISTS posts (
    postID INTEGER PRIMARY KEY AUTOINCREMENT,
    id INTEGER,
    title TEXT,
    content TEXT,
    image BLOB,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (id) REFERENCES users(id)
)`, (err) => 
{
    if (err) 
    {
        console.error(err.message);
    } 
    else 
    {
        console.log('Posts table loaded');
    }
});

// Create the replies table
database.run(`CREATE TABLE IF NOT EXISTS replies (
    replyID INTEGER PRIMARY KEY AUTOINCREMENT,
    postID INTEGER,
    id INTEGER,
    content TEXT,
    image BLOB,
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (postID) REFERENCES posts(postID),
    FOREIGN KEY (id) REFERENCES users(id)
)`, (err) => 
{
    if (err) 
    {
        console.error(err.message);
    } 
    else 
    {
        console.log('Replies table loaded');
    }
});

// Table for friends relationships
database.run(`CREATE TABLE IF NOT EXISTS friends (
    user_id INTEGER,
    friend_id INTEGER,
    UNIQUE(user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
)`, (err) => 
{
    if (err) 
    {
        console.error(err.message);
    } 
    else 
    {
        console.log('Friends table loaded');
    }
});

// Table for friend requests
database.run(`CREATE TABLE IF NOT EXISTS friendRequests (
    requestID INTEGER PRIMARY KEY AUTOINCREMENT,
    senderID INTEGER,
    receiverID INTEGER,
    status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (senderID) REFERENCES users(id),
    FOREIGN KEY (receiverID) REFERENCES users(id)
)`, (err) => 
{
    if (err) 
    {
        console.error(err.message);
    } 
    else 
    {
        console.log('FriendRequests table loaded');
    }
});

module.exports = database; //expots this file as database