document.getElementById('postForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const photoLink = document.getElementById('photoLink').value;
    const description = document.getElementById('description').value;
  
    try {
      const response = await axios.post('http://localhost:3000/post', { photoLink, description });
      const { id, photoLink: newPhotoLink, description: newDescription } = response.data;
  
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${newPhotoLink}" alt="Post Image">
        <p>${newDescription}</p>
        <div class="comments">
          <h3>Comments</h3>
          <input type="text" id="commentInput${id}" placeholder="Add a comment">
          <button onclick="addComment(${id})">Add</button>
          <div id="commentsContainer${id}"></div>
        </div>
      `;
  
      document.getElementById('cards').appendChild(card);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  });
  
  async function addComment(postId) {
    const commentInput = document.getElementById(`commentInput${postId}`);
    const commentText = commentInput.value;
  
    try {
      await axios.post(`http://localhost:3000/post/${postId}/comments`, { comment: commentText });
      commentInput.value = '';
  
      const commentsContainer = document.getElementById(`commentsContainer${postId}`);
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('comment');
      commentDiv.textContent = commentText;
      commentsContainer.appendChild(commentDiv);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }
  