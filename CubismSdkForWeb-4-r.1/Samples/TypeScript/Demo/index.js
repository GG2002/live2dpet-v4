const {
    ipcRenderer
} = require("electron");

document.addEventListener("click", () => {
    ipcRenderer.send("showPDFList");
})
document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.dataTransfer.files[0]);
    let files = e.dataTransfer.files;
    let filelist = [];
    for (let i = 0; i < files.length; i++) {
        filelist[i] = {};
        filelist[i].path = files[i].path;
        filelist[i].name = files[i].name;
    }
    console.log(JSON.stringify(filelist));
    ipcRenderer.send("onFileIn", JSON.stringify(filelist));
}, false)
document.addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();
    // console.log(e.dataTransfer);
}, false)
document.addEventListener("dragenter", (e) => {
    e.stopPropagation();
    e.preventDefault();
}, false)
