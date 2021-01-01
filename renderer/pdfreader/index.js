// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {
    ipcRenderer
} = require("electron");
const pdfjsLib = require('pdfjs-dist');
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js';
window.onload = () => {
    ipcRenderer.send("getLocalSettings");
    ipcRenderer.on("getLocalSettings", (event, settings) => {
        settings = JSON.parse(settings);
        sessionStorage.setItem('list', settings.list);
    })

    window.onresize = () => {
        waterfall();
    }

    window.onblur = () => {
        console.log("blur!");
    }
    let icon = document.getElementsByClassName("myicon")[0];

    icon.addEventListener("click", (e) => {
        let pdf = document.getElementById("pdf");
        pdf.innerHTML = '';
        if (sessionStorage.getItem('list') === "card-list") {
            sessionStorage.setItem("list", "images");
        } else {
            sessionStorage.setItem("list", "card-list");
        }
        showPDF();
        ipcRenderer.send("setLocalSettings", JSON.stringify({
            "list": sessionStorage.getItem('list')
        }));
    })

    ipcRenderer.send("getPDFList");
    ipcRenderer.on("showPDF", (event, files) => {
        sessionStorage.setItem("files", JSON.stringify(files));
        showPDF();
    })
}

function waterfall() {
    let cols = 3;
    if (sessionStorage.getItem("list") === "images") {
        cols = Math.floor(document.documentElement.offsetWidth / 250);
    } else {
        cols = Math.floor(document.documentElement.offsetWidth / 500);
    }
    cols = cols == 0 ? 1 : cols;
    document.getElementById("pdf").style = "column-count:" + cols + ";";
}

function showPDF() {
    let files = JSON.parse(sessionStorage.getItem("files"));
    let icon = document.getElementsByClassName("myicon")[0];
    let pdf = document.getElementById("pdf");
    pdf.innerHTML = "";
    switch (sessionStorage.getItem("list")) {
        case "images":
            icon.innerHTML = "<svg width='2em' height='2em'viewBox='0 0 16 16' class='bi bi-card-list' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M14.5 3h-13a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z'/><path  fill-rule='evenodd'  d='M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z'/><circle cx='3.5' cy='5.5' r='.5' /><circle cx='3.5' cy='8' r='.5' /><circle cx='3.5' cy='10.5' r='.5' /></svg>";
            for (let file of files) {
                let div = document.createElement("div");
                let canvas = document.createElement("canvas");
                let div2 = document.createElement("div");
                canvas.width = 200;
                canvas.height = 300;
                div.className = "pdf-list";
                div.append(canvas);
                div2.className = "pdf-title";
                div2.innerHTML = file;
                div.append(div2);
                pdf.append(div);

                let type = file.substr(file.lastIndexOf(".") + 1);
                if (type == "jpg") {
                    let img = new Image();
                    img.onload = function () {
                        var context = canvas.getContext('2d');
                        canvas.height = img.height;
                        context.drawImage(img, 0, 0);
                    }
                    img.src = "D:/Program Files (x86)/pdf/cover/" + file;
                    div.addEventListener("click", (ev) => {
                        ipcRenderer.send("openPDF", "/pdf/" + file.substr(0, file.lastIndexOf(".")) + ".pdf");
                    })
                } else {
                    loadPDF("D:/Program Files (x86)/pdf/" + file, canvas);
                    div.addEventListener("click", (ev) => {
                        ipcRenderer.send("openPDF", "/pdf/" + file);
                    })
                }

            }
            break;
        case "card-list":
            icon.innerHTML = "<svg width='2em' height='2em' viewBox='0 0 16 16' class='bi bi-images' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' d='M12.002 4h-10a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1zm-10-1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-10zm4 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z'/><path fill-rule='evenodd' d='M4 2h10a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1v1a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2h1a1 1 0 0 1 1-1z'/></svg>";
            let div = document.createElement("div");
            div.className = "list-group list-group-flush";
            for (let file of files) {
                let type = file.substr(file.lastIndexOf(".") + 1);
                if (type == "jpg") {
                    file = file.substr(0, file.lastIndexOf(".")) + ".pdf";
                }
                div.innerHTML += "<button type='button' class='list-group-item list-group-item-action'>" + file + "</button>";
            }
            pdf.append(div);
            for (let button of document.getElementsByClassName("list-group-item")) {
                button.addEventListener("click", (ev) => {
                    ipcRenderer.send("openPDF", "/pdf/" + button.innerHTML);
                })
            }
            break;
    }
    waterfall();
}

function loadPDF(url, canvas) {
    // Asynchronous download of PDF
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function (pdf) {
            // Fetch the first page
            var pageNumber = 1;
            pdf.getPage(pageNumber).then(function (page) {
                var viewport = page.getViewport({
                    scale: 1
                });
                var scale = canvas.width / viewport.width;
                viewport = page.getViewport({
                    scale
                });

                // Prepare canvas using PDF page dimensions
                // var canvas = document.getElementById("the-canvas");
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                // canvas.width = viewport.width;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext).promise.then(() => {
                    let cover = canvas.toDataURL("image/jpeg");
                    let filename = url.substr(url.lastIndexOf("/") + 1, url.length - 5 - url.lastIndexOf("/"));
                    cover = cover.substr(cover.indexOf("base64") + 7);

                    ipcRenderer.send("pdfCover", JSON.stringify({
                        filename,
                        "image": cover
                    }));
                });
            }, function (reason) {
                // PDF loading error
                console.error(reason);
            });
        },
        function (reason) {
            // PDF loading error
            console.error(reason);
        })
}