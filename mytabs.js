import { saveTabs, deleteOneIndexDB, getTabs } from "./dbs/db.js";

const tablists = document.getElementById("tablists");
const addBtn = document.getElementById("addNewTab");
const searchInput = document.getElementById("searchTab")
const clearSearch = document.getElementById("clearSearch")


function createTab(tab) {
  const tabDetails = document.createElement("a");
  tabDetails.className = "tabDetails";
  tabDetails.href = tab?.links;
  tabDetails.target = "_blank";

  const tabName = document.createElement("div");
  tabName.className = "tabName";
  tabName.innerText = tab?.name;

  const tabImg = document.createElement("div");
  tabImg.className = "tabImg";
  const imgTag = document.createElement("img");
  imgTag.src = tab?.icons || "./assets/tabs.png";
  tabImg.appendChild(imgTag);

  tabDetails.appendChild(tabImg);
  tabDetails.appendChild(tabName);

  const deletBtn = document.createElement("button")
  deletBtn.id = tab.id
  deletBtn.className = "deleteBtn"
  deletBtn.innerHTML = "❌"

  deletBtn.title = "Delete Tabs"
  tabDetails.appendChild(deletBtn)
  tablists.appendChild(tabDetails);

  deletBtn.addEventListener('click', deleteTab)
}

function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const formatted = tabs.map((tabData) => ({
        name: tabData.title,
        icons: tabData.favIconUrl,
        links: tabData.url,
      }));
      resolve(formatted);
    });
  });
}

addBtn.addEventListener("click", async () => {
  const addedTabs = await getActiveTab();
  await saveTabs(addedTabs);
  await displayTabs()
});
const displayTabs = async () => {
  const res = await getTabs();
  tablists.innerHTML = "";
  res.forEach((tab) => createTab(tab));
}

displayTabs()

const deleteTab = (e) => {
  e.preventDefault();
  const id = e.target.id
  deleteOneIndexDB(parseInt(id))
  displayTabs()
}


const searchHanlder = async (e) => {
  const { value } = e.target
  if (!value.trim()) {
    return
  }
  let tabsData = await getTabs()
  let searchInputText = value.toLowerCase()
  tabsData = tabsData.filter((tabs) => tabs.name.toLowerCase().includes(searchInputText) || tabs.links.toLowerCase().includes(searchInputText))
  tablists.innerHTML = "";
  tabsData.forEach((tab) => createTab(tab));
}
searchInput.addEventListener("input", searchHanlder)

const clearSearchHandler = () => {
  window.location.reload();
}
clearSearch.addEventListener("click", clearSearchHandler)