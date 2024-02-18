document.addEventListener('DOMContentLoaded', () => //when content is loaded...
{
    fetchFriendSuggestions();
    fetchFriendRequests();
    fetchFriendsList();
});

function fetchFriendsList() {
    fetch('./../loggedInUsersFiles/credentials.json')
        .then(response => response.json())
        .then(userData => {
            const userID = userData.id;

            return fetch('/getUsersFriends', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID: userID })
            });
        })
        .then(response => response.text()) // Use text() instead of json() to get the raw response
        .then(text => 
        {
            return JSON.parse(text); // Parse the text as JSON
        })
        .then(friends => 
        {
            const friendsContent = document.querySelector('.friendscontent');
            friendsContent.innerHTML = ''; // Clear existing content

            friends.forEach(friend => 
            {
                const friendItem = document.createElement('div');
                friendItem.classList.add('friend-item');

                const profileCircle = document.createElement('div');
                profileCircle.classList.add('profile-circle');
                // You can set the background image to the friend's profile picture if available
                // profileCircle.style.backgroundImage = `url(${friend.profilePictureUrl})`;

                //const nameSpan = document.createElement('span');
                //nameSpan.textContent = friend.firstName + " " + friend.lastName;

                // Create an anchor element for the friend's name
                const nameLink = document.createElement('a');
                nameLink.textContent = friend.firstName + " " + friend.lastName;
                nameLink.href = '#'; // Placeholder, actual navigation will be handled by the click event
                nameLink.classList.add('name-link');
                nameLink.onclick = function(event) 
                {
                    event.preventDefault(); // Prevent the default anchor behavior
                    postUserID(friend.email); // Post the friend's email to the endpoint
                };

                friendItem.appendChild(profileCircle);
                friendItem.appendChild(nameLink);
                friendsContent.appendChild(friendItem);
            });
        })
        .catch(error => 
        {
            console.error('Error fetching friends list:', error);
        });
}

function fetchFriendRequests() 
{
    fetch('./../loggedInUsersFiles/credentials.json')
        .then(response => response.json())
        .then(userData => 
        {
            const userID = userData.id;

            return fetch('/getFriendRequests', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID: userID })
            });
        })
        .then(response => response.json())
        .then(requests => 
        {
            const friendRequestsContent = document.querySelector('.friendRequestcontent');
            friendRequestsContent.innerHTML = ''; // Clear existing content

            requests.forEach(request => 
            {
                const requestItem = document.createElement('div');
                requestItem.classList.add('friend-request-item');

                const nameSpan = document.createElement('span');
                nameSpan.textContent = request.firstName + " " + request.lastName;

                const acceptButton = document.createElement('button');
                acceptButton.textContent = 'Accept';
                acceptButton.classList.add('accept-button');
                acceptButton.onclick = function() 
                {
                    console.log('Request ID Below')
                    console.log(request.id);
                    // Send a POST request to accept the friend request
                    fetch('/acceptFriendRequest', 
                    {
                        method: 'POST',
                        headers: 
                        {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ requestID: request.id })
                    })
                    .then(response => 
                    {
                        if (!response.ok) 
                        {
                            throw new Error('Failed to accept friend request');
                        }
                        // Handle successful response, maybe refresh the page or update UI
                        refreshPage();
                    })
                    .catch(error => 
                    {
                        console.error('Error accepting friend request:', error);
                    });
                };

                requestItem.appendChild(nameSpan);
                requestItem.appendChild(acceptButton);
                friendRequestsContent.appendChild(requestItem);
            });
        })
        .catch(error => 
        {
            console.error('Error fetching friend requests:', error);
        });
}


function fetchFriendSuggestions() 
{
    fetch('/suggestFriends')
        .then(response => response.json())
        .then(users => 
        {
            const suggestedFriendsList = document.getElementById('suggestedFriendsList');
            suggestedFriendsList.innerHTML = ''; // Clear existing list items

            users.forEach(user => 
            {
                const listItem = document.createElement('li');
                listItem.classList.add('friend-suggestion-item');

                // Creates a div for the profile circle
                const profileCircle = document.createElement('div');
                profileCircle.classList.add('profile-circle');

                // Creates an anchor element for the user's name
                const nameLink = document.createElement('a');
                nameLink.textContent = user.firstName + " " + user.lastName;
                nameLink.href = '#'; // Placeholder, actual navigation will be handled by the click event
                nameLink.classList.add('name-link');
                nameLink.onclick = function(event) 
                {
                    event.preventDefault(); // Prevent the default anchor behavior
                    postUserID(user.email); // Post the user's ID to the endpoint
                };

                // Creates a button for hiding the list item
                const hideButton = document.createElement('button');
                hideButton.textContent = 'Add';
                hideButton.classList.add('hide-button');
                hideButton.onclick = function() 
                {
                    listItem.style.display = 'none';
                    fetch('/createFriendRequest', 
                    {
                        method: 'POST',
                        headers: 
                        {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: user.id })
                    })
                    .then(response => 
                    {
                        if (!response.ok) 
                        {
                            throw new Error('Failed to add friend');
                        }
                        // Handle successful response
                    })
                    .catch(error => 
                    {
                        console.error('Error adding friend:', error);
                    });
                };

                // Append elements to the list item
                listItem.appendChild(profileCircle);
                listItem.appendChild(nameLink);
                listItem.appendChild(hideButton);

                suggestedFriendsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching suggested friends:', error);
        });
}

// Function to post the user's ID to the /viewUsersProfile endpoint
function postUserID(userID) 
{
    fetch('/viewUsersProfile', 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userID })
    })
    .then(response => 
    {
        if (!response.ok) 
        {
            throw new Error('Network response was not ok');
        }
        // Redirect to the main menu if the response is ok
        window.location.href = '/otherUsersProfile';
    })
    .catch(error => {
        console.error('Error posting user ID:', error);
    });
}




function refreshPage() 
{
    fetch('/refreshPage', 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: window.location.href })
    })
    .then(response => 
    {
        if (response.redirected) 
        {
            window.location.href = response.url; // Redirect to the same page
        }
    })
    .catch(error => console.error('Error:', error));
}