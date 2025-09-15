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
  imgTag.src = tab?.icons || "default-icon.png";
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
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject("DB error: " + event.target.errorCode);
  });
}

async function saveTabs(tabs) {
  const db = await openDB();
  const tx = db.transaction("tabs", "readwrite");
  const store = tx.objectStore("tabs");
  tabs.forEach((tab) => {
    store.add(tab);
  });
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