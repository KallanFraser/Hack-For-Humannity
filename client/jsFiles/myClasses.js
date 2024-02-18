function loadAndDisplayClasses() {
    fetch('../src/listOfClasses.json')
    .then(response => response.json())
    .then(data =>
        {
            const classListAdd = document.getElementById('classListAdd');
            data.forEach(classObject =>
            {
                const newOption = new Option(classObject.name, classObject.name);
                classListAdd.add(newOption);
            });
            $(classListAdd).select2();
        })
    .catch(error=> console.error('Error loading list of classes', error));
}

document.addEventListener('DOMContentLoaded', () => //when content is loaded...
{
    loadAndDisplayClasses();
    refreshUsersClasses();
});

document.getElementById('submitClass').addEventListener('click', function() 
{
    const selectedClass = document.getElementById('classListAdd').value;

    fetch('../loggedInUsersFiles/credentials.json')
    .then(response => response.json())
    .then(data => 
    {
        const usersEmail = data.email;

        const payload =  //What we POST to the endpoint
        {
            email: usersEmail,
            classAdded: selectedClass
        };

        fetch('/addClass', 
        {
            method: 'POST',
            headers: 
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => 
        {
            if (!response.ok) 
            {
                throw new Error('Network response was not ok');
            }

            const payload2 =  //What we POST to the endpoint
            {
                email: usersEmail
            };
            
            fetch('/refreshCredentials', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload2)
            })
            .then(response => 
            {
                if (!response.ok) 
                {
                    throw new Error('Network response was not ok');
                }
                //All good section
                // call refreshUsersClasses
                refreshUsersClasses();
            })
            .catch(error => 
            {
                console.error('Error:', error);
            });
            
        })
        .catch(error => 
        {
            console.error('Error:', error);
        });
    })
    .catch(error => 
    {
        console.error('Error', error);
    });
});


function refreshUsersClasses()
{
    fetch('../loggedInUsersFiles/credentials.json')
        .then(response => response.json())
        .then(data => 
            {
            const classListContainer = document.querySelector('.classList');
            classListContainer.innerHTML = ''; // Remove all existing list items
            
            const classes = ['class1', 'class2', 'class3', 'class4', 'class5'];

            classes.forEach(className => 
                {
                const classNameValue = data[className];
                if (classNameValue) 
                {
                    const listItem = document.createElement('li');
                    const link = document.createElement('a');
                    link.textContent = classNameValue;
                    listItem.appendChild(link);
                    classListContainer.appendChild(listItem);

                    fetch('../src/listOfClasses.json') // Fetch and process the listOfClasses.json file for each class
                        .then(response => response.json())
                        .then(links => 
                            {
                            const linkData = links.find(linkItem => linkItem.name === classNameValue); // Find the corresponding link in listOfClasses.json
                            if (linkData) 
                            {
                                link.href = `../classes/htmlFiles/${linkData.value}.html`; // Set the href using the value from listOfClasses.json
                            }
                        })
                        .catch(error => console.error('Error loading listOfClasses.json:', error));
                }
            });
        })
        .catch(error => console.error('Error loading credentials.json:', error));
}
