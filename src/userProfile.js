import { container } from "./showdata.js";
import { fetchData } from "../src/fetchdata.js";
import { handleToggle } from "./toggleTheme.js";
const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get('userId');
let baseURL = `http://localhost:3000/users/${userId}`;
let toggle = document.querySelector(".toggle");
let login = document.querySelector(".login");
let addpost = document.querySelector(".addpost")
let user = document.querySelector(".user")
let form = document.querySelector("form")
console.log(userId)

toggle.addEventListener("click", handleToggle)



export let loggeduser = JSON.parse(localStorage.getItem("logged")) || [];
console.log(loggeduser.id)
if (loggeduser.id != userId) {
    addpost.classList.add("hide")
}


if (userId == null) {
    setTimeout(() => {
        alert("Please login");
        window.location.href = "login.html";
    }, 5000)
} else {
    login.innerHTML = "Logout";
    login.addEventListener("click", () => {
        localStorage.removeItem("logged");
        window.location.href = "login.html";
    });
}


let flag = false;
form.classList.add("hide")

addpost.addEventListener("click", () => {

    if (flag) {
        form.classList.add("hide")
        flag = false;
    }
    else {
        form.classList.remove("hide")
        flag = true

    }
})

let data;
let getdata = async (baseURL) => {
    data = await fetchData(baseURL)
    createcard(data)
    // console.log(data)
    return (data)
}
data = getdata(baseURL);


let handleForm = async (event) => {
    event.preventDefault();
    let title = event.target[0].value
    let body = event.target[1].value
    let obj = {
        title, body,
        "reactions": [
            { "type": "like", "emoji": "👍", "count": 0 },
            { "type": "heart", "emoji": "❤️", "count": 0 },
            { "type": "haha", "emoji": "😄", "count": 0 }
        ],
        "comments": [""]

    }
    let narr = data.blogs || []
    console.log(narr)
    narr = [...narr, obj]
    console.log(narr)
    console.log(baseURL)
    await fetch(baseURL, {
        method: "PATCH",
        headers: {
            "content-type": 'application/json'
        },
        body: JSON.stringify({ blogs: narr })
    })
    data = await getdata(baseURL)
}
form.addEventListener("submit", handleForm)

console.log(loggeduser.id)


let createcard = async (data) => {
    if (loggeduser.id == userId) {
        user.innerHTML = "Hey " + data.username + ", Revisit all your amazing blog posts."

    }
    else {
        user.innerHTML = data.username + "'s Blogs"
    }
    data.blogs.forEach((blog) => {
        let card = document.createElement("div");
        card.classList.add("card");


        let title = document.createElement("h5");
        title.innerHTML = blog.title;
        let bodyy = document.createElement("p");
        bodyy.innerHTML = blog.body;
        // Reaction functionality

        let analyticsRedirect = ()=>{
            localStorage.setItem("selectBlog", JSON.stringify(blog))
             window.location.href = "./analytics.html"
        }
        
                bodyy.addEventListener("click", analyticsRedirect)
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



    });

}

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
