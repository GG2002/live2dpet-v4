// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  shell,
  Menu,
  Tray
} = require('electron');
const path = require('path');
const fs = require('fs');
const {
  documentDir
} = require('./config');

const Store = require('electron-store');
const store = new Store();

function createWindow() {
  // Create the browser window.
  let size = screen.getPrimaryDisplay().workAreaSize;
  let width = 210;
  let height = 210;
  const mainWindow = new BrowserWindow({
    width,
    height,
    x: size.width - width,
    y: size.height - height,
    transparent: true,
    frame: false,
    resizable:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  //窗口始终在前
  mainWindow.setAlwaysOnTop(true);
  //不在任务栏显示窗口
  mainWindow.setSkipTaskbar(true);
  //最小化窗口
  this.apptray = setTray(app, mainWindow);
  
  // and load the index.html of the app.
  mainWindow.loadFile('.\\CubismSdkForWeb-4-r.1\\Samples\\TypeScript\\Demo\\index.html')
  
  // mainWindow.loadFile("./renderer/index/index.html");
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("onFileIn", (event, files) => {
  let filelist = JSON.parse(files);
  for (let file of filelist) {
    fs.stat(file.path, (err, data) => {
      let isFile = data.isFile();
      if (isFile) {
        //文件

        let type = file.path.substr(file.path.lastIndexOf(".") + 1);

        if (type === "pdf") {
          //若没有文件夹则创建
          checkDir(documentDir + type);

          fs.readFile(file.path, (e, data) => {
            fs.writeFile(documentDir + type + '/' + file.name, data, (e) => {
              fs.unlink(file.path, () => {})
            });
          })
        }
      }

    });
  }
})
ipcMain.on("showPDFList", (event) => {
  try {
    this.pdfListWindow.show();
    console.log(1);
    fs.readdir(documentDir + "pdf", (err, files) => {
      for (let i = 0; i < files.length; i++) {
        files[i] = store.get(files[i]) || files[i];
        if (files[i].indexOf('.') < 0) {
          files.splice(i, 1);
          i--;
        }
      }
      this.pdfListWindow.send("showPDF", files);
    })
  } catch (e) {
    this.pdfListWindow = new BrowserWindow({
      width: 600,
      height: 600,
      // transparent: true,
      // frame: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
      }
    });
    // this.pdfListWindow.webContents.openDevTools();
    this.pdfListWindow.loadFile("./renderer/pdfreader/" + "index.html");
    this.pdfListWindow.on("close", (event) => {
      event.preventDefault();
      this.pdfListWindow.hide();
    })

    ipcMain.on("getPDFList", (event) => {
      fs.readdir(documentDir + "pdf", (err, files) => {
        for (let i = 0; i < files.length; i++) {
          files[i] = store.get(files[i]) || files[i];
          if (files[i].indexOf('.') < 0) {
            files.splice(i, 1);
            i--;
          }
        }
        console.log(2);
        event.sender.send("showPDF", files);
      })
    });
    ipcMain.on("openPDF", (event, filePath) => {
      shell.openPath(path.join("D:/Program Files (x86)/", filePath));
      this.pdfListWindow.hide();
    });
    ipcMain.on("pdfCover", (event, data) => {
      const {
        filename,
        image
      } = JSON.parse(data);
      checkDir(documentDir + 'pdf/cover/');
      fs.writeFile(documentDir + 'pdf/cover/' + filename + ".jpg", Buffer(image, 'base64'), (e) => {
        store.set(filename + ".pdf", filename + ".jpg");
      })
    })
  }
});

ipcMain.on("setLocalSettings", (event, settings) => {
  settings = JSON.parse(settings);
  for (let item in settings) {
    store.set("settings." + item, settings[item]);
  }
})

ipcMain.on("getLocalSettings", (event) => {
  let settings = store.get("settings");
  console.log(settings);
  event.sender.send("getLocalSettings", JSON.stringify(settings));
})

function checkDir(path) {
  //若没有文件夹则创建
  fs.stat(path, (err, data) => {
    try {
      data.isDirectory();
    } catch (e) {
      fs.mkdir(path, () => {});
    }
  })
}


// 隐藏主窗口，并创建托盘，绑定关闭事件
function setTray (app, mainWindow) {
  // 用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区
  // 通常被添加到一个 context menu 上.
  // 系统托盘右键菜单
  const trayMenuTemplate = [{
      // 系统托盘图标目录
      label: '退出',
      click: () => {
          app.quit();
      }
  }];
  // 设置系统托盘图标
  const iconPath = path.join(__dirname, './icon.ico');

  const appTray = new Tray(iconPath);

  // 图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  // 展示主窗口，隐藏主窗口 mainWindow.hide()
  // mainWindow.show();

  // 设置托盘悬浮提示
  appTray.setToolTip('never forget');

  // 设置托盘菜单
  appTray.setContextMenu(contextMenu);

  // 单击托盘小图标显示应用
  appTray.on('click', () => {
      // 显示主程序
      mainWindow.show();
      // 关闭托盘显示
      // appTray.destroy();
  });
  return appTray;
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.