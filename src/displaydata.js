export let displayblog = (blog) =>{

    let card = document.createElement("div");
    card.classList.add("card");
    
    
    let title = document.createElement("h5");
    title.innerHTML = blog.title;
    let bodyy = document.createElement("p");
    bodyy.innerHTML = blog.body;
    // Reaction functionality
    
    let reactionContainer = document.createElement("div");
    reactionContainer.classList.add("reaction-container");
    
    // Create reaction buttons dynamically
    blog.reactions.forEach((reaction) => {
    let reactionButton = document.createElement("button");
    reactionButton.classList.add("reaction-btn");
    reactionButton.innerHTML = reaction.emoji + ` ${reaction.count}`;
    
    reactionButton.addEventListener("click", () => {
        // Update only the selected reaction
        blog.reactions.forEach((r) => {
            if (r.type === reaction.type) {
                r.count += r.selected ? -1 : 1;
                r.selected = !r.selected;
                reactionButton.innerHTML = r.emoji + ` ${r.count}`;
                
                // Update reactions on the server
                updateReactionsOnServer(
                    data.id,
                    blog.id,
                    blog.reactions
                );
            } else {
                r.selected = false;
            }
        });
        
        reactionButton.classList.toggle("selected");
    });
    
    reactionContainer.append(reactionButton);
});



// Comment functionality
let commentSection = document.createElement("div");
commentSection.classList.add("comment-section");

let commentList = document.createElement("ul");
commentList.classList.add("comment-list");
let showComment = document.createElement("button");
showComment.classList.add("showcomment")
// Display existing comments from blog comments
blog.comments.forEach((comment) => {
    let commentItem = document.createElement("li");
    commentItem.classList.add("comment-item");
    commentItem.classList.add("comment-item-css");
    commentItem.textContent = comment;
    commentList.append(commentItem);
    
    showComment.innerHTML = "View Comments";
    
    showComment.addEventListener("click", () => {
        let isHidden = commentItem.classList.contains("comment-item");
        commentItem.classList.toggle("comment-item");
        
        // Update button text based on visibility
        showComment.textContent = isHidden ? "Hide Comments" : "View Comments";
    });
});

let commentBox = document.createElement("div")
commentBox.classList.add("commentBox")

let commentForm = document.createElement("form");
commentForm.classList.add("comment-form");

let commentInput = document.createElement("input");
commentInput.type = "text";
commentInput.required = true;
commentInput.placeholder = "Leave a comment";
commentForm.append(commentInput);

let submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Comment";
commentForm.append(submitButton);
commentBox.append(commentForm)
// Add comment on form submission
commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newComment = commentInput.value.trim();
    if (!newComment) return; // Handle empty comment
    
    // Update comments in data and UI
    blog.comments = blog.comments || [];
    blog.comments.push(newComment);
    
    let commentItem = document.createElement("li");
    commentItem.classList.add("comment-item");
    commentItem.textContent = newComment;
    commentList.append(commentItem);
    
    commentInput.value = ""; // Clear input after submission
    
    
    
    // Update comments on the server
    updateCommentsOnServer(data.id, blog.id, blog.comments);
})



commentSection.append(commentList, commentBox, showComment);

let reactDiv = document.createElement("div")
reactDiv.classList.add("reactDiv")
reactDiv.append(reactionContainer, commentSection)
commentSection.append(commentList, commentBox, showComment);


card.append(title, bodyy, reactDiv);
container.append(card);


}