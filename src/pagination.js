import { fetchData } from "./fetchdata.js";
import { showData, clearData } from "./showdata.js";

const container = document.querySelector(".container");
const pagination = document.querySelector(".pagination");
const toggleButton = document.getElementById("toggle");

let currentPage = 1;
let isInfiniteScroll = false;
const itemsPerPage = 4;

const loadPaginatedData = async (page) => {
    clearData(); // Clear previous data
    const data = await fetchData(`http://localhost:3000/users?_page=${page}&_limit=${itemsPerPage}`);
    showData(data);
};

const loadInfiniteData = async () => {
    const data = await fetchData(`http://localhost:3000/users?_page=${currentPage}&_limit=${itemsPerPage}`);
    showData(data);
    currentPage++;
};

const createPaginationButtons = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", () => {
            clearData();
            loadPaginatedData(i);
        });
        pagination.appendChild(button);
    }
};

const toggleScrollMode = async () => {
    isInfiniteScroll = !isInfiniteScroll;
    currentPage = 1;
    clearData();
    if (isInfiniteScroll) {
        toggleButton.textContent = "Switch to Pagination";
        pagination.style.display = "none";
        window.addEventListener("scroll", handleInfiniteScroll);
        await loadInfiniteData();
    } else {
        toggleButton.textContent = "Switch to Infinite Scroll";
        pagination.style.display = "flex";
        window.removeEventListener("scroll", handleInfiniteScroll);
        const data = await fetchData(`http://localhost:3000/users`);
        const totalItems = data.length;
        createPaginationButtons(totalItems);
        await loadPaginatedData(1);
    }
};

const handleInfiniteScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        loadInfiniteData();
    }
};

toggleButton.addEventListener("click", toggleScrollMode);

export { toggleScrollMode, loadPaginatedData, loadInfiniteData };
