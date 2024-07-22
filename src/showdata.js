export let container = document.querySelector(".container");

export let showData = (arr) => {
    arr.forEach((data) => {
        if (data.blogs[0]) {
            let card = document.createElement("div");
            card.classList.add("card");

            let userContainer = document.createElement("div");
            let user = document.createElement("a");
            user.innerHTML = data.username;
            user.href = `./files/user.html?userId=${data.id}`;
            let img = document.createElement("img");
            img.src = "./images/profile.png"; // Or default image path
            userContainer.append(img, user);
            userContainer.classList.add("user");

            let divBlog = document.createElement("div");

            let title = document.createElement("h5");
            title.innerHTML = data.blogs[0].title;
            let body = document.createElement("p");
            body.innerHTML = data.blogs[0].body;

            // Reaction functionality
            let reactionContainer = document.createElement("div");
            reactionContainer.classList.add("reaction-container");

            // Create reaction buttons dynamically
            data.blogs[0].reactions.forEach((reaction) => {
                let reactionButton = document.createElement("button");
                reactionButton.classList.add("reaction-btn");
                reactionButton.innerHTML = reaction.emoji + ` ${reaction.count}`;

                reactionButton.addEventListener("click", () => {
                    
                    // Update only the selected reaction
                    data.blogs[0].reactions.forEach((r) => {
                        if (r.type === reaction.type) {
                            r.count += r.selected ? -1 : 1;
                            r.selected = !r.selected;
                            reactionButton.innerHTML = r.emoji + ` ${r.count}`;

                            // Update reactions on the server
                            updateReactionsOnServer(
                                data.id,
                                data.blogs[0].id,
                                data.blogs[0].reactions
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
            // Display existing comments from data.blogs[0].comments
            data.blogs[0].comments?.forEach((comment) => {
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

            let commentBox = document.createElement("div");
            commentBox.classList.add("commentBox");

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
            commentBox.append(commentForm);
            // Add comment on form submission
            commentForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const newComment = commentInput.value.trim();
                if (!newComment) return; // Handle empty comment

                // Update comments in data and UI
                data.blogs[0].comments = data.blogs[0].comments || [];
                data.blogs[0].comments.push(newComment);

                let commentItem = document.createElement("li");
                commentItem.classList.add("comment-item");
                commentItem.textContent = newComment;
                commentList.append(commentItem);

                commentInput.value = ""; // Clear input after submission

                // Update comments on the server
                updateCommentsOnServer(data.id, data.blogs[0].id, data.blogs[0].comments);
            });

            let reactDiv = document.createElement("div");
            reactDiv.classList.add("reactDiv");
            reactDiv.append(reactionContainer, commentSection);
            commentSection.append(commentList, commentBox, showComment);

            divBlog.append(title, body, reactDiv);

            card.append(userContainer, divBlog);
            container.append(card);
        }
    });
};

export const clearData = () => {
    container.innerHTML = "";
};

function updateReactionsOnServer(userId, blogId, reactions) {
    fetch(`http://localhost:3000/users/${userId}`)
        .then((response) => response.json())
        .then((user) => {
            // Find the specific blog
            let blog = user.blogs.find((blog) => blog.id === blogId);
            if (blog) {
                blog.reactions = reactions; // Update reactions
                // Send the entire user object back to the server
                return fetch(`http://localhost:3000/users/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user),
                });
            } else {
                throw new Error("Blog not found");
            }
        })
        .then((response) => response.json())
        .then((data) => console.log("Reactions updated successfully", data))
        .catch((error) => console.error("Error updating reactions:", error));
}

function updateCommentsOnServer(userId, blogId, comments) {
    fetch(`http://localhost:3000/users/${userId}`)
        .then((response) => response.json())
        .then((user) => {
            // Find the specific blog
            let blog = user.blogs.find((blog) => blog.id === blogId);
            if (blog) {
                blog.comments = comments; // Update comments
                // Send the entire user object back to the server
                return fetch(`http://localhost:3000/users/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user),
                });
            } else {
                throw new Error("Blog not found");
            }
        })
        .then((response) => response.json())
        .then((data) => console.log("Comments updated successfully", data))
        .catch((error) => console.error("Error updating comments:", error));
}
