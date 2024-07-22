import { fetchData } from "./fetchdata.js";
import { showData, clearData } from "./showdata.js";
import { handleToggle } from "./toggleTheme.js";
import { toggleScrollMode, loadPaginatedData, loadInfiniteData } from "./pagination.js";

const urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get('userId');
let baseURL = `http://localhost:3000/users/${userId}`;
let login = document.querySelector(".login");
let toggle = document.querySelector(".toggle");
let profile = document.querySelector(".profile");
let search = document.querySelector("#search");

if (userId === null) {
    setTimeout(() => {
        alert("Please login");
        window.location.href = "./files/login.html";
    }, 5000);
} else {
    login.innerHTML = "Logout";
    login.addEventListener("click", () => {
        localStorage.removeItem("logged");
        window.location.href = "./files/login.html";
    });
}

let getData = async (baseURL) => {
    let data = await fetchData(baseURL);
    showData(data);
    return data;
};

getData(`http://localhost:3000/users`);

toggle.addEventListener("click", handleToggle);

let handleProfile = () => {
    window.location.href = `./files/user.html?userId=${userId}`;
};

profile.addEventListener("click", handleProfile);

let handleSearch = async (event) => {
    event.preventDefault();
    let query = search.value.toLowerCase();
    let data = await fetchData(`http://localhost:3000/users`);
    let filteredData = data.filter(user => user.username.toLowerCase().includes(query));
    clearData();
    showData(filteredData);
};

search.addEventListener("input", handleSearch);





