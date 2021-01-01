const {
    ipcRenderer
} = require("electron");
document.addEventListener("click", () => {
    ipcRenderer.send("showPDFList");
})