import { mytabs } from "./data.js";

const tablists = document.getElementById("tablists");
const addBtn = document.getElementById("addNewTab");

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
  imgTag.src = tab?.icons
  tabImg.appendChild(imgTag);

  tabDetails.appendChild(tabImg);
  tabDetails.appendChild(tabName);

  tablists.appendChild(tabDetails);
}



function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyTabs", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("tabs")) {
        db.createObjectStore("tabs", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("DB error: " + event.target.errorCode);
    };
  });
}

async function saveTabs(tabs) {
  const db = await openDB();
  const tx = db.transaction("tabs", "readwrite");
  const store = tx.objectStore("tabs");
  tabs.forEach(tab => {
    store.add(tab);
  });
  return tx.complete;
}

async function getTabs() {
  const db = await openDB();
  const tx = db.transaction("tabs", "readonly");
  const store = tx.objectStore("tabs");

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Error reading data");
  });
}

addBtn.addEventListener("click", async () => {
  let addedTabs = []
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.map((tabData) => {
      addedTabs.push({ name: tabData.title, icons: tabData.favIconUrl, links: tabData.url })
    })
  });
  console.log(addedTabs, "<---- addedd tabs")
  let res = await saveTabs(addedTabs)
  console.log(res)
})