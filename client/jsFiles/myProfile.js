document.addEventListener('DOMContentLoaded', () => //when content is loaded...
{
    fetch('../loggedInUsersFiles/credentials.json')
    .then(response => response.json())
    .then(data => 
    {
        // Updates the HTML elements with the data
        document.getElementById('userName').textContent = data.firstName + " " + data.lastName;
        document.getElementById('userEmail').textContent = data.email;
        document.getElementById('userMajor').textContent = data.major;
        document.getElementById('userGradYear').textContent = data.graduationYear
    })
    .catch(error => 
    {
        console.error('Error', error);
    });
});
