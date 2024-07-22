import { container } from "./showdata.js";

export const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetching data failed", error);
        return [];
    }
};

let isLogged = JSON.parse(localStorage.getItem("logged")) || false;
let home  = document.querySelector(".home")
let handleRedirect = () => {
    window.location.href = `../index.html?userId=${isLogged.id}`;
}

home.addEventListener("click", handleRedirect)


