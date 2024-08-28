// Retrieve the result from local storage and display it in the sidebar
chrome.storage.local.get("result", (data) => {
    if (data.result) {
        document.getElementById("output").innerText = data.result;
    } else {
        document.getElementById("output").innerText = "No result available.";
    }
});

