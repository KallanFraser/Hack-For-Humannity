document.addEventListener('DOMContentLoaded', () => //when content is loaded...
{
    fetchPostsRepliesAndAddReply();
});

function fetchPostsRepliesAndAddReply()
{
    // Fetches and displays the most recent posts - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    fetch('/getRecentPosts')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('all-posts');
        if (!postsContainer)
        {
            console.error('Error: Element with ID "all-posts" not found.');
            return;
        }

        posts.forEach(post => 
        {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-content">
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <p><small>Posted: ${moment.utc(post.created_at).fromNow()}</small></p>
                </div>
                <div class="replies-container"></div>
                <button class="reply-button">Reply</button>
                <div class="reply-form" style="display: none;">
                    <textarea class="reply-text" placeholder="Write your reply..."></textarea>
                    <button class="submit-reply">Submit Reply</button>
                </div>
            `;
            postsContainer.appendChild(postElement);

            const repliesContainer = postElement.querySelector('.replies-container');

            // Fetches and displays each of the Replies to the current Post - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            fetch('/getReplies', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postID: post.postID }),
            })
            .then(response => response.json())
            .then(replies => 
            {
                replies.forEach(reply => 
                {
                    const replyElement = document.createElement('div');
                    replyElement.className = 'reply';
                    replyElement.innerHTML = `
                        <p>${reply.content}</p>
                        <p><small>Replied: ${moment.utc(reply.created_at).fromNow()}</small></p>
                    `;
                    repliesContainer.appendChild(replyElement);
                });
            })
            .catch(error => console.error('Error fetching replies:', error));
            
            const replyButton = postElement.querySelector('.reply-button');
            const replyForm = postElement.querySelector('.reply-form');
            const replyText = postElement.querySelector('.reply-text');

            replyButton.addEventListener('click', () => 
            {
                replyForm.style.display = 'block';
                event.stopPropagation();
            });

            //Sends the new reply to the server database - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            const submitButton = postElement.querySelector('.submit-reply');
            submitButton.addEventListener('click', () => 
            {
                const replyContent = replyText.value;
                const postID = post.postID; 
                let userID = null;
                
                fetch('../../loggedInUsersFiles/credentials.json')
                .then(response => response.json())
                .then(data => 
                {
                    userID = data.id;  
                    const payload =  //What we POST to the endpoint
                    {
                        postID: postID,
                        id: userID,
                        content: replyContent,
                    };
                    
                    return fetch('/createReply', 
                    {
                        method: 'POST',
                        headers: 
                        {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload),
                    });
                })
                .then(response => response.json())
                .then(data => 
                {
                    console.log('Reply succesfully created client side:', data);
                    replyForm.style.display = 'none';
                    replyText.value = ''; // Clears the text area
                    console.log('Refreshing page');
                    refreshPage();
                })
                .catch(error => console.error('Error submitting reply:', error));
            });
        });

        // Hide all reply forms when clicking anywhere outside the reply sections
        document.addEventListener('click', (event) => 
        {
            const replyForms = document.querySelectorAll('.reply-form');
            replyForms.forEach(form => 
            {
                if (!form.contains(event.target)) 
                {
                    form.style.display = 'none';
                }
            });
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
}

document.getElementById('newPostButton').addEventListener('click', function() 
{
    //document.querySelector('.post-form').style.display = 'block';
    document.querySelector('.post-form').style.display = 'flex';
});

document.getElementById('submitPostButton').addEventListener('click', function() 
{
    var title = document.getElementById('postTitle').value;
    var text = document.getElementById('postText').value;
    var image = document.getElementById('postImage').files[0];
    let userID = null;
    // Send text and image to the endpoint
    fetch('../../loggedInUsersFiles/credentials.json')
        .then(response => response.json())
        .then(data => 
        {
            userID = data.id;  
            console.log(userID);
            const payload =  //What we POST to the endpoint
            {
                userID: userID,
                title: title,
                text: text,
            };
            //will add image: image but for now we do not have enough time
            fetch('/createPost', 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        })
    .then(response => 
    {
        console.log("Post successfully created");
        refreshPage();
    })
    .catch(error => 
    {
        console.error('Error:', error);
    });
});

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