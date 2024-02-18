function addListOfMajors()
{
    fetch('/listOfMajors')
        .then(response => response.json())
        .then(data =>
        {
            const majorElement = document.getElementById('major');
            data.forEach(major =>
            {
                const newOption = new Option(major.name, major.name);
                majorElement.add(newOption);
            });
            $(majorElement).select2();
        })
        .catch(error=> console.error('Error loading list of majors', error));
}

function authenticatePassword() 
{
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) 
    {
        alert("Passwords do not match.");
        return false; // Prevent form submission
    }
    return true; // Allow form submission
}

function authenticateEmail()
{
    var emailEntered = document.getElementById("email").value;
    const parts = emailEntered.split('@');

    if (parts.length <= 1) 
    {
        alert("No domain entered.");
        return false; // Immediately return false if no domain part
    }
    
    var domainCheck = parts[1]; // Selects the second part, which is the part after the "@"

    let foundDomain = collegeDomainList.some(college => college.value === domainCheck);

    if (foundDomain) {
        // Domain found, proceed with authentication
        return true;
    } else {
        alert("Could not find a matching college domain");
        return false;
    }

}

let collegeDomainList = null; // Cache outside the function
function importCollegeDomains() //this is temporary and will eventually be put on the server side as it is a security risk
{
    if (collegeDomainList) 
    {
        return Promise.resolve(collegeDomainList); // Use cached data
    } 
    else 
    {
        // Fetch and cache the data
        return fetch('/listOfCollegeDomains')
            .then(response => response.json())
            .then(data => 
                {
                collegeDomainList = data; // Cache the fetched data
                return data;
            })
            .catch(error => 
                {
                console.error('Error loading list of college domains', error);
                return []; // Return an empty list or handle the error as needed
            });
    }
}

function authenticateGraduationYear()
{
    const currentYear = new Date().getFullYear();
    //var yearEntered = document.getElementById("graduationYear").value;
    var yearEntered = parseInt(document.getElementById("graduationYear").value, 10);

    if (currentYear <= yearEntered && yearEntered <= (currentYear+5))
    {
        return true;
    }
    alert("Invalid graduation year entry!");
    return false;
}

document.getElementById('registerForm').addEventListener('submit', function(event) 
{
    if (!authenticatePassword()) 
    {
        event.preventDefault(); // Prevents form submission
    }
    if (!authenticateEmail())
    {
        event.preventDefault(); // Prevents form submission
    }
    if (!authenticateGraduationYear())
    {
        event.preventDefault(); // Prevents form submission
    }
});

document.addEventListener('DOMContentLoaded', function() 
{
    addListOfMajors(); // Calls the method to add all the list of majors to the selection panel
    importCollegeDomains();
});