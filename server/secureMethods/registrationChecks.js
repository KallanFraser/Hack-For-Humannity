const fs = require('fs');
const path = require('path');


function importCollegeDomains()
{
    const filePath = path.join(__dirname, '..','src','listOfCollegeDomains.json'); // Path to the JSON file
    const rawData = fs.readFileSync(filePath, 'utf8'); // Read the file synchronously
    return JSON.parse(rawData); // Parse the JSON data and return
}

function importMajors(majors)
{
    const filePath = path.join(__dirname, '..','src','listOfMajors.json'); // Path to the JSON file
    const rawData = fs.readFileSync(filePath, 'utf8'); // Read the file synchronously
    return JSON.parse(rawData); // Parse the JSON data and return
}

function authenticatePassword(password) 
{
    if (password.length > 5 && password.length <= 40)
    {
        return true;
    }
    return false;
}

function authenticateEmail(emailEntered)
{
    let collegeDomainCache = importCollegeDomains(); // Imports a JSON

    const parts = emailEntered.split('@');
    if (parts.length <= 1) 
    {
        return false; // Immediately return false if no domain part
    }

    const domainCheck = parts[1]; // Selects the second part, which is the domain
    let foundDomain = collegeDomainCache.some(college => college.value === domainCheck);

    return foundDomain; // Domain found, return true; otherwise, return false
}

function authenticateMajor(major)
{
    let collegeMajorList = importMajors(); //function returns an array of objects with a 'value' property

    let foundDomain = collegeMajorList.some(majorItem => majorItem.name === major);

    return foundDomain; // Major found = return true else, return false
        
}

function authenticateGraduationYear(graduationYear)
{
    const currentYear = new Date().getFullYear();
    let graduationYearIntForm = 0;

    if (typeof graduationYear === 'number') 
    {
        graduationYearIntForm = Math.floor(graduationYear);
    }

    if (typeof graduationYear === 'string') 
    {
        graduationYearIntForm = parseInt(graduationYear, 10);
    }

    if (currentYear <= graduationYearIntForm && graduationYearIntForm <= (currentYear+5))
    {
        return true;
    }
    return false;
}

function authenticateNames(firstName, secondName)
{
    if (firstName.length < 2 && firstName.length > 20)
    {
        return false;
    }
    if (secondName.length < 2 && secondName.length > 20)
    {
        return false;
    }    
    return true;
}


module.exports = {authenticateNames, importCollegeDomains, authenticatePassword, authenticateEmail, authenticateGraduationYear, authenticateMajor};