webpackHotUpdate("main",{

/***/ "./src/lappdelegate.ts":
/*!*****************************!*\
  !*** ./src/lappdelegate.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var live2dcubismframework_1 = __webpack_require__(/*! @framework/live2dcubismframework */ "../../../Framework/src/live2dcubismframework.ts");
var Csm_CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var lappview_1 = __webpack_require__(/*! ./lappview */ "./src/lappview.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/lapppal.ts");
var lapptexturemanager_1 = __webpack_require__(/*! ./lapptexturemanager */ "./src/lapptexturemanager.ts");
var lapplive2dmanager_1 = __webpack_require__(/*! ./lapplive2dmanager */ "./src/lapplive2dmanager.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/lappdefine.ts"));
exports.canvas = null;
exports.s_instance = null;
exports.gl = null;
exports.frameBuffer = null;
exports.win = window;
var LAppDelegate = (function () {
    function LAppDelegate() {
        this._captured = false;
        this._mouseX = 0.0;
        this._mouseY = 0.0;
        this._isEnd = false;
        this._cubismOption = new live2dcubismframework_1.Option();
        this._view = new lappview_1.LAppView();
        this._textureManager = new lapptexturemanager_1.LAppTextureManager();
    }
    LAppDelegate.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppDelegate();
        }
        return exports.s_instance;
    };
    LAppDelegate.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance.release();
        }
        exports.s_instance = null;
    };
    LAppDelegate.prototype.initialize = function () {
        exports.canvas = document.getElementById("canvas");
        exports.gl = exports.canvas.getContext("webgl") || exports.canvas.getContext("experimental-webgl");
        if (!exports.gl) {
            alert("Cannot initialize WebGL. This browser does not support.");
            exports.gl = null;
            document.body.innerHTML =
                "This browser does not support the <code>&lt;canvas&gt;</code> element.";
            return false;
        }
        if (!exports.frameBuffer) {
            exports.frameBuffer = exports.gl.getParameter(exports.gl.FRAMEBUFFER_BINDING);
        }
        exports.gl.enable(exports.gl.BLEND);
        exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
        var supportTouch = "ontouchend" in exports.canvas;
        if (supportTouch) {
            exports.canvas.ontouchstart = onTouchBegan;
            exports.canvas.ontouchmove = onTouchMoved;
            exports.canvas.ontouchend = onTouchEnded;
            exports.canvas.ontouchcancel = onTouchCancel;
        }
        else {
            exports.canvas.onmousedown = onClickBegan;
            window.onmousemove = onMouseMoved;
            exports.canvas.onmouseup = onClickEnded;
        }
        exports.win.initDefine('.\\Samples\\Resources\\');
        this._view.initialize();
        this.initializeCubism();
        return true;
    };
    LAppDelegate.prototype.release = function () {
        this._textureManager.release();
        this._textureManager = null;
        this._view.release();
        this._view = null;
        lapplive2dmanager_1.LAppLive2DManager.releaseInstance();
        Csm_CubismFramework.dispose();
    };
    LAppDelegate.prototype.run = function () {
        var _this = this;
        var loop = function () {
            if (exports.s_instance == null) {
                return;
            }
            lapppal_1.LAppPal.updateTime();
            exports.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            exports.gl.enable(exports.gl.DEPTH_TEST);
            exports.gl.depthFunc(exports.gl.LEQUAL);
            exports.gl.clear(exports.gl.COLOR_BUFFER_BIT | exports.gl.DEPTH_BUFFER_BIT);
            exports.gl.clearDepth(1.0);
            exports.gl.enable(exports.gl.BLEND);
            exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
            _this._view.render();
            requestAnimationFrame(loop);
        };
        loop();
    };
    LAppDelegate.prototype.createShader = function () {
        var vertexShaderId = exports.gl.createShader(exports.gl.VERTEX_SHADER);
        if (vertexShaderId == null) {
            lapppal_1.LAppPal.printMessage("failed to create vertexShader");
            return null;
        }
        var vertexShader = "precision mediump float;" +
            "attribute vec3 position;" +
            "attribute vec2 uv;" +
            "varying vec2 vuv;" +
            "void main(void)" +
            "{" +
            "   gl_Position = vec4(position, 1.0);" +
            "   vuv = uv;" +
            "}";
        exports.gl.shaderSource(vertexShaderId, vertexShader);
        exports.gl.compileShader(vertexShaderId);
        var fragmentShaderId = exports.gl.createShader(exports.gl.FRAGMENT_SHADER);
        if (fragmentShaderId == null) {
            lapppal_1.LAppPal.printMessage("failed to create fragmentShader");
            return null;
        }
        var fragmentShader = "precision mediump float;" +
            "varying vec2 vuv;" +
            "uniform sampler2D texture;" +
            "void main(void)" +
            "{" +
            "   gl_FragColor = texture2D(texture, vuv);" +
            "}";
        exports.gl.shaderSource(fragmentShaderId, fragmentShader);
        exports.gl.compileShader(fragmentShaderId);
        var programId = exports.gl.createProgram();
        exports.gl.attachShader(programId, vertexShaderId);
        exports.gl.attachShader(programId, fragmentShaderId);
        exports.gl.deleteShader(vertexShaderId);
        exports.gl.deleteShader(fragmentShaderId);
        exports.gl.linkProgram(programId);
        exports.gl.useProgram(programId);
        return programId;
    };
    LAppDelegate.prototype.getView = function () {
        return this._view;
    };
    LAppDelegate.prototype.getTextureManager = function () {
        return this._textureManager;
    };
    LAppDelegate.prototype.initializeCubism = function () {
        this._cubismOption.logFunction = lapppal_1.LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        Csm_CubismFramework.startUp(this._cubismOption);
        Csm_CubismFramework.initialize();
        lapplive2dmanager_1.LAppLive2DManager.getInstance();
        lapppal_1.LAppPal.updateTime();
        this._view.initializeSprite();
    };
    return LAppDelegate;
}());
exports.LAppDelegate = LAppDelegate;
function onClickBegan(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage("view notfound");
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    var posX = e.pageX;
    var posY = e.pageY;
    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}
function onMouseMoved(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage("view notfound");
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
function onClickEnded(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage("view notfound");
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
function onTouchBegan(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage("view notfound");
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    var posX = e.changedTouches[0].pageX;
    var posY = e.changedTouches[0].pageY;
    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}
function onTouchMoved(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage("view notfound");
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
function onTouchEnded(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage("view notfound");
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
function onTouchCancel(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage("view notfound");
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}


/***/ }),

/***/ "./src/lapplive2dmanager.ts":
/*!**********************************!*\
  !*** ./src/lapplive2dmanager.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "../../../Framework/src/math/cubismmatrix44.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../Framework/src/type/csmvector.ts");
var Csm_csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var Csm_CubismMatrix44 = cubismmatrix44_1.Live2DCubismFramework.CubismMatrix44;
var lappmodel_1 = __webpack_require__(/*! ./lappmodel */ "./src/lappmodel.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/lapppal.ts");
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/lappdelegate.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/lappdefine.ts"));
exports.s_instance = null;
var LAppLive2DManager = (function () {
    function LAppLive2DManager() {
        this._finishedMotion = function (self) {
            lapppal_1.LAppPal.printMessage('Motion Finished:');
            console.log(self);
        };
        this._viewMatrix = new Csm_CubismMatrix44();
        this._models = new Csm_csmVector();
        this._sceneIndex = 0;
        this.changeScene(this._sceneIndex);
    }
    LAppLive2DManager.getInstance = function () {
        if (exports.s_instance == null) {
            exports.s_instance = new LAppLive2DManager();
        }
        return exports.s_instance;
    };
    LAppLive2DManager.releaseInstance = function () {
        if (exports.s_instance != null) {
            exports.s_instance = void 0;
        }
        exports.s_instance = null;
    };
    LAppLive2DManager.prototype.getModel = function (no) {
        if (no < this._models.getSize()) {
            return this._models.at(no);
        }
        return null;
    };
    LAppLive2DManager.prototype.releaseAllModel = function () {
        for (var i = 0; i < this._models.getSize(); i++) {
            this._models.at(i).release();
            this._models.set(i, null);
        }
        this._models.clear();
    };
    LAppLive2DManager.prototype.onDrag = function (x, y) {
        for (var i = 0; i < this._models.getSize(); i++) {
            var model = this.getModel(i);
            if (model) {
                model.setDragging(x, y);
            }
        }
    };
    LAppLive2DManager.prototype.onTap = function (x, y) {
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage("[APP]tap point: {x: " + x.toFixed(2) + " y: " + y.toFixed(2) + "}");
        }
        for (var i = 0; i < this._models.getSize(); i++) {
            if (this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    lapppal_1.LAppPal.printMessage("[APP]hit area: [" + LAppDefine.HitAreaNameHead + "]");
                }
                this._models.at(i).setRandomExpression();
            }
            else if (this._models.at(i).hitTest(LAppDefine.HitAreaNameBody, x, y)) {
                if (LAppDefine.DebugLogEnable) {
                    lapppal_1.LAppPal.printMessage("[APP]hit area: [" + LAppDefine.HitAreaNameBody + "]");
                }
                this._models
                    .at(i)
                    .startRandomMotion(LAppDefine.MotionGroupTapBody, LAppDefine.PriorityNormal, this._finishedMotion);
            }
        }
    };
    LAppLive2DManager.prototype.onUpdate = function () {
        var projection = new Csm_CubismMatrix44();
        var width = lappdelegate_1.canvas.width, height = lappdelegate_1.canvas.height;
        projection.scale(1.0, width / height);
        if (this._viewMatrix != null) {
            projection.multiplyByMatrix(this._viewMatrix);
        }
        var saveProjection = projection.clone();
        var modelCount = this._models.getSize();
        for (var i = 0; i < modelCount; ++i) {
            var model = this.getModel(i);
            projection = saveProjection.clone();
            model.update();
            model.draw(projection);
        }
    };
    LAppLive2DManager.prototype.nextScene = function () {
        var no = (this._sceneIndex + 1) % LAppDefine.ModelDirSize;
        this.changeScene(no);
    };
    LAppLive2DManager.prototype.changeScene = function (index) {
        this._sceneIndex = index;
        if (LAppDefine.DebugLogEnable) {
            lapppal_1.LAppPal.printMessage("[APP]model index: " + this._sceneIndex);
        }
        var model = LAppDefine.ModelDir[index];
        var modelPath = LAppDefine.ResourcesPath + model + '/';
        var modelJsonName = LAppDefine.ModelDir[index];
        modelJsonName += '.model3.json';
        this.releaseAllModel();
        this._models.pushBack(new lappmodel_1.LAppModel());
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    };
    return LAppLive2DManager;
}());
exports.LAppLive2DManager = LAppLive2DManager;


/***/ }),

/***/ "./src/lappmodel.ts":
/*!**************************!*\
  !*** ./src/lappmodel.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var live2dcubismframework_1 = __webpack_require__(/*! @framework/live2dcubismframework */ "../../../Framework/src/live2dcubismframework.ts");
var cubismusermodel_1 = __webpack_require__(/*! @framework/model/cubismusermodel */ "../../../Framework/src/model/cubismusermodel.ts");
var cubismmodelsettingjson_1 = __webpack_require__(/*! @framework/cubismmodelsettingjson */ "../../../Framework/src/cubismmodelsettingjson.ts");
var cubismdefaultparameterid_1 = __webpack_require__(/*! @framework/cubismdefaultparameterid */ "../../../Framework/src/cubismdefaultparameterid.ts");
var acubismmotion_1 = __webpack_require__(/*! @framework/motion/acubismmotion */ "../../../Framework/src/motion/acubismmotion.ts");
var cubismeyeblink_1 = __webpack_require__(/*! @framework/effect/cubismeyeblink */ "../../../Framework/src/effect/cubismeyeblink.ts");
var cubismbreath_1 = __webpack_require__(/*! @framework/effect/cubismbreath */ "../../../Framework/src/effect/cubismbreath.ts");
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../Framework/src/type/csmvector.ts");
var csmmap_1 = __webpack_require__(/*! @framework/type/csmmap */ "../../../Framework/src/type/csmmap.ts");
var cubismmotionqueuemanager_1 = __webpack_require__(/*! @framework/motion/cubismmotionqueuemanager */ "../../../Framework/src/motion/cubismmotionqueuemanager.ts");
var cubismdebug_1 = __webpack_require__(/*! @framework/utils/cubismdebug */ "../../../Framework/src/utils/cubismdebug.ts");
var InvalidMotionQueueEntryHandleValue = cubismmotionqueuemanager_1.Live2DCubismFramework.InvalidMotionQueueEntryHandleValue;
var csmMap = csmmap_1.Live2DCubismFramework.csmMap;
var csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var CubismBreath = cubismbreath_1.Live2DCubismFramework.CubismBreath;
var BreathParameterData = cubismbreath_1.Live2DCubismFramework.BreathParameterData;
var CubismEyeBlink = cubismeyeblink_1.Live2DCubismFramework.CubismEyeBlink;
var ACubismMotion = acubismmotion_1.Live2DCubismFramework.ACubismMotion;
var CubismFramework = live2dcubismframework_1.Live2DCubismFramework.CubismFramework;
var CubismUserModel = cubismusermodel_1.Live2DCubismFramework.CubismUserModel;
var CubismModelSettingJson = cubismmodelsettingjson_1.Live2DCubismFramework.CubismModelSettingJson;
var CubismDefaultParameterId = cubismdefaultparameterid_1.Live2DCubismFramework;
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/lapppal.ts");
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/lappdelegate.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/lappdefine.ts"));
__webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");
var LoadStep;
(function (LoadStep) {
    LoadStep[LoadStep["LoadAssets"] = 0] = "LoadAssets";
    LoadStep[LoadStep["LoadModel"] = 1] = "LoadModel";
    LoadStep[LoadStep["WaitLoadModel"] = 2] = "WaitLoadModel";
    LoadStep[LoadStep["LoadExpression"] = 3] = "LoadExpression";
    LoadStep[LoadStep["WaitLoadExpression"] = 4] = "WaitLoadExpression";
    LoadStep[LoadStep["LoadPhysics"] = 5] = "LoadPhysics";
    LoadStep[LoadStep["WaitLoadPhysics"] = 6] = "WaitLoadPhysics";
    LoadStep[LoadStep["LoadPose"] = 7] = "LoadPose";
    LoadStep[LoadStep["WaitLoadPose"] = 8] = "WaitLoadPose";
    LoadStep[LoadStep["SetupEyeBlink"] = 9] = "SetupEyeBlink";
    LoadStep[LoadStep["SetupBreath"] = 10] = "SetupBreath";
    LoadStep[LoadStep["LoadUserData"] = 11] = "LoadUserData";
    LoadStep[LoadStep["WaitLoadUserData"] = 12] = "WaitLoadUserData";
    LoadStep[LoadStep["SetupEyeBlinkIds"] = 13] = "SetupEyeBlinkIds";
    LoadStep[LoadStep["SetupLipSyncIds"] = 14] = "SetupLipSyncIds";
    LoadStep[LoadStep["SetupLayout"] = 15] = "SetupLayout";
    LoadStep[LoadStep["LoadMotion"] = 16] = "LoadMotion";
    LoadStep[LoadStep["WaitLoadMotion"] = 17] = "WaitLoadMotion";
    LoadStep[LoadStep["CompleteInitialize"] = 18] = "CompleteInitialize";
    LoadStep[LoadStep["CompleteSetupModel"] = 19] = "CompleteSetupModel";
    LoadStep[LoadStep["LoadTexture"] = 20] = "LoadTexture";
    LoadStep[LoadStep["WaitLoadTexture"] = 21] = "WaitLoadTexture";
    LoadStep[LoadStep["CompleteSetup"] = 22] = "CompleteSetup";
})(LoadStep || (LoadStep = {}));
var LAppModel = (function (_super) {
    __extends(LAppModel, _super);
    function LAppModel() {
        var _this = _super.call(this) || this;
        _this._modelSetting = null;
        _this._modelHomeDir = null;
        _this._userTimeSeconds = 0.0;
        _this._eyeBlinkIds = new csmVector();
        _this._lipSyncIds = new csmVector();
        _this._motions = new csmMap();
        _this._expressions = new csmMap();
        _this._hitArea = new csmVector();
        _this._userArea = new csmVector();
        _this._idParamAngleX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleX);
        _this._idParamAngleY = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleY);
        _this._idParamAngleZ = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleZ);
        _this._idParamEyeBallX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamEyeBallX);
        _this._idParamEyeBallY = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamEyeBallY);
        _this._idParamBodyAngleX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleX);
        _this._state = LoadStep.LoadAssets;
        _this._expressionCount = 0;
        _this._textureCount = 0;
        _this._motionCount = 0;
        _this._allMotionCount = 0;
        return _this;
    }
    LAppModel.prototype.loadAssets = function (dir, fileName) {
        var _this = this;
        this._modelHomeDir = dir;
        fetch(this._modelHomeDir + "/" + fileName)
            .then(function (response) { return response.arrayBuffer(); })
            .then(function (arrayBuffer) {
            var setting = new CubismModelSettingJson(arrayBuffer, arrayBuffer.byteLength);
            _this._state = LoadStep.LoadModel;
            _this.setupModel(setting);
        });
    };
    LAppModel.prototype.setupModel = function (setting) {
        var _this = this;
        this._updating = true;
        this._initialized = false;
        this._modelSetting = setting;
        if (this._modelSetting.getModelFileName() != '') {
            var modelFileName = this._modelSetting.getModelFileName();
            fetch(this._modelHomeDir + "/" + modelFileName)
                .then(function (response) { return response.arrayBuffer(); })
                .then(function (arrayBuffer) {
                _this.loadModel(arrayBuffer);
                _this._state = LoadStep.LoadExpression;
                loadCubismExpression();
            });
            this._state = LoadStep.WaitLoadModel;
        }
        else {
            lapppal_1.LAppPal.printMessage('Model data does not exist.');
        }
        var loadCubismExpression = function () {
            if (_this._modelSetting.getExpressionCount() > 0) {
                var count_1 = _this._modelSetting.getExpressionCount();
                var _loop_1 = function (i) {
                    var expressionName = _this._modelSetting.getExpressionName(i);
                    var expressionFileName = _this._modelSetting.getExpressionFileName(i);
                    fetch(_this._modelHomeDir + "/" + expressionFileName)
                        .then(function (response) { return response.arrayBuffer(); })
                        .then(function (arrayBuffer) {
                        var motion = _this.loadExpression(arrayBuffer, arrayBuffer.byteLength, expressionName);
                        if (_this._expressions.getValue(expressionName) != null) {
                            ACubismMotion.delete(_this._expressions.getValue(expressionName));
                            _this._expressions.setValue(expressionName, null);
                        }
                        _this._expressions.setValue(expressionName, motion);
                        _this._expressionCount++;
                        if (_this._expressionCount >= count_1) {
                            _this._state = LoadStep.LoadPhysics;
                            loadCubismPhysics();
                        }
                    });
                };
                for (var i = 0; i < count_1; i++) {
                    _loop_1(i);
                }
                _this._state = LoadStep.WaitLoadExpression;
            }
            else {
                _this._state = LoadStep.LoadPhysics;
                loadCubismPhysics();
            }
        };
        var loadCubismPhysics = function () {
            if (_this._modelSetting.getPhysicsFileName() != '') {
                var physicsFileName = _this._modelSetting.getPhysicsFileName();
                fetch(_this._modelHomeDir + "/" + physicsFileName)
                    .then(function (response) { return response.arrayBuffer(); })
                    .then(function (arrayBuffer) {
                    _this.loadPhysics(arrayBuffer, arrayBuffer.byteLength);
                    _this._state = LoadStep.LoadPose;
                    loadCubismPose();
                });
                _this._state = LoadStep.WaitLoadPhysics;
            }
            else {
                _this._state = LoadStep.LoadPose;
                loadCubismPose();
            }
        };
        var loadCubismPose = function () {
            if (_this._modelSetting.getPoseFileName() != '') {
                var poseFileName = _this._modelSetting.getPoseFileName();
                fetch(_this._modelHomeDir + "/" + poseFileName)
                    .then(function (response) { return response.arrayBuffer(); })
                    .then(function (arrayBuffer) {
                    _this.loadPose(arrayBuffer, arrayBuffer.byteLength);
                    _this._state = LoadStep.SetupEyeBlink;
                    setupEyeBlink();
                });
                _this._state = LoadStep.WaitLoadPose;
            }
            else {
                _this._state = LoadStep.SetupEyeBlink;
                setupEyeBlink();
            }
        };
        var setupEyeBlink = function () {
            if (_this._modelSetting.getEyeBlinkParameterCount() > 0) {
                _this._eyeBlink = CubismEyeBlink.create(_this._modelSetting);
                _this._state = LoadStep.SetupBreath;
            }
            setupBreath();
        };
        var setupBreath = function () {
            _this._breath = CubismBreath.create();
            var breathParameters = new csmVector();
            breathParameters.pushBack(new BreathParameterData(_this._idParamAngleX, 0.0, 15.0, 6.5345, 0.5));
            breathParameters.pushBack(new BreathParameterData(_this._idParamAngleY, 0.0, 8.0, 3.5345, 0.5));
            breathParameters.pushBack(new BreathParameterData(_this._idParamAngleZ, 0.0, 10.0, 5.5345, 0.5));
            breathParameters.pushBack(new BreathParameterData(_this._idParamBodyAngleX, 0.0, 4.0, 15.5345, 0.5));
            breathParameters.pushBack(new BreathParameterData(CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath), 0.0, 0.5, 3.2345, 0.5));
            _this._breath.setParameters(breathParameters);
            _this._state = LoadStep.LoadUserData;
            loadUserData();
        };
        var loadUserData = function () {
            if (_this._modelSetting.getUserDataFile() != '') {
                var userDataFile = _this._modelSetting.getUserDataFile();
                fetch(_this._modelHomeDir + "/" + userDataFile)
                    .then(function (response) { return response.arrayBuffer(); })
                    .then(function (arrayBuffer) {
                    _this.loadUserData(arrayBuffer, arrayBuffer.byteLength);
                    _this._state = LoadStep.SetupEyeBlinkIds;
                    setupEyeBlinkIds();
                });
                _this._state = LoadStep.WaitLoadUserData;
            }
            else {
                _this._state = LoadStep.SetupEyeBlinkIds;
                setupEyeBlinkIds();
            }
        };
        var setupEyeBlinkIds = function () {
            var eyeBlinkIdCount = _this._modelSetting.getEyeBlinkParameterCount();
            for (var i = 0; i < eyeBlinkIdCount; ++i) {
                _this._eyeBlinkIds.pushBack(_this._modelSetting.getEyeBlinkParameterId(i));
            }
            _this._state = LoadStep.SetupLipSyncIds;
            setupLipSyncIds();
        };
        var setupLipSyncIds = function () {
            var lipSyncIdCount = _this._modelSetting.getLipSyncParameterCount();
            for (var i = 0; i < lipSyncIdCount; ++i) {
                _this._lipSyncIds.pushBack(_this._modelSetting.getLipSyncParameterId(i));
            }
            _this._state = LoadStep.SetupLayout;
            setupLayout();
        };
        var setupLayout = function () {
            var layout = new csmMap();
            _this._modelSetting.getLayoutMap(layout);
            _this._modelMatrix.setupFromLayout(layout);
            _this._state = LoadStep.LoadMotion;
            loadCubismMotion();
        };
        var loadCubismMotion = function () {
            _this._state = LoadStep.WaitLoadMotion;
            _this._model.saveParameters();
            _this._allMotionCount = 0;
            _this._motionCount = 0;
            var group = [];
            var motionGroupCount = _this._modelSetting.getMotionGroupCount();
            for (var i = 0; i < motionGroupCount; i++) {
                group[i] = _this._modelSetting.getMotionGroupName(i);
                _this._allMotionCount += _this._modelSetting.getMotionCount(group[i]);
            }
            for (var i = 0; i < motionGroupCount; i++) {
                _this.preLoadMotionGroup(group[i]);
            }
            if (motionGroupCount == 0) {
                _this._state = LoadStep.LoadTexture;
                _this._motionManager.stopAllMotions();
                _this._updating = false;
                _this._initialized = true;
                _this.createRenderer();
                _this.setupTextures();
                _this.getRenderer().startUp(lappdelegate_1.gl);
            }
        };
    };
    LAppModel.prototype.setupTextures = function () {
        var _this = this;
        var usePremultiply = true;
        if (this._state == LoadStep.LoadTexture) {
            var textureCount_1 = this._modelSetting.getTextureCount();
            var _loop_2 = function (modelTextureNumber) {
                if (this_1._modelSetting.getTextureFileName(modelTextureNumber) == '') {
                    console.log('getTextureFileName null');
                    return "continue";
                }
                var texturePath = this_1._modelSetting.getTextureFileName(modelTextureNumber);
                texturePath = this_1._modelHomeDir + texturePath;
                var onLoad = function (textureInfo) {
                    _this.getRenderer().bindTexture(modelTextureNumber, textureInfo.id);
                    _this._textureCount++;
                    if (_this._textureCount >= textureCount_1) {
                        _this._state = LoadStep.CompleteSetup;
                    }
                };
                lappdelegate_1.LAppDelegate.getInstance()
                    .getTextureManager()
                    .createTextureFromPngFile(texturePath, usePremultiply, onLoad);
                this_1.getRenderer().setIsPremultipliedAlpha(usePremultiply);
            };
            var this_1 = this;
            for (var modelTextureNumber = 0; modelTextureNumber < textureCount_1; modelTextureNumber++) {
                _loop_2(modelTextureNumber);
            }
            this._state = LoadStep.WaitLoadTexture;
        }
    };
    LAppModel.prototype.reloadRenderer = function () {
        this.deleteRenderer();
        this.createRenderer();
        this.setupTextures();
    };
    LAppModel.prototype.update = function () {
        if (this._state != LoadStep.CompleteSetup)
            return;
        var deltaTimeSeconds = lapppal_1.LAppPal.getDeltaTime();
        this._userTimeSeconds += deltaTimeSeconds;
        this._dragManager.update(deltaTimeSeconds);
        this._dragX = this._dragManager.getX();
        this._dragY = this._dragManager.getY();
        var motionUpdated = false;
        this._model.loadParameters();
        if (this._motionManager.isFinished()) {
            this.startRandomMotion(LAppDefine.MotionGroupIdle, LAppDefine.PriorityIdle);
        }
        else {
            motionUpdated = this._motionManager.updateMotion(this._model, deltaTimeSeconds);
        }
        this._model.saveParameters();
        if (!motionUpdated) {
            if (this._eyeBlink != null) {
                this._eyeBlink.updateParameters(this._model, deltaTimeSeconds);
            }
        }
        if (this._expressionManager != null) {
            this._expressionManager.updateMotion(this._model, deltaTimeSeconds);
        }
        this._model.addParameterValueById(this._idParamAngleX, this._dragX * 30);
        this._model.addParameterValueById(this._idParamAngleY, this._dragY * 30);
        this._model.addParameterValueById(this._idParamAngleZ, this._dragX * this._dragY * -30);
        this._model.addParameterValueById(this._idParamBodyAngleX, this._dragX * 10);
        this._model.addParameterValueById(this._idParamEyeBallX, this._dragX);
        this._model.addParameterValueById(this._idParamEyeBallY, this._dragY);
        if (this._breath != null) {
            this._breath.updateParameters(this._model, deltaTimeSeconds);
        }
        if (this._physics != null) {
            this._physics.evaluate(this._model, deltaTimeSeconds);
        }
        if (this._lipsync) {
            var value = 0;
            for (var i = 0; i < this._lipSyncIds.getSize(); ++i) {
                this._model.addParameterValueById(this._lipSyncIds.at(i), value, 0.8);
            }
        }
        if (this._pose != null) {
            this._pose.updateParameters(this._model, deltaTimeSeconds);
        }
        this._model.update();
    };
    LAppModel.prototype.startMotion = function (group, no, priority, onFinishedMotionHandler) {
        var _this = this;
        if (priority == LAppDefine.PriorityForce) {
            this._motionManager.setReservePriority(priority);
        }
        else if (!this._motionManager.reserveMotion(priority)) {
            if (this._debugMode) {
                lapppal_1.LAppPal.printMessage("[APP]can't start motion.");
            }
            return InvalidMotionQueueEntryHandleValue;
        }
        var motionFileName = this._modelSetting.getMotionFileName(group, no);
        var name = group + "_" + no;
        var motion = this._motions.getValue(name);
        var autoDelete = false;
        if (motion == null) {
            fetch(this._modelHomeDir + "/" + motionFileName)
                .then(function (response) { return response.arrayBuffer(); })
                .then(function (arrayBuffer) {
                motion = _this.loadMotion(arrayBuffer, arrayBuffer.byteLength, null, onFinishedMotionHandler);
                var fadeTime = _this._modelSetting.getMotionFadeInTimeValue(group, no);
                if (fadeTime >= 0.0) {
                    motion.setFadeInTime(fadeTime);
                }
                fadeTime = _this._modelSetting.getMotionFadeOutTimeValue(group, no);
                if (fadeTime >= 0.0) {
                    motion.setFadeOutTime(fadeTime);
                }
                motion.setEffectIds(_this._eyeBlinkIds, _this._lipSyncIds);
                autoDelete = true;
            });
        }
        else {
            motion.setFinishedMotionHandler(onFinishedMotionHandler);
        }
        if (this._debugMode) {
            lapppal_1.LAppPal.printMessage("[APP]start motion: [" + group + "_" + no);
        }
        return this._motionManager.startMotionPriority(motion, autoDelete, priority);
    };
    LAppModel.prototype.startRandomMotion = function (group, priority, onFinishedMotionHandler) {
        if (this._modelSetting.getMotionCount(group) == 0) {
            return InvalidMotionQueueEntryHandleValue;
        }
        var no = Math.floor(Math.random() * this._modelSetting.getMotionCount(group));
        return this.startMotion(group, no, priority, onFinishedMotionHandler);
    };
    LAppModel.prototype.setExpression = function (expressionId) {
        var motion = this._expressions.getValue(expressionId);
        if (this._debugMode) {
            lapppal_1.LAppPal.printMessage("[APP]expression: [" + expressionId + "]");
        }
        if (motion != null) {
            this._expressionManager.startMotionPriority(motion, false, LAppDefine.PriorityForce);
        }
        else {
            if (this._debugMode) {
                lapppal_1.LAppPal.printMessage("[APP]expression[" + expressionId + "] is null");
            }
        }
    };
    LAppModel.prototype.setRandomExpression = function () {
        if (this._expressions.getSize() == 0) {
            return;
        }
        var no = Math.floor(Math.random() * this._expressions.getSize());
        for (var i = 0; i < this._expressions.getSize(); i++) {
            if (i == no) {
                var name_1 = this._expressions._keyValues[i].first;
                this.setExpression(name_1);
                return;
            }
        }
    };
    LAppModel.prototype.motionEventFired = function (eventValue) {
        cubismdebug_1.CubismLogInfo('{0} is fired on LAppModel!!', eventValue.s);
    };
    LAppModel.prototype.hitTest = function (hitArenaName, x, y) {
        if (this._opacity < 1) {
            return false;
        }
        var count = this._modelSetting.getHitAreasCount();
        for (var i = 0; i < count; i++) {
            if (this._modelSetting.getHitAreaName(i) == hitArenaName) {
                var drawId = this._modelSetting.getHitAreaId(i);
                return this.isHit(drawId, x, y);
            }
        }
        return false;
    };
    LAppModel.prototype.preLoadMotionGroup = function (group) {
        var _this = this;
        var _loop_3 = function (i) {
            var motionFileName = this_2._modelSetting.getMotionFileName(group, i);
            var name_2 = group + "_" + i;
            if (this_2._debugMode) {
                lapppal_1.LAppPal.printMessage("[APP]load motion: " + motionFileName + " => [" + name_2 + "]");
            }
            fetch(this_2._modelHomeDir + "/" + motionFileName)
                .then(function (response) { return response.arrayBuffer(); })
                .then(function (arrayBuffer) {
                var tmpMotion = _this.loadMotion(arrayBuffer, arrayBuffer.byteLength, name_2);
                var fadeTime = _this._modelSetting.getMotionFadeInTimeValue(group, i);
                if (fadeTime >= 0.0) {
                    tmpMotion.setFadeInTime(fadeTime);
                }
                fadeTime = _this._modelSetting.getMotionFadeOutTimeValue(group, i);
                if (fadeTime >= 0.0) {
                    tmpMotion.setFadeOutTime(fadeTime);
                }
                tmpMotion.setEffectIds(_this._eyeBlinkIds, _this._lipSyncIds);
                if (_this._motions.getValue(name_2) != null) {
                    ACubismMotion.delete(_this._motions.getValue(name_2));
                }
                _this._motions.setValue(name_2, tmpMotion);
                _this._motionCount++;
                if (_this._motionCount >= _this._allMotionCount) {
                    _this._state = LoadStep.LoadTexture;
                    _this._motionManager.stopAllMotions();
                    _this._updating = false;
                    _this._initialized = true;
                    _this.createRenderer();
                    _this.setupTextures();
                    _this.getRenderer().startUp(lappdelegate_1.gl);
                }
            });
        };
        var this_2 = this;
        for (var i = 0; i < this._modelSetting.getMotionCount(group); i++) {
            _loop_3(i);
        }
    };
    LAppModel.prototype.releaseMotions = function () {
        this._motions.clear();
    };
    LAppModel.prototype.releaseExpressions = function () {
        this._expressions.clear();
    };
    LAppModel.prototype.doDraw = function () {
        if (this._model == null)
            return;
        var viewport = [0, 0, lappdelegate_1.canvas.width, lappdelegate_1.canvas.height];
        this.getRenderer().setRenderState(lappdelegate_1.frameBuffer, viewport);
        this.getRenderer().drawModel();
    };
    LAppModel.prototype.draw = function (matrix) {
        if (this._model == null) {
            return;
        }
        if (this._state == LoadStep.CompleteSetup) {
            matrix.multiplyByMatrix(this._modelMatrix);
            this.getRenderer().setMvpMatrix(matrix);
            this.doDraw();
        }
    };
    return LAppModel;
}(CubismUserModel));
exports.LAppModel = LAppModel;


/***/ }),

/***/ "./src/lappsprite.ts":
/*!***************************!*\
  !*** ./src/lappsprite.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/lappdelegate.ts");
var LAppSprite = (function () {
    function LAppSprite(x, y, width, height, textureId) {
        this._rect = new Rect();
        this._rect.left = x - width * 0.5;
        this._rect.right = x + width * 0.5;
        this._rect.up = y + height * 0.5;
        this._rect.down = y - height * 0.5;
        this._texture = textureId;
        this._vertexBuffer = null;
        this._uvBuffer = null;
        this._indexBuffer = null;
        this._positionLocation = null;
        this._uvLocation = null;
        this._textureLocation = null;
        this._positionArray = null;
        this._uvArray = null;
        this._indexArray = null;
        this._firstDraw = true;
    }
    LAppSprite.prototype.release = function () {
        this._rect = null;
        lappdelegate_1.gl.deleteTexture(this._texture);
        this._texture = null;
        lappdelegate_1.gl.deleteBuffer(this._uvBuffer);
        this._uvBuffer = null;
        lappdelegate_1.gl.deleteBuffer(this._vertexBuffer);
        this._vertexBuffer = null;
        lappdelegate_1.gl.deleteBuffer(this._indexBuffer);
        this._indexBuffer = null;
    };
    LAppSprite.prototype.getTexture = function () {
        return this._texture;
    };
    LAppSprite.prototype.render = function (programId) {
        if (this._texture == null) {
            return;
        }
        if (this._firstDraw) {
            this._positionLocation = lappdelegate_1.gl.getAttribLocation(programId, 'position');
            lappdelegate_1.gl.enableVertexAttribArray(this._positionLocation);
            this._uvLocation = lappdelegate_1.gl.getAttribLocation(programId, 'uv');
            lappdelegate_1.gl.enableVertexAttribArray(this._uvLocation);
            this._textureLocation = lappdelegate_1.gl.getUniformLocation(programId, 'texture');
            lappdelegate_1.gl.uniform1i(this._textureLocation, 0);
            {
                this._uvArray = new Float32Array([
                    1.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    1.0,
                    1.0,
                    1.0
                ]);
                this._uvBuffer = lappdelegate_1.gl.createBuffer();
            }
            {
                var maxWidth = lappdelegate_1.canvas.width;
                var maxHeight = lappdelegate_1.canvas.height;
                this._positionArray = new Float32Array([
                    (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5),
                    (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5),
                    (this._rect.up - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.left - maxWidth * 0.5) / (maxWidth * 0.5),
                    (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5),
                    (this._rect.right - maxWidth * 0.5) / (maxWidth * 0.5),
                    (this._rect.down - maxHeight * 0.5) / (maxHeight * 0.5)
                ]);
                this._vertexBuffer = lappdelegate_1.gl.createBuffer();
            }
            {
                this._indexArray = new Uint16Array([0, 1, 2, 3, 2, 0]);
                this._indexBuffer = lappdelegate_1.gl.createBuffer();
            }
            this._firstDraw = false;
        }
        lappdelegate_1.gl.bindBuffer(lappdelegate_1.gl.ARRAY_BUFFER, this._uvBuffer);
        lappdelegate_1.gl.bufferData(lappdelegate_1.gl.ARRAY_BUFFER, this._uvArray, lappdelegate_1.gl.STATIC_DRAW);
        lappdelegate_1.gl.vertexAttribPointer(this._uvLocation, 2, lappdelegate_1.gl.FLOAT, false, 0, 0);
        lappdelegate_1.gl.bindBuffer(lappdelegate_1.gl.ARRAY_BUFFER, this._vertexBuffer);
        lappdelegate_1.gl.bufferData(lappdelegate_1.gl.ARRAY_BUFFER, this._positionArray, lappdelegate_1.gl.STATIC_DRAW);
        lappdelegate_1.gl.vertexAttribPointer(this._positionLocation, 2, lappdelegate_1.gl.FLOAT, false, 0, 0);
        lappdelegate_1.gl.bindBuffer(lappdelegate_1.gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        lappdelegate_1.gl.bufferData(lappdelegate_1.gl.ELEMENT_ARRAY_BUFFER, this._indexArray, lappdelegate_1.gl.DYNAMIC_DRAW);
        lappdelegate_1.gl.bindTexture(lappdelegate_1.gl.TEXTURE_2D, this._texture);
        lappdelegate_1.gl.drawElements(lappdelegate_1.gl.TRIANGLES, this._indexArray.length, lappdelegate_1.gl.UNSIGNED_SHORT, 0);
    };
    LAppSprite.prototype.isHit = function (pointX, pointY) {
        var height = lappdelegate_1.canvas.height;
        var y = height - pointY;
        return (pointX >= this._rect.left &&
            pointX <= this._rect.right &&
            y <= this._rect.up &&
            y >= this._rect.down);
    };
    return LAppSprite;
}());
exports.LAppSprite = LAppSprite;
var Rect = (function () {
    function Rect() {
    }
    return Rect;
}());
exports.Rect = Rect;


/***/ }),

/***/ "./src/lapptexturemanager.ts":
/*!***********************************!*\
  !*** ./src/lapptexturemanager.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var csmvector_1 = __webpack_require__(/*! @framework/type/csmvector */ "../../../Framework/src/type/csmvector.ts");
var Csm_csmVector = csmvector_1.Live2DCubismFramework.csmVector;
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/lappdelegate.ts");
var LAppTextureManager = (function () {
    function LAppTextureManager() {
        this._textures = new Csm_csmVector();
    }
    LAppTextureManager.prototype.release = function () {
        for (var ite = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            lappdelegate_1.gl.deleteTexture(ite.ptr().id);
        }
        this._textures = null;
    };
    LAppTextureManager.prototype.createTextureFromPngFile = function (fileName, usePremultiply, callback) {
        var _this = this;
        var _loop_1 = function (ite) {
            if (ite.ptr().fileName == fileName &&
                ite.ptr().usePremultply == usePremultiply) {
                ite.ptr().img = new Image();
                ite.ptr().img.onload = function () { return callback(ite.ptr()); };
                ite.ptr().img.src = fileName;
                return { value: void 0 };
            }
        };
        for (var ite = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement()) {
            var state_1 = _loop_1(ite);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        var img = new Image();
        img.onload = function () {
            var tex = lappdelegate_1.gl.createTexture();
            lappdelegate_1.gl.bindTexture(lappdelegate_1.gl.TEXTURE_2D, tex);
            lappdelegate_1.gl.texParameteri(lappdelegate_1.gl.TEXTURE_2D, lappdelegate_1.gl.TEXTURE_MIN_FILTER, lappdelegate_1.gl.LINEAR_MIPMAP_LINEAR);
            lappdelegate_1.gl.texParameteri(lappdelegate_1.gl.TEXTURE_2D, lappdelegate_1.gl.TEXTURE_MAG_FILTER, lappdelegate_1.gl.LINEAR);
            if (usePremultiply) {
                lappdelegate_1.gl.pixelStorei(lappdelegate_1.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            }
            lappdelegate_1.gl.texImage2D(lappdelegate_1.gl.TEXTURE_2D, 0, lappdelegate_1.gl.RGBA, lappdelegate_1.gl.RGBA, lappdelegate_1.gl.UNSIGNED_BYTE, img);
            lappdelegate_1.gl.generateMipmap(lappdelegate_1.gl.TEXTURE_2D);
            lappdelegate_1.gl.bindTexture(lappdelegate_1.gl.TEXTURE_2D, null);
            var textureInfo = new TextureInfo();
            if (textureInfo != null) {
                textureInfo.fileName = fileName;
                textureInfo.width = img.width;
                textureInfo.height = img.height;
                textureInfo.id = tex;
                textureInfo.img = img;
                textureInfo.usePremultply = usePremultiply;
                _this._textures.pushBack(textureInfo);
            }
            callback(textureInfo);
        };
        img.src = fileName;
    };
    LAppTextureManager.prototype.releaseTextures = function () {
        for (var i = 0; i < this._textures.getSize(); i++) {
            this._textures.set(i, null);
        }
        this._textures.clear();
    };
    LAppTextureManager.prototype.releaseTextureByTexture = function (texture) {
        for (var i = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).id != texture) {
                continue;
            }
            this._textures.set(i, null);
            this._textures.remove(i);
            break;
        }
    };
    LAppTextureManager.prototype.releaseTextureByFilePath = function (fileName) {
        for (var i = 0; i < this._textures.getSize(); i++) {
            if (this._textures.at(i).fileName == fileName) {
                this._textures.set(i, null);
                this._textures.remove(i);
                break;
            }
        }
    };
    return LAppTextureManager;
}());
exports.LAppTextureManager = LAppTextureManager;
var TextureInfo = (function () {
    function TextureInfo() {
        this.id = null;
        this.width = 0;
        this.height = 0;
    }
    return TextureInfo;
}());
exports.TextureInfo = TextureInfo;


/***/ }),

/***/ "./src/lappview.ts":
/*!*************************!*\
  !*** ./src/lappview.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cubismmatrix44_1 = __webpack_require__(/*! @framework/math/cubismmatrix44 */ "../../../Framework/src/math/cubismmatrix44.ts");
var cubismviewmatrix_1 = __webpack_require__(/*! @framework/math/cubismviewmatrix */ "../../../Framework/src/math/cubismviewmatrix.ts");
var Csm_CubismViewMatrix = cubismviewmatrix_1.Live2DCubismFramework.CubismViewMatrix;
var Csm_CubismMatrix44 = cubismmatrix44_1.Live2DCubismFramework.CubismMatrix44;
var touchmanager_1 = __webpack_require__(/*! ./touchmanager */ "./src/touchmanager.ts");
var lapplive2dmanager_1 = __webpack_require__(/*! ./lapplive2dmanager */ "./src/lapplive2dmanager.ts");
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/lappdelegate.ts");
var lappsprite_1 = __webpack_require__(/*! ./lappsprite */ "./src/lappsprite.ts");
var lapppal_1 = __webpack_require__(/*! ./lapppal */ "./src/lapppal.ts");
var LAppDefine = __importStar(__webpack_require__(/*! ./lappdefine */ "./src/lappdefine.ts"));
var LAppView = (function () {
    function LAppView() {
        this._programId = null;
        this._back = null;
        this._gear = null;
        this._touchManager = new touchmanager_1.TouchManager();
        this._deviceToScreen = new Csm_CubismMatrix44();
        this._viewMatrix = new Csm_CubismViewMatrix();
    }
    LAppView.prototype.initialize = function () {
        var width = lappdelegate_1.canvas.width, height = lappdelegate_1.canvas.height;
        var ratio = height / width;
        var left = LAppDefine.ViewLogicalLeft;
        var right = LAppDefine.ViewLogicalRight;
        var bottom = -ratio;
        var top = ratio;
        this._viewMatrix.setScreenRect(left, right, bottom, top);
        var screenW = Math.abs(left - right);
        this._deviceToScreen.scaleRelative(screenW / width, -screenW / width);
        this._deviceToScreen.translateRelative(-width * 0.5, -height * 0.5);
        this._viewMatrix.setMaxScale(LAppDefine.ViewMaxScale);
        this._viewMatrix.setMinScale(LAppDefine.ViewMinScale);
        this._viewMatrix.setMaxScreenRect(LAppDefine.ViewLogicalMaxLeft, LAppDefine.ViewLogicalMaxRight, LAppDefine.ViewLogicalMaxBottom, LAppDefine.ViewLogicalMaxTop);
    };
    LAppView.prototype.release = function () {
        this._viewMatrix = null;
        this._touchManager = null;
        this._deviceToScreen = null;
        this._gear.release();
        this._gear = null;
        this._back.release();
        this._back = null;
        lappdelegate_1.gl.deleteProgram(this._programId);
        this._programId = null;
    };
    LAppView.prototype.render = function () {
        lappdelegate_1.gl.useProgram(this._programId);
        if (this._back) {
            this._back.render(this._programId);
        }
        if (this._gear) {
            this._gear.render(this._programId);
        }
        lappdelegate_1.gl.flush();
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        live2DManager.onUpdate();
    };
    LAppView.prototype.initializeSprite = function () {
        var _this = this;
        var width = lappdelegate_1.canvas.width;
        var height = lappdelegate_1.canvas.height;
        var textureManager = lappdelegate_1.LAppDelegate.getInstance().getTextureManager();
        var resourcesPath = LAppDefine.ResourcesPath;
        var imageName = '';
        imageName = LAppDefine.BackImageName;
        var initBackGroundTexture = function (textureInfo) {
            var x = width * 0.5;
            var y = height * 0.5;
            var fwidth = textureInfo.width * 2.0;
            var fheight = height * 0.95;
            _this._back = new lappsprite_1.LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };
        textureManager.createTextureFromPngFile(resourcesPath + imageName, false, initBackGroundTexture);
        imageName = LAppDefine.GearImageName;
        var initGearTexture = function (textureInfo) {
            var x = width - textureInfo.width * 0.5;
            var y = height - textureInfo.height * 0.5;
            var fwidth = textureInfo.width;
            var fheight = textureInfo.height;
            _this._gear = new lappsprite_1.LAppSprite(x, y, fwidth, fheight, textureInfo.id);
        };
        textureManager.createTextureFromPngFile(resourcesPath + imageName, false, initGearTexture);
        if (this._programId == null) {
            this._programId = lappdelegate_1.LAppDelegate.getInstance().createShader();
        }
    };
    LAppView.prototype.onTouchesBegan = function (pointX, pointY) {
        this._touchManager.touchesBegan(pointX, pointY);
    };
    LAppView.prototype.onTouchesMoved = function (pointX, pointY) {
        var viewX = this.transformViewX(this._touchManager.getX());
        var viewY = this.transformViewY(this._touchManager.getY());
        this._touchManager.touchesMoved(pointX, pointY);
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        live2DManager.onDrag(viewX, viewY);
    };
    LAppView.prototype.onTouchesEnded = function (pointX, pointY) {
        var live2DManager = lapplive2dmanager_1.LAppLive2DManager.getInstance();
        live2DManager.onDrag(0.0, 0.0);
        {
            var x = this._deviceToScreen.transformX(this._touchManager.getX());
            var y = this._deviceToScreen.transformY(this._touchManager.getY());
            if (LAppDefine.DebugTouchLogEnable) {
                lapppal_1.LAppPal.printMessage("[APP]touchesEnded x: " + x + " y: " + y);
            }
            live2DManager.onTap(x, y);
            if (this._gear.isHit(pointX, pointY)) {
                live2DManager.nextScene();
            }
        }
    };
    LAppView.prototype.transformViewX = function (deviceX) {
        var screenX = this._deviceToScreen.transformX(deviceX);
        return this._viewMatrix.invertTransformX(screenX);
    };
    LAppView.prototype.transformViewY = function (deviceY) {
        var screenY = this._deviceToScreen.transformY(deviceY);
        return this._viewMatrix.invertTransformY(screenY);
    };
    LAppView.prototype.transformScreenX = function (deviceX) {
        return this._deviceToScreen.transformX(deviceX);
    };
    LAppView.prototype.transformScreenY = function (deviceY) {
        return this._deviceToScreen.transformY(deviceY);
    };
    return LAppView;
}());
exports.LAppView = LAppView;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lappdelegate_1 = __webpack_require__(/*! ./lappdelegate */ "./src/lappdelegate.ts");
window.onload = function () {
    if (lappdelegate_1.LAppDelegate.getInstance().initialize() == false) {
        return;
    }
    lappdelegate_1.LAppDelegate.getInstance().run();
};
window.onbeforeunload = function () { return lappdelegate_1.LAppDelegate.releaseInstance(); };


/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGFwcGRlbGVnYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwbGl2ZTJkbWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFwcG1vZGVsLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwc3ByaXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwdGV4dHVyZW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xhcHB2aWV3LnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPQSw2SUFHMEM7QUFDMUMsSUFBTyxtQkFBbUIsR0FBRyw2Q0FBcUIsQ0FBQyxlQUFlLENBQUM7QUFDbkUsNEVBQXNDO0FBQ3RDLHlFQUFvQztBQUNwQywwR0FBMEQ7QUFDMUQsdUdBQXdEO0FBQ3hELDhGQUEyQztBQUVoQyxjQUFNLEdBQXNCLElBQUksQ0FBQztBQUNqQyxrQkFBVSxHQUFpQixJQUFJLENBQUM7QUFDaEMsVUFBRSxHQUEwQixJQUFJLENBQUM7QUFDakMsbUJBQVcsR0FBcUIsSUFBSSxDQUFDO0FBQ3JDLFdBQUcsR0FBTyxNQUFNLENBQUM7QUFNNUI7SUFZRTtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRXBCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSw4QkFBVSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBUWEsd0JBQVcsR0FBekI7UUFDRSxJQUFJLGtCQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLGtCQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztTQUNqQztRQUVELE9BQU8sa0JBQVUsQ0FBQztJQUNwQixDQUFDO0lBS2EsNEJBQWUsR0FBN0I7UUFDRSxJQUFJLGtCQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLGtCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDdEI7UUFFRCxrQkFBVSxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBS00saUNBQVUsR0FBakI7UUFFRSxjQUFNLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFJOUQsVUFBRSxHQUFHLGNBQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksY0FBTSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRTNFLElBQUksQ0FBQyxVQUFFLEVBQUU7WUFDUCxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztZQUNqRSxVQUFFLEdBQUcsSUFBSSxDQUFDO1lBRVYsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTO2dCQUNyQix3RUFBd0UsQ0FBQztZQUczRSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLG1CQUFXLEVBQUU7WUFDaEIsbUJBQVcsR0FBRyxVQUFFLENBQUMsWUFBWSxDQUFDLFVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3ZEO1FBR0QsVUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsVUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFFLENBQUMsU0FBUyxFQUFFLFVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBRW5ELElBQU0sWUFBWSxHQUFZLFlBQVksSUFBSSxjQUFNLENBQUM7UUFFckQsSUFBSSxZQUFZLEVBQUU7WUFFaEIsY0FBTSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7WUFDbkMsY0FBTSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7WUFDbEMsY0FBTSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUM7WUFDakMsY0FBTSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7U0FDdEM7YUFBTTtZQUVMLGNBQU0sQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsWUFBWSxDQUFDO1lBQ2xDLGNBQU0sQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO1NBQ2pDO1FBRUQsV0FBRyxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFHeEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFeEIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBS00sOEJBQU8sR0FBZDtRQUNFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFFNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUdsQixxQ0FBaUIsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUdwQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBS00sMEJBQUcsR0FBVjtRQUFBLGlCQW9DQztRQWxDQyxJQUFNLElBQUksR0FBRztZQUVYLElBQUksa0JBQVUsSUFBSSxJQUFJLEVBQUU7Z0JBQ3RCLE9BQU87YUFDUjtZQUdELGlCQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7WUFHckIsVUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUdsQyxVQUFFLENBQUMsTUFBTSxDQUFDLFVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUd6QixVQUFFLENBQUMsU0FBUyxDQUFDLFVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUd4QixVQUFFLENBQUMsS0FBSyxDQUFDLFVBQUUsQ0FBQyxnQkFBZ0IsR0FBRyxVQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVwRCxVQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBR25CLFVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLFVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUduRCxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBR3BCLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztRQUNGLElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQztJQUtNLG1DQUFZLEdBQW5CO1FBRUUsSUFBTSxjQUFjLEdBQUcsVUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFekQsSUFBSSxjQUFjLElBQUksSUFBSSxFQUFFO1lBQzFCLGlCQUFPLENBQUMsWUFBWSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDdEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0sWUFBWSxHQUNoQiwwQkFBMEI7WUFDMUIsMEJBQTBCO1lBQzFCLG9CQUFvQjtZQUNwQixtQkFBbUI7WUFDbkIsaUJBQWlCO1lBQ2pCLEdBQUc7WUFDSCx1Q0FBdUM7WUFDdkMsY0FBYztZQUNkLEdBQUcsQ0FBQztRQUVOLFVBQUUsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzlDLFVBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFHakMsSUFBTSxnQkFBZ0IsR0FBRyxVQUFFLENBQUMsWUFBWSxDQUFDLFVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUU3RCxJQUFJLGdCQUFnQixJQUFJLElBQUksRUFBRTtZQUM1QixpQkFBTyxDQUFDLFlBQVksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFNLGNBQWMsR0FDbEIsMEJBQTBCO1lBQzFCLG1CQUFtQjtZQUNuQiw0QkFBNEI7WUFDNUIsaUJBQWlCO1lBQ2pCLEdBQUc7WUFDSCw0Q0FBNEM7WUFDNUMsR0FBRyxDQUFDO1FBRU4sVUFBRSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNsRCxVQUFFLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFHbkMsSUFBTSxTQUFTLEdBQUcsVUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JDLFVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzNDLFVBQUUsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFN0MsVUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoQyxVQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFHbEMsVUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUxQixVQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXpCLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFLTSw4QkFBTyxHQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFTSx3Q0FBaUIsR0FBeEI7UUFDRSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztJQUtNLHVDQUFnQixHQUF2QjtRQUVFLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLGlCQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3RELElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztRQUNoRSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBR2hELG1CQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDO1FBR2pDLHFDQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRWhDLGlCQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUM7QUE3UFksb0NBQVk7QUFrUXpCLFNBQVMsWUFBWSxDQUFDLENBQWE7SUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUU7UUFDckMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdEMsT0FBTztLQUNSO0lBQ0QsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFFNUMsSUFBTSxJQUFJLEdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM3QixJQUFNLElBQUksR0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBRTdCLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBS0QsU0FBUyxZQUFZLENBQUMsQ0FBYTtJQU1qQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRTtRQUNyQyxpQkFBTyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0QyxPQUFPO0tBQ1I7SUFFRCxJQUFNLElBQUksR0FBSSxDQUFDLENBQUMsTUFBa0IsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQzNELElBQU0sSUFBSSxHQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMzQyxJQUFNLElBQUksR0FBVyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7SUFFMUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFLRCxTQUFTLFlBQVksQ0FBQyxDQUFhO0lBQ2pDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzdDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFO1FBQ3JDLGlCQUFPLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3RDLE9BQU87S0FDUjtJQUVELElBQU0sSUFBSSxHQUFJLENBQUMsQ0FBQyxNQUFrQixDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDM0QsSUFBTSxJQUFJLEdBQVcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzNDLElBQU0sSUFBSSxHQUFXLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUUxQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUtELFNBQVMsWUFBWSxDQUFDLENBQWE7SUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUU7UUFDckMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdEMsT0FBTztLQUNSO0lBRUQsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFFNUMsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDdkMsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFFdkMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlELENBQUM7QUFLRCxTQUFTLFlBQVksQ0FBQyxDQUFhO0lBTWpDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFO1FBQ3JDLGlCQUFPLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3RDLE9BQU87S0FDUjtJQUVELElBQU0sSUFBSSxHQUFJLENBQUMsQ0FBQyxNQUFrQixDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFFM0QsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyRCxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBRXBELFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBS0QsU0FBUyxZQUFZLENBQUMsQ0FBYTtJQUNqQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUU3QyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssRUFBRTtRQUNyQyxpQkFBTyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0QyxPQUFPO0tBQ1I7SUFFRCxJQUFNLElBQUksR0FBSSxDQUFDLENBQUMsTUFBa0IsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBRTNELElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckQsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUVwRCxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUtELFNBQVMsYUFBYSxDQUFDLENBQWE7SUFDbEMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFFN0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUU7UUFDckMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdEMsT0FBTztLQUNSO0lBRUQsSUFBTSxJQUFJLEdBQUksQ0FBQyxDQUFDLE1BQWtCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUUzRCxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JELElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7SUFFcEQsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyWkQsa0lBQXlGO0FBQ3pGLG1IQUErRTtBQUUvRSxJQUFPLGFBQWEsR0FBRyxpQ0FBUyxDQUFDLFNBQVMsQ0FBQztBQUMzQyxJQUFPLGtCQUFrQixHQUFHLHNDQUFjLENBQUMsY0FBYyxDQUFDO0FBRzFELCtFQUF3QztBQUN4Qyx5RUFBb0M7QUFDcEMsd0ZBQXdDO0FBQ3hDLDhGQUEyQztBQUVoQyxrQkFBVSxHQUFzQixJQUFJLENBQUM7QUFNaEQ7SUF1S0U7UUFXQSxvQkFBZSxHQUFHLFVBQUMsSUFBbUI7WUFDcEMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQztRQWJBLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQWEsQ0FBQztRQUM5QyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBckthLDZCQUFXLEdBQXpCO1FBQ0UsSUFBSSxrQkFBVSxJQUFJLElBQUksRUFBRTtZQUN0QixrQkFBVSxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztTQUN0QztRQUVELE9BQU8sa0JBQVUsQ0FBQztJQUNwQixDQUFDO0lBS2EsaUNBQWUsR0FBN0I7UUFDRSxJQUFJLGtCQUFVLElBQUksSUFBSSxFQUFFO1lBQ3RCLGtCQUFVLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDckI7UUFFRCxrQkFBVSxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBUU0sb0NBQVEsR0FBZixVQUFnQixFQUFVO1FBQ3hCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUtNLDJDQUFlLEdBQXRCO1FBQ0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNCO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBUU0sa0NBQU0sR0FBYixVQUFjLENBQVMsRUFBRSxDQUFTO1FBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUMsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDekI7U0FDRjtJQUNILENBQUM7SUFRTSxpQ0FBSyxHQUFaLFVBQWEsQ0FBUyxFQUFFLENBQVM7UUFDL0IsSUFBSSxVQUFVLENBQUMsY0FBYyxFQUFFO1lBQzdCLGlCQUFPLENBQUMsWUFBWSxDQUNsQix5QkFBdUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsWUFBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFHLENBQzFELENBQUM7U0FDSDtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9DLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUNoRSxJQUFJLFVBQVUsQ0FBQyxjQUFjLEVBQUU7b0JBQzdCLGlCQUFPLENBQUMsWUFBWSxDQUNsQixxQkFBbUIsVUFBVSxDQUFDLGVBQWUsTUFBRyxDQUNqRCxDQUFDO2lCQUNIO2dCQUNELElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDMUM7aUJBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZFLElBQUksVUFBVSxDQUFDLGNBQWMsRUFBRTtvQkFDN0IsaUJBQU8sQ0FBQyxZQUFZLENBQ2xCLHFCQUFtQixVQUFVLENBQUMsZUFBZSxNQUFHLENBQ2pELENBQUM7aUJBQ0g7Z0JBQ0QsSUFBSSxDQUFDLE9BQU87cUJBQ1QsRUFBRSxDQUFDLENBQUMsQ0FBQztxQkFDTCxpQkFBaUIsQ0FDaEIsVUFBVSxDQUFDLGtCQUFrQixFQUM3QixVQUFVLENBQUMsY0FBYyxFQUN6QixJQUFJLENBQUMsZUFBZSxDQUNyQixDQUFDO2FBQ0w7U0FDRjtJQUNILENBQUM7SUFNTSxvQ0FBUSxHQUFmO1FBQ0UsSUFBSSxVQUFVLEdBQXVCLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUV0RCx1Q0FBSyxFQUFFLHFDQUFNLENBQVk7UUFDakMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBRXRDLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7WUFDNUIsVUFBVSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUMvQztRQUVELElBQU0sY0FBYyxHQUF1QixVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUQsSUFBTSxVQUFVLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVsRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLElBQU0sS0FBSyxHQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVwQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQU1NLHFDQUFTLEdBQWhCO1FBQ0UsSUFBTSxFQUFFLEdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUM7UUFDcEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBTU0sdUNBQVcsR0FBbEIsVUFBbUIsS0FBYTtRQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLFVBQVUsQ0FBQyxjQUFjLEVBQUU7WUFDN0IsaUJBQU8sQ0FBQyxZQUFZLENBQUMsdUJBQXFCLElBQUksQ0FBQyxXQUFhLENBQUMsQ0FBQztTQUMvRDtRQUtELElBQU0sS0FBSyxHQUFXLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsSUFBTSxTQUFTLEdBQVcsVUFBVSxDQUFDLGFBQWEsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2pFLElBQUksYUFBYSxHQUFXLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkQsYUFBYSxJQUFJLGNBQWMsQ0FBQztRQUVoQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxxQkFBUyxFQUFFLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFvQkgsd0JBQUM7QUFBRCxDQUFDO0FBdExZLDhDQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQjlCLDZJQUFrRztBQUVsRyx1SUFBNEY7QUFFNUYsZ0pBQW9HO0FBQ3BHLHNKQUF3RztBQUN4RyxtSUFBeUY7QUFDekYsc0lBQTJGO0FBQzNGLGdJQUF1RjtBQUN2RixtSEFBK0U7QUFDL0UsMEdBQXlFO0FBR3pFLG9LQUErRztBQUcvRywySEFBNkQ7QUFHN0QsSUFBTyxrQ0FBa0MsR0FBRyxnREFBd0IsQ0FBQyxrQ0FBa0MsQ0FBQztBQUl4RyxJQUFPLE1BQU0sR0FBRyw4QkFBTSxDQUFDLE1BQU0sQ0FBQztBQUM5QixJQUFPLFNBQVMsR0FBRyxpQ0FBUyxDQUFDLFNBQVMsQ0FBQztBQUN2QyxJQUFPLFlBQVksR0FBRyxvQ0FBWSxDQUFDLFlBQVksQ0FBQztBQUNoRCxJQUFPLG1CQUFtQixHQUFHLG9DQUFZLENBQUMsbUJBQW1CLENBQUM7QUFDOUQsSUFBTyxjQUFjLEdBQUcsc0NBQWMsQ0FBQyxjQUFjLENBQUM7QUFDdEQsSUFBTyxhQUFhLEdBQUcscUNBQWEsQ0FBQyxhQUFhLENBQUM7QUFFbkQsSUFBTyxlQUFlLEdBQUcsNkNBQXFCLENBQUMsZUFBZSxDQUFDO0FBRS9ELElBQU8sZUFBZSxHQUFHLHVDQUFlLENBQUMsZUFBZSxDQUFDO0FBRXpELElBQU8sc0JBQXNCLEdBQUcsOENBQXNCLENBQUMsc0JBQXNCLENBQUM7QUFDOUUsSUFBTyx3QkFBd0IsR0FBRyxnREFBd0IsQ0FBQztBQUUzRCx5RUFBb0M7QUFDcEMsd0ZBQXVFO0FBRXZFLDhGQUEyQztBQUMzQyxnRkFBc0I7QUFFdEIsSUFBSyxRQXdCSjtBQXhCRCxXQUFLLFFBQVE7SUFDWCxtREFBVTtJQUNWLGlEQUFTO0lBQ1QseURBQWE7SUFDYiwyREFBYztJQUNkLG1FQUFrQjtJQUNsQixxREFBVztJQUNYLDZEQUFlO0lBQ2YsK0NBQVE7SUFDUix1REFBWTtJQUNaLHlEQUFhO0lBQ2Isc0RBQVc7SUFDWCx3REFBWTtJQUNaLGdFQUFnQjtJQUNoQixnRUFBZ0I7SUFDaEIsOERBQWU7SUFDZixzREFBVztJQUNYLG9EQUFVO0lBQ1YsNERBQWM7SUFDZCxvRUFBa0I7SUFDbEIsb0VBQWtCO0lBQ2xCLHNEQUFXO0lBQ1gsOERBQWU7SUFDZiwwREFBYTtBQUNmLENBQUMsRUF4QkksUUFBUSxLQUFSLFFBQVEsUUF3Qlo7QUFNRDtJQUErQiw2QkFBZTtJQTh0QjVDO1FBQUEsWUFDRSxpQkFBTyxTQXVDUjtRQXJDQyxLQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixLQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO1FBRTVCLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxTQUFTLEVBQWtCLENBQUM7UUFDcEQsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFNBQVMsRUFBa0IsQ0FBQztRQUVuRCxLQUFJLENBQUMsUUFBUSxHQUFHLElBQUksTUFBTSxFQUF5QixDQUFDO1FBQ3BELEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxNQUFNLEVBQXlCLENBQUM7UUFFeEQsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFNBQVMsRUFBVyxDQUFDO1FBQ3pDLEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQVcsQ0FBQztRQUUxQyxLQUFJLENBQUMsY0FBYyxHQUFHLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQ3hELHdCQUF3QixDQUFDLFdBQVcsQ0FDckMsQ0FBQztRQUNGLEtBQUksQ0FBQyxjQUFjLEdBQUcsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FDeEQsd0JBQXdCLENBQUMsV0FBVyxDQUNyQyxDQUFDO1FBQ0YsS0FBSSxDQUFDLGNBQWMsR0FBRyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUN4RCx3QkFBd0IsQ0FBQyxXQUFXLENBQ3JDLENBQUM7UUFDRixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FDMUQsd0JBQXdCLENBQUMsYUFBYSxDQUN2QyxDQUFDO1FBQ0YsS0FBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQzFELHdCQUF3QixDQUFDLGFBQWEsQ0FDdkMsQ0FBQztRQUNGLEtBQUksQ0FBQyxrQkFBa0IsR0FBRyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUM1RCx3QkFBd0IsQ0FBQyxlQUFlLENBQ3pDLENBQUM7UUFFRixLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDbEMsS0FBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztRQUMxQixLQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN2QixLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixLQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQzs7SUFDM0IsQ0FBQztJQWh3Qk0sOEJBQVUsR0FBakIsVUFBa0IsR0FBVyxFQUFFLFFBQWdCO1FBQS9DLGlCQWlCQztRQWhCQyxJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztRQUV6QixLQUFLLENBQUksSUFBSSxDQUFDLGFBQWEsU0FBSSxRQUFVLENBQUM7YUFDdkMsSUFBSSxDQUFDLGtCQUFRLElBQUksZUFBUSxDQUFDLFdBQVcsRUFBRSxFQUF0QixDQUFzQixDQUFDO2FBQ3hDLElBQUksQ0FBQyxxQkFBVztZQUNmLElBQU0sT0FBTyxHQUF3QixJQUFJLHNCQUFzQixDQUM3RCxXQUFXLEVBQ1gsV0FBVyxDQUFDLFVBQVUsQ0FDdkIsQ0FBQztZQUdGLEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUdqQyxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQVFPLDhCQUFVLEdBQWxCLFVBQW1CLE9BQTRCO1FBQS9DLGlCQTZRQztRQTVRQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUUxQixJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQztRQUc3QixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDL0MsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRTVELEtBQUssQ0FBSSxJQUFJLENBQUMsYUFBYSxTQUFJLGFBQWUsQ0FBQztpQkFDNUMsSUFBSSxDQUFDLGtCQUFRLElBQUksZUFBUSxDQUFDLFdBQVcsRUFBRSxFQUF0QixDQUFzQixDQUFDO2lCQUN4QyxJQUFJLENBQUMscUJBQVc7Z0JBQ2YsS0FBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDNUIsS0FBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO2dCQUd0QyxvQkFBb0IsRUFBRSxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBRUwsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1NBQ3RDO2FBQU07WUFDTCxpQkFBTyxDQUFDLFlBQVksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1NBQ3BEO1FBR0QsSUFBTSxvQkFBb0IsR0FBRztZQUMzQixJQUFJLEtBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQy9DLElBQU0sT0FBSyxHQUFXLEtBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzt3Q0FFckQsQ0FBQztvQkFDUixJQUFNLGNBQWMsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxJQUFNLGtCQUFrQixHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQ2pFLENBQUMsQ0FDRixDQUFDO29CQUVGLEtBQUssQ0FBSSxLQUFJLENBQUMsYUFBYSxTQUFJLGtCQUFvQixDQUFDO3lCQUNqRCxJQUFJLENBQUMsa0JBQVEsSUFBSSxlQUFRLENBQUMsV0FBVyxFQUFFLEVBQXRCLENBQXNCLENBQUM7eUJBQ3hDLElBQUksQ0FBQyxxQkFBVzt3QkFDZixJQUFNLE1BQU0sR0FBa0IsS0FBSSxDQUFDLGNBQWMsQ0FDL0MsV0FBVyxFQUNYLFdBQVcsQ0FBQyxVQUFVLEVBQ3RCLGNBQWMsQ0FDZixDQUFDO3dCQUVGLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxFQUFFOzRCQUN0RCxhQUFhLENBQUMsTUFBTSxDQUNsQixLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FDM0MsQ0FBQzs0QkFDRixLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7eUJBQ2xEO3dCQUVELEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFFbkQsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7d0JBRXhCLElBQUksS0FBSSxDQUFDLGdCQUFnQixJQUFJLE9BQUssRUFBRTs0QkFDbEMsS0FBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDOzRCQUduQyxpQkFBaUIsRUFBRSxDQUFDO3lCQUNyQjtvQkFDSCxDQUFDLENBQUMsQ0FBQzs7Z0JBaENQLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFLLEVBQUUsQ0FBQyxFQUFFOzRCQUFyQixDQUFDO2lCQWlDVDtnQkFDRCxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQzthQUMzQztpQkFBTTtnQkFDTCxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7Z0JBR25DLGlCQUFpQixFQUFFLENBQUM7YUFDckI7UUFDSCxDQUFDLENBQUM7UUFHRixJQUFNLGlCQUFpQixHQUFHO1lBQ3hCLElBQUksS0FBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDakQsSUFBTSxlQUFlLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUVoRSxLQUFLLENBQUksS0FBSSxDQUFDLGFBQWEsU0FBSSxlQUFpQixDQUFDO3FCQUM5QyxJQUFJLENBQUMsa0JBQVEsSUFBSSxlQUFRLENBQUMsV0FBVyxFQUFFLEVBQXRCLENBQXNCLENBQUM7cUJBQ3hDLElBQUksQ0FBQyxxQkFBVztvQkFDZixLQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBRXRELEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztvQkFHaEMsY0FBYyxFQUFFLENBQUM7Z0JBQ25CLENBQUMsQ0FBQyxDQUFDO2dCQUNMLEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzthQUN4QztpQkFBTTtnQkFDTCxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBR2hDLGNBQWMsRUFBRSxDQUFDO2FBQ2xCO1FBQ0gsQ0FBQyxDQUFDO1FBR0YsSUFBTSxjQUFjLEdBQUc7WUFDckIsSUFBSSxLQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDOUMsSUFBTSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFMUQsS0FBSyxDQUFJLEtBQUksQ0FBQyxhQUFhLFNBQUksWUFBYyxDQUFDO3FCQUMzQyxJQUFJLENBQUMsa0JBQVEsSUFBSSxlQUFRLENBQUMsV0FBVyxFQUFFLEVBQXRCLENBQXNCLENBQUM7cUJBQ3hDLElBQUksQ0FBQyxxQkFBVztvQkFDZixLQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBRW5ELEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztvQkFHckMsYUFBYSxFQUFFLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQzthQUNyQztpQkFBTTtnQkFDTCxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7Z0JBR3JDLGFBQWEsRUFBRSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQyxDQUFDO1FBR0YsSUFBTSxhQUFhLEdBQUc7WUFDcEIsSUFBSSxLQUFJLENBQUMsYUFBYSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUN0RCxLQUFJLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMzRCxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7YUFDcEM7WUFHRCxXQUFXLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUM7UUFHRixJQUFNLFdBQVcsR0FBRztZQUNsQixLQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVyQyxJQUFNLGdCQUFnQixHQUFtQyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ3pFLGdCQUFnQixDQUFDLFFBQVEsQ0FDdkIsSUFBSSxtQkFBbUIsQ0FBQyxLQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUNyRSxDQUFDO1lBQ0YsZ0JBQWdCLENBQUMsUUFBUSxDQUN2QixJQUFJLG1CQUFtQixDQUFDLEtBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQ3BFLENBQUM7WUFDRixnQkFBZ0IsQ0FBQyxRQUFRLENBQ3ZCLElBQUksbUJBQW1CLENBQUMsS0FBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FDckUsQ0FBQztZQUNGLGdCQUFnQixDQUFDLFFBQVEsQ0FDdkIsSUFBSSxtQkFBbUIsQ0FBQyxLQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQ3pFLENBQUM7WUFDRixnQkFBZ0IsQ0FBQyxRQUFRLENBQ3ZCLElBQUksbUJBQW1CLENBQ3JCLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQ2xDLHdCQUF3QixDQUFDLFdBQVcsQ0FDckMsRUFDRCxHQUFHLEVBQ0gsR0FBRyxFQUNILE1BQU0sRUFDTixHQUFHLENBQ0osQ0FDRixDQUFDO1lBRUYsS0FBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM3QyxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUM7WUFHcEMsWUFBWSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDO1FBR0YsSUFBTSxZQUFZLEdBQUc7WUFDbkIsSUFBSSxLQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDOUMsSUFBTSxZQUFZLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFMUQsS0FBSyxDQUFJLEtBQUksQ0FBQyxhQUFhLFNBQUksWUFBYyxDQUFDO3FCQUMzQyxJQUFJLENBQUMsa0JBQVEsSUFBSSxlQUFRLENBQUMsV0FBVyxFQUFFLEVBQXRCLENBQXNCLENBQUM7cUJBQ3hDLElBQUksQ0FBQyxxQkFBVztvQkFDZixLQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBRXZELEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDO29CQUd4QyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQztnQkFFTCxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQzthQUN6QztpQkFBTTtnQkFDTCxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFHeEMsZ0JBQWdCLEVBQUUsQ0FBQzthQUNwQjtRQUNILENBQUMsQ0FBQztRQUdGLElBQU0sZ0JBQWdCLEdBQUc7WUFDdkIsSUFBTSxlQUFlLEdBQVcsS0FBSSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBRS9FLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ3hDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUN4QixLQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUM3QyxDQUFDO2FBQ0g7WUFFRCxLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7WUFHdkMsZUFBZSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDO1FBR0YsSUFBTSxlQUFlLEdBQUc7WUFDdEIsSUFBTSxjQUFjLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBRXJFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ3ZDLEtBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4RTtZQUNELEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUduQyxXQUFXLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUM7UUFHRixJQUFNLFdBQVcsR0FBRztZQUNsQixJQUFNLE1BQU0sR0FBMkIsSUFBSSxNQUFNLEVBQWtCLENBQUM7WUFDcEUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsS0FBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUMsS0FBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBR2xDLGdCQUFnQixFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDO1FBR0YsSUFBTSxnQkFBZ0IsR0FBRztZQUN2QixLQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDdEMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUM3QixLQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztZQUN6QixLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7WUFFM0IsSUFBTSxnQkFBZ0IsR0FBVyxLQUFJLENBQUMsYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFHMUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN6QyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsS0FBSSxDQUFDLGVBQWUsSUFBSSxLQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyRTtZQUdELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25DO1lBR0QsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLEVBQUU7Z0JBQ3pCLEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztnQkFHbkMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFFckMsS0FBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUV6QixLQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3RCLEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDckIsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBRSxDQUFDLENBQUM7YUFDaEM7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDO0lBS08saUNBQWEsR0FBckI7UUFBQSxpQkE4Q0M7UUE1Q0MsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBRTVCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsV0FBVyxFQUFFO1lBRXZDLElBQU0sY0FBWSxHQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLENBQUM7b0NBRzVELGtCQUFrQjtnQkFLdEIsSUFBSSxPQUFLLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztpQkFFeEM7Z0JBR0QsSUFBSSxXQUFXLEdBQUcsT0FBSyxhQUFhLENBQUMsa0JBQWtCLENBQ3JELGtCQUFrQixDQUNuQixDQUFDO2dCQUNGLFdBQVcsR0FBRyxPQUFLLGFBQWEsR0FBRyxXQUFXLENBQUM7Z0JBRy9DLElBQU0sTUFBTSxHQUFHLFVBQUMsV0FBd0I7b0JBQ3RDLEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUVuRSxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBRXJCLElBQUksS0FBSSxDQUFDLGFBQWEsSUFBSSxjQUFZLEVBQUU7d0JBRXRDLEtBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztxQkFDdEM7Z0JBQ0gsQ0FBQyxDQUFDO2dCQUdGLDJCQUFZLENBQUMsV0FBVyxFQUFFO3FCQUN2QixpQkFBaUIsRUFBRTtxQkFDbkIsd0JBQXdCLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDakUsT0FBSyxXQUFXLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7O1lBakM3RCxLQUNFLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxFQUMxQixrQkFBa0IsR0FBRyxjQUFZLEVBQ2pDLGtCQUFrQixFQUFFO3dCQUZoQixrQkFBa0I7YUFpQ3ZCO1lBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUtNLGtDQUFjLEdBQXJCO1FBQ0UsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUtNLDBCQUFNLEdBQWI7UUFDRSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLGFBQWE7WUFBRSxPQUFPO1FBRWxELElBQU0sZ0JBQWdCLEdBQVcsaUJBQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLElBQUksZ0JBQWdCLENBQUM7UUFFMUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO1FBR3ZDLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQztRQUcxQixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUVwQyxJQUFJLENBQUMsaUJBQWlCLENBQ3BCLFVBQVUsQ0FBQyxlQUFlLEVBQzFCLFVBQVUsQ0FBQyxZQUFZLENBQ3hCLENBQUM7U0FDSDthQUFNO1lBQ0wsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUM5QyxJQUFJLENBQUMsTUFBTSxFQUNYLGdCQUFnQixDQUNqQixDQUFDO1NBQ0g7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBSTdCLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtnQkFFMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7YUFDaEU7U0FDRjtRQUVELElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksRUFBRTtZQUNuQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUNyRTtRQUlELElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQy9CLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FDaEMsQ0FBQztRQUdGLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQy9CLElBQUksQ0FBQyxrQkFBa0IsRUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQ2pCLENBQUM7UUFHRixJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBR3RFLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7U0FDOUQ7UUFHRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUN2RDtRQUdELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7WUFFaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZFO1NBQ0Y7UUFHRCxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1NBQzVEO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBVU0sK0JBQVcsR0FBbEIsVUFDRSxLQUFhLEVBQ2IsRUFBVSxFQUNWLFFBQWdCLEVBQ2hCLHVCQUFnRDtRQUpsRCxpQkE2REM7UUF2REMsSUFBSSxRQUFRLElBQUksVUFBVSxDQUFDLGFBQWEsRUFBRTtZQUN4QyxJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2xEO2FBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3ZELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsaUJBQU8sQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUMsQ0FBQzthQUNsRDtZQUNELE9BQU8sa0NBQWtDLENBQUM7U0FDM0M7UUFFRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUd2RSxJQUFNLElBQUksR0FBTSxLQUFLLFNBQUksRUFBSSxDQUFDO1FBQzlCLElBQUksTUFBTSxHQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQWlCLENBQUM7UUFDeEUsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBRXZCLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtZQUNsQixLQUFLLENBQUksSUFBSSxDQUFDLGFBQWEsU0FBSSxjQUFnQixDQUFDO2lCQUM3QyxJQUFJLENBQUMsa0JBQVEsSUFBSSxlQUFRLENBQUMsV0FBVyxFQUFFLEVBQXRCLENBQXNCLENBQUM7aUJBQ3hDLElBQUksQ0FBQyxxQkFBVztnQkFDZixNQUFNLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FDdEIsV0FBVyxFQUNYLFdBQVcsQ0FBQyxVQUFVLEVBQ3RCLElBQUksRUFDSix1QkFBdUIsQ0FDeEIsQ0FBQztnQkFDRixJQUFJLFFBQVEsR0FBVyxLQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUNoRSxLQUFLLEVBQ0wsRUFBRSxDQUNILENBQUM7Z0JBRUYsSUFBSSxRQUFRLElBQUksR0FBRyxFQUFFO29CQUNuQixNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNoQztnQkFFRCxRQUFRLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ25FLElBQUksUUFBUSxJQUFJLEdBQUcsRUFBRTtvQkFDbkIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDakM7Z0JBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDekQsVUFBVSxHQUFHLElBQUksQ0FBQztZQUNwQixDQUFDLENBQUMsQ0FBQztTQUNOO2FBQU07WUFDTCxNQUFNLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUMxRDtRQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixpQkFBTyxDQUFDLFlBQVksQ0FBQyx5QkFBdUIsS0FBSyxTQUFJLEVBQUksQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUM1QyxNQUFNLEVBQ04sVUFBVSxFQUNWLFFBQVEsQ0FDVCxDQUFDO0lBQ0osQ0FBQztJQVNNLHFDQUFpQixHQUF4QixVQUNFLEtBQWEsRUFDYixRQUFnQixFQUNoQix1QkFBZ0Q7UUFFaEQsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDakQsT0FBTyxrQ0FBa0MsQ0FBQztTQUMzQztRQUVELElBQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQzNCLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FDekQsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFPTSxpQ0FBYSxHQUFwQixVQUFxQixZQUFvQjtRQUN2QyxJQUFNLE1BQU0sR0FBa0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFdkUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLGlCQUFPLENBQUMsWUFBWSxDQUFDLHVCQUFxQixZQUFZLE1BQUcsQ0FBQyxDQUFDO1NBQzVEO1FBRUQsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FDekMsTUFBTSxFQUNOLEtBQUssRUFDTCxVQUFVLENBQUMsYUFBYSxDQUN6QixDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsaUJBQU8sQ0FBQyxZQUFZLENBQUMscUJBQW1CLFlBQVksY0FBVyxDQUFDLENBQUM7YUFDbEU7U0FDRjtJQUNILENBQUM7SUFLTSx1Q0FBbUIsR0FBMUI7UUFDRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3BDLE9BQU87U0FDUjtRQUVELElBQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUUzRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwRCxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ1gsSUFBTSxNQUFJLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQUksQ0FBQyxDQUFDO2dCQUN6QixPQUFPO2FBQ1I7U0FDRjtJQUNILENBQUM7SUFLTSxvQ0FBZ0IsR0FBdkIsVUFBd0IsVUFBcUI7UUFDM0MsMkJBQWEsQ0FBQyw2QkFBNkIsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQVVNLDJCQUFPLEdBQWQsVUFBZSxZQUFvQixFQUFFLENBQVMsRUFBRSxDQUFTO1FBRXZELElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDckIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUU1RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzlCLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBWSxFQUFFO2dCQUN4RCxJQUFNLE1BQU0sR0FBbUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Y7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFRTSxzQ0FBa0IsR0FBekIsVUFBMEIsS0FBYTtRQUF2QyxpQkFzREM7Z0NBckRVLENBQUM7WUFDUixJQUFNLGNBQWMsR0FBRyxPQUFLLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFHdEUsSUFBTSxNQUFJLEdBQU0sS0FBSyxTQUFJLENBQUcsQ0FBQztZQUM3QixJQUFJLE9BQUssVUFBVSxFQUFFO2dCQUNuQixpQkFBTyxDQUFDLFlBQVksQ0FDbEIsdUJBQXFCLGNBQWMsYUFBUSxNQUFJLE1BQUcsQ0FDbkQsQ0FBQzthQUNIO1lBRUQsS0FBSyxDQUFJLE9BQUssYUFBYSxTQUFJLGNBQWdCLENBQUM7aUJBQzdDLElBQUksQ0FBQyxrQkFBUSxJQUFJLGVBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBdEIsQ0FBc0IsQ0FBQztpQkFDeEMsSUFBSSxDQUFDLHFCQUFXO2dCQUNmLElBQU0sU0FBUyxHQUFpQixLQUFJLENBQUMsVUFBVSxDQUM3QyxXQUFXLEVBQ1gsV0FBVyxDQUFDLFVBQVUsRUFDdEIsTUFBSSxDQUNMLENBQUM7Z0JBRUYsSUFBSSxRQUFRLEdBQUcsS0FBSSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLElBQUksUUFBUSxJQUFJLEdBQUcsRUFBRTtvQkFDbkIsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDbkM7Z0JBRUQsUUFBUSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxJQUFJLFFBQVEsSUFBSSxHQUFHLEVBQUU7b0JBQ25CLFNBQVMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3BDO2dCQUNELFNBQVMsQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLFlBQVksRUFBRSxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBRTVELElBQUksS0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO29CQUN4QyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQUksQ0FBQyxDQUFDLENBQUM7aUJBQ3BEO2dCQUVELEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQUksRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFFeEMsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQixJQUFJLEtBQUksQ0FBQyxZQUFZLElBQUksS0FBSSxDQUFDLGVBQWUsRUFBRTtvQkFDN0MsS0FBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO29CQUduQyxLQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUVyQyxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDdkIsS0FBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBRXpCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdEIsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO29CQUNyQixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLGlCQUFFLENBQUMsQ0FBQztpQkFDaEM7WUFDSCxDQUFDLENBQUMsQ0FBQzs7O1FBbkRQLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQXhELENBQUM7U0FvRFQ7SUFDSCxDQUFDO0lBS00sa0NBQWMsR0FBckI7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFLTSxzQ0FBa0IsR0FBekI7UUFDRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFLTSwwQkFBTSxHQUFiO1FBQ0UsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUk7WUFBRSxPQUFPO1FBR2hDLElBQU0sUUFBUSxHQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxxQkFBTSxDQUFDLEtBQUssRUFBRSxxQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9ELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxjQUFjLENBQUMsMEJBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUtNLHdCQUFJLEdBQVgsVUFBWSxNQUFzQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ3ZCLE9BQU87U0FDUjtRQUdELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsYUFBYSxFQUFFO1lBQ3pDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFM0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV4QyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7SUF3RUgsZ0JBQUM7QUFBRCxDQUFDLENBanlCOEIsZUFBZSxHQWl5QjdDO0FBanlCWSw4QkFBUzs7Ozs7Ozs7Ozs7Ozs7O0FDekV0Qix3RkFBNEM7QUFPNUM7SUFTRSxvQkFDRSxDQUFTLEVBQ1QsQ0FBUyxFQUNULEtBQWEsRUFDYixNQUFjLEVBQ2QsU0FBdUI7UUFFdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ25DLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBRXpCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUU3QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUV4QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBS00sNEJBQU8sR0FBZDtRQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRWxCLGlCQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUVyQixpQkFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdEIsaUJBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBRTFCLGlCQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBS00sK0JBQVUsR0FBakI7UUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQU9NLDJCQUFNLEdBQWIsVUFBYyxTQUF1QjtRQUNuQyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1lBRXpCLE9BQU87U0FDUjtRQUdELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUVuQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckUsaUJBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsV0FBVyxHQUFHLGlCQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pELGlCQUFFLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRzdDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBRSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUdwRSxpQkFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFHdkM7Z0JBQ0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQztvQkFDL0IsR0FBRztvQkFDSCxHQUFHO29CQUNILEdBQUc7b0JBQ0gsR0FBRztvQkFDSCxHQUFHO29CQUNILEdBQUc7b0JBQ0gsR0FBRztvQkFDSCxHQUFHO2lCQUNKLENBQUMsQ0FBQztnQkFHSCxJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7YUFDcEM7WUFHRDtnQkFDRSxJQUFNLFFBQVEsR0FBRyxxQkFBTSxDQUFDLEtBQUssQ0FBQztnQkFDOUIsSUFBTSxTQUFTLEdBQUcscUJBQU0sQ0FBQyxNQUFNLENBQUM7Z0JBR2hDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxZQUFZLENBQUM7b0JBQ3JDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztvQkFDdEQsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO29CQUNyRCxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7b0JBQ3JELENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsU0FBUyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztvQkFDckQsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO29CQUNyRCxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7b0JBQ3ZELENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztvQkFDdEQsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO2lCQUN4RCxDQUFDLENBQUM7Z0JBR0gsSUFBSSxDQUFDLGFBQWEsR0FBRyxpQkFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQ3hDO1lBR0Q7Z0JBRUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFHdkQsSUFBSSxDQUFDLFlBQVksR0FBRyxpQkFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO2FBQ3ZDO1lBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7U0FDekI7UUFHRCxpQkFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsaUJBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxpQkFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRzlELGlCQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsaUJBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUduRSxpQkFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkQsaUJBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxpQkFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBR3BFLGlCQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsRUFBRSxpQkFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBR3pFLGlCQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFFLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzFELGlCQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFFLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxpQkFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRzFFLGlCQUFFLENBQUMsV0FBVyxDQUFDLGlCQUFFLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxpQkFBRSxDQUFDLFlBQVksQ0FDYixpQkFBRSxDQUFDLFNBQVMsRUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFDdkIsaUJBQUUsQ0FBQyxjQUFjLEVBQ2pCLENBQUMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQU9NLDBCQUFLLEdBQVosVUFBYSxNQUFjLEVBQUUsTUFBYztRQUVqQyx5Q0FBTSxDQUFZO1FBRzFCLElBQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFMUIsT0FBTyxDQUNMLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUk7WUFDekIsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUMxQixDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDckIsQ0FBQztJQUNKLENBQUM7SUFpQkgsaUJBQUM7QUFBRCxDQUFDO0FBMU1ZLGdDQUFVO0FBNE12QjtJQUFBO0lBS0EsQ0FBQztJQUFELFdBQUM7QUFBRCxDQUFDO0FBTFksb0JBQUk7Ozs7Ozs7Ozs7Ozs7OztBQ25OakIsbUhBQStFO0FBQy9FLElBQU8sYUFBYSxHQUFHLGlDQUFTLENBQUMsU0FBUyxDQUFDO0FBRTNDLHdGQUFvQztBQU1wQztJQUlFO1FBQ0UsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGFBQWEsRUFBZSxDQUFDO0lBQ3BELENBQUM7SUFLTSxvQ0FBTyxHQUFkO1FBQ0UsS0FDRSxJQUFJLEdBQUcsR0FBb0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFDakUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQ2xDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFDbEI7WUFDQSxpQkFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDaEM7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBU00scURBQXdCLEdBQS9CLFVBQ0UsUUFBZ0IsRUFDaEIsY0FBdUIsRUFDdkIsUUFBNEM7UUFIOUMsaUJBc0VDO2dDQS9ETyxHQUFHO1lBSVAsSUFDRSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxJQUFJLFFBQVE7Z0JBQzlCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLElBQUksY0FBYyxFQUN6QztnQkFJQSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQzVCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLGNBQVksZUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFuQixDQUFtQixDQUFDO2dCQUN2RCxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7O2FBRTlCOztRQWhCSCxLQUNFLElBQUksR0FBRyxHQUFvQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUNqRSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsRUFDbEMsR0FBRyxDQUFDLFlBQVksRUFBRTtrQ0FGZCxHQUFHOzs7U0FnQlI7UUFHRCxJQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxNQUFNLEdBQUc7WUFFWCxJQUFNLEdBQUcsR0FBaUIsaUJBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUc3QyxpQkFBRSxDQUFDLFdBQVcsQ0FBQyxpQkFBRSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUduQyxpQkFBRSxDQUFDLGFBQWEsQ0FDZCxpQkFBRSxDQUFDLFVBQVUsRUFDYixpQkFBRSxDQUFDLGtCQUFrQixFQUNyQixpQkFBRSxDQUFDLG9CQUFvQixDQUN4QixDQUFDO1lBQ0YsaUJBQUUsQ0FBQyxhQUFhLENBQUMsaUJBQUUsQ0FBQyxVQUFVLEVBQUUsaUJBQUUsQ0FBQyxrQkFBa0IsRUFBRSxpQkFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBR2xFLElBQUksY0FBYyxFQUFFO2dCQUNsQixpQkFBRSxDQUFDLFdBQVcsQ0FBQyxpQkFBRSxDQUFDLDhCQUE4QixFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3REO1lBR0QsaUJBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLGlCQUFFLENBQUMsSUFBSSxFQUFFLGlCQUFFLENBQUMsSUFBSSxFQUFFLGlCQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBR3pFLGlCQUFFLENBQUMsY0FBYyxDQUFDLGlCQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7WUFHakMsaUJBQUUsQ0FBQyxXQUFXLENBQUMsaUJBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFcEMsSUFBTSxXQUFXLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7WUFDbkQsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO2dCQUN2QixXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztnQkFDaEMsV0FBVyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUM5QixXQUFXLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ2hDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO2dCQUNyQixXQUFXLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztnQkFDdEIsV0FBVyxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUM7Z0JBQzNDLEtBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3RDO1lBRUQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQztRQUNGLEdBQUcsQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO0lBQ3JCLENBQUM7SUFPTSw0Q0FBZSxHQUF0QjtRQUNFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3QjtRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQVFNLG9EQUF1QixHQUE5QixVQUErQixPQUFxQjtRQUNsRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNqRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxPQUFPLEVBQUU7Z0JBQ3RDLFNBQVM7YUFDVjtZQUVELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNO1NBQ1A7SUFDSCxDQUFDO0lBUU0scURBQXdCLEdBQS9CLFVBQWdDLFFBQWdCO1FBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTTthQUNQO1NBQ0Y7SUFDSCxDQUFDO0lBR0gseUJBQUM7QUFBRCxDQUFDO0FBckpZLGdEQUFrQjtBQTBKL0I7SUFBQTtRQUVFLE9BQUUsR0FBaUIsSUFBSSxDQUFDO1FBQ3hCLFVBQUssR0FBRyxDQUFDLENBQUM7UUFDVixXQUFNLEdBQUcsQ0FBQyxDQUFDO0lBR2IsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQztBQVBZLGtDQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkt4QixrSUFBeUY7QUFDekYsd0lBQTZGO0FBQzdGLElBQU8sb0JBQW9CLEdBQUcsd0NBQWdCLENBQUMsZ0JBQWdCLENBQUM7QUFDaEUsSUFBTyxrQkFBa0IsR0FBRyxzQ0FBYyxDQUFDLGNBQWMsQ0FBQztBQUMxRCx3RkFBOEM7QUFDOUMsdUdBQXdEO0FBQ3hELHdGQUEwRDtBQUMxRCxrRkFBMEM7QUFFMUMseUVBQW9DO0FBQ3BDLDhGQUEyQztBQUszQztJQUlFO1FBQ0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFHbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztRQUd4QyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztRQUdoRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBS00sNkJBQVUsR0FBakI7UUFDVSx1Q0FBSyxFQUFFLHFDQUFNLENBQVk7UUFFakMsSUFBTSxLQUFLLEdBQVcsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNyQyxJQUFNLElBQUksR0FBVyxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQ2hELElBQU0sS0FBSyxHQUFXLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNsRCxJQUFNLE1BQU0sR0FBVyxDQUFDLEtBQUssQ0FBQztRQUM5QixJQUFNLEdBQUcsR0FBVyxLQUFLLENBQUM7UUFFMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFekQsSUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztRQUdwRSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBR3RELElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQy9CLFVBQVUsQ0FBQyxrQkFBa0IsRUFDN0IsVUFBVSxDQUFDLG1CQUFtQixFQUM5QixVQUFVLENBQUMsb0JBQW9CLEVBQy9CLFVBQVUsQ0FBQyxpQkFBaUIsQ0FDN0IsQ0FBQztJQUNKLENBQUM7SUFLTSwwQkFBTyxHQUFkO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFFNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUVsQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRWxCLGlCQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBS00seUJBQU0sR0FBYjtRQUNFLGlCQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUvQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEM7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEM7UUFFRCxpQkFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRVgsSUFBTSxhQUFhLEdBQXNCLHFDQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRXpFLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBS00sbUNBQWdCLEdBQXZCO1FBQUEsaUJBZ0RDO1FBL0NDLElBQU0sS0FBSyxHQUFXLHFCQUFNLENBQUMsS0FBSyxDQUFDO1FBQ25DLElBQU0sTUFBTSxHQUFXLHFCQUFNLENBQUMsTUFBTSxDQUFDO1FBRXJDLElBQU0sY0FBYyxHQUFHLDJCQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN0RSxJQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBRS9DLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUduQixTQUFTLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUdyQyxJQUFNLHFCQUFxQixHQUFHLFVBQUMsV0FBd0I7WUFDckQsSUFBTSxDQUFDLEdBQVcsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUM5QixJQUFNLENBQUMsR0FBVyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBRS9CLElBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ3ZDLElBQU0sT0FBTyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDOUIsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLHVCQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDLENBQUM7UUFFRixjQUFjLENBQUMsd0JBQXdCLENBQ3JDLGFBQWEsR0FBRyxTQUFTLEVBQ3pCLEtBQUssRUFDTCxxQkFBcUIsQ0FDdEIsQ0FBQztRQUdGLFNBQVMsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQ3JDLElBQU0sZUFBZSxHQUFHLFVBQUMsV0FBd0I7WUFDL0MsSUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQzFDLElBQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUM1QyxJQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ2pDLElBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7WUFDbkMsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLHVCQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDLENBQUM7UUFFRixjQUFjLENBQUMsd0JBQXdCLENBQ3JDLGFBQWEsR0FBRyxTQUFTLEVBQ3pCLEtBQUssRUFDTCxlQUFlLENBQ2hCLENBQUM7UUFHRixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFO1lBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsMkJBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUM3RDtJQUNILENBQUM7SUFRTSxpQ0FBYyxHQUFyQixVQUFzQixNQUFjLEVBQUUsTUFBYztRQUNsRCxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQVFNLGlDQUFjLEdBQXJCLFVBQXNCLE1BQWMsRUFBRSxNQUFjO1FBQ2xELElBQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLElBQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRXJFLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVoRCxJQUFNLGFBQWEsR0FBc0IscUNBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDekUsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQVFNLGlDQUFjLEdBQXJCLFVBQXNCLE1BQWMsRUFBRSxNQUFjO1FBRWxELElBQU0sYUFBYSxHQUFzQixxQ0FBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6RSxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUUvQjtZQUVFLElBQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUMxQixDQUFDO1lBQ0YsSUFBTSxDQUFDLEdBQVcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQzFCLENBQUM7WUFFRixJQUFJLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDbEMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsMEJBQXdCLENBQUMsWUFBTyxDQUFHLENBQUMsQ0FBQzthQUMzRDtZQUNELGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRzFCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUNwQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDM0I7U0FDRjtJQUNILENBQUM7SUFPTSxpQ0FBYyxHQUFyQixVQUFzQixPQUFlO1FBQ25DLElBQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBT00saUNBQWMsR0FBckIsVUFBc0IsT0FBZTtRQUNuQyxJQUFNLE9BQU8sR0FBVyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQU1NLG1DQUFnQixHQUF2QixVQUF3QixPQUFlO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQU9NLG1DQUFnQixHQUF2QixVQUF3QixPQUFlO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQVVILGVBQUM7QUFBRCxDQUFDO0FBcFBZLDRCQUFROzs7Ozs7Ozs7Ozs7Ozs7QUNmckIsd0ZBQThDO0FBSzlDLE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFFZCxJQUFJLDJCQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO1FBQ3BELE9BQU87S0FDUjtJQUVELDJCQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkMsQ0FBQyxDQUFDO0FBS0YsTUFBTSxDQUFDLGNBQWMsR0FBRyxjQUFZLGtDQUFZLENBQUMsZUFBZSxFQUFFLEVBQTlCLENBQThCLENBQUMiLCJmaWxlIjoibWFpbi5mZmFhYzEyZGZmNmU1ZDIzZDY3NC5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHtcbiAgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGxpdmUyZGN1YmlzbWZyYW1ld29yayxcbiAgT3B0aW9uIGFzIENzbV9PcHRpb24sXG59IGZyb20gXCJAZnJhbWV3b3JrL2xpdmUyZGN1YmlzbWZyYW1ld29ya1wiO1xuaW1wb3J0IENzbV9DdWJpc21GcmFtZXdvcmsgPSBsaXZlMmRjdWJpc21mcmFtZXdvcmsuQ3ViaXNtRnJhbWV3b3JrO1xuaW1wb3J0IHsgTEFwcFZpZXcgfSBmcm9tIFwiLi9sYXBwdmlld1wiO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gXCIuL2xhcHBwYWxcIjtcbmltcG9ydCB7IExBcHBUZXh0dXJlTWFuYWdlciB9IGZyb20gXCIuL2xhcHB0ZXh0dXJlbWFuYWdlclwiO1xuaW1wb3J0IHsgTEFwcExpdmUyRE1hbmFnZXIgfSBmcm9tIFwiLi9sYXBwbGl2ZTJkbWFuYWdlclwiO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tIFwiLi9sYXBwZGVmaW5lXCI7XG5cbmV4cG9ydCBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IG51bGw7XG5leHBvcnQgbGV0IHNfaW5zdGFuY2U6IExBcHBEZWxlZ2F0ZSA9IG51bGw7XG5leHBvcnQgbGV0IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuZXhwb3J0IGxldCBmcmFtZUJ1ZmZlcjogV2ViR0xGcmFtZWJ1ZmZlciA9IG51bGw7XG5leHBvcnQgbGV0IHdpbjogYW55ID13aW5kb3c7XG5cbi8qKlxuICog44Ki44OX44Oq44Kx44O844K344On44Oz44Kv44Op44K544CCXG4gKiBDdWJpc20gU0RL44Gu566h55CG44KS6KGM44GG44CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwRGVsZWdhdGUge1xuICBfY3ViaXNtT3B0aW9uOiBDc21fT3B0aW9uOyAvLyBDdWJpc20gU0RLIE9wdGlvblxuICBfdmlldzogTEFwcFZpZXc7IC8vIFZpZXfmg4XloLFcbiAgX2NhcHR1cmVkOiBib29sZWFuOyAvLyDjgq/jg6rjg4Pjgq/jgZfjgabjgYTjgovjgYtcbiAgX21vdXNlWDogbnVtYmVyOyAvLyDjg57jgqbjgrlY5bqn5qiZXG4gIF9tb3VzZVk6IG51bWJlcjsgLy8g44Oe44Km44K5WeW6p+aomVxuICBfaXNFbmQ6IGJvb2xlYW47IC8vIEFQUOe1guS6huOBl+OBpuOBhOOCi+OBi1xuICBfdGV4dHVyZU1hbmFnZXI6IExBcHBUZXh0dXJlTWFuYWdlcjsgLy8g44OG44Kv44K544OB44Oj44Oe44ON44O844K444Oj44O8XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FwdHVyZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9tb3VzZVggPSAwLjA7XG4gICAgdGhpcy5fbW91c2VZID0gMC4wO1xuICAgIHRoaXMuX2lzRW5kID0gZmFsc2U7XG5cbiAgICB0aGlzLl9jdWJpc21PcHRpb24gPSBuZXcgQ3NtX09wdGlvbigpO1xuICAgIHRoaXMuX3ZpZXcgPSBuZXcgTEFwcFZpZXcoKTtcbiAgICB0aGlzLl90ZXh0dXJlTWFuYWdlciA9IG5ldyBMQXBwVGV4dHVyZU1hbmFnZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrnvvIjjgrfjg7PjgrDjg6vjg4jjg7PvvInjgpLov5TjgZnjgIJcbiAgICog44Kk44Oz44K544K/44Oz44K544GM55Sf5oiQ44GV44KM44Gm44GE44Gq44GE5aC05ZCI44Gv5YaF6YOo44Gn44Kk44Oz44K544K/44Oz44K544KS55Sf5oiQ44GZ44KL44CCXG4gICAqXG4gICAqIEByZXR1cm4g44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IExBcHBEZWxlZ2F0ZSB7XG4gICAgaWYgKHNfaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgc19pbnN0YW5jZSA9IG5ldyBMQXBwRGVsZWdhdGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc19pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrnvvIjjgrfjg7PjgrDjg6vjg4jjg7PvvInjgpLop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVsZWFzZUluc3RhbmNlKCk6IHZvaWQge1xuICAgIGlmIChzX2luc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UucmVsZWFzZSgpO1xuICAgIH1cblxuICAgIHNfaW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQUOOBq+W/heimgeOBqueJqeOCkuWIneacn+WMluOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemUoKTogYm9vbGVhbiB7XG4gICAgLy8g44Kt44Oj44Oz44OQ44K544Gu5L2c5oiQXG4gICAgY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuXG4gICAgLy8gZ2zjgrPjg7Pjg4bjgq3jgrnjg4jjgpLliJ3mnJ/ljJZcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dChcIndlYmdsXCIpIHx8IGNhbnZhcy5nZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpO1xuXG4gICAgaWYgKCFnbCkge1xuICAgICAgYWxlcnQoXCJDYW5ub3QgaW5pdGlhbGl6ZSBXZWJHTC4gVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQuXCIpO1xuICAgICAgZ2wgPSBudWxsO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9XG4gICAgICAgIFwiVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlIDxjb2RlPiZsdDtjYW52YXMmZ3Q7PC9jb2RlPiBlbGVtZW50LlwiO1xuXG4gICAgICAvLyBnbOWIneacn+WMluWkseaVl1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghZnJhbWVCdWZmZXIpIHtcbiAgICAgIGZyYW1lQnVmZmVyID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLkZSQU1FQlVGRkVSX0JJTkRJTkcpO1xuICAgIH1cblxuICAgIC8vIOmAj+mBjuioreWumlxuICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgZ2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cbiAgICBjb25zdCBzdXBwb3J0VG91Y2g6IGJvb2xlYW4gPSBcIm9udG91Y2hlbmRcIiBpbiBjYW52YXM7XG5cbiAgICBpZiAoc3VwcG9ydFRvdWNoKSB7XG4gICAgICAvLyDjgr/jg4Pjg4HplqLpgKPjgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbDnmbvpjLJcbiAgICAgIGNhbnZhcy5vbnRvdWNoc3RhcnQgPSBvblRvdWNoQmVnYW47XG4gICAgICBjYW52YXMub250b3VjaG1vdmUgPSBvblRvdWNoTW92ZWQ7XG4gICAgICBjYW52YXMub250b3VjaGVuZCA9IG9uVG91Y2hFbmRlZDtcbiAgICAgIGNhbnZhcy5vbnRvdWNoY2FuY2VsID0gb25Ub3VjaENhbmNlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g44Oe44Km44K56Zai6YCj44Kz44O844Or44OQ44OD44Kv6Zai5pWw55m76YyyXG4gICAgICBjYW52YXMub25tb3VzZWRvd24gPSBvbkNsaWNrQmVnYW47XG4gICAgICB3aW5kb3cub25tb3VzZW1vdmUgPSBvbk1vdXNlTW92ZWQ7XG4gICAgICBjYW52YXMub25tb3VzZXVwID0gb25DbGlja0VuZGVkO1xuICAgIH1cblxuICAgIHdpbi5pbml0RGVmaW5lKCcuXFxcXFNhbXBsZXNcXFxcUmVzb3VyY2VzXFxcXCcpO1xuICAgIC8vIEFwcFZpZXfjga7liJ3mnJ/ljJZcbiAgICB0aGlzLl92aWV3LmluaXRpYWxpemUoKTtcblxuICAgIC8vIEN1YmlzbSBTREvjga7liJ3mnJ/ljJZcbiAgICB0aGlzLmluaXRpYWxpemVDdWJpc20oKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIOino+aUvuOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fdGV4dHVyZU1hbmFnZXIucmVsZWFzZSgpO1xuICAgIHRoaXMuX3RleHR1cmVNYW5hZ2VyID0gbnVsbDtcblxuICAgIHRoaXMuX3ZpZXcucmVsZWFzZSgpO1xuICAgIHRoaXMuX3ZpZXcgPSBudWxsO1xuXG4gICAgLy8g44Oq44K944O844K544KS6Kej5pS+XG4gICAgTEFwcExpdmUyRE1hbmFnZXIucmVsZWFzZUluc3RhbmNlKCk7XG5cbiAgICAvLyBDdWJpc20gU0RL44Gu6Kej5pS+XG4gICAgQ3NtX0N1YmlzbUZyYW1ld29yay5kaXNwb3NlKCk7XG4gIH1cblxuICAvKipcbiAgICog5a6f6KGM5Yem55CG44CCXG4gICAqL1xuICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgIC8vIOODoeOCpOODs+ODq+ODvOODl1xuICAgIGNvbnN0IGxvb3AgPSAoKTogdm9pZCA9PiB7XG4gICAgICAvLyDjgqTjg7Pjgrnjgr/jg7Pjgrnjga7mnInnhKHjga7norroqo1cbiAgICAgIGlmIChzX2luc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyDmmYLplpPmm7TmlrBcbiAgICAgIExBcHBQYWwudXBkYXRlVGltZSgpO1xuXG4gICAgICAvLyDnlLvpnaLjga7liJ3mnJ/ljJZcbiAgICAgIGdsLmNsZWFyQ29sb3IoMC4wLCAwLjAsIDAuMCwgMC4wKTtcblxuICAgICAgLy8g5rex5bqm44OG44K544OI44KS5pyJ5Yq55YyWXG4gICAgICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XG5cbiAgICAgIC8vIOi/keOBj+OBq+OBguOCi+eJqeS9k+OBr+OAgemBoOOBj+OBq+OBguOCi+eJqeS9k+OCkuimhuOBhOmaoOOBmVxuICAgICAgZ2wuZGVwdGhGdW5jKGdsLkxFUVVBTCk7XG5cbiAgICAgIC8vIOOCq+ODqeODvOODkOODg+ODleOCoeOChOa3seW6puODkOODg+ODleOCoeOCkuOCr+ODquOCouOBmeOCi1xuICAgICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG4gICAgICBnbC5jbGVhckRlcHRoKDEuMCk7XG5cbiAgICAgIC8vIOmAj+mBjuioreWumlxuICAgICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcbiAgICAgIGdsLmJsZW5kRnVuYyhnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xuXG4gICAgICAvLyDmj4/nlLvmm7TmlrBcbiAgICAgIHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cbiAgICAgIC8vIOODq+ODvOODl+OBruOBn+OCgeOBq+WGjeW4sOWRvOOBs+WHuuOBl1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH07XG4gICAgbG9vcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOOCt+OCp+ODvOODgOODvOOCkueZu+mMsuOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVNoYWRlcigpOiBXZWJHTFByb2dyYW0ge1xuICAgIC8vIOODkOODvOODhuODg+OCr+OCueOCt+OCp+ODvOODgOODvOOBruOCs+ODs+ODkeOCpOODq1xuICAgIGNvbnN0IHZlcnRleFNoYWRlcklkID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuXG4gICAgaWYgKHZlcnRleFNoYWRlcklkID09IG51bGwpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFwiZmFpbGVkIHRvIGNyZWF0ZSB2ZXJ0ZXhTaGFkZXJcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXI6IHN0cmluZyA9XG4gICAgICBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiICtcbiAgICAgIFwiYXR0cmlidXRlIHZlYzMgcG9zaXRpb247XCIgK1xuICAgICAgXCJhdHRyaWJ1dGUgdmVjMiB1djtcIiArXG4gICAgICBcInZhcnlpbmcgdmVjMiB2dXY7XCIgK1xuICAgICAgXCJ2b2lkIG1haW4odm9pZClcIiArXG4gICAgICBcIntcIiArXG4gICAgICBcIiAgIGdsX1Bvc2l0aW9uID0gdmVjNChwb3NpdGlvbiwgMS4wKTtcIiArXG4gICAgICBcIiAgIHZ1diA9IHV2O1wiICtcbiAgICAgIFwifVwiO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlcklkLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVySWQpO1xuXG4gICAgLy8g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44Kz44Oz44OR44Kk44OrXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXJJZCA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xuXG4gICAgaWYgKGZyYWdtZW50U2hhZGVySWQgPT0gbnVsbCkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXCJmYWlsZWQgdG8gY3JlYXRlIGZyYWdtZW50U2hhZGVyXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXI6IHN0cmluZyA9XG4gICAgICBcInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1wiICtcbiAgICAgIFwidmFyeWluZyB2ZWMyIHZ1djtcIiArXG4gICAgICBcInVuaWZvcm0gc2FtcGxlcjJEIHRleHR1cmU7XCIgK1xuICAgICAgXCJ2b2lkIG1haW4odm9pZClcIiArXG4gICAgICBcIntcIiArXG4gICAgICBcIiAgIGdsX0ZyYWdDb2xvciA9IHRleHR1cmUyRCh0ZXh0dXJlLCB2dXYpO1wiICtcbiAgICAgIFwifVwiO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKGZyYWdtZW50U2hhZGVySWQsIGZyYWdtZW50U2hhZGVyKTtcbiAgICBnbC5jb21waWxlU2hhZGVyKGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgLy8g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44Gu5L2c5oiQXG4gICAgY29uc3QgcHJvZ3JhbUlkID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtSWQsIHZlcnRleFNoYWRlcklkKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbUlkLCBmcmFnbWVudFNoYWRlcklkKTtcblxuICAgIGdsLmRlbGV0ZVNoYWRlcih2ZXJ0ZXhTaGFkZXJJZCk7XG4gICAgZ2wuZGVsZXRlU2hhZGVyKGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgLy8g44Oq44Oz44KvXG4gICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbUlkKTtcblxuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbUlkKTtcblxuICAgIHJldHVybiBwcm9ncmFtSWQ7XG4gIH1cblxuICAvKipcbiAgICogVmlld+aDheWgseOCkuWPluW+l+OBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIGdldFZpZXcoKTogTEFwcFZpZXcge1xuICAgIHJldHVybiB0aGlzLl92aWV3O1xuICB9XG5cbiAgcHVibGljIGdldFRleHR1cmVNYW5hZ2VyKCk6IExBcHBUZXh0dXJlTWFuYWdlciB7XG4gICAgcmV0dXJuIHRoaXMuX3RleHR1cmVNYW5hZ2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIEN1YmlzbSBTREvjga7liJ3mnJ/ljJZcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplQ3ViaXNtKCk6IHZvaWQge1xuICAgIC8vIHNldHVwIGN1YmlzbVxuICAgIHRoaXMuX2N1YmlzbU9wdGlvbi5sb2dGdW5jdGlvbiA9IExBcHBQYWwucHJpbnRNZXNzYWdlO1xuICAgIHRoaXMuX2N1YmlzbU9wdGlvbi5sb2dnaW5nTGV2ZWwgPSBMQXBwRGVmaW5lLkN1YmlzbUxvZ2dpbmdMZXZlbDtcbiAgICBDc21fQ3ViaXNtRnJhbWV3b3JrLnN0YXJ0VXAodGhpcy5fY3ViaXNtT3B0aW9uKTtcblxuICAgIC8vIGluaXRpYWxpemUgY3ViaXNtXG4gICAgQ3NtX0N1YmlzbUZyYW1ld29yay5pbml0aWFsaXplKCk7XG5cbiAgICAvLyBsb2FkIG1vZGVsXG4gICAgTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuICAgIExBcHBQYWwudXBkYXRlVGltZSgpO1xuXG4gICAgdGhpcy5fdmlldy5pbml0aWFsaXplU3ByaXRlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiDjgq/jg6rjg4Pjgq/jgZfjgZ/jgajjgY3jgavlkbzjgbDjgozjgovjgIJcbiAqL1xuZnVuY3Rpb24gb25DbGlja0JlZ2FuKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFwidmlldyBub3Rmb3VuZFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gdHJ1ZTtcblxuICBjb25zdCBwb3NYOiBudW1iZXIgPSBlLnBhZ2VYO1xuICBjb25zdCBwb3NZOiBudW1iZXIgPSBlLnBhZ2VZO1xuICBcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzQmVnYW4ocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICog44Oe44Km44K544Od44Kk44Oz44K/44GM5YuV44GE44Gf44KJ5ZG844Gw44KM44KL44CCXG4gKi9cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlZChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gIC8v54K55Ye75bem6ZSu5omN6Kem5Y+RXG4gIC8vIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkKSB7XG4gIC8vICAgcmV0dXJuO1xuICAvLyB9XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFwidmlldyBub3Rmb3VuZFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgXG4gIGNvbnN0IHJlY3QgPSAoZS50YXJnZXQgYXMgRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHBvc1g6IG51bWJlciA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWTogbnVtYmVyID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG4gIFxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNNb3ZlZChwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiDjgq/jg6rjg4Pjgq/jgYzntYLkuobjgZfjgZ/jgonlkbzjgbDjgozjgovjgIJcbiAqL1xuZnVuY3Rpb24gb25DbGlja0VuZGVkKGU6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gZmFsc2U7XG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZShcInZpZXcgbm90Zm91bmRcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVjdCA9IChlLnRhcmdldCBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgcG9zWDogbnVtYmVyID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZOiBudW1iZXIgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNFbmRlZChwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiDjgr/jg4Pjg4HjgZfjgZ/jgajjgY3jgavlkbzjgbDjgozjgovjgIJcbiAqL1xuZnVuY3Rpb24gb25Ub3VjaEJlZ2FuKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFwidmlldyBub3Rmb3VuZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSB0cnVlO1xuXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNCZWdhbihwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiDjgrnjg6/jgqTjg5fjgZnjgovjgajlkbzjgbDjgozjgovjgIJcbiAqL1xuZnVuY3Rpb24gb25Ub3VjaE1vdmVkKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgLy/ngrnlh7vmiY3op6blj5FcbiAgLy8gaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQpIHtcbiAgLy8gICByZXR1cm47XG4gIC8vIH1cblxuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXCJ2aWV3IG5vdGZvdW5kXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlY3QgPSAoZS50YXJnZXQgYXMgRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgY29uc3QgcG9zWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc01vdmVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIOOCv+ODg+ODgeOBjOe1guS6huOBl+OBn+OCieWRvOOBsOOCjOOCi+OAglxuICovXG5mdW5jdGlvbiBvblRvdWNoRW5kZWQoZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSBmYWxzZTtcblxuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXCJ2aWV3IG5vdGZvdW5kXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlY3QgPSAoZS50YXJnZXQgYXMgRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgY29uc3QgcG9zWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0VuZGVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIOOCv+ODg+ODgeOBjOOCreODo+ODs+OCu+ODq+OBleOCjOOCi+OBqOWRvOOBsOOCjOOCi+OAglxuICovXG5mdW5jdGlvbiBvblRvdWNoQ2FuY2VsKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gZmFsc2U7XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFwidmlldyBub3Rmb3VuZFwiKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWN0ID0gKGUudGFyZ2V0IGFzIEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1kgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNFbmRlZChwb3NYLCBwb3NZKTtcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tYXRyaXg0NCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtdmVjdG9yIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXZlY3Rvcic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgYWN1YmlzbW1vdGlvbiB9IGZyb20gJ0BmcmFtZXdvcmsvbW90aW9uL2FjdWJpc21tb3Rpb24nO1xuaW1wb3J0IENzbV9jc21WZWN0b3IgPSBjc212ZWN0b3IuY3NtVmVjdG9yO1xuaW1wb3J0IENzbV9DdWJpc21NYXRyaXg0NCA9IGN1YmlzbW1hdHJpeDQ0LkN1YmlzbU1hdHJpeDQ0O1xuaW1wb3J0IEFDdWJpc21Nb3Rpb24gPSBhY3ViaXNtbW90aW9uLkFDdWJpc21Nb3Rpb247XG5cbmltcG9ydCB7IExBcHBNb2RlbCB9IGZyb20gJy4vbGFwcG1vZGVsJztcbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuXG5leHBvcnQgbGV0IHNfaW5zdGFuY2U6IExBcHBMaXZlMkRNYW5hZ2VyID0gbnVsbDtcblxuLyoqXG4gKiDjgrXjg7Pjg5fjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7PjgavjgYrjgYTjgaZDdWJpc21Nb2RlbOOCkueuoeeQhuOBmeOCi+OCr+ODqeOCuVxuICog44Oi44OH44Or55Sf5oiQ44Go56C05qOE44CB44K/44OD44OX44Kk44OZ44Oz44OI44Gu5Yem55CG44CB44Oi44OH44Or5YiH44KK5pu/44GI44KS6KGM44GG44CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwTGl2ZTJETWFuYWdlciB7XG4gIC8qKlxuICAgKiDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrnvvIjjgrfjg7PjgrDjg6vjg4jjg7PvvInjgpLov5TjgZnjgIJcbiAgICog44Kk44Oz44K544K/44Oz44K544GM55Sf5oiQ44GV44KM44Gm44GE44Gq44GE5aC05ZCI44Gv5YaF6YOo44Gn44Kk44Oz44K544K/44Oz44K544KS55Sf5oiQ44GZ44KL44CCXG4gICAqXG4gICAqIEByZXR1cm4g44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IExBcHBMaXZlMkRNYW5hZ2VyIHtcbiAgICBpZiAoc19pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICBzX2luc3RhbmNlID0gbmV3IExBcHBMaXZlMkRNYW5hZ2VyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNfaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICog44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K577yI44K344Oz44Kw44Or44OI44Oz77yJ44KS6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlbGVhc2VJbnN0YW5jZSgpOiB2b2lkIHtcbiAgICBpZiAoc19pbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICBzX2luc3RhbmNlID0gdm9pZCAwO1xuICAgIH1cblxuICAgIHNfaW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOePvuWcqOOBruOCt+ODvOODs+OBp+S/neaMgeOBl+OBpuOBhOOCi+ODouODh+ODq+OCkui/lOOBmeOAglxuICAgKlxuICAgKiBAcGFyYW0gbm8g44Oi44OH44Or44Oq44K544OI44Gu44Kk44Oz44OH44OD44Kv44K55YCkXG4gICAqIEByZXR1cm4g44Oi44OH44Or44Gu44Kk44Oz44K544K/44Oz44K544KS6L+U44GZ44CC44Kk44Oz44OH44OD44Kv44K55YCk44GM56+E5Zuy5aSW44Gu5aC05ZCI44GvTlVMTOOCkui/lOOBmeOAglxuICAgKi9cbiAgcHVibGljIGdldE1vZGVsKG5vOiBudW1iZXIpOiBMQXBwTW9kZWwge1xuICAgIGlmIChubyA8IHRoaXMuX21vZGVscy5nZXRTaXplKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbHMuYXQobm8pO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOePvuWcqOOBruOCt+ODvOODs+OBp+S/neaMgeOBl+OBpuOBhOOCi+OBmeOBueOBpuOBruODouODh+ODq+OCkuino+aUvuOBmeOCi1xuICAgKi9cbiAgcHVibGljIHJlbGVhc2VBbGxNb2RlbCgpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21vZGVscy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgdGhpcy5fbW9kZWxzLmF0KGkpLnJlbGVhc2UoKTtcbiAgICAgIHRoaXMuX21vZGVscy5zZXQoaSwgbnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbW9kZWxzLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICog55S76Z2i44KS44OJ44Op44OD44Kw44GX44Gf5pmC44Gu5Yem55CGXG4gICAqXG4gICAqIEBwYXJhbSB4IOeUu+mdouOBrljluqfmqJlcbiAgICogQHBhcmFtIHkg55S76Z2i44GuWeW6p+aomVxuICAgKi9cbiAgcHVibGljIG9uRHJhZyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZWxzLmdldFNpemUoKTsgaSsrKSB7XG4gICAgICBjb25zdCBtb2RlbDogTEFwcE1vZGVsID0gdGhpcy5nZXRNb2RlbChpKTtcblxuICAgICAgaWYgKG1vZGVsKSB7XG4gICAgICAgIG1vZGVsLnNldERyYWdnaW5nKHgsIHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvpnaLjgpLjgr/jg4Pjg5fjgZfjgZ/mmYLjga7lh6bnkIZcbiAgICpcbiAgICogQHBhcmFtIHgg55S76Z2i44GuWOW6p+aomVxuICAgKiBAcGFyYW0geSDnlLvpnaLjga5Z5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25UYXAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXG4gICAgICAgIGBbQVBQXXRhcCBwb2ludDoge3g6ICR7eC50b0ZpeGVkKDIpfSB5OiAke3kudG9GaXhlZCgyKX19YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21vZGVscy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX21vZGVscy5hdChpKS5oaXRUZXN0KExBcHBEZWZpbmUuSGl0QXJlYU5hbWVIZWFkLCB4LCB5KSkge1xuICAgICAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFxuICAgICAgICAgICAgYFtBUFBdaGl0IGFyZWE6IFske0xBcHBEZWZpbmUuSGl0QXJlYU5hbWVIZWFkfV1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tb2RlbHMuYXQoaSkuc2V0UmFuZG9tRXhwcmVzc2lvbigpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbHMuYXQoaSkuaGl0VGVzdChMQXBwRGVmaW5lLkhpdEFyZWFOYW1lQm9keSwgeCwgeSkpIHtcbiAgICAgICAgaWYgKExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUpIHtcbiAgICAgICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShcbiAgICAgICAgICAgIGBbQVBQXWhpdCBhcmVhOiBbJHtMQXBwRGVmaW5lLkhpdEFyZWFOYW1lQm9keX1dYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbW9kZWxzXG4gICAgICAgICAgLmF0KGkpXG4gICAgICAgICAgLnN0YXJ0UmFuZG9tTW90aW9uKFxuICAgICAgICAgICAgTEFwcERlZmluZS5Nb3Rpb25Hcm91cFRhcEJvZHksXG4gICAgICAgICAgICBMQXBwRGVmaW5lLlByaW9yaXR5Tm9ybWFsLFxuICAgICAgICAgICAgdGhpcy5fZmluaXNoZWRNb3Rpb25cbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvpnaLjgpLmm7TmlrDjgZnjgovjgajjgY3jga7lh6bnkIZcbiAgICog44Oi44OH44Or44Gu5pu05paw5Yem55CG5Y+K44Gz5o+P55S75Yem55CG44KS6KGM44GGXG4gICAqL1xuICBwdWJsaWMgb25VcGRhdGUoKTogdm9pZCB7XG4gICAgbGV0IHByb2plY3Rpb246IENzbV9DdWJpc21NYXRyaXg0NCA9IG5ldyBDc21fQ3ViaXNtTWF0cml4NDQoKTtcblxuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY2FudmFzO1xuICAgIHByb2plY3Rpb24uc2NhbGUoMS4wLCB3aWR0aCAvIGhlaWdodCk7XG5cbiAgICBpZiAodGhpcy5fdmlld01hdHJpeCAhPSBudWxsKSB7XG4gICAgICBwcm9qZWN0aW9uLm11bHRpcGx5QnlNYXRyaXgodGhpcy5fdmlld01hdHJpeCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2F2ZVByb2plY3Rpb246IENzbV9DdWJpc21NYXRyaXg0NCA9IHByb2plY3Rpb24uY2xvbmUoKTtcbiAgICBjb25zdCBtb2RlbENvdW50OiBudW1iZXIgPSB0aGlzLl9tb2RlbHMuZ2V0U2l6ZSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RlbENvdW50OyArK2kpIHtcbiAgICAgIGNvbnN0IG1vZGVsOiBMQXBwTW9kZWwgPSB0aGlzLmdldE1vZGVsKGkpO1xuICAgICAgcHJvamVjdGlvbiA9IHNhdmVQcm9qZWN0aW9uLmNsb25lKCk7XG5cbiAgICAgIG1vZGVsLnVwZGF0ZSgpO1xuICAgICAgbW9kZWwuZHJhdyhwcm9qZWN0aW9uKTsgLy8g5Y+C54Wn5rih44GX44Gq44Gu44GncHJvamVjdGlvbuOBr+WkieizquOBmeOCi+OAglxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDmrKHjga7jgrfjg7zjg7PjgavliIfjgorjgYvjgYjjgotcbiAgICog44K144Oz44OX44Or44Ki44OX44Oq44Kx44O844K344On44Oz44Gn44Gv44Oi44OH44Or44K744OD44OI44Gu5YiH44KK5pu/44GI44KS6KGM44GG44CCXG4gICAqL1xuICBwdWJsaWMgbmV4dFNjZW5lKCk6IHZvaWQge1xuICAgIGNvbnN0IG5vOiBudW1iZXIgPSAodGhpcy5fc2NlbmVJbmRleCArIDEpICUgTEFwcERlZmluZS5Nb2RlbERpclNpemU7XG4gICAgdGhpcy5jaGFuZ2VTY2VuZShubyk7XG4gIH1cblxuICAvKipcbiAgICog44K344O844Oz44KS5YiH44KK5pu/44GI44KLXG4gICAqIOOCteODs+ODl+ODq+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBp+OBr+ODouODh+ODq+OCu+ODg+ODiOOBruWIh+OCiuabv+OBiOOCkuihjOOBhuOAglxuICAgKi9cbiAgcHVibGljIGNoYW5nZVNjZW5lKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9zY2VuZUluZGV4ID0gaW5kZXg7XG4gICAgaWYgKExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbQVBQXW1vZGVsIGluZGV4OiAke3RoaXMuX3NjZW5lSW5kZXh9YCk7XG4gICAgfVxuXG4gICAgLy8gTW9kZWxEaXJbXeOBq+S/neaMgeOBl+OBn+ODh+OCo+ODrOOCr+ODiOODquWQjeOBi+OCiVxuICAgIC8vIG1vZGVsMy5qc29u44Gu44OR44K544KS5rG65a6a44GZ44KL44CCXG4gICAgLy8g44OH44Kj44Os44Kv44OI44Oq5ZCN44GobW9kZWwzLmpzb27jga7lkI3liY3jgpLkuIDoh7TjgZXjgZvjgabjgYrjgY/jgZPjgajjgIJcbiAgICBjb25zdCBtb2RlbDogc3RyaW5nID0gTEFwcERlZmluZS5Nb2RlbERpcltpbmRleF07XG4gICAgY29uc3QgbW9kZWxQYXRoOiBzdHJpbmcgPSBMQXBwRGVmaW5lLlJlc291cmNlc1BhdGggKyBtb2RlbCArICcvJztcbiAgICBsZXQgbW9kZWxKc29uTmFtZTogc3RyaW5nID0gTEFwcERlZmluZS5Nb2RlbERpcltpbmRleF07XG4gICAgbW9kZWxKc29uTmFtZSArPSAnLm1vZGVsMy5qc29uJztcblxuICAgIHRoaXMucmVsZWFzZUFsbE1vZGVsKCk7XG4gICAgdGhpcy5fbW9kZWxzLnB1c2hCYWNrKG5ldyBMQXBwTW9kZWwoKSk7XG4gICAgdGhpcy5fbW9kZWxzLmF0KDApLmxvYWRBc3NldHMobW9kZWxQYXRoLCBtb2RlbEpzb25OYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBuZXcgQ3NtX0N1YmlzbU1hdHJpeDQ0KCk7XG4gICAgdGhpcy5fbW9kZWxzID0gbmV3IENzbV9jc21WZWN0b3I8TEFwcE1vZGVsPigpO1xuICAgIHRoaXMuX3NjZW5lSW5kZXggPSAwO1xuICAgIHRoaXMuY2hhbmdlU2NlbmUodGhpcy5fc2NlbmVJbmRleCk7XG4gIH1cblxuICBfdmlld01hdHJpeDogQ3NtX0N1YmlzbU1hdHJpeDQ0OyAvLyDjg6Ljg4fjg6vmj4/nlLvjgavnlKjjgYTjgot2aWV36KGM5YiXXG4gIF9tb2RlbHM6IENzbV9jc21WZWN0b3I8TEFwcE1vZGVsPjsgLy8g44Oi44OH44Or44Kk44Oz44K544K/44Oz44K544Gu44Kz44Oz44OG44OKXG4gIF9zY2VuZUluZGV4OiBudW1iZXI7IC8vIOihqOekuuOBmeOCi+OCt+ODvOODs+OBruOCpOODs+ODh+ODg+OCr+OCueWApFxuICAvLyDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/ntYLkuobjga7jgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbBcbiAgX2ZpbmlzaGVkTW90aW9uID0gKHNlbGY6IEFDdWJpc21Nb3Rpb24pOiB2b2lkID0+IHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgnTW90aW9uIEZpbmlzaGVkOicpO1xuICAgIGNvbnNvbGUubG9nKHNlbGYpO1xuICB9O1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGxpdmUyZGN1YmlzbWZyYW1ld29yayB9IGZyb20gJ0BmcmFtZXdvcmsvbGl2ZTJkY3ViaXNtZnJhbWV3b3JrJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21pZCB9IGZyb20gJ0BmcmFtZXdvcmsvaWQvY3ViaXNtaWQnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbXVzZXJtb2RlbCB9IGZyb20gJ0BmcmFtZXdvcmsvbW9kZWwvY3ViaXNtdXNlcm1vZGVsJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBpY3ViaXNtbW9kZWxzZXR0aW5nIH0gZnJvbSAnQGZyYW1ld29yay9pY3ViaXNtbW9kZWxzZXR0aW5nJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tb2RlbHNldHRpbmdqc29uIH0gZnJvbSAnQGZyYW1ld29yay9jdWJpc21tb2RlbHNldHRpbmdqc29uJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21kZWZhdWx0cGFyYW1ldGVyaWQgfSBmcm9tICdAZnJhbWV3b3JrL2N1YmlzbWRlZmF1bHRwYXJhbWV0ZXJpZCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgYWN1YmlzbW1vdGlvbiB9IGZyb20gJ0BmcmFtZXdvcmsvbW90aW9uL2FjdWJpc21tb3Rpb24nO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbWV5ZWJsaW5rIH0gZnJvbSAnQGZyYW1ld29yay9lZmZlY3QvY3ViaXNtZXllYmxpbmsnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbWJyZWF0aCB9IGZyb20gJ0BmcmFtZXdvcmsvZWZmZWN0L2N1YmlzbWJyZWF0aCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtdmVjdG9yIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXZlY3Rvcic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtbWFwIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbW1hcCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtbWF0cml4NDQgfSBmcm9tICdAZnJhbWV3b3JrL21hdGgvY3ViaXNtbWF0cml4NDQnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbW1vdGlvbiB9IGZyb20gJ0BmcmFtZXdvcmsvbW90aW9uL2N1YmlzbW1vdGlvbic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtbW90aW9ucXVldWVtYW5hZ2VyIH0gZnJvbSAnQGZyYW1ld29yay9tb3Rpb24vY3ViaXNtbW90aW9ucXVldWVtYW5hZ2VyJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc21zdHJpbmcgfSBmcm9tICdAZnJhbWV3b3JrL3R5cGUvY3Ntc3RyaW5nJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc21yZWN0IH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXJlY3RmJztcbmltcG9ydCB7IEN1YmlzbUxvZ0luZm8gfSBmcm9tICdAZnJhbWV3b3JrL3V0aWxzL2N1YmlzbWRlYnVnJztcbmltcG9ydCBjc21SZWN0ID0gY3NtcmVjdC5jc21SZWN0O1xuaW1wb3J0IGNzbVN0cmluZyA9IGNzbXN0cmluZy5jc21TdHJpbmc7XG5pbXBvcnQgSW52YWxpZE1vdGlvblF1ZXVlRW50cnlIYW5kbGVWYWx1ZSA9IGN1YmlzbW1vdGlvbnF1ZXVlbWFuYWdlci5JbnZhbGlkTW90aW9uUXVldWVFbnRyeUhhbmRsZVZhbHVlO1xuaW1wb3J0IEN1YmlzbU1vdGlvblF1ZXVlRW50cnlIYW5kbGUgPSBjdWJpc21tb3Rpb25xdWV1ZW1hbmFnZXIuQ3ViaXNtTW90aW9uUXVldWVFbnRyeUhhbmRsZTtcbmltcG9ydCBDdWJpc21Nb3Rpb24gPSBjdWJpc21tb3Rpb24uQ3ViaXNtTW90aW9uO1xuaW1wb3J0IEN1YmlzbU1hdHJpeDQ0ID0gY3ViaXNtbWF0cml4NDQuQ3ViaXNtTWF0cml4NDQ7XG5pbXBvcnQgY3NtTWFwID0gY3NtbWFwLmNzbU1hcDtcbmltcG9ydCBjc21WZWN0b3IgPSBjc212ZWN0b3IuY3NtVmVjdG9yO1xuaW1wb3J0IEN1YmlzbUJyZWF0aCA9IGN1YmlzbWJyZWF0aC5DdWJpc21CcmVhdGg7XG5pbXBvcnQgQnJlYXRoUGFyYW1ldGVyRGF0YSA9IGN1YmlzbWJyZWF0aC5CcmVhdGhQYXJhbWV0ZXJEYXRhO1xuaW1wb3J0IEN1YmlzbUV5ZUJsaW5rID0gY3ViaXNtZXllYmxpbmsuQ3ViaXNtRXllQmxpbms7XG5pbXBvcnQgQUN1YmlzbU1vdGlvbiA9IGFjdWJpc21tb3Rpb24uQUN1YmlzbU1vdGlvbjtcbmltcG9ydCBGaW5pc2hlZE1vdGlvbkNhbGxiYWNrID0gYWN1YmlzbW1vdGlvbi5GaW5pc2hlZE1vdGlvbkNhbGxiYWNrO1xuaW1wb3J0IEN1YmlzbUZyYW1ld29yayA9IGxpdmUyZGN1YmlzbWZyYW1ld29yay5DdWJpc21GcmFtZXdvcms7XG5pbXBvcnQgQ3ViaXNtSWRIYW5kbGUgPSBjdWJpc21pZC5DdWJpc21JZEhhbmRsZTtcbmltcG9ydCBDdWJpc21Vc2VyTW9kZWwgPSBjdWJpc211c2VybW9kZWwuQ3ViaXNtVXNlck1vZGVsO1xuaW1wb3J0IElDdWJpc21Nb2RlbFNldHRpbmcgPSBpY3ViaXNtbW9kZWxzZXR0aW5nLklDdWJpc21Nb2RlbFNldHRpbmc7XG5pbXBvcnQgQ3ViaXNtTW9kZWxTZXR0aW5nSnNvbiA9IGN1YmlzbW1vZGVsc2V0dGluZ2pzb24uQ3ViaXNtTW9kZWxTZXR0aW5nSnNvbjtcbmltcG9ydCBDdWJpc21EZWZhdWx0UGFyYW1ldGVySWQgPSBjdWJpc21kZWZhdWx0cGFyYW1ldGVyaWQ7XG5cbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0IHsgZ2wsIGNhbnZhcywgZnJhbWVCdWZmZXIsIExBcHBEZWxlZ2F0ZSB9IGZyb20gJy4vbGFwcGRlbGVnYXRlJztcbmltcG9ydCB7IFRleHR1cmVJbmZvIH0gZnJvbSAnLi9sYXBwdGV4dHVyZW1hbmFnZXInO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xuXG5lbnVtIExvYWRTdGVwIHtcbiAgTG9hZEFzc2V0cyxcbiAgTG9hZE1vZGVsLFxuICBXYWl0TG9hZE1vZGVsLFxuICBMb2FkRXhwcmVzc2lvbixcbiAgV2FpdExvYWRFeHByZXNzaW9uLFxuICBMb2FkUGh5c2ljcyxcbiAgV2FpdExvYWRQaHlzaWNzLFxuICBMb2FkUG9zZSxcbiAgV2FpdExvYWRQb3NlLFxuICBTZXR1cEV5ZUJsaW5rLFxuICBTZXR1cEJyZWF0aCxcbiAgTG9hZFVzZXJEYXRhLFxuICBXYWl0TG9hZFVzZXJEYXRhLFxuICBTZXR1cEV5ZUJsaW5rSWRzLFxuICBTZXR1cExpcFN5bmNJZHMsXG4gIFNldHVwTGF5b3V0LFxuICBMb2FkTW90aW9uLFxuICBXYWl0TG9hZE1vdGlvbixcbiAgQ29tcGxldGVJbml0aWFsaXplLFxuICBDb21wbGV0ZVNldHVwTW9kZWwsXG4gIExvYWRUZXh0dXJlLFxuICBXYWl0TG9hZFRleHR1cmUsXG4gIENvbXBsZXRlU2V0dXBcbn1cblxuLyoqXG4gKiDjg6bjg7zjgrbjg7zjgYzlrp/pmpvjgavkvb/nlKjjgZnjgovjg6Ljg4fjg6vjga7lrp/oo4Xjgq/jg6njgrk8YnI+XG4gKiDjg6Ljg4fjg6vnlJ/miJDjgIHmqZ/og73jgrPjg7Pjg53jg7zjg43jg7Pjg4jnlJ/miJDjgIHmm7TmlrDlh6bnkIbjgajjg6zjg7Pjg4Djg6rjg7PjgrDjga7lkbzjgbPlh7rjgZfjgpLooYzjgYbjgIJcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBNb2RlbCBleHRlbmRzIEN1YmlzbVVzZXJNb2RlbCB7XG4gIC8qKlxuICAgKiBtb2RlbDMuanNvbuOBjOe9ruOBi+OCjOOBn+ODh+OCo+ODrOOCr+ODiOODquOBqOODleOCoeOCpOODq+ODkeOCueOBi+OCieODouODh+ODq+OCkueUn+aIkOOBmeOCi1xuICAgKiBAcGFyYW0gZGlyXG4gICAqIEBwYXJhbSBmaWxlTmFtZVxuICAgKi9cbiAgcHVibGljIGxvYWRBc3NldHMoZGlyOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9tb2RlbEhvbWVEaXIgPSBkaXI7XG5cbiAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7ZmlsZU5hbWV9YClcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgIGNvbnN0IHNldHRpbmc6IElDdWJpc21Nb2RlbFNldHRpbmcgPSBuZXcgQ3ViaXNtTW9kZWxTZXR0aW5nSnNvbihcbiAgICAgICAgICBhcnJheUJ1ZmZlcixcbiAgICAgICAgICBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8g44K544OG44O844OI44KS5pu05pawXG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZE1vZGVsO1xuXG4gICAgICAgIC8vIOe1kOaenOOCkuS/neWtmFxuICAgICAgICB0aGlzLnNldHVwTW9kZWwoc2V0dGluZyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBtb2RlbDMuanNvbuOBi+OCieODouODh+ODq+OCkueUn+aIkOOBmeOCi+OAglxuICAgKiBtb2RlbDMuanNvbuOBruiomOi/sOOBq+W+k+OBo+OBpuODouODh+ODq+eUn+aIkOOAgeODouODvOOCt+ODp+ODs+OAgeeJqeeQhua8lOeul+OBquOBqeOBruOCs+ODs+ODneODvOODjeODs+ODiOeUn+aIkOOCkuihjOOBhuOAglxuICAgKlxuICAgKiBAcGFyYW0gc2V0dGluZyBJQ3ViaXNtTW9kZWxTZXR0aW5n44Gu44Kk44Oz44K544K/44Oz44K5XG4gICAqL1xuICBwcml2YXRlIHNldHVwTW9kZWwoc2V0dGluZzogSUN1YmlzbU1vZGVsU2V0dGluZyk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0aW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fbW9kZWxTZXR0aW5nID0gc2V0dGluZztcblxuICAgIC8vIEN1YmlzbU1vZGVsXG4gICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb2RlbEZpbGVOYW1lKCkgIT0gJycpIHtcbiAgICAgIGNvbnN0IG1vZGVsRmlsZU5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW9kZWxGaWxlTmFtZSgpO1xuXG4gICAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7bW9kZWxGaWxlTmFtZX1gKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5hcnJheUJ1ZmZlcigpKVxuICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgdGhpcy5sb2FkTW9kZWwoYXJyYXlCdWZmZXIpO1xuICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZEV4cHJlc3Npb247XG5cbiAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICAgIGxvYWRDdWJpc21FeHByZXNzaW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkTW9kZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCdNb2RlbCBkYXRhIGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIC8vIEV4cHJlc3Npb25cbiAgICBjb25zdCBsb2FkQ3ViaXNtRXhwcmVzc2lvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXhwcmVzc2lvbkNvdW50KCkgPiAwKSB7XG4gICAgICAgIGNvbnN0IGNvdW50OiBudW1iZXIgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXhwcmVzc2lvbkNvdW50KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbk5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXhwcmVzc2lvbk5hbWUoaSk7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbkZpbGVOYW1lID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldEV4cHJlc3Npb25GaWxlTmFtZShcbiAgICAgICAgICAgIGlcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgZmV0Y2goYCR7dGhpcy5fbW9kZWxIb21lRGlyfS8ke2V4cHJlc3Npb25GaWxlTmFtZX1gKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSlcbiAgICAgICAgICAgIC50aGVuKGFycmF5QnVmZmVyID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbW90aW9uOiBBQ3ViaXNtTW90aW9uID0gdGhpcy5sb2FkRXhwcmVzc2lvbihcbiAgICAgICAgICAgICAgICBhcnJheUJ1ZmZlcixcbiAgICAgICAgICAgICAgICBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoLFxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25OYW1lXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX2V4cHJlc3Npb25zLmdldFZhbHVlKGV4cHJlc3Npb25OYW1lKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgQUN1YmlzbU1vdGlvbi5kZWxldGUoXG4gICAgICAgICAgICAgICAgICB0aGlzLl9leHByZXNzaW9ucy5nZXRWYWx1ZShleHByZXNzaW9uTmFtZSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb25zLnNldFZhbHVlKGV4cHJlc3Npb25OYW1lLCBudWxsKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb25zLnNldFZhbHVlKGV4cHJlc3Npb25OYW1lLCBtb3Rpb24pO1xuXG4gICAgICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb25Db3VudCsrO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLl9leHByZXNzaW9uQ291bnQgPj0gY291bnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLkxvYWRQaHlzaWNzO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgICAgICAgICBsb2FkQ3ViaXNtUGh5c2ljcygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkRXhwcmVzc2lvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFBoeXNpY3M7XG5cbiAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgbG9hZEN1YmlzbVBoeXNpY3MoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gUGh5c2ljc1xuICAgIGNvbnN0IGxvYWRDdWJpc21QaHlzaWNzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRQaHlzaWNzRmlsZU5hbWUoKSAhPSAnJykge1xuICAgICAgICBjb25zdCBwaHlzaWNzRmlsZU5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0UGh5c2ljc0ZpbGVOYW1lKCk7XG5cbiAgICAgICAgZmV0Y2goYCR7dGhpcy5fbW9kZWxIb21lRGlyfS8ke3BoeXNpY3NGaWxlTmFtZX1gKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAgICAgLnRoZW4oYXJyYXlCdWZmZXIgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkUGh5c2ljcyhhcnJheUJ1ZmZlciwgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFBvc2U7XG5cbiAgICAgICAgICAgIC8vIGNhbGxiYWNrXG4gICAgICAgICAgICBsb2FkQ3ViaXNtUG9zZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkUGh5c2ljcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFBvc2U7XG5cbiAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgbG9hZEN1YmlzbVBvc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gUG9zZVxuICAgIGNvbnN0IGxvYWRDdWJpc21Qb3NlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRQb3NlRmlsZU5hbWUoKSAhPSAnJykge1xuICAgICAgICBjb25zdCBwb3NlRmlsZU5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0UG9zZUZpbGVOYW1lKCk7XG5cbiAgICAgICAgZmV0Y2goYCR7dGhpcy5fbW9kZWxIb21lRGlyfS8ke3Bvc2VGaWxlTmFtZX1gKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAgICAgLnRoZW4oYXJyYXlCdWZmZXIgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkUG9zZShhcnJheUJ1ZmZlciwgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuU2V0dXBFeWVCbGluaztcblxuICAgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgICAgIHNldHVwRXllQmxpbmsoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5XYWl0TG9hZFBvc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLlNldHVwRXllQmxpbms7XG5cbiAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgc2V0dXBFeWVCbGluaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBFeWVCbGlua1xuICAgIGNvbnN0IHNldHVwRXllQmxpbmsgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldEV5ZUJsaW5rUGFyYW1ldGVyQ291bnQoKSA+IDApIHtcbiAgICAgICAgdGhpcy5fZXllQmxpbmsgPSBDdWJpc21FeWVCbGluay5jcmVhdGUodGhpcy5fbW9kZWxTZXR0aW5nKTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5TZXR1cEJyZWF0aDtcbiAgICAgIH1cblxuICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIHNldHVwQnJlYXRoKCk7XG4gICAgfTtcblxuICAgIC8vIEJyZWF0aFxuICAgIGNvbnN0IHNldHVwQnJlYXRoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGhpcy5fYnJlYXRoID0gQ3ViaXNtQnJlYXRoLmNyZWF0ZSgpO1xuXG4gICAgICBjb25zdCBicmVhdGhQYXJhbWV0ZXJzOiBjc21WZWN0b3I8QnJlYXRoUGFyYW1ldGVyRGF0YT4gPSBuZXcgY3NtVmVjdG9yKCk7XG4gICAgICBicmVhdGhQYXJhbWV0ZXJzLnB1c2hCYWNrKFxuICAgICAgICBuZXcgQnJlYXRoUGFyYW1ldGVyRGF0YSh0aGlzLl9pZFBhcmFtQW5nbGVYLCAwLjAsIDE1LjAsIDYuNTM0NSwgMC41KVxuICAgICAgKTtcbiAgICAgIGJyZWF0aFBhcmFtZXRlcnMucHVzaEJhY2soXG4gICAgICAgIG5ldyBCcmVhdGhQYXJhbWV0ZXJEYXRhKHRoaXMuX2lkUGFyYW1BbmdsZVksIDAuMCwgOC4wLCAzLjUzNDUsIDAuNSlcbiAgICAgICk7XG4gICAgICBicmVhdGhQYXJhbWV0ZXJzLnB1c2hCYWNrKFxuICAgICAgICBuZXcgQnJlYXRoUGFyYW1ldGVyRGF0YSh0aGlzLl9pZFBhcmFtQW5nbGVaLCAwLjAsIDEwLjAsIDUuNTM0NSwgMC41KVxuICAgICAgKTtcbiAgICAgIGJyZWF0aFBhcmFtZXRlcnMucHVzaEJhY2soXG4gICAgICAgIG5ldyBCcmVhdGhQYXJhbWV0ZXJEYXRhKHRoaXMuX2lkUGFyYW1Cb2R5QW5nbGVYLCAwLjAsIDQuMCwgMTUuNTM0NSwgMC41KVxuICAgICAgKTtcbiAgICAgIGJyZWF0aFBhcmFtZXRlcnMucHVzaEJhY2soXG4gICAgICAgIG5ldyBCcmVhdGhQYXJhbWV0ZXJEYXRhKFxuICAgICAgICAgIEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgICAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUJyZWF0aFxuICAgICAgICAgICksXG4gICAgICAgICAgMC4wLFxuICAgICAgICAgIDAuNSxcbiAgICAgICAgICAzLjIzNDUsXG4gICAgICAgICAgMC41XG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuX2JyZWF0aC5zZXRQYXJhbWV0ZXJzKGJyZWF0aFBhcmFtZXRlcnMpO1xuICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkVXNlckRhdGE7XG5cbiAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBsb2FkVXNlckRhdGEoKTtcbiAgICB9O1xuXG4gICAgLy8gVXNlckRhdGFcbiAgICBjb25zdCBsb2FkVXNlckRhdGEgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldFVzZXJEYXRhRmlsZSgpICE9ICcnKSB7XG4gICAgICAgIGNvbnN0IHVzZXJEYXRhRmlsZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRVc2VyRGF0YUZpbGUoKTtcblxuICAgICAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7dXNlckRhdGFGaWxlfWApXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSlcbiAgICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRVc2VyRGF0YShhcnJheUJ1ZmZlciwgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuU2V0dXBFeWVCbGlua0lkcztcblxuICAgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgICAgIHNldHVwRXllQmxpbmtJZHMoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkVXNlckRhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLlNldHVwRXllQmxpbmtJZHM7XG5cbiAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgc2V0dXBFeWVCbGlua0lkcygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBFeWVCbGlua0lkc1xuICAgIGNvbnN0IHNldHVwRXllQmxpbmtJZHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBleWVCbGlua0lkQ291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRFeWVCbGlua1BhcmFtZXRlckNvdW50KCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXllQmxpbmtJZENvdW50OyArK2kpIHtcbiAgICAgICAgdGhpcy5fZXllQmxpbmtJZHMucHVzaEJhY2soXG4gICAgICAgICAgdGhpcy5fbW9kZWxTZXR0aW5nLmdldEV5ZUJsaW5rUGFyYW1ldGVySWQoaSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5TZXR1cExpcFN5bmNJZHM7XG5cbiAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBzZXR1cExpcFN5bmNJZHMoKTtcbiAgICB9O1xuXG4gICAgLy8gTGlwU3luY0lkc1xuICAgIGNvbnN0IHNldHVwTGlwU3luY0lkcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGxpcFN5bmNJZENvdW50ID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldExpcFN5bmNQYXJhbWV0ZXJDb3VudCgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpcFN5bmNJZENvdW50OyArK2kpIHtcbiAgICAgICAgdGhpcy5fbGlwU3luY0lkcy5wdXNoQmFjayh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TGlwU3luY1BhcmFtZXRlcklkKGkpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuU2V0dXBMYXlvdXQ7XG5cbiAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBzZXR1cExheW91dCgpO1xuICAgIH07XG5cbiAgICAvLyBMYXlvdXRcbiAgICBjb25zdCBzZXR1cExheW91dCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGxheW91dDogY3NtTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBjc21NYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgICB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TGF5b3V0TWFwKGxheW91dCk7XG4gICAgICB0aGlzLl9tb2RlbE1hdHJpeC5zZXR1cEZyb21MYXlvdXQobGF5b3V0KTtcbiAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZE1vdGlvbjtcblxuICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIGxvYWRDdWJpc21Nb3Rpb24oKTtcbiAgICB9O1xuXG4gICAgLy8gTW90aW9uXG4gICAgY29uc3QgbG9hZEN1YmlzbU1vdGlvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuV2FpdExvYWRNb3Rpb247XG4gICAgICB0aGlzLl9tb2RlbC5zYXZlUGFyYW1ldGVycygpO1xuICAgICAgdGhpcy5fYWxsTW90aW9uQ291bnQgPSAwO1xuICAgICAgdGhpcy5fbW90aW9uQ291bnQgPSAwO1xuICAgICAgY29uc3QgZ3JvdXA6IHN0cmluZ1tdID0gW107XG5cbiAgICAgIGNvbnN0IG1vdGlvbkdyb3VwQ291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25Hcm91cENvdW50KCk7XG5cbiAgICAgIC8vIOODouODvOOCt+ODp+ODs+OBrue3j+aVsOOCkuaxguOCgeOCi1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Rpb25Hcm91cENvdW50OyBpKyspIHtcbiAgICAgICAgZ3JvdXBbaV0gPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW90aW9uR3JvdXBOYW1lKGkpO1xuICAgICAgICB0aGlzLl9hbGxNb3Rpb25Db3VudCArPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW90aW9uQ291bnQoZ3JvdXBbaV0pO1xuICAgICAgfVxuXG4gICAgICAvLyDjg6Ljg7zjgrfjg6fjg7Pjga7oqq3jgb/ovrzjgb9cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW90aW9uR3JvdXBDb3VudDsgaSsrKSB7XG4gICAgICAgIHRoaXMucHJlTG9hZE1vdGlvbkdyb3VwKGdyb3VwW2ldKTtcbiAgICAgIH1cblxuICAgICAgLy8g44Oi44O844K344On44Oz44GM44Gq44GE5aC05ZCIXG4gICAgICBpZiAobW90aW9uR3JvdXBDb3VudCA9PSAwKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFRleHR1cmU7XG5cbiAgICAgICAgLy8g5YWo44Gm44Gu44Oi44O844K344On44Oz44KS5YGc5q2i44GZ44KLXG4gICAgICAgIHRoaXMuX21vdGlvbk1hbmFnZXIuc3RvcEFsbE1vdGlvbnMoKTtcblxuICAgICAgICB0aGlzLl91cGRhdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVSZW5kZXJlcigpO1xuICAgICAgICB0aGlzLnNldHVwVGV4dHVyZXMoKTtcbiAgICAgICAgdGhpcy5nZXRSZW5kZXJlcigpLnN0YXJ0VXAoZ2wpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog44OG44Kv44K544OB44Oj44Om44OL44OD44OI44Gr44OG44Kv44K544OB44Oj44KS44Ot44O844OJ44GZ44KLXG4gICAqL1xuICBwcml2YXRlIHNldHVwVGV4dHVyZXMoKTogdm9pZCB7XG4gICAgLy8gaVBob25l44Gn44Gu44Ki44Or44OV44Kh5ZOB6LOq5ZCR5LiK44Gu44Gf44KBVHlwZXNjcmlwdOOBp+OBr3ByZW11bHRpcGxpZWRBbHBoYeOCkuaOoeeUqFxuICAgIGNvbnN0IHVzZVByZW11bHRpcGx5ID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSA9PSBMb2FkU3RlcC5Mb2FkVGV4dHVyZSkge1xuICAgICAgLy8g44OG44Kv44K544OB44Oj6Kqt44G/6L6844G/55SoXG4gICAgICBjb25zdCB0ZXh0dXJlQ291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRUZXh0dXJlQ291bnQoKTtcblxuICAgICAgZm9yIChcbiAgICAgICAgbGV0IG1vZGVsVGV4dHVyZU51bWJlciA9IDA7XG4gICAgICAgIG1vZGVsVGV4dHVyZU51bWJlciA8IHRleHR1cmVDb3VudDtcbiAgICAgICAgbW9kZWxUZXh0dXJlTnVtYmVyKytcbiAgICAgICkge1xuICAgICAgICAvLyDjg4bjgq/jgrnjg4Hjg6PlkI3jgYznqbrmloflrZfjgaDjgaPjgZ/loLTlkIjjga/jg63jg7zjg4njg7vjg5DjgqTjg7Pjg4nlh6bnkIbjgpLjgrnjgq3jg4Pjg5dcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRUZXh0dXJlRmlsZU5hbWUobW9kZWxUZXh0dXJlTnVtYmVyKSA9PSAnJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdnZXRUZXh0dXJlRmlsZU5hbWUgbnVsbCcpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2ViR0zjga7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4jjgavjg4bjgq/jgrnjg4Hjg6PjgpLjg63jg7zjg4njgZnjgotcbiAgICAgICAgbGV0IHRleHR1cmVQYXRoID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldFRleHR1cmVGaWxlTmFtZShcbiAgICAgICAgICBtb2RlbFRleHR1cmVOdW1iZXJcbiAgICAgICAgKTtcbiAgICAgICAgdGV4dHVyZVBhdGggPSB0aGlzLl9tb2RlbEhvbWVEaXIgKyB0ZXh0dXJlUGF0aDtcblxuICAgICAgICAvLyDjg63jg7zjg4nlrozkuobmmYLjgavlkbzjgbPlh7rjgZnjgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbBcbiAgICAgICAgY29uc3Qgb25Mb2FkID0gKHRleHR1cmVJbmZvOiBUZXh0dXJlSW5mbyk6IHZvaWQgPT4ge1xuICAgICAgICAgIHRoaXMuZ2V0UmVuZGVyZXIoKS5iaW5kVGV4dHVyZShtb2RlbFRleHR1cmVOdW1iZXIsIHRleHR1cmVJbmZvLmlkKTtcblxuICAgICAgICAgIHRoaXMuX3RleHR1cmVDb3VudCsrO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX3RleHR1cmVDb3VudCA+PSB0ZXh0dXJlQ291bnQpIHtcbiAgICAgICAgICAgIC8vIOODreODvOODieWujOS6hlxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Db21wbGV0ZVNldHVwO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyDoqq3jgb/ovrzjgb9cbiAgICAgICAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKClcbiAgICAgICAgICAuZ2V0VGV4dHVyZU1hbmFnZXIoKVxuICAgICAgICAgIC5jcmVhdGVUZXh0dXJlRnJvbVBuZ0ZpbGUodGV4dHVyZVBhdGgsIHVzZVByZW11bHRpcGx5LCBvbkxvYWQpO1xuICAgICAgICB0aGlzLmdldFJlbmRlcmVyKCkuc2V0SXNQcmVtdWx0aXBsaWVkQWxwaGEodXNlUHJlbXVsdGlwbHkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkVGV4dHVyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog44Os44Oz44OA44Op44KS5YaN5qeL56+J44GZ44KLXG4gICAqL1xuICBwdWJsaWMgcmVsb2FkUmVuZGVyZXIoKTogdm9pZCB7XG4gICAgdGhpcy5kZWxldGVSZW5kZXJlcigpO1xuICAgIHRoaXMuY3JlYXRlUmVuZGVyZXIoKTtcbiAgICB0aGlzLnNldHVwVGV4dHVyZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmm7TmlrBcbiAgICovXG4gIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3N0YXRlICE9IExvYWRTdGVwLkNvbXBsZXRlU2V0dXApIHJldHVybjtcblxuICAgIGNvbnN0IGRlbHRhVGltZVNlY29uZHM6IG51bWJlciA9IExBcHBQYWwuZ2V0RGVsdGFUaW1lKCk7XG4gICAgdGhpcy5fdXNlclRpbWVTZWNvbmRzICs9IGRlbHRhVGltZVNlY29uZHM7XG5cbiAgICB0aGlzLl9kcmFnTWFuYWdlci51cGRhdGUoZGVsdGFUaW1lU2Vjb25kcyk7XG4gICAgdGhpcy5fZHJhZ1ggPSB0aGlzLl9kcmFnTWFuYWdlci5nZXRYKCk7XG4gICAgdGhpcy5fZHJhZ1kgPSB0aGlzLl9kcmFnTWFuYWdlci5nZXRZKCk7XG5cbiAgICAvLyDjg6Ljg7zjgrfjg6fjg7Pjgavjgojjgovjg5Hjg6njg6Hjg7zjgr/mm7TmlrDjga7mnInnhKFcbiAgICBsZXQgbW90aW9uVXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRoaXMuX21vZGVsLmxvYWRQYXJhbWV0ZXJzKCk7IC8vIOWJjeWbnuOCu+ODvOODluOBleOCjOOBn+eKtuaFi+OCkuODreODvOODiVxuICAgIGlmICh0aGlzLl9tb3Rpb25NYW5hZ2VyLmlzRmluaXNoZWQoKSkge1xuICAgICAgLy8g44Oi44O844K344On44Oz44Gu5YaN55Sf44GM44Gq44GE5aC05ZCI44CB5b6F5qmf44Oi44O844K344On44Oz44Gu5Lit44GL44KJ44Op44Oz44OA44Og44Gn5YaN55Sf44GZ44KLXG4gICAgICB0aGlzLnN0YXJ0UmFuZG9tTW90aW9uKFxuICAgICAgICBMQXBwRGVmaW5lLk1vdGlvbkdyb3VwSWRsZSxcbiAgICAgICAgTEFwcERlZmluZS5Qcmlvcml0eUlkbGVcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vdGlvblVwZGF0ZWQgPSB0aGlzLl9tb3Rpb25NYW5hZ2VyLnVwZGF0ZU1vdGlvbihcbiAgICAgICAgdGhpcy5fbW9kZWwsXG4gICAgICAgIGRlbHRhVGltZVNlY29uZHNcbiAgICAgICk7IC8vIOODouODvOOCt+ODp+ODs+OCkuabtOaWsFxuICAgIH1cbiAgICB0aGlzLl9tb2RlbC5zYXZlUGFyYW1ldGVycygpOyAvLyDnirbmhYvjgpLkv53lrZhcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyDjgb7jgbDjgZ/jgY1cbiAgICBpZiAoIW1vdGlvblVwZGF0ZWQpIHtcbiAgICAgIGlmICh0aGlzLl9leWVCbGluayAhPSBudWxsKSB7XG4gICAgICAgIC8vIOODoeOCpOODs+ODouODvOOCt+ODp+ODs+OBruabtOaWsOOBjOOBquOBhOOBqOOBjVxuICAgICAgICB0aGlzLl9leWVCbGluay51cGRhdGVQYXJhbWV0ZXJzKHRoaXMuX21vZGVsLCBkZWx0YVRpbWVTZWNvbmRzKTsgLy8g55uu44OR44OBXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V4cHJlc3Npb25NYW5hZ2VyICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX2V4cHJlc3Npb25NYW5hZ2VyLnVwZGF0ZU1vdGlvbih0aGlzLl9tb2RlbCwgZGVsdGFUaW1lU2Vjb25kcyk7IC8vIOihqOaDheOBp+ODkeODqeODoeODvOOCv+abtOaWsO+8iOebuOWvvuWkieWMlu+8iVxuICAgIH1cblxuICAgIC8vIOODieODqeODg+OCsOOBq+OCiOOCi+WkieWMllxuICAgIC8vIOODieODqeODg+OCsOOBq+OCiOOCi+mhlOOBruWQkeOBjeOBruiqv+aVtFxuICAgIHRoaXMuX21vZGVsLmFkZFBhcmFtZXRlclZhbHVlQnlJZCh0aGlzLl9pZFBhcmFtQW5nbGVYLCB0aGlzLl9kcmFnWCAqIDMwKTsgLy8gLTMw44GL44KJMzDjga7lgKTjgpLliqDjgYjjgotcbiAgICB0aGlzLl9tb2RlbC5hZGRQYXJhbWV0ZXJWYWx1ZUJ5SWQodGhpcy5faWRQYXJhbUFuZ2xlWSwgdGhpcy5fZHJhZ1kgKiAzMCk7XG4gICAgdGhpcy5fbW9kZWwuYWRkUGFyYW1ldGVyVmFsdWVCeUlkKFxuICAgICAgdGhpcy5faWRQYXJhbUFuZ2xlWixcbiAgICAgIHRoaXMuX2RyYWdYICogdGhpcy5fZHJhZ1kgKiAtMzBcbiAgICApO1xuXG4gICAgLy8g44OJ44Op44OD44Kw44Gr44KI44KL5L2T44Gu5ZCR44GN44Gu6Kq/5pW0XG4gICAgdGhpcy5fbW9kZWwuYWRkUGFyYW1ldGVyVmFsdWVCeUlkKFxuICAgICAgdGhpcy5faWRQYXJhbUJvZHlBbmdsZVgsXG4gICAgICB0aGlzLl9kcmFnWCAqIDEwXG4gICAgKTsgLy8gLTEw44GL44KJMTDjga7lgKTjgpLliqDjgYjjgotcblxuICAgIC8vIOODieODqeODg+OCsOOBq+OCiOOCi+ebruOBruWQkeOBjeOBruiqv+aVtFxuICAgIHRoaXMuX21vZGVsLmFkZFBhcmFtZXRlclZhbHVlQnlJZCh0aGlzLl9pZFBhcmFtRXllQmFsbFgsIHRoaXMuX2RyYWdYKTsgLy8gLTHjgYvjgokx44Gu5YCk44KS5Yqg44GI44KLXG4gICAgdGhpcy5fbW9kZWwuYWRkUGFyYW1ldGVyVmFsdWVCeUlkKHRoaXMuX2lkUGFyYW1FeWVCYWxsWSwgdGhpcy5fZHJhZ1kpO1xuXG4gICAgLy8g5ZG85ZC444Gq44GpXG4gICAgaWYgKHRoaXMuX2JyZWF0aCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9icmVhdGgudXBkYXRlUGFyYW1ldGVycyh0aGlzLl9tb2RlbCwgZGVsdGFUaW1lU2Vjb25kcyk7XG4gICAgfVxuXG4gICAgLy8g54mp55CG5ryU566X44Gu6Kit5a6aXG4gICAgaWYgKHRoaXMuX3BoeXNpY3MgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fcGh5c2ljcy5ldmFsdWF0ZSh0aGlzLl9tb2RlbCwgZGVsdGFUaW1lU2Vjb25kcyk7XG4gICAgfVxuXG4gICAgLy8g44Oq44OD44OX44K344Oz44Kv44Gu6Kit5a6aXG4gICAgaWYgKHRoaXMuX2xpcHN5bmMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gMDsgLy8g44Oq44Ki44Or44K/44Kk44Og44Gn44Oq44OD44OX44K344Oz44Kv44KS6KGM44GG5aC05ZCI44CB44K344K544OG44Og44GL44KJ6Z+z6YeP44KS5Y+W5b6X44GX44Gm44CBMH4x44Gu56+E5Zuy44Gn5YCk44KS5YWl5Yqb44GX44G+44GZ44CCXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGlwU3luY0lkcy5nZXRTaXplKCk7ICsraSkge1xuICAgICAgICB0aGlzLl9tb2RlbC5hZGRQYXJhbWV0ZXJWYWx1ZUJ5SWQodGhpcy5fbGlwU3luY0lkcy5hdChpKSwgdmFsdWUsIDAuOCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g44Od44O844K644Gu6Kit5a6aXG4gICAgaWYgKHRoaXMuX3Bvc2UgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fcG9zZS51cGRhdGVQYXJhbWV0ZXJzKHRoaXMuX21vZGVsLCBkZWx0YVRpbWVTZWNvbmRzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9tb2RlbC51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlvJXmlbDjgafmjIflrprjgZfjgZ/jg6Ljg7zjgrfjg6fjg7Pjga7lho3nlJ/jgpLplovlp4vjgZnjgotcbiAgICogQHBhcmFtIGdyb3VwIOODouODvOOCt+ODp+ODs+OCsOODq+ODvOODl+WQjVxuICAgKiBAcGFyYW0gbm8g44Kw44Or44O844OX5YaF44Gu55Wq5Y+3XG4gICAqIEBwYXJhbSBwcmlvcml0eSDlhKrlhYjluqZcbiAgICogQHBhcmFtIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyIOODouODvOOCt+ODp+ODs+WGjeeUn+e1guS6huaZguOBq+WRvOOBs+WHuuOBleOCjOOCi+OCs+ODvOODq+ODkOODg+OCr+mWouaVsFxuICAgKiBAcmV0dXJuIOmWi+Wni+OBl+OBn+ODouODvOOCt+ODp+ODs+OBruitmOWIpeeVquWPt+OCkui/lOOBmeOAguWAi+WIpeOBruODouODvOOCt+ODp+ODs+OBjOe1guS6huOBl+OBn+OBi+WQpuOBi+OCkuWIpOWumuOBmeOCi2lzRmluaXNoZWQoKeOBruW8leaVsOOBp+S9v+eUqOOBmeOCi+OAgumWi+Wni+OBp+OBjeOBquOBhOaZguOBr1stMV1cbiAgICovXG4gIHB1YmxpYyBzdGFydE1vdGlvbihcbiAgICBncm91cDogc3RyaW5nLFxuICAgIG5vOiBudW1iZXIsXG4gICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICBvbkZpbmlzaGVkTW90aW9uSGFuZGxlcj86IEZpbmlzaGVkTW90aW9uQ2FsbGJhY2tcbiAgKTogQ3ViaXNtTW90aW9uUXVldWVFbnRyeUhhbmRsZSB7XG4gICAgaWYgKHByaW9yaXR5ID09IExBcHBEZWZpbmUuUHJpb3JpdHlGb3JjZSkge1xuICAgICAgdGhpcy5fbW90aW9uTWFuYWdlci5zZXRSZXNlcnZlUHJpb3JpdHkocHJpb3JpdHkpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX21vdGlvbk1hbmFnZXIucmVzZXJ2ZU1vdGlvbihwcmlvcml0eSkpIHtcbiAgICAgIGlmICh0aGlzLl9kZWJ1Z01vZGUpIHtcbiAgICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXCJbQVBQXWNhbid0IHN0YXJ0IG1vdGlvbi5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gSW52YWxpZE1vdGlvblF1ZXVlRW50cnlIYW5kbGVWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBtb3Rpb25GaWxlTmFtZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GaWxlTmFtZShncm91cCwgbm8pO1xuXG4gICAgLy8gZXgpIGlkbGVfMFxuICAgIGNvbnN0IG5hbWUgPSBgJHtncm91cH1fJHtub31gO1xuICAgIGxldCBtb3Rpb246IEN1YmlzbU1vdGlvbiA9IHRoaXMuX21vdGlvbnMuZ2V0VmFsdWUobmFtZSkgYXMgQ3ViaXNtTW90aW9uO1xuICAgIGxldCBhdXRvRGVsZXRlID0gZmFsc2U7XG5cbiAgICBpZiAobW90aW9uID09IG51bGwpIHtcbiAgICAgIGZldGNoKGAke3RoaXMuX21vZGVsSG9tZURpcn0vJHttb3Rpb25GaWxlTmFtZX1gKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5hcnJheUJ1ZmZlcigpKVxuICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgbW90aW9uID0gdGhpcy5sb2FkTW90aW9uKFxuICAgICAgICAgICAgYXJyYXlCdWZmZXIsXG4gICAgICAgICAgICBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyXG4gICAgICAgICAgKTtcbiAgICAgICAgICBsZXQgZmFkZVRpbWU6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GYWRlSW5UaW1lVmFsdWUoXG4gICAgICAgICAgICBncm91cCxcbiAgICAgICAgICAgIG5vXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChmYWRlVGltZSA+PSAwLjApIHtcbiAgICAgICAgICAgIG1vdGlvbi5zZXRGYWRlSW5UaW1lKGZhZGVUaW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmYWRlVGltZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GYWRlT3V0VGltZVZhbHVlKGdyb3VwLCBubyk7XG4gICAgICAgICAgaWYgKGZhZGVUaW1lID49IDAuMCkge1xuICAgICAgICAgICAgbW90aW9uLnNldEZhZGVPdXRUaW1lKGZhZGVUaW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtb3Rpb24uc2V0RWZmZWN0SWRzKHRoaXMuX2V5ZUJsaW5rSWRzLCB0aGlzLl9saXBTeW5jSWRzKTtcbiAgICAgICAgICBhdXRvRGVsZXRlID0gdHJ1ZTsgLy8g57WC5LqG5pmC44Gr44Oh44Oi44Oq44GL44KJ5YmK6ZmkXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb3Rpb24uc2V0RmluaXNoZWRNb3Rpb25IYW5kbGVyKG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGVidWdNb2RlKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0FQUF1zdGFydCBtb3Rpb246IFske2dyb3VwfV8ke25vfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbW90aW9uTWFuYWdlci5zdGFydE1vdGlvblByaW9yaXR5KFxuICAgICAgbW90aW9uLFxuICAgICAgYXV0b0RlbGV0ZSxcbiAgICAgIHByaW9yaXR5XG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6njg7Pjg4Djg6DjgavpgbjjgbDjgozjgZ/jg6Ljg7zjgrfjg6fjg7Pjga7lho3nlJ/jgpLplovlp4vjgZnjgovjgIJcbiAgICogQHBhcmFtIGdyb3VwIOODouODvOOCt+ODp+ODs+OCsOODq+ODvOODl+WQjVxuICAgKiBAcGFyYW0gcHJpb3JpdHkg5YSq5YWI5bqmXG4gICAqIEBwYXJhbSBvbkZpbmlzaGVkTW90aW9uSGFuZGxlciDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/ntYLkuobmmYLjgavlkbzjgbPlh7rjgZXjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbBcbiAgICogQHJldHVybiDplovlp4vjgZfjgZ/jg6Ljg7zjgrfjg6fjg7Pjga7orZjliKXnlarlj7fjgpLov5TjgZnjgILlgIvliKXjga7jg6Ljg7zjgrfjg6fjg7PjgYzntYLkuobjgZfjgZ/jgYvlkKbjgYvjgpLliKTlrprjgZnjgotpc0ZpbmlzaGVkKCnjga7lvJXmlbDjgafkvb/nlKjjgZnjgovjgILplovlp4vjgafjgY3jgarjgYTmmYLjga9bLTFdXG4gICAqL1xuICBwdWJsaWMgc3RhcnRSYW5kb21Nb3Rpb24oXG4gICAgZ3JvdXA6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyPzogRmluaXNoZWRNb3Rpb25DYWxsYmFja1xuICApOiBDdWJpc21Nb3Rpb25RdWV1ZUVudHJ5SGFuZGxlIHtcbiAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkNvdW50KGdyb3VwKSA9PSAwKSB7XG4gICAgICByZXR1cm4gSW52YWxpZE1vdGlvblF1ZXVlRW50cnlIYW5kbGVWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBubzogbnVtYmVyID0gTWF0aC5mbG9vcihcbiAgICAgIE1hdGgucmFuZG9tKCkgKiB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW90aW9uQ291bnQoZ3JvdXApXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLnN0YXJ0TW90aW9uKGdyb3VwLCBubywgcHJpb3JpdHksIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlvJXmlbDjgafmjIflrprjgZfjgZ/ooajmg4Xjg6Ljg7zjgrfjg6fjg7PjgpLjgrvjg4Pjg4jjgZnjgotcbiAgICpcbiAgICogQHBhcmFtIGV4cHJlc3Npb25JZCDooajmg4Xjg6Ljg7zjgrfjg6fjg7Pjga5JRFxuICAgKi9cbiAgcHVibGljIHNldEV4cHJlc3Npb24oZXhwcmVzc2lvbklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBtb3Rpb246IEFDdWJpc21Nb3Rpb24gPSB0aGlzLl9leHByZXNzaW9ucy5nZXRWYWx1ZShleHByZXNzaW9uSWQpO1xuXG4gICAgaWYgKHRoaXMuX2RlYnVnTW9kZSkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoYFtBUFBdZXhwcmVzc2lvbjogWyR7ZXhwcmVzc2lvbklkfV1gKTtcbiAgICB9XG5cbiAgICBpZiAobW90aW9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX2V4cHJlc3Npb25NYW5hZ2VyLnN0YXJ0TW90aW9uUHJpb3JpdHkoXG4gICAgICAgIG1vdGlvbixcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIExBcHBEZWZpbmUuUHJpb3JpdHlGb3JjZVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX2RlYnVnTW9kZSkge1xuICAgICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0FQUF1leHByZXNzaW9uWyR7ZXhwcmVzc2lvbklkfV0gaXMgbnVsbGApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDjg6njg7Pjg4Djg6DjgavpgbjjgbDjgozjgZ/ooajmg4Xjg6Ljg7zjgrfjg6fjg7PjgpLjgrvjg4Pjg4jjgZnjgotcbiAgICovXG4gIHB1YmxpYyBzZXRSYW5kb21FeHByZXNzaW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9leHByZXNzaW9ucy5nZXRTaXplKCkgPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5vOiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLl9leHByZXNzaW9ucy5nZXRTaXplKCkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9leHByZXNzaW9ucy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgaWYgKGkgPT0gbm8pIHtcbiAgICAgICAgY29uc3QgbmFtZTogc3RyaW5nID0gdGhpcy5fZXhwcmVzc2lvbnMuX2tleVZhbHVlc1tpXS5maXJzdDtcbiAgICAgICAgdGhpcy5zZXRFeHByZXNzaW9uKG5hbWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOOCpOODmeODs+ODiOOBrueZuueBq+OCkuWPl+OBkeWPluOCi1xuICAgKi9cbiAgcHVibGljIG1vdGlvbkV2ZW50RmlyZWQoZXZlbnRWYWx1ZTogY3NtU3RyaW5nKTogdm9pZCB7XG4gICAgQ3ViaXNtTG9nSW5mbygnezB9IGlzIGZpcmVkIG9uIExBcHBNb2RlbCEhJywgZXZlbnRWYWx1ZS5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlvZPjgZ/jgorliKTlrprjg4bjgrnjg4hcbiAgICog5oyH5a6a77yp77yk44Gu6aCC54K544Oq44K544OI44GL44KJ55+p5b2i44KS6KiI566X44GX44CB5bqn5qiZ44KS44GM55+p5b2i56+E5Zuy5YaF44GL5Yik5a6a44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBoaXRBcmVuYU5hbWUgIOW9k+OBn+OCiuWIpOWumuOCkuODhuOCueODiOOBmeOCi+WvvuixoeOBrklEXG4gICAqIEBwYXJhbSB4ICAgICAgICAgICAgIOWIpOWumuOCkuihjOOBhljluqfmqJlcbiAgICogQHBhcmFtIHkgICAgICAgICAgICAg5Yik5a6a44KS6KGM44GGWeW6p+aomVxuICAgKi9cbiAgcHVibGljIGhpdFRlc3QoaGl0QXJlbmFOYW1lOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgLy8g6YCP5piO5pmC44Gv5b2T44Gf44KK5Yik5a6a54Sh44GX44CCXG4gICAgaWYgKHRoaXMuX29wYWNpdHkgPCAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRIaXRBcmVhc0NvdW50KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0SGl0QXJlYU5hbWUoaSkgPT0gaGl0QXJlbmFOYW1lKSB7XG4gICAgICAgIGNvbnN0IGRyYXdJZDogQ3ViaXNtSWRIYW5kbGUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0SGl0QXJlYUlkKGkpO1xuICAgICAgICByZXR1cm4gdGhpcy5pc0hpdChkcmF3SWQsIHgsIHkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6Ljg7zjgrfjg6fjg7Pjg4fjg7zjgr/jgpLjgrDjg6vjg7zjg5flkI3jgYvjgonkuIDmi6zjgafjg63jg7zjg4njgZnjgovjgIJcbiAgICog44Oi44O844K344On44Oz44OH44O844K/44Gu5ZCN5YmN44Gv5YaF6YOo44GnTW9kZWxTZXR0aW5n44GL44KJ5Y+W5b6X44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBncm91cCDjg6Ljg7zjgrfjg6fjg7Pjg4fjg7zjgr/jga7jgrDjg6vjg7zjg5flkI1cbiAgICovXG4gIHB1YmxpYyBwcmVMb2FkTW90aW9uR3JvdXAoZ3JvdXA6IHN0cmluZyk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkNvdW50KGdyb3VwKTsgaSsrKSB7XG4gICAgICBjb25zdCBtb3Rpb25GaWxlTmFtZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GaWxlTmFtZShncm91cCwgaSk7XG5cbiAgICAgIC8vIGV4KSBpZGxlXzBcbiAgICAgIGNvbnN0IG5hbWUgPSBgJHtncm91cH1fJHtpfWA7XG4gICAgICBpZiAodGhpcy5fZGVidWdNb2RlKSB7XG4gICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFxuICAgICAgICAgIGBbQVBQXWxvYWQgbW90aW9uOiAke21vdGlvbkZpbGVOYW1lfSA9PiBbJHtuYW1lfV1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGZldGNoKGAke3RoaXMuX21vZGVsSG9tZURpcn0vJHttb3Rpb25GaWxlTmFtZX1gKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5hcnJheUJ1ZmZlcigpKVxuICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgY29uc3QgdG1wTW90aW9uOiBDdWJpc21Nb3Rpb24gPSB0aGlzLmxvYWRNb3Rpb24oXG4gICAgICAgICAgICBhcnJheUJ1ZmZlcixcbiAgICAgICAgICAgIGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgsXG4gICAgICAgICAgICBuYW1lXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGxldCBmYWRlVGltZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GYWRlSW5UaW1lVmFsdWUoZ3JvdXAsIGkpO1xuICAgICAgICAgIGlmIChmYWRlVGltZSA+PSAwLjApIHtcbiAgICAgICAgICAgIHRtcE1vdGlvbi5zZXRGYWRlSW5UaW1lKGZhZGVUaW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmYWRlVGltZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GYWRlT3V0VGltZVZhbHVlKGdyb3VwLCBpKTtcbiAgICAgICAgICBpZiAoZmFkZVRpbWUgPj0gMC4wKSB7XG4gICAgICAgICAgICB0bXBNb3Rpb24uc2V0RmFkZU91dFRpbWUoZmFkZVRpbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0bXBNb3Rpb24uc2V0RWZmZWN0SWRzKHRoaXMuX2V5ZUJsaW5rSWRzLCB0aGlzLl9saXBTeW5jSWRzKTtcblxuICAgICAgICAgIGlmICh0aGlzLl9tb3Rpb25zLmdldFZhbHVlKG5hbWUpICE9IG51bGwpIHtcbiAgICAgICAgICAgIEFDdWJpc21Nb3Rpb24uZGVsZXRlKHRoaXMuX21vdGlvbnMuZ2V0VmFsdWUobmFtZSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX21vdGlvbnMuc2V0VmFsdWUobmFtZSwgdG1wTW90aW9uKTtcblxuICAgICAgICAgIHRoaXMuX21vdGlvbkNvdW50Kys7XG4gICAgICAgICAgaWYgKHRoaXMuX21vdGlvbkNvdW50ID49IHRoaXMuX2FsbE1vdGlvbkNvdW50KSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLkxvYWRUZXh0dXJlO1xuXG4gICAgICAgICAgICAvLyDlhajjgabjga7jg6Ljg7zjgrfjg6fjg7PjgpLlgZzmraLjgZnjgotcbiAgICAgICAgICAgIHRoaXMuX21vdGlvbk1hbmFnZXIuc3RvcEFsbE1vdGlvbnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fdXBkYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSZW5kZXJlcigpO1xuICAgICAgICAgICAgdGhpcy5zZXR1cFRleHR1cmVzKCk7XG4gICAgICAgICAgICB0aGlzLmdldFJlbmRlcmVyKCkuc3RhcnRVcChnbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog44GZ44G544Gm44Gu44Oi44O844K344On44Oz44OH44O844K/44KS6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZU1vdGlvbnMoKTogdm9pZCB7XG4gICAgdGhpcy5fbW90aW9ucy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWFqOOBpuOBruihqOaDheODh+ODvOOCv+OCkuino+aUvuOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbGVhc2VFeHByZXNzaW9ucygpOiB2b2lkIHtcbiAgICB0aGlzLl9leHByZXNzaW9ucy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODouODh+ODq+OCkuaPj+eUu+OBmeOCi+WHpueQhuOAguODouODh+ODq+OCkuaPj+eUu+OBmeOCi+epuumWk+OBrlZpZXctUHJvamVjdGlvbuihjOWIl+OCkua4oeOBmeOAglxuICAgKi9cbiAgcHVibGljIGRvRHJhdygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgLy8g44Kt44Oj44Oz44OQ44K544K144Kk44K644KS5rih44GZXG4gICAgY29uc3Qgdmlld3BvcnQ6IG51bWJlcltdID0gWzAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodF07XG5cbiAgICB0aGlzLmdldFJlbmRlcmVyKCkuc2V0UmVuZGVyU3RhdGUoZnJhbWVCdWZmZXIsIHZpZXdwb3J0KTtcbiAgICB0aGlzLmdldFJlbmRlcmVyKCkuZHJhd01vZGVsKCk7XG4gIH1cblxuICAvKipcbiAgICog44Oi44OH44Or44KS5o+P55S744GZ44KL5Yem55CG44CC44Oi44OH44Or44KS5o+P55S744GZ44KL56m66ZaT44GuVmlldy1Qcm9qZWN0aW9u6KGM5YiX44KS5rih44GZ44CCXG4gICAqL1xuICBwdWJsaWMgZHJhdyhtYXRyaXg6IEN1YmlzbU1hdHJpeDQ0KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21vZGVsID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlkIToqq3jgb/ovrzjgb/ntYLkuoblvoxcbiAgICBpZiAodGhpcy5fc3RhdGUgPT0gTG9hZFN0ZXAuQ29tcGxldGVTZXR1cCkge1xuICAgICAgbWF0cml4Lm11bHRpcGx5QnlNYXRyaXgodGhpcy5fbW9kZWxNYXRyaXgpO1xuXG4gICAgICB0aGlzLmdldFJlbmRlcmVyKCkuc2V0TXZwTWF0cml4KG1hdHJpeCk7XG5cbiAgICAgIHRoaXMuZG9EcmF3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9tb2RlbFNldHRpbmcgPSBudWxsO1xuICAgIHRoaXMuX21vZGVsSG9tZURpciA9IG51bGw7XG4gICAgdGhpcy5fdXNlclRpbWVTZWNvbmRzID0gMC4wO1xuXG4gICAgdGhpcy5fZXllQmxpbmtJZHMgPSBuZXcgY3NtVmVjdG9yPEN1YmlzbUlkSGFuZGxlPigpO1xuICAgIHRoaXMuX2xpcFN5bmNJZHMgPSBuZXcgY3NtVmVjdG9yPEN1YmlzbUlkSGFuZGxlPigpO1xuXG4gICAgdGhpcy5fbW90aW9ucyA9IG5ldyBjc21NYXA8c3RyaW5nLCBBQ3ViaXNtTW90aW9uPigpO1xuICAgIHRoaXMuX2V4cHJlc3Npb25zID0gbmV3IGNzbU1hcDxzdHJpbmcsIEFDdWJpc21Nb3Rpb24+KCk7XG5cbiAgICB0aGlzLl9oaXRBcmVhID0gbmV3IGNzbVZlY3Rvcjxjc21SZWN0PigpO1xuICAgIHRoaXMuX3VzZXJBcmVhID0gbmV3IGNzbVZlY3Rvcjxjc21SZWN0PigpO1xuXG4gICAgdGhpcy5faWRQYXJhbUFuZ2xlWCA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUFuZ2xlWFxuICAgICk7XG4gICAgdGhpcy5faWRQYXJhbUFuZ2xlWSA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUFuZ2xlWVxuICAgICk7XG4gICAgdGhpcy5faWRQYXJhbUFuZ2xlWiA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUFuZ2xlWlxuICAgICk7XG4gICAgdGhpcy5faWRQYXJhbUV5ZUJhbGxYID0gQ3ViaXNtRnJhbWV3b3JrLmdldElkTWFuYWdlcigpLmdldElkKFxuICAgICAgQ3ViaXNtRGVmYXVsdFBhcmFtZXRlcklkLlBhcmFtRXllQmFsbFhcbiAgICApO1xuICAgIHRoaXMuX2lkUGFyYW1FeWVCYWxsWSA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUV5ZUJhbGxZXG4gICAgKTtcbiAgICB0aGlzLl9pZFBhcmFtQm9keUFuZ2xlWCA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUJvZHlBbmdsZVhcbiAgICApO1xuXG4gICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkQXNzZXRzO1xuICAgIHRoaXMuX2V4cHJlc3Npb25Db3VudCA9IDA7XG4gICAgdGhpcy5fdGV4dHVyZUNvdW50ID0gMDtcbiAgICB0aGlzLl9tb3Rpb25Db3VudCA9IDA7XG4gICAgdGhpcy5fYWxsTW90aW9uQ291bnQgPSAwO1xuICB9XG5cbiAgX21vZGVsU2V0dGluZzogSUN1YmlzbU1vZGVsU2V0dGluZzsgLy8g44Oi44OH44Or44K744OD44OG44Kj44Oz44Kw5oOF5aCxXG4gIF9tb2RlbEhvbWVEaXI6IHN0cmluZzsgLy8g44Oi44OH44Or44K744OD44OG44Kj44Oz44Kw44GM572u44GL44KM44Gf44OH44Kj44Os44Kv44OI44OqXG4gIF91c2VyVGltZVNlY29uZHM6IG51bWJlcjsgLy8g44OH44Or44K/5pmC6ZaT44Gu56mN566X5YCkW+enkl1cblxuICBfZXllQmxpbmtJZHM6IGNzbVZlY3RvcjxDdWJpc21JZEhhbmRsZT47IC8vIOODouODh+ODq+OBq+ioreWumuOBleOCjOOBn+eerOOBjeapn+iDveeUqOODkeODqeODoeODvOOCv0lEXG4gIF9saXBTeW5jSWRzOiBjc21WZWN0b3I8Q3ViaXNtSWRIYW5kbGU+OyAvLyDjg6Ljg4fjg6vjgavoqK3lrprjgZXjgozjgZ/jg6rjg4Pjg5fjgrfjg7Pjgq/mqZ/og73nlKjjg5Hjg6njg6Hjg7zjgr9JRFxuXG4gIF9tb3Rpb25zOiBjc21NYXA8c3RyaW5nLCBBQ3ViaXNtTW90aW9uPjsgLy8g6Kqt44G/6L6844G+44KM44Gm44GE44KL44Oi44O844K344On44Oz44Gu44Oq44K544OIXG4gIF9leHByZXNzaW9uczogY3NtTWFwPHN0cmluZywgQUN1YmlzbU1vdGlvbj47IC8vIOiqreOBv+i+vOOBvuOCjOOBpuOBhOOCi+ihqOaDheOBruODquOCueODiFxuXG4gIF9oaXRBcmVhOiBjc21WZWN0b3I8Y3NtUmVjdD47XG4gIF91c2VyQXJlYTogY3NtVmVjdG9yPGNzbVJlY3Q+O1xuXG4gIF9pZFBhcmFtQW5nbGVYOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtQW5nbGVYXG4gIF9pZFBhcmFtQW5nbGVZOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtQW5nbGVZXG4gIF9pZFBhcmFtQW5nbGVaOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtQW5nbGVaXG4gIF9pZFBhcmFtRXllQmFsbFg6IEN1YmlzbUlkSGFuZGxlOyAvLyDjg5Hjg6njg6Hjg7zjgr9JRDogUGFyYW1FeWVCYWxsWFxuICBfaWRQYXJhbUV5ZUJhbGxZOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtRXllQkFsbFlcbiAgX2lkUGFyYW1Cb2R5QW5nbGVYOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtQm9keUFuZ2xlWFxuXG4gIF9zdGF0ZTogbnVtYmVyOyAvLyDnj77lnKjjga7jgrnjg4bjg7zjgr/jgrnnrqHnkIbnlKhcbiAgX2V4cHJlc3Npb25Db3VudDogbnVtYmVyOyAvLyDooajmg4Xjg4fjg7zjgr/jgqvjgqbjg7Pjg4hcbiAgX3RleHR1cmVDb3VudDogbnVtYmVyOyAvLyDjg4bjgq/jgrnjg4Hjg6Pjgqvjgqbjg7Pjg4hcbiAgX21vdGlvbkNvdW50OiBudW1iZXI7IC8vIOODouODvOOCt+ODp+ODs+ODh+ODvOOCv+OCq+OCpuODs+ODiFxuICBfYWxsTW90aW9uQ291bnQ6IG51bWJlcjsgLy8g44Oi44O844K344On44Oz57eP5pWwXG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBnbCwgY2FudmFzIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuXG4vKipcbiAqIOOCueODl+ODqeOCpOODiOOCkuWun+ijheOBmeOCi+OCr+ODqeOCuVxuICpcbiAqIOODhuOCr+OCueODgeODo++8qe+8pOOAgVJlY3Tjga7nrqHnkIZcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBTcHJpdGUge1xuICAvKipcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/XG4gICAqIEBwYXJhbSB4ICAgICAgICAgICAgeOW6p+aomVxuICAgKiBAcGFyYW0geSAgICAgICAgICAgIHnluqfmqJlcbiAgICogQHBhcmFtIHdpZHRoICAgICAgICDmqKrluYVcbiAgICogQHBhcmFtIGhlaWdodCAgICAgICDpq5jjgZVcbiAgICogQHBhcmFtIHRleHR1cmVJZCAgICDjg4bjgq/jgrnjg4Hjg6NcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICB0ZXh0dXJlSWQ6IFdlYkdMVGV4dHVyZVxuICApIHtcbiAgICB0aGlzLl9yZWN0ID0gbmV3IFJlY3QoKTtcbiAgICB0aGlzLl9yZWN0LmxlZnQgPSB4IC0gd2lkdGggKiAwLjU7XG4gICAgdGhpcy5fcmVjdC5yaWdodCA9IHggKyB3aWR0aCAqIDAuNTtcbiAgICB0aGlzLl9yZWN0LnVwID0geSArIGhlaWdodCAqIDAuNTtcbiAgICB0aGlzLl9yZWN0LmRvd24gPSB5IC0gaGVpZ2h0ICogMC41O1xuICAgIHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlSWQ7XG4gICAgdGhpcy5fdmVydGV4QnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLl91dkJ1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5faW5kZXhCdWZmZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fcG9zaXRpb25Mb2NhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fdXZMb2NhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fdGV4dHVyZUxvY2F0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuX3Bvc2l0aW9uQXJyYXkgPSBudWxsO1xuICAgIHRoaXMuX3V2QXJyYXkgPSBudWxsO1xuICAgIHRoaXMuX2luZGV4QXJyYXkgPSBudWxsO1xuXG4gICAgdGhpcy5fZmlyc3REcmF3ID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIHRoaXMuX3JlY3QgPSBudWxsO1xuXG4gICAgZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLl90ZXh0dXJlKTtcbiAgICB0aGlzLl90ZXh0dXJlID0gbnVsbDtcblxuICAgIGdsLmRlbGV0ZUJ1ZmZlcih0aGlzLl91dkJ1ZmZlcik7XG4gICAgdGhpcy5fdXZCdWZmZXIgPSBudWxsO1xuXG4gICAgZ2wuZGVsZXRlQnVmZmVyKHRoaXMuX3ZlcnRleEJ1ZmZlcik7XG4gICAgdGhpcy5fdmVydGV4QnVmZmVyID0gbnVsbDtcblxuICAgIGdsLmRlbGV0ZUJ1ZmZlcih0aGlzLl9pbmRleEJ1ZmZlcik7XG4gICAgdGhpcy5faW5kZXhCdWZmZXIgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOODhuOCr+OCueODgeODo+OCkui/lOOBmVxuICAgKi9cbiAgcHVibGljIGdldFRleHR1cmUoKTogV2ViR0xUZXh0dXJlIHtcbiAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmj4/nlLvjgZnjgovjgIJcbiAgICogQHBhcmFtIHByb2dyYW1JZCDjgrfjgqfjg7zjg4Djg7zjg5fjg63jgrDjg6njg6BcbiAgICogQHBhcmFtIGNhbnZhcyDmj4/nlLvjgZnjgovjgq3jg6Pjg7Pjg5Hjgrnmg4XloLFcbiAgICovXG4gIHB1YmxpYyByZW5kZXIocHJvZ3JhbUlkOiBXZWJHTFByb2dyYW0pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdGV4dHVyZSA9PSBudWxsKSB7XG4gICAgICAvLyDjg63jg7zjg4njgYzlrozkuobjgZfjgabjgYTjgarjgYRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDliJ3lm57mj4/nlLvmmYJcbiAgICBpZiAodGhpcy5fZmlyc3REcmF3KSB7XG4gICAgICAvLyDkvZXnlarnm67jga5hdHRyaWJ1dGXlpInmlbDjgYvlj5blvpdcbiAgICAgIHRoaXMuX3Bvc2l0aW9uTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtSWQsICdwb3NpdGlvbicpO1xuICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fcG9zaXRpb25Mb2NhdGlvbik7XG5cbiAgICAgIHRoaXMuX3V2TG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtSWQsICd1dicpO1xuICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fdXZMb2NhdGlvbik7XG5cbiAgICAgIC8vIOS9leeVquebruOBrnVuaWZvcm3lpInmlbDjgYvlj5blvpdcbiAgICAgIHRoaXMuX3RleHR1cmVMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtSWQsICd0ZXh0dXJlJyk7XG5cbiAgICAgIC8vIHVuaWZvcm3lsZ7mgKfjga7nmbvpjLJcbiAgICAgIGdsLnVuaWZvcm0xaSh0aGlzLl90ZXh0dXJlTG9jYXRpb24sIDApO1xuXG4gICAgICAvLyB1duODkOODg+ODleOCoeOAgeW6p+aomeWIneacn+WMllxuICAgICAge1xuICAgICAgICB0aGlzLl91dkFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgICAgMS4wLFxuICAgICAgICAgIDAuMCxcbiAgICAgICAgICAwLjAsXG4gICAgICAgICAgMC4wLFxuICAgICAgICAgIDAuMCxcbiAgICAgICAgICAxLjAsXG4gICAgICAgICAgMS4wLFxuICAgICAgICAgIDEuMFxuICAgICAgICBdKTtcblxuICAgICAgICAvLyB1duODkOODg+ODleOCoeOCkuS9nOaIkFxuICAgICAgICB0aGlzLl91dkJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgfVxuXG4gICAgICAvLyDpoILngrnjg5Djg4Pjg5XjgqHjgIHluqfmqJnliJ3mnJ/ljJZcbiAgICAgIHtcbiAgICAgICAgY29uc3QgbWF4V2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgICAgICAgLy8g6aCC54K544OH44O844K/XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAodGhpcy5fcmVjdC5yaWdodCAtIG1heFdpZHRoICogMC41KSAvIChtYXhXaWR0aCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QudXAgLSBtYXhIZWlnaHQgKiAwLjUpIC8gKG1heEhlaWdodCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QubGVmdCAtIG1heFdpZHRoICogMC41KSAvIChtYXhXaWR0aCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QudXAgLSBtYXhIZWlnaHQgKiAwLjUpIC8gKG1heEhlaWdodCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QubGVmdCAtIG1heFdpZHRoICogMC41KSAvIChtYXhXaWR0aCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QuZG93biAtIG1heEhlaWdodCAqIDAuNSkgLyAobWF4SGVpZ2h0ICogMC41KSxcbiAgICAgICAgICAodGhpcy5fcmVjdC5yaWdodCAtIG1heFdpZHRoICogMC41KSAvIChtYXhXaWR0aCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QuZG93biAtIG1heEhlaWdodCAqIDAuNSkgLyAobWF4SGVpZ2h0ICogMC41KVxuICAgICAgICBdKTtcblxuICAgICAgICAvLyDpoILngrnjg5Djg4Pjg5XjgqHjgpLkvZzmiJBcbiAgICAgICAgdGhpcy5fdmVydGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIOmggueCueOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOAgeWIneacn+WMllxuICAgICAge1xuICAgICAgICAvLyDjgqTjg7Pjg4fjg4Pjgq/jgrnjg4fjg7zjgr9cbiAgICAgICAgdGhpcy5faW5kZXhBcnJheSA9IG5ldyBVaW50MTZBcnJheShbMCwgMSwgMiwgMywgMiwgMF0pO1xuXG4gICAgICAgIC8vIOOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOCkuS9nOaIkFxuICAgICAgICB0aGlzLl9pbmRleEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9maXJzdERyYXcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBVVuW6p+aomeeZu+mMslxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl91dkJ1ZmZlcik7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHRoaXMuX3V2QXJyYXksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIGF0dHJpYnV0ZeWxnuaAp+OCkueZu+mMslxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fdXZMb2NhdGlvbiwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOmggueCueW6p+aomeOCkueZu+mMslxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl92ZXJ0ZXhCdWZmZXIpO1xuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl9wb3NpdGlvbkFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyBhdHRyaWJ1dGXlsZ7mgKfjgpLnmbvpjLJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuX3Bvc2l0aW9uTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLkvZzmiJBcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLl9pbmRleEJ1ZmZlcik7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5faW5kZXhBcnJheSwgZ2wuRFlOQU1JQ19EUkFXKTtcblxuICAgIC8vIOODouODh+ODq+OBruaPj+eUu1xuICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMuX3RleHR1cmUpO1xuICAgIGdsLmRyYXdFbGVtZW50cyhcbiAgICAgIGdsLlRSSUFOR0xFUyxcbiAgICAgIHRoaXMuX2luZGV4QXJyYXkubGVuZ3RoLFxuICAgICAgZ2wuVU5TSUdORURfU0hPUlQsXG4gICAgICAwXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlvZPjgZ/jgorliKTlrppcbiAgICogQHBhcmFtIHBvaW50WCB45bqn5qiZXG4gICAqIEBwYXJhbSBwb2ludFkgeeW6p+aomVxuICAgKi9cbiAgcHVibGljIGlzSGl0KHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIC8vIOeUu+mdouOCteOCpOOCuuOCkuWPluW+l+OBmeOCi+OAglxuICAgIGNvbnN0IHsgaGVpZ2h0IH0gPSBjYW52YXM7XG5cbiAgICAvLyBZ5bqn5qiZ44Gv5aSJ5o+b44GZ44KL5b+F6KaB44GC44KKXG4gICAgY29uc3QgeSA9IGhlaWdodCAtIHBvaW50WTtcblxuICAgIHJldHVybiAoXG4gICAgICBwb2ludFggPj0gdGhpcy5fcmVjdC5sZWZ0ICYmXG4gICAgICBwb2ludFggPD0gdGhpcy5fcmVjdC5yaWdodCAmJlxuICAgICAgeSA8PSB0aGlzLl9yZWN0LnVwICYmXG4gICAgICB5ID49IHRoaXMuX3JlY3QuZG93blxuICAgICk7XG4gIH1cblxuICBfdGV4dHVyZTogV2ViR0xUZXh0dXJlOyAvLyDjg4bjgq/jgrnjg4Hjg6NcbiAgX3ZlcnRleEJ1ZmZlcjogV2ViR0xCdWZmZXI7IC8vIOmggueCueODkOODg+ODleOCoVxuICBfdXZCdWZmZXI6IFdlYkdMQnVmZmVyOyAvLyB1dumggueCueODkOODg+ODleOCoVxuICBfaW5kZXhCdWZmZXI6IFdlYkdMQnVmZmVyOyAvLyDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqFcbiAgX3JlY3Q6IFJlY3Q7IC8vIOefqeW9olxuXG4gIF9wb3NpdGlvbkxvY2F0aW9uOiBudW1iZXI7XG4gIF91dkxvY2F0aW9uOiBudW1iZXI7XG4gIF90ZXh0dXJlTG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xuXG4gIF9wb3NpdGlvbkFycmF5OiBGbG9hdDMyQXJyYXk7XG4gIF91dkFycmF5OiBGbG9hdDMyQXJyYXk7XG4gIF9pbmRleEFycmF5OiBVaW50MTZBcnJheTtcblxuICBfZmlyc3REcmF3OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgUmVjdCB7XG4gIHB1YmxpYyBsZWZ0OiBudW1iZXI7IC8vIOW3pui+ulxuICBwdWJsaWMgcmlnaHQ6IG51bWJlcjsgLy8g5Y+z6L66XG4gIHB1YmxpYyB1cDogbnVtYmVyOyAvLyDkuIrovrpcbiAgcHVibGljIGRvd246IG51bWJlcjsgLy8g5LiL6L66XG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtdmVjdG9yIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXZlY3Rvcic7XG5pbXBvcnQgQ3NtX2NzbVZlY3RvciA9IGNzbXZlY3Rvci5jc21WZWN0b3I7XG5pbXBvcnQgY3NtVmVjdG9yX2l0ZXJhdG9yID0gY3NtdmVjdG9yLml0ZXJhdG9yO1xuaW1wb3J0IHsgZ2wgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5cbi8qKlxuICog44OG44Kv44K544OB44Oj566h55CG44Kv44Op44K5XG4gKiDnlLvlg4/oqq3jgb/ovrzjgb/jgIHnrqHnkIbjgpLooYzjgYbjgq/jg6njgrnjgIJcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBUZXh0dXJlTWFuYWdlciB7XG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3RleHR1cmVzID0gbmV3IENzbV9jc21WZWN0b3I8VGV4dHVyZUluZm8+KCk7XG4gIH1cblxuICAvKipcbiAgICog6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBmb3IgKFxuICAgICAgbGV0IGl0ZTogY3NtVmVjdG9yX2l0ZXJhdG9yPFRleHR1cmVJbmZvPiA9IHRoaXMuX3RleHR1cmVzLmJlZ2luKCk7XG4gICAgICBpdGUubm90RXF1YWwodGhpcy5fdGV4dHVyZXMuZW5kKCkpO1xuICAgICAgaXRlLnByZUluY3JlbWVudCgpXG4gICAgKSB7XG4gICAgICBnbC5kZWxldGVUZXh0dXJlKGl0ZS5wdHIoKS5pZCk7XG4gICAgfVxuICAgIHRoaXMuX3RleHR1cmVzID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/oqq3jgb/ovrzjgb9cbiAgICpcbiAgICogQHBhcmFtIGZpbGVOYW1lIOiqreOBv+i+vOOCgOeUu+WDj+ODleOCoeOCpOODq+ODkeOCueWQjVxuICAgKiBAcGFyYW0gdXNlUHJlbXVsdGlwbHkgUHJlbXVsdOWHpueQhuOCkuacieWKueOBq+OBmeOCi+OBi1xuICAgKiBAcmV0dXJuIOeUu+WDj+aDheWgseOAgeiqreOBv+i+vOOBv+WkseaVl+aZguOBr251bGzjgpLov5TjgZlcbiAgICovXG4gIHB1YmxpYyBjcmVhdGVUZXh0dXJlRnJvbVBuZ0ZpbGUoXG4gICAgZmlsZU5hbWU6IHN0cmluZyxcbiAgICB1c2VQcmVtdWx0aXBseTogYm9vbGVhbixcbiAgICBjYWxsYmFjazogKHRleHR1cmVJbmZvOiBUZXh0dXJlSW5mbykgPT4gdm9pZFxuICApOiB2b2lkIHtcbiAgICAvLyBzZWFyY2ggbG9hZGVkIHRleHR1cmUgYWxyZWFkeVxuICAgIGZvciAoXG4gICAgICBsZXQgaXRlOiBjc21WZWN0b3JfaXRlcmF0b3I8VGV4dHVyZUluZm8+ID0gdGhpcy5fdGV4dHVyZXMuYmVnaW4oKTtcbiAgICAgIGl0ZS5ub3RFcXVhbCh0aGlzLl90ZXh0dXJlcy5lbmQoKSk7XG4gICAgICBpdGUucHJlSW5jcmVtZW50KClcbiAgICApIHtcbiAgICAgIGlmIChcbiAgICAgICAgaXRlLnB0cigpLmZpbGVOYW1lID09IGZpbGVOYW1lICYmXG4gICAgICAgIGl0ZS5wdHIoKS51c2VQcmVtdWx0cGx5ID09IHVzZVByZW11bHRpcGx5XG4gICAgICApIHtcbiAgICAgICAgLy8gMuWbnuebruS7pemZjeOBr+OCreODo+ODg+OCt+ODpeOBjOS9v+eUqOOBleOCjOOCiyjlvoXjgaHmmYLplpPjgarjgZcpXG4gICAgICAgIC8vIFdlYktpdOOBp+OBr+WQjOOBmEltYWdl44Gub25sb2Fk44KS5YaN5bqm5ZG844G244Gr44Gv5YaN44Kk44Oz44K544K/44Oz44K544GM5b+F6KaBXG4gICAgICAgIC8vIOips+e0sO+8mmh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MDI0MTgxXG4gICAgICAgIGl0ZS5wdHIoKS5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaXRlLnB0cigpLmltZy5vbmxvYWQgPSAoKTogdm9pZCA9PiBjYWxsYmFjayhpdGUucHRyKCkpO1xuICAgICAgICBpdGUucHRyKCkuaW1nLnNyYyA9IGZpbGVOYW1lO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g44OH44O844K/44Gu44Kq44Oz44Ot44O844OJ44KS44OI44Oq44Ks44O844Gr44GZ44KLXG4gICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLm9ubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxuICAgICAgY29uc3QgdGV4OiBXZWJHTFRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OCkumBuOaKnlxuICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4KTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44Gr44OU44Kv44K744Or44KS5pu444GN6L6844KAXG4gICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxuICAgICAgICBnbC5URVhUVVJFXzJELFxuICAgICAgICBnbC5URVhUVVJFX01JTl9GSUxURVIsXG4gICAgICAgIGdsLkxJTkVBUl9NSVBNQVBfTElORUFSXG4gICAgICApO1xuICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XG5cbiAgICAgIC8vIFByZW11bHTlh6bnkIbjgpLooYzjgo/jgZvjgotcbiAgICAgIGlmICh1c2VQcmVtdWx0aXBseSkge1xuICAgICAgICBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIDEpO1xuICAgICAgfVxuXG4gICAgICAvLyDjg4bjgq/jgrnjg4Hjg6Pjgavjg5Tjgq/jgrvjg6vjgpLmm7jjgY3ovrzjgoBcbiAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1nKTtcblxuICAgICAgLy8g44Of44OD44OX44Oe44OD44OX44KS55Sf5oiQXG4gICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44KS44OQ44Kk44Oz44OJXG4gICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcblxuICAgICAgY29uc3QgdGV4dHVyZUluZm86IFRleHR1cmVJbmZvID0gbmV3IFRleHR1cmVJbmZvKCk7XG4gICAgICBpZiAodGV4dHVyZUluZm8gIT0gbnVsbCkge1xuICAgICAgICB0ZXh0dXJlSW5mby5maWxlTmFtZSA9IGZpbGVOYW1lO1xuICAgICAgICB0ZXh0dXJlSW5mby53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgdGV4dHVyZUluZm8uaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICAgICAgdGV4dHVyZUluZm8uaWQgPSB0ZXg7XG4gICAgICAgIHRleHR1cmVJbmZvLmltZyA9IGltZztcbiAgICAgICAgdGV4dHVyZUluZm8udXNlUHJlbXVsdHBseSA9IHVzZVByZW11bHRpcGx5O1xuICAgICAgICB0aGlzLl90ZXh0dXJlcy5wdXNoQmFjayh0ZXh0dXJlSW5mbyk7XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKHRleHR1cmVJbmZvKTtcbiAgICB9O1xuICAgIGltZy5zcmMgPSBmaWxlTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/jga7op6PmlL5cbiAgICpcbiAgICog6YWN5YiX44Gr5a2Y5Zyo44GZ44KL55S75YOP5YWo44Gm44KS6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZVRleHR1cmVzKCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGV4dHVyZXMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIHRoaXMuX3RleHR1cmVzLnNldChpLCBudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLl90ZXh0dXJlcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOeUu+WDj+OBruino+aUvlxuICAgKlxuICAgKiDmjIflrprjgZfjgZ/jg4bjgq/jgrnjg4Hjg6Pjga7nlLvlg4/jgpLop6PmlL7jgZnjgovjgIJcbiAgICogQHBhcmFtIHRleHR1cmUg6Kej5pS+44GZ44KL44OG44Kv44K544OB44OjXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZVRleHR1cmVCeVRleHR1cmUodGV4dHVyZTogV2ViR0xUZXh0dXJlKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZXh0dXJlcy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX3RleHR1cmVzLmF0KGkpLmlkICE9IHRleHR1cmUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RleHR1cmVzLnNldChpLCBudWxsKTtcbiAgICAgIHRoaXMuX3RleHR1cmVzLnJlbW92ZShpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/jga7op6PmlL5cbiAgICpcbiAgICog5oyH5a6a44GX44Gf5ZCN5YmN44Gu55S75YOP44KS6Kej5pS+44GZ44KL44CCXG4gICAqIEBwYXJhbSBmaWxlTmFtZSDop6PmlL7jgZnjgovnlLvlg4/jg5XjgqHjgqTjg6vjg5HjgrnlkI1cbiAgICovXG4gIHB1YmxpYyByZWxlYXNlVGV4dHVyZUJ5RmlsZVBhdGgoZmlsZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGV4dHVyZXMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl90ZXh0dXJlcy5hdChpKS5maWxlTmFtZSA9PSBmaWxlTmFtZSkge1xuICAgICAgICB0aGlzLl90ZXh0dXJlcy5zZXQoaSwgbnVsbCk7XG4gICAgICAgIHRoaXMuX3RleHR1cmVzLnJlbW92ZShpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3RleHR1cmVzOiBDc21fY3NtVmVjdG9yPFRleHR1cmVJbmZvPjtcbn1cblxuLyoqXG4gKiDnlLvlg4/mg4XloLHmp4vpgKDkvZNcbiAqL1xuZXhwb3J0IGNsYXNzIFRleHR1cmVJbmZvIHtcbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50OyAvLyDnlLvlg49cbiAgaWQ6IFdlYkdMVGV4dHVyZSA9IG51bGw7IC8vIOODhuOCr+OCueODgeODo1xuICB3aWR0aCA9IDA7IC8vIOaoquW5hVxuICBoZWlnaHQgPSAwOyAvLyDpq5jjgZVcbiAgdXNlUHJlbXVsdHBseTogYm9vbGVhbjsgLy8gUHJlbXVsdOWHpueQhuOCkuacieWKueOBq+OBmeOCi+OBi1xuICBmaWxlTmFtZTogc3RyaW5nOyAvLyDjg5XjgqHjgqTjg6vlkI1cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21NYXRyaXg0NCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtdmlld21hdHJpeCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc212aWV3bWF0cml4JztcbmltcG9ydCBDc21fQ3ViaXNtVmlld01hdHJpeCA9IGN1YmlzbXZpZXdtYXRyaXguQ3ViaXNtVmlld01hdHJpeDtcbmltcG9ydCBDc21fQ3ViaXNtTWF0cml4NDQgPSBjdWJpc21NYXRyaXg0NC5DdWJpc21NYXRyaXg0NDtcbmltcG9ydCB7IFRvdWNoTWFuYWdlciB9IGZyb20gJy4vdG91Y2htYW5hZ2VyJztcbmltcG9ydCB7IExBcHBMaXZlMkRNYW5hZ2VyIH0gZnJvbSAnLi9sYXBwbGl2ZTJkbWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwRGVsZWdhdGUsIGNhbnZhcywgZ2wgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5pbXBvcnQgeyBMQXBwU3ByaXRlIH0gZnJvbSAnLi9sYXBwc3ByaXRlJztcbmltcG9ydCB7IFRleHR1cmVJbmZvIH0gZnJvbSAnLi9sYXBwdGV4dHVyZW1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5cbi8qKlxuICog5o+P55S744Kv44Op44K544CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwVmlldyB7XG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Byb2dyYW1JZCA9IG51bGw7XG4gICAgdGhpcy5fYmFjayA9IG51bGw7XG4gICAgdGhpcy5fZ2VhciA9IG51bGw7XG5cbiAgICAvLyDjgr/jg4Pjg4HplqLkv4Ljga7jgqTjg5njg7Pjg4jnrqHnkIZcbiAgICB0aGlzLl90b3VjaE1hbmFnZXIgPSBuZXcgVG91Y2hNYW5hZ2VyKCk7XG5cbiAgICAvLyDjg4fjg5DjgqTjgrnluqfmqJnjgYvjgonjgrnjgq/jg6rjg7zjg7PluqfmqJnjgavlpInmj5vjgZnjgovjgZ/jgoHjga5cbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbiA9IG5ldyBDc21fQ3ViaXNtTWF0cml4NDQoKTtcblxuICAgIC8vIOeUu+mdouOBruihqOekuuOBruaLoeWkp+e4ruWwj+OChOenu+WLleOBruWkieaPm+OCkuihjOOBhuihjOWIl1xuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBuZXcgQ3NtX0N1YmlzbVZpZXdNYXRyaXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDliJ3mnJ/ljJbjgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY2FudmFzO1xuXG4gICAgY29uc3QgcmF0aW86IG51bWJlciA9IGhlaWdodCAvIHdpZHRoO1xuICAgIGNvbnN0IGxlZnQ6IG51bWJlciA9IExBcHBEZWZpbmUuVmlld0xvZ2ljYWxMZWZ0O1xuICAgIGNvbnN0IHJpZ2h0OiBudW1iZXIgPSBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsUmlnaHQ7XG4gICAgY29uc3QgYm90dG9tOiBudW1iZXIgPSAtcmF0aW87XG4gICAgY29uc3QgdG9wOiBudW1iZXIgPSByYXRpbztcblxuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0U2NyZWVuUmVjdChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3ApOyAvLyDjg4fjg5DjgqTjgrnjgavlr77lv5zjgZnjgovnlLvpnaLjga7nr4Tlm7LjgIIgWOOBruW3puerr+OAgVjjga7lj7Pnq6/jgIFZ44Gu5LiL56uv44CBWeOBruS4iuerr1xuXG4gICAgY29uc3Qgc2NyZWVuVzogbnVtYmVyID0gTWF0aC5hYnMobGVmdCAtIHJpZ2h0KTtcbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbi5zY2FsZVJlbGF0aXZlKHNjcmVlblcgLyB3aWR0aCwgLXNjcmVlblcgLyB3aWR0aCk7XG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNsYXRlUmVsYXRpdmUoLXdpZHRoICogMC41LCAtaGVpZ2h0ICogMC41KTtcblxuICAgIC8vIOihqOekuuevhOWbsuOBruioreWumlxuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0TWF4U2NhbGUoTEFwcERlZmluZS5WaWV3TWF4U2NhbGUpOyAvLyDpmZDnlYzmi6HlvLXnjodcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldE1pblNjYWxlKExBcHBEZWZpbmUuVmlld01pblNjYWxlKTsgLy8g6ZmQ55WM57iu5bCP546HXG5cbiAgICAvLyDooajnpLrjgafjgY3jgovmnIDlpKfnr4Tlm7JcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldE1heFNjcmVlblJlY3QoXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4TGVmdCxcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhSaWdodCxcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhCb3R0b20sXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4VG9wXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmlL7jgZnjgotcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBudWxsO1xuICAgIHRoaXMuX3RvdWNoTWFuYWdlciA9IG51bGw7XG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4gPSBudWxsO1xuXG4gICAgdGhpcy5fZ2Vhci5yZWxlYXNlKCk7XG4gICAgdGhpcy5fZ2VhciA9IG51bGw7XG5cbiAgICB0aGlzLl9iYWNrLnJlbGVhc2UoKTtcbiAgICB0aGlzLl9iYWNrID0gbnVsbDtcblxuICAgIGdsLmRlbGV0ZVByb2dyYW0odGhpcy5fcHJvZ3JhbUlkKTtcbiAgICB0aGlzLl9wcm9ncmFtSWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOaPj+eUu+OBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcbiAgICBnbC51c2VQcm9ncmFtKHRoaXMuX3Byb2dyYW1JZCk7XG5cbiAgICBpZiAodGhpcy5fYmFjaykge1xuICAgICAgdGhpcy5fYmFjay5yZW5kZXIodGhpcy5fcHJvZ3JhbUlkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2dlYXIpIHtcbiAgICAgIHRoaXMuX2dlYXIucmVuZGVyKHRoaXMuX3Byb2dyYW1JZCk7XG4gICAgfVxuXG4gICAgZ2wuZmx1c2goKTtcblxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuICAgIGxpdmUyRE1hbmFnZXIub25VcGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/jga7liJ3mnJ/ljJbjgpLooYzjgYbjgIJcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplU3ByaXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IHdpZHRoOiBudW1iZXIgPSBjYW52YXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0OiBudW1iZXIgPSBjYW52YXMuaGVpZ2h0O1xuXG4gICAgY29uc3QgdGV4dHVyZU1hbmFnZXIgPSBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlTWFuYWdlcigpO1xuICAgIGNvbnN0IHJlc291cmNlc1BhdGggPSBMQXBwRGVmaW5lLlJlc291cmNlc1BhdGg7XG5cbiAgICBsZXQgaW1hZ2VOYW1lID0gJyc7XG5cbiAgICAvLyDog4zmma/nlLvlg4/liJ3mnJ/ljJZcbiAgICBpbWFnZU5hbWUgPSBMQXBwRGVmaW5lLkJhY2tJbWFnZU5hbWU7XG5cbiAgICAvLyDpnZ7lkIzmnJ/jgarjga7jgafjgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbDjgpLkvZzmiJBcbiAgICBjb25zdCBpbml0QmFja0dyb3VuZFRleHR1cmUgPSAodGV4dHVyZUluZm86IFRleHR1cmVJbmZvKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB4OiBudW1iZXIgPSB3aWR0aCAqIDAuNTtcbiAgICAgIGNvbnN0IHk6IG51bWJlciA9IGhlaWdodCAqIDAuNTtcblxuICAgICAgY29uc3QgZndpZHRoID0gdGV4dHVyZUluZm8ud2lkdGggKiAyLjA7XG4gICAgICBjb25zdCBmaGVpZ2h0ID0gaGVpZ2h0ICogMC45NTtcbiAgICAgIHRoaXMuX2JhY2sgPSBuZXcgTEFwcFNwcml0ZSh4LCB5LCBmd2lkdGgsIGZoZWlnaHQsIHRleHR1cmVJbmZvLmlkKTtcbiAgICB9O1xuXG4gICAgdGV4dHVyZU1hbmFnZXIuY3JlYXRlVGV4dHVyZUZyb21QbmdGaWxlKFxuICAgICAgcmVzb3VyY2VzUGF0aCArIGltYWdlTmFtZSxcbiAgICAgIGZhbHNlLFxuICAgICAgaW5pdEJhY2tHcm91bmRUZXh0dXJlXG4gICAgKTtcblxuICAgIC8vIOatr+i7iueUu+WDj+WIneacn+WMllxuICAgIGltYWdlTmFtZSA9IExBcHBEZWZpbmUuR2VhckltYWdlTmFtZTtcbiAgICBjb25zdCBpbml0R2VhclRleHR1cmUgPSAodGV4dHVyZUluZm86IFRleHR1cmVJbmZvKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB4ID0gd2lkdGggLSB0ZXh0dXJlSW5mby53aWR0aCAqIDAuNTtcbiAgICAgIGNvbnN0IHkgPSBoZWlnaHQgLSB0ZXh0dXJlSW5mby5oZWlnaHQgKiAwLjU7XG4gICAgICBjb25zdCBmd2lkdGggPSB0ZXh0dXJlSW5mby53aWR0aDtcbiAgICAgIGNvbnN0IGZoZWlnaHQgPSB0ZXh0dXJlSW5mby5oZWlnaHQ7XG4gICAgICB0aGlzLl9nZWFyID0gbmV3IExBcHBTcHJpdGUoeCwgeSwgZndpZHRoLCBmaGVpZ2h0LCB0ZXh0dXJlSW5mby5pZCk7XG4gICAgfTtcblxuICAgIHRleHR1cmVNYW5hZ2VyLmNyZWF0ZVRleHR1cmVGcm9tUG5nRmlsZShcbiAgICAgIHJlc291cmNlc1BhdGggKyBpbWFnZU5hbWUsXG4gICAgICBmYWxzZSxcbiAgICAgIGluaXRHZWFyVGV4dHVyZVxuICAgICk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djg7zjgpLkvZzmiJBcbiAgICBpZiAodGhpcy5fcHJvZ3JhbUlkID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3Byb2dyYW1JZCA9IExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLmNyZWF0ZVNoYWRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDjgr/jg4Pjg4HjgZXjgozjgZ/mmYLjgavlkbzjgbDjgozjgovjgIJcbiAgICpcbiAgICogQHBhcmFtIHBvaW50WCDjgrnjgq/jg6rjg7zjg7NY5bqn5qiZXG4gICAqIEBwYXJhbSBwb2ludFkg44K544Kv44Oq44O844OzWeW6p+aomVxuICAgKi9cbiAgcHVibGljIG9uVG91Y2hlc0JlZ2FuKHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX3RvdWNoTWFuYWdlci50b3VjaGVzQmVnYW4ocG9pbnRYLCBwb2ludFkpO1xuICB9XG5cbiAgLyoqXG4gICAqIOOCv+ODg+ODgeOBl+OBpuOBhOOCi+OBqOOBjeOBq+ODneOCpOODs+OCv+OBjOWLleOBhOOBn+OCieWRvOOBsOOCjOOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIOOCueOCr+ODquODvOODs1jluqfmqJlcbiAgICogQHBhcmFtIHBvaW50WSDjgrnjgq/jg6rjg7zjg7NZ5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzTW92ZWQocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qgdmlld1g6IG51bWJlciA9IHRoaXMudHJhbnNmb3JtVmlld1godGhpcy5fdG91Y2hNYW5hZ2VyLmdldFgoKSk7XG4gICAgY29uc3Qgdmlld1k6IG51bWJlciA9IHRoaXMudHJhbnNmb3JtVmlld1kodGhpcy5fdG91Y2hNYW5hZ2VyLmdldFkoKSk7XG5cbiAgICB0aGlzLl90b3VjaE1hbmFnZXIudG91Y2hlc01vdmVkKHBvaW50WCwgcG9pbnRZKTtcblxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICBsaXZlMkRNYW5hZ2VyLm9uRHJhZyh2aWV3WCwgdmlld1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIOOCv+ODg+ODgeOBjOe1guS6huOBl+OBn+OCieWRvOOBsOOCjOOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIOOCueOCr+ODquODvOODs1jluqfmqJlcbiAgICogQHBhcmFtIHBvaW50WSDjgrnjgq/jg6rjg7zjg7NZ5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzRW5kZWQocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8g44K/44OD44OB57WC5LqGXG4gICAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICAgIGxpdmUyRE1hbmFnZXIub25EcmFnKDAuMCwgMC4wKTtcblxuICAgIHtcbiAgICAgIC8vIOOCt+ODs+OCsOODq+OCv+ODg+ODl1xuICAgICAgY29uc3QgeDogbnVtYmVyID0gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWChcbiAgICAgICAgdGhpcy5fdG91Y2hNYW5hZ2VyLmdldFgoKVxuICAgICAgKTsgLy8g6KuW55CG5bqn5qiZ5aSJ5o+b44GX44Gf5bqn5qiZ44KS5Y+W5b6X44CCXG4gICAgICBjb25zdCB5OiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1ZKFxuICAgICAgICB0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WSgpXG4gICAgICApOyAvLyDoq5bnkIbluqfmqJnlpInljJbjgZfjgZ/luqfmqJnjgpLlj5blvpfjgIJcblxuICAgICAgaWYgKExBcHBEZWZpbmUuRGVidWdUb3VjaExvZ0VuYWJsZSkge1xuICAgICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0FQUF10b3VjaGVzRW5kZWQgeDogJHt4fSB5OiAke3l9YCk7XG4gICAgICB9XG4gICAgICBsaXZlMkRNYW5hZ2VyLm9uVGFwKHgsIHkpO1xuXG4gICAgICAvLyDmra/ou4rjgavjgr/jg4Pjg5fjgZfjgZ/jgYtcbiAgICAgIGlmICh0aGlzLl9nZWFyLmlzSGl0KHBvaW50WCwgcG9pbnRZKSkge1xuICAgICAgICBsaXZlMkRNYW5hZ2VyLm5leHRTY2VuZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBY5bqn5qiZ44KSVmlld+W6p+aomeOBq+WkieaPm+OBmeOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gZGV2aWNlWCDjg4fjg5DjgqTjgrlY5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtVmlld1goZGV2aWNlWDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBzY3JlZW5YOiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1YKGRldmljZVgpOyAvLyDoq5bnkIbluqfmqJnlpInmj5vjgZfjgZ/luqfmqJnjgpLlj5blvpfjgIJcbiAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeC5pbnZlcnRUcmFuc2Zvcm1YKHNjcmVlblgpOyAvLyDmi6HlpKfjgIHnuK7lsI/jgIHnp7vli5Xlvozjga7lgKTjgIJcbiAgfVxuXG4gIC8qKlxuICAgKiBZ5bqn5qiZ44KSVmlld+W6p+aomeOBq+WkieaPm+OBmeOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gZGV2aWNlWSDjg4fjg5DjgqTjgrlZ5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtVmlld1koZGV2aWNlWTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBzY3JlZW5ZOiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1ZKGRldmljZVkpOyAvLyDoq5bnkIbluqfmqJnlpInmj5vjgZfjgZ/luqfmqJnjgpLlj5blvpfjgIJcbiAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeC5pbnZlcnRUcmFuc2Zvcm1ZKHNjcmVlblkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFjluqfmqJnjgpJTY3JlZW7luqfmqJnjgavlpInmj5vjgZnjgovjgIJcbiAgICogQHBhcmFtIGRldmljZVgg44OH44OQ44Kk44K5WOW6p+aomVxuICAgKi9cbiAgcHVibGljIHRyYW5zZm9ybVNjcmVlblgoZGV2aWNlWDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWChkZXZpY2VYKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBZ5bqn5qiZ44KSU2NyZWVu5bqn5qiZ44Gr5aSJ5o+b44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VZIOODh+ODkOOCpOOCuVnluqfmqJlcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1TY3JlZW5ZKGRldmljZVk6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVkoZGV2aWNlWSk7XG4gIH1cblxuICBfdG91Y2hNYW5hZ2VyOiBUb3VjaE1hbmFnZXI7IC8vIOOCv+ODg+ODgeODnuODjeODvOOCuOODo+ODvFxuICBfZGV2aWNlVG9TY3JlZW46IENzbV9DdWJpc21NYXRyaXg0NDsgLy8g44OH44OQ44Kk44K544GL44KJ44K544Kv44Oq44O844Oz44G444Gu6KGM5YiXXG4gIF92aWV3TWF0cml4OiBDc21fQ3ViaXNtVmlld01hdHJpeDsgLy8gdmlld01hdHJpeFxuICBfcHJvZ3JhbUlkOiBXZWJHTFByb2dyYW07IC8vIOOCt+OCp+ODvOODgElEXG4gIF9iYWNrOiBMQXBwU3ByaXRlOyAvLyDog4zmma/nlLvlg49cbiAgX2dlYXI6IExBcHBTcHJpdGU7IC8vIOOCruOCoueUu+WDj1xuICBfY2hhbmdlTW9kZWw6IGJvb2xlYW47IC8vIOODouODh+ODq+WIh+OCiuabv+OBiOODleODqeOCsFxuICBfaXNDbGljazogYm9vbGVhbjsgLy8g44Kv44Oq44OD44Kv5LitXG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBMQXBwRGVsZWdhdGUgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5cbi8qKlxuICog44OW44Op44Km44K244Ot44O844OJ5b6M44Gu5Yem55CGXG4gKi9cbndpbmRvdy5vbmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gIC8vIGNyZWF0ZSB0aGUgYXBwbGljYXRpb24gaW5zdGFuY2VcbiAgaWYgKExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLmluaXRpYWxpemUoKSA9PSBmYWxzZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLnJ1bigpO1xufTtcblxuLyoqXG4gKiDntYLkuobmmYLjga7lh6bnkIZcbiAqL1xud2luZG93Lm9uYmVmb3JldW5sb2FkID0gKCk6IHZvaWQgPT4gTEFwcERlbGVnYXRlLnJlbGVhc2VJbnN0YW5jZSgpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==