import { mytabs } from "./data.js";

const tablists = document.getElementById("tablists");
const addBtn = document.getElementById("addNewTab")

mytabs.forEach(tab => {
  const tabDetails = document.createElement("a");
  tabDetails.className = "tabDetails";
  tabDetails.href = "https://github.com/Mr-Jitesh9170/My-Tabs"

  const tabName = document.createElement("div");
  tabName.className = "tabName";
  tabName.innerText = tab.name;

  const tabImg = document.createElement("div");
  tabImg.className = "tabImg";
  const imgTag = document.createElement("img");
  imgTag.src = tab.icons || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwJTFfoVZ4-V-Zt8oj5O3AnpHaYlrOEpVgRg&s";
  tabImg.appendChild(imgTag);

  tabDetails.appendChild(tabImg);
  tabDetails.appendChild(tabName);

  tablists.appendChild(tabDetails);
});

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  Array.from(inputFields).forEach((data) => {
    const newTab = {
      name: data.value,
      icons: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwJTFfoVZ4-V-Zt8oj5O3AnpHaYlrOEpVgRg&s",
      links: "https://github.com/Mr-Jitesh9170/My-Tabs"
    };
    mytabs.push(newTab);
    createTab(newTab); 
    data.value = ""; 
  });
});