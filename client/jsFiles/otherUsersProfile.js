document.addEventListener('DOMContentLoaded', () => 
{
    fetch('../loggedInUsersFiles/otherUser.json')
        .then(response => response.json())
        .then(user => 
        {
            const userProfile = document.getElementById('userProfile');
            userProfile.innerHTML = `
                <h2>${user.firstName} ${user.lastName}</h2>
                <p>Class of ${user.graduationYear}</p>
                <p>${user.email}</p>
                <p>Majoring in ${user.major}</p>
            `;
        })
        .catch(error => 
        {
            console.error('Error fetching user data:', error);
        });
});