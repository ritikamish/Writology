import { container } from "./showdata.js";

let body = document.querySelector("body");
let header = document.querySelector("header");

let theme = JSON.parse(localStorage.getItem("theme")) || "light";
let flag = theme === "dark"; // Set flag based on saved theme

export let handleToggle = () => {
    if (flag) {
        container.classList.remove("dark");
        header.classList.remove("dark");
        body.classList.remove("dark");
        localStorage.setItem("theme", JSON.stringify("light"));
        flag = false;
    } else {
        body.classList.add("dark");
        container.classList.add("dark");
        header.classList.add("dark");
        localStorage.setItem("theme", JSON.stringify("dark"));
        flag = true;
    }
};

// Apply saved theme on page load
if (theme === "dark") {
    body.classList.add("dark");
    container.classList.add("dark");
    header.classList.add("dark");
}
