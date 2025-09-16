
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

function clearIndexedDB(dbName) {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = function () {
        console.log(`Database '${dbName}' deleted successfully`);
    };

    request.onerror = function () {
        console.error(`Error deleting database '${dbName}'`);
    };

    request.onblocked = function () {
        console.warn(`Database '${dbName}' deletion blocked`);
    };
}

const deleteOneIndexDB = (id) => {
    let request = indexedDB.open(`MyTabs`, 1);
    request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(["tabs"], "readwrite");
        let store = transaction.objectStore("tabs");
        let deleteRequest = store.delete(id);
        deleteRequest.onsuccess = function () {
            console.log("Deleted successfully!");
        };
        deleteRequest.onerror = function (event) {
            console.error(event.target.error);
        };
    };
}


export {
    openDB, clearIndexedDB, saveTabs, deleteOneIndexDB
}