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
        exports.canvas = document.getElementById('canvas');
        exports.gl = exports.canvas.getContext('webgl') || exports.canvas.getContext('experimental-webgl');
        if (!exports.gl) {
            alert('Cannot initialize WebGL. This browser does not support.');
            exports.gl = null;
            document.body.innerHTML =
                'This browser does not support the <code>&lt;canvas&gt;</code> element.';
            return false;
        }
        if (!exports.frameBuffer) {
            exports.frameBuffer = exports.gl.getParameter(exports.gl.FRAMEBUFFER_BINDING);
        }
        exports.gl.enable(exports.gl.BLEND);
        exports.gl.blendFunc(exports.gl.SRC_ALPHA, exports.gl.ONE_MINUS_SRC_ALPHA);
        var supportTouch = 'ontouchend' in exports.canvas;
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
            window.onmouseleave = onmouseleave;
        }
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
            lapppal_1.LAppPal.printMessage('failed to create vertexShader');
            return null;
        }
        var vertexShader = 'precision mediump float;' +
            'attribute vec3 position;' +
            'attribute vec2 uv;' +
            'varying vec2 vuv;' +
            'void main(void)' +
            '{' +
            '   gl_Position = vec4(position, 1.0);' +
            '   vuv = uv;' +
            '}';
        exports.gl.shaderSource(vertexShaderId, vertexShader);
        exports.gl.compileShader(vertexShaderId);
        var fragmentShaderId = exports.gl.createShader(exports.gl.FRAGMENT_SHADER);
        if (fragmentShaderId == null) {
            lapppal_1.LAppPal.printMessage('failed to create fragmentShader');
            return null;
        }
        var fragmentShader = 'precision mediump float;' +
            'varying vec2 vuv;' +
            'uniform sampler2D texture;' +
            'void main(void)' +
            '{' +
            '   gl_FragColor = texture2D(texture, vuv);' +
            '}';
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
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    var posX = e.pageX;
    var posY = e.pageY;
    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}
function onMouseMoved(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    console.log(2);
    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}
function onClickEnded(e) {
    LAppDelegate.getInstance()._captured = false;
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.clientX - rect.left;
    var posY = e.clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
function onTouchBegan(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    var posX = e.changedTouches[0].pageX;
    var posY = e.changedTouches[0].pageY;
    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}
function onTouchMoved(e) {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
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
        lapppal_1.LAppPal.printMessage('view notfound');
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
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    var rect = e.target.getBoundingClientRect();
    var posX = e.changedTouches[0].clientX - rect.left;
    var posY = e.changedTouches[0].clientY - rect.top;
    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
function onmouseleave() {
    if (!LAppDelegate.getInstance()._view) {
        lapppal_1.LAppPal.printMessage('view notfound');
        return;
    }
    console.log(1);
    LAppDelegate.getInstance()._view.onTouchesMoved(0, 0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGFwcGRlbGVnYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwbGl2ZTJkbWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFwcG1vZGVsLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwc3ByaXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwdGV4dHVyZW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xhcHB2aWV3LnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQSw2SUFHMEM7QUFDMUMsSUFBTyxtQkFBbUIsR0FBRyw2Q0FBcUIsQ0FBQyxlQUFlLENBQUM7QUFDbkUsNEVBQXNDO0FBQ3RDLHlFQUFvQztBQUNwQywwR0FBMEQ7QUFDMUQsdUdBQXdEO0FBQ3hELDhGQUEyQztBQUVoQyxjQUFNLEdBQXNCLElBQUksQ0FBQztBQUNqQyxrQkFBVSxHQUFpQixJQUFJLENBQUM7QUFDaEMsVUFBRSxHQUEwQixJQUFJLENBQUM7QUFDakMsbUJBQVcsR0FBcUIsSUFBSSxDQUFDO0FBQ25DLFdBQUcsR0FBUSxNQUFNLENBQUM7QUFNL0I7SUFZRTtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRXBCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSw4QkFBVSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBUWEsd0JBQVcsR0FBekI7UUFDRSxJQUFJLGtC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LE9BQU8sQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFPTSxpQ0FBYyxHQUFyQixVQUFzQixPQUFlO1FBQ25DLElBQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBTU0sbUNBQWdCLEdBQXZCLFVBQXdCLE9BQWU7UUFDckMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBT00sbUNBQWdCLEdBQXZCLFVBQXdCLE9BQWU7UUFDckMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBVUgsZUFBQztBQUFELENBQUM7QUFwUFksNEJBQVE7Ozs7Ozs7Ozs7Ozs7OztBQ2ZyQix3RkFBOEM7QUFLOUMsTUFBTSxDQUFDLE1BQU0sR0FBRztJQUVkLElBQUksMkJBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxLQUFLLEVBQUU7UUFDcEQsT0FBTztLQUNSO0lBRUQsMkJBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuQyxDQUFDLENBQUM7QUFLRixNQUFNLENBQUMsY0FBYyxHQUFHLGNBQVksa0NBQVksQ0FBQyxlQUFlLEVBQUUsRUFBOUIsQ0FBOEIsQ0FBQyIsImZpbGUiOiJtYWluLjgxZTBmY2JmMzZmMGVhZjZhNzUzLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvY29uc2lzdGVudC10eXBlLWFzc2VydGlvbnMgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9jYW1lbGNhc2UgKi9cbi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7XG4gIExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBsaXZlMmRjdWJpc21mcmFtZXdvcmssXG4gIE9wdGlvbiBhcyBDc21fT3B0aW9uXG59IGZyb20gJ0BmcmFtZXdvcmsvbGl2ZTJkY3ViaXNtZnJhbWV3b3JrJztcbmltcG9ydCBDc21fQ3ViaXNtRnJhbWV3b3JrID0gbGl2ZTJkY3ViaXNtZnJhbWV3b3JrLkN1YmlzbUZyYW1ld29yaztcbmltcG9ydCB7IExBcHBWaWV3IH0gZnJvbSAnLi9sYXBwdmlldyc7XG5pbXBvcnQgeyBMQXBwUGFsIH0gZnJvbSAnLi9sYXBwcGFsJztcbmltcG9ydCB7IExBcHBUZXh0dXJlTWFuYWdlciB9IGZyb20gJy4vbGFwcHRleHR1cmVtYW5hZ2VyJztcbmltcG9ydCB7IExBcHBMaXZlMkRNYW5hZ2VyIH0gZnJvbSAnLi9sYXBwbGl2ZTJkbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5cbmV4cG9ydCBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IG51bGw7XG5leHBvcnQgbGV0IHNfaW5zdGFuY2U6IExBcHBEZWxlZ2F0ZSA9IG51bGw7XG5leHBvcnQgbGV0IGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuZXhwb3J0IGxldCBmcmFtZUJ1ZmZlcjogV2ViR0xGcmFtZWJ1ZmZlciA9IG51bGw7XG5leHBvcnQgY29uc3Qgd2luOiBhbnkgPSB3aW5kb3c7XG5cbi8qKlxuICog44Ki44OX44Oq44Kx44O844K344On44Oz44Kv44Op44K544CCXG4gKiBDdWJpc20gU0RL44Gu566h55CG44KS6KGM44GG44CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwRGVsZWdhdGUge1xuICBfY3ViaXNtT3B0aW9uOiBDc21fT3B0aW9uOyAvLyBDdWJpc20gU0RLIE9wdGlvblxuICBfdmlldzogTEFwcFZpZXc7IC8vIFZpZXfmg4XloLFcbiAgX2NhcHR1cmVkOiBib29sZWFuOyAvLyDjgq/jg6rjg4Pjgq/jgZfjgabjgYTjgovjgYtcbiAgX21vdXNlWDogbnVtYmVyOyAvLyDjg57jgqbjgrlY5bqn5qiZXG4gIF9tb3VzZVk6IG51bWJlcjsgLy8g44Oe44Km44K5WeW6p+aomVxuICBfaXNFbmQ6IGJvb2xlYW47IC8vIEFQUOe1guS6huOBl+OBpuOBhOOCi+OBi1xuICBfdGV4dHVyZU1hbmFnZXI6IExBcHBUZXh0dXJlTWFuYWdlcjsgLy8g44OG44Kv44K544OB44Oj44Oe44ON44O844K444Oj44O8XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fY2FwdHVyZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9tb3VzZVggPSAwLjA7XG4gICAgdGhpcy5fbW91c2VZID0gMC4wO1xuICAgIHRoaXMuX2lzRW5kID0gZmFsc2U7XG5cbiAgICB0aGlzLl9jdWJpc21PcHRpb24gPSBuZXcgQ3NtX09wdGlvbigpO1xuICAgIHRoaXMuX3ZpZXcgPSBuZXcgTEFwcFZpZXcoKTtcbiAgICB0aGlzLl90ZXh0dXJlTWFuYWdlciA9IG5ldyBMQXBwVGV4dHVyZU1hbmFnZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrnvvIjjgrfjg7PjgrDjg6vjg4jjg7PvvInjgpLov5TjgZnjgIJcbiAgICog44Kk44Oz44K544K/44Oz44K544GM55Sf5oiQ44GV44KM44Gm44GE44Gq44GE5aC05ZCI44Gv5YaF6YOo44Gn44Kk44Oz44K544K/44Oz44K544KS55Sf5oiQ44GZ44KL44CCXG4gICAqXG4gICAqIEByZXR1cm4g44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IExBcHBEZWxlZ2F0ZSB7XG4gICAgaWYgKHNfaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgc19pbnN0YW5jZSA9IG5ldyBMQXBwRGVsZWdhdGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc19pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrnvvIjjgrfjg7PjgrDjg6vjg4jjg7PvvInjgpLop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVsZWFzZUluc3RhbmNlKCk6IHZvaWQge1xuICAgIGlmIChzX2luc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UucmVsZWFzZSgpO1xuICAgIH1cblxuICAgIHNfaW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQUOOBq+W/heimgeOBqueJqeOCkuWIneacn+WMluOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemUoKTogYm9vbGVhbiB7XG4gICAgLy8g44Kt44Oj44Oz44OQ44K544Gu5L2c5oiQXG4gICAgY2FudmFzID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcblxuICAgIC8vIGds44Kz44Oz44OG44Kt44K544OI44KS5Yid5pyf5YyWXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJykgfHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuXG4gICAgaWYgKCFnbCkge1xuICAgICAgYWxlcnQoJ0Nhbm5vdCBpbml0aWFsaXplIFdlYkdMLiBUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydC4nKTtcbiAgICAgIGdsID0gbnVsbDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPVxuICAgICAgICAnVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlIDxjb2RlPiZsdDtjYW52YXMmZ3Q7PC9jb2RlPiBlbGVtZW50Lic7XG5cbiAgICAgIC8vIGds5Yid5pyf5YyW5aSx5pWXXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFmcmFtZUJ1ZmZlcikge1xuICAgICAgZnJhbWVCdWZmZXIgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuRlJBTUVCVUZGRVJfQklORElORyk7XG4gICAgfVxuXG4gICAgLy8g6YCP6YGO6Kit5a6aXG4gICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcbiAgICBnbC5ibGVuZEZ1bmMoZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblxuICAgIGNvbnN0IHN1cHBvcnRUb3VjaDogYm9vbGVhbiA9ICdvbnRvdWNoZW5kJyBpbiBjYW52YXM7XG5cbiAgICBpZiAoc3VwcG9ydFRvdWNoKSB7XG4gICAgICAvLyDjgr/jg4Pjg4HplqLpgKPjgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbDnmbvpjLJcbiAgICAgIGNhbnZhcy5vbnRvdWNoc3RhcnQgPSBvblRvdWNoQmVnYW47XG4gICAgICBjYW52YXMub250b3VjaG1vdmUgPSBvblRvdWNoTW92ZWQ7XG4gICAgICBjYW52YXMub250b3VjaGVuZCA9IG9uVG91Y2hFbmRlZDtcbiAgICAgIGNhbnZhcy5vbnRvdWNoY2FuY2VsID0gb25Ub3VjaENhbmNlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g44Oe44Km44K56Zai6YCj44Kz44O844Or44OQ44OD44Kv6Zai5pWw55m76YyyXG4gICAgICBjYW52YXMub25tb3VzZWRvd24gPSBvbkNsaWNrQmVnYW47XG4gICAgICB3aW5kb3cub25tb3VzZW1vdmUgPSBvbk1vdXNlTW92ZWQ7XG4gICAgICBjYW52YXMub25tb3VzZXVwID0gb25DbGlja0VuZGVkO1xuICAgICAgd2luZG93Lm9ubW91c2VsZWF2ZSA9IG9ubW91c2VsZWF2ZTtcbiAgICB9XG5cbiAgICAvLyB3aW4uaW5pdERlZmluZSgnLlxcXFxTYW1wbGVzXFxcXFJlc291cmNlc1xcXFwnKTtcbiAgICAvLyBBcHBWaWV344Gu5Yid5pyf5YyWXG4gICAgdGhpcy5fdmlldy5pbml0aWFsaXplKCk7XG5cbiAgICAvLyBDdWJpc20gU0RL44Gu5Yid5pyf5YyWXG4gICAgdGhpcy5pbml0aWFsaXplQ3ViaXNtKCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIHRoaXMuX3RleHR1cmVNYW5hZ2VyLnJlbGVhc2UoKTtcbiAgICB0aGlzLl90ZXh0dXJlTWFuYWdlciA9IG51bGw7XG5cbiAgICB0aGlzLl92aWV3LnJlbGVhc2UoKTtcbiAgICB0aGlzLl92aWV3ID0gbnVsbDtcblxuICAgIC8vIOODquOCveODvOOCueOCkuino+aUvlxuICAgIExBcHBMaXZlMkRNYW5hZ2VyLnJlbGVhc2VJbnN0YW5jZSgpO1xuXG4gICAgLy8gQ3ViaXNtIFNES+OBruino+aUvlxuICAgIENzbV9DdWJpc21GcmFtZXdvcmsuZGlzcG9zZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWun+ihjOWHpueQhuOAglxuICAgKi9cbiAgcHVibGljIHJ1bigpOiB2b2lkIHtcbiAgICAvLyDjg6HjgqTjg7Pjg6vjg7zjg5dcbiAgICBjb25zdCBsb29wID0gKCk6IHZvaWQgPT4ge1xuICAgICAgLy8g44Kk44Oz44K544K/44Oz44K544Gu5pyJ54Sh44Gu56K66KqNXG4gICAgICBpZiAoc19pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8g5pmC6ZaT5pu05pawXG4gICAgICBMQXBwUGFsLnVwZGF0ZVRpbWUoKTtcblxuICAgICAgLy8g55S76Z2i44Gu5Yid5pyf5YyWXG4gICAgICBnbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDAuMCk7XG5cbiAgICAgIC8vIOa3seW6puODhuOCueODiOOCkuacieWKueWMllxuICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xuXG4gICAgICAvLyDov5HjgY/jgavjgYLjgovniankvZPjga/jgIHpgaDjgY/jgavjgYLjgovniankvZPjgpLopobjgYTpmqDjgZlcbiAgICAgIGdsLmRlcHRoRnVuYyhnbC5MRVFVQUwpO1xuXG4gICAgICAvLyDjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgoTmt7Hluqbjg5Djg4Pjg5XjgqHjgpLjgq/jg6rjgqLjgZnjgotcbiAgICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgICAgZ2wuY2xlYXJEZXB0aCgxLjApO1xuXG4gICAgICAvLyDpgI/pgY7oqK3lrppcbiAgICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgICBnbC5ibGVuZEZ1bmMoZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBKTtcblxuICAgICAgLy8g5o+P55S75pu05pawXG4gICAgICB0aGlzLl92aWV3LnJlbmRlcigpO1xuXG4gICAgICAvLyDjg6vjg7zjg5fjga7jgZ/jgoHjgavlho3luLDlkbzjgbPlh7rjgZdcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9O1xuICAgIGxvb3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgrfjgqfjg7zjg4Djg7zjgpLnmbvpjLLjgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyBjcmVhdGVTaGFkZXIoKTogV2ViR0xQcm9ncmFtIHtcbiAgICAvLyDjg5Djg7zjg4bjg4Pjgq/jgrnjgrfjgqfjg7zjg4Djg7zjga7jgrPjg7Pjg5HjgqTjg6tcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXJJZCA9IGdsLmNyZWF0ZVNoYWRlcihnbC5WRVJURVhfU0hBREVSKTtcblxuICAgIGlmICh2ZXJ0ZXhTaGFkZXJJZCA9PSBudWxsKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgnZmFpbGVkIHRvIGNyZWF0ZSB2ZXJ0ZXhTaGFkZXInKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHZlcnRleFNoYWRlcjogc3RyaW5nID1cbiAgICAgICdwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsnICtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMyBwb3NpdGlvbjsnICtcbiAgICAgICdhdHRyaWJ1dGUgdmVjMiB1djsnICtcbiAgICAgICd2YXJ5aW5nIHZlYzIgdnV2OycgK1xuICAgICAgJ3ZvaWQgbWFpbih2b2lkKScgK1xuICAgICAgJ3snICtcbiAgICAgICcgICBnbF9Qb3NpdGlvbiA9IHZlYzQocG9zaXRpb24sIDEuMCk7JyArXG4gICAgICAnICAgdnV2ID0gdXY7JyArXG4gICAgICAnfSc7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UodmVydGV4U2hhZGVySWQsIHZlcnRleFNoYWRlcik7XG4gICAgZ2wuY29tcGlsZVNoYWRlcih2ZXJ0ZXhTaGFkZXJJZCk7XG5cbiAgICAvLyDjg5Xjg6njgrDjg6Hjg7Pjg4jjgrfjgqfjg7zjg4Djga7jgrPjg7Pjg5HjgqTjg6tcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlcklkID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XG5cbiAgICBpZiAoZnJhZ21lbnRTaGFkZXJJZCA9PSBudWxsKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgnZmFpbGVkIHRvIGNyZWF0ZSBmcmFnbWVudFNoYWRlcicpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXI6IHN0cmluZyA9XG4gICAgICAncHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7JyArXG4gICAgICAndmFyeWluZyB2ZWMyIHZ1djsnICtcbiAgICAgICd1bmlmb3JtIHNhbXBsZXIyRCB0ZXh0dXJlOycgK1xuICAgICAgJ3ZvaWQgbWFpbih2b2lkKScgK1xuICAgICAgJ3snICtcbiAgICAgICcgICBnbF9GcmFnQ29sb3IgPSB0ZXh0dXJlMkQodGV4dHVyZSwgdnV2KTsnICtcbiAgICAgICd9JztcblxuICAgIGdsLnNoYWRlclNvdXJjZShmcmFnbWVudFNoYWRlcklkLCBmcmFnbWVudFNoYWRlcik7XG4gICAgZ2wuY29tcGlsZVNoYWRlcihmcmFnbWVudFNoYWRlcklkKTtcblxuICAgIC8vIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxuICAgIGNvbnN0IHByb2dyYW1JZCA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbUlkLCB2ZXJ0ZXhTaGFkZXJJZCk7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1JZCwgZnJhZ21lbnRTaGFkZXJJZCk7XG5cbiAgICBnbC5kZWxldGVTaGFkZXIodmVydGV4U2hhZGVySWQpO1xuICAgIGdsLmRlbGV0ZVNoYWRlcihmcmFnbWVudFNoYWRlcklkKTtcblxuICAgIC8vIOODquODs+OCr1xuICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW1JZCk7XG5cbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW1JZCk7XG5cbiAgICByZXR1cm4gcHJvZ3JhbUlkO1xuICB9XG5cbiAgLyoqXG4gICAqIFZpZXfmg4XloLHjgpLlj5blvpfjgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyBnZXRWaWV3KCk6IExBcHBWaWV3IHtcbiAgICByZXR1cm4gdGhpcy5fdmlldztcbiAgfVxuXG4gIHB1YmxpYyBnZXRUZXh0dXJlTWFuYWdlcigpOiBMQXBwVGV4dHVyZU1hbmFnZXIge1xuICAgIHJldHVybiB0aGlzLl90ZXh0dXJlTWFuYWdlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDdWJpc20gU0RL44Gu5Yid5pyf5YyWXG4gICAqL1xuICBwdWJsaWMgaW5pdGlhbGl6ZUN1YmlzbSgpOiB2b2lkIHtcbiAgICAvLyBzZXR1cCBjdWJpc21cbiAgICB0aGlzLl9jdWJpc21PcHRpb24ubG9nRnVuY3Rpb24gPSBMQXBwUGFsLnByaW50TWVzc2FnZTtcbiAgICB0aGlzLl9jdWJpc21PcHRpb24ubG9nZ2luZ0xldmVsID0gTEFwcERlZmluZS5DdWJpc21Mb2dnaW5nTGV2ZWw7XG4gICAgQ3NtX0N1YmlzbUZyYW1ld29yay5zdGFydFVwKHRoaXMuX2N1YmlzbU9wdGlvbik7XG5cbiAgICAvLyBpbml0aWFsaXplIGN1YmlzbVxuICAgIENzbV9DdWJpc21GcmFtZXdvcmsuaW5pdGlhbGl6ZSgpO1xuXG4gICAgLy8gbG9hZCBtb2RlbFxuICAgIExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG5cbiAgICBMQXBwUGFsLnVwZGF0ZVRpbWUoKTtcblxuICAgIHRoaXMuX3ZpZXcuaW5pdGlhbGl6ZVNwcml0ZSgpO1xuICB9XG59XG5cbi8qKlxuICog44Kv44Oq44OD44Kv44GX44Gf44Go44GN44Gr5ZG844Gw44KM44KL44CCXG4gKi9cbmZ1bmN0aW9uIG9uQ2xpY2tCZWdhbihlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSB0cnVlO1xuXG4gIGNvbnN0IHBvc1g6IG51bWJlciA9IGUucGFnZVg7XG4gIGNvbnN0IHBvc1k6IG51bWJlciA9IGUucGFnZVk7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzQmVnYW4ocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICog44Oe44Km44K544Od44Kk44Oz44K/44GM5YuV44GE44Gf44KJ5ZG844Gw44KM44KL44CCXG4gKi9cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlZChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gIC8v54K55Ye75bem6ZSu5omN6Kem5Y+RXG4gIC8vIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkKSB7XG4gIC8vICAgcmV0dXJuO1xuICAvLyB9XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVjdCA9IChlLnRhcmdldCBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgcG9zWDogbnVtYmVyID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZOiBudW1iZXIgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcbiAgY29uc29sZS5sb2coMik7XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc01vdmVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIOOCr+ODquODg+OCr+OBjOe1guS6huOBl+OBn+OCieWRvOOBsOOCjOOCi+OAglxuICovXG5mdW5jdGlvbiBvbkNsaWNrRW5kZWQoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSBmYWxzZTtcbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVjdCA9IChlLnRhcmdldCBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgcG9zWDogbnVtYmVyID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZOiBudW1iZXIgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNFbmRlZChwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiDjgr/jg4Pjg4HjgZfjgZ/jgajjgY3jgavlkbzjgbDjgozjgovjgIJcbiAqL1xuZnVuY3Rpb24gb25Ub3VjaEJlZ2FuKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gdHJ1ZTtcblxuICBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzQmVnYW4ocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICog44K544Ov44Kk44OX44GZ44KL44Go5ZG844Gw44KM44KL44CCXG4gKi9cbmZ1bmN0aW9uIG9uVG91Y2hNb3ZlZChlOiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gIC8v54K55Ye75omN6Kem5Y+RXG4gIC8vIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkKSB7XG4gIC8vICAgcmV0dXJuO1xuICAvLyB9XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVjdCA9IChlLnRhcmdldCBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzTW92ZWQocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICog44K/44OD44OB44GM57WC5LqG44GX44Gf44KJ5ZG844Gw44KM44KL44CCXG4gKi9cbmZ1bmN0aW9uIG9uVG91Y2hFbmRlZChlOiBUb3VjaEV2ZW50KTogdm9pZCB7XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCA9IGZhbHNlO1xuXG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlY3QgPSAoZS50YXJnZXQgYXMgRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgY29uc3QgcG9zWCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0VuZGVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIOOCv+ODg+ODgeOBjOOCreODo+ODs+OCu+ODq+OBleOCjOOCi+OBqOWRvOOBsOOCjOOCi+OAglxuICovXG5mdW5jdGlvbiBvblRvdWNoQ2FuY2VsKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gZmFsc2U7XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVjdCA9IChlLnRhcmdldCBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzRW5kZWQocG9zWCwgcG9zWSk7XG59XG5cbmZ1bmN0aW9uIG9ubW91c2VsZWF2ZSgpOiB2b2lkIHtcbiAgLy/ngrnlh7vmiY3op6blj5FcbiAgLy8gaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQpIHtcbiAgLy8gICByZXR1cm47XG4gIC8vIH1cblxuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2coMSk7XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc01vdmVkKDAsIDApO1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbW1hdHJpeDQ0IH0gZnJvbSAnQGZyYW1ld29yay9tYXRoL2N1YmlzbW1hdHJpeDQ0JztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc212ZWN0b3IgfSBmcm9tICdAZnJhbWV3b3JrL3R5cGUvY3NtdmVjdG9yJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBhY3ViaXNtbW90aW9uIH0gZnJvbSAnQGZyYW1ld29yay9tb3Rpb24vYWN1YmlzbW1vdGlvbic7XG5pbXBvcnQgQ3NtX2NzbVZlY3RvciA9IGNzbXZlY3Rvci5jc21WZWN0b3I7XG5pbXBvcnQgQ3NtX0N1YmlzbU1hdHJpeDQ0ID0gY3ViaXNtbWF0cml4NDQuQ3ViaXNtTWF0cml4NDQ7XG5pbXBvcnQgQUN1YmlzbU1vdGlvbiA9IGFjdWJpc21tb3Rpb24uQUN1YmlzbU1vdGlvbjtcblxuaW1wb3J0IHsgTEFwcE1vZGVsIH0gZnJvbSAnLi9sYXBwbW9kZWwnO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5pbXBvcnQgeyBjYW52YXMgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5cbmV4cG9ydCBsZXQgc19pbnN0YW5jZTogTEFwcExpdmUyRE1hbmFnZXIgPSBudWxsO1xuXG4vKipcbiAqIOOCteODs+ODl+ODq+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBq+OBiuOBhOOBpkN1YmlzbU1vZGVs44KS566h55CG44GZ44KL44Kv44Op44K5XG4gKiDjg6Ljg4fjg6vnlJ/miJDjgajnoLTmo4TjgIHjgr/jg4Pjg5fjgqTjg5njg7Pjg4jjga7lh6bnkIbjgIHjg6Ljg4fjg6vliIfjgormm7/jgYjjgpLooYzjgYbjgIJcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBMaXZlMkRNYW5hZ2VyIHtcbiAgLyoqXG4gICAqIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCue+8iOOCt+ODs+OCsOODq+ODiOODs++8ieOCkui/lOOBmeOAglxuICAgKiDjgqTjg7Pjgrnjgr/jg7PjgrnjgYznlJ/miJDjgZXjgozjgabjgYTjgarjgYTloLTlkIjjga/lhoXpg6jjgafjgqTjg7Pjgrnjgr/jg7PjgrnjgpLnlJ/miJDjgZnjgovjgIJcbiAgICpcbiAgICogQHJldHVybiDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogTEFwcExpdmUyRE1hbmFnZXIge1xuICAgIGlmIChzX2luc3RhbmNlID09IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UgPSBuZXcgTEFwcExpdmUyRE1hbmFnZXIoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc19pbnN0YW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrnvvIjjgrfjg7PjgrDjg6vjg4jjg7PvvInjgpLop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVsZWFzZUluc3RhbmNlKCk6IHZvaWQge1xuICAgIGlmIChzX2luc3RhbmNlICE9IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UgPSB2b2lkIDA7XG4gICAgfVxuXG4gICAgc19pbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICog54++5Zyo44Gu44K344O844Oz44Gn5L+d5oyB44GX44Gm44GE44KL44Oi44OH44Or44KS6L+U44GZ44CCXG4gICAqXG4gICAqIEBwYXJhbSBubyDjg6Ljg4fjg6vjg6rjgrnjg4jjga7jgqTjg7Pjg4fjg4Pjgq/jgrnlgKRcbiAgICogQHJldHVybiDjg6Ljg4fjg6vjga7jgqTjg7Pjgrnjgr/jg7PjgrnjgpLov5TjgZnjgILjgqTjg7Pjg4fjg4Pjgq/jgrnlgKTjgYznr4Tlm7LlpJbjga7loLTlkIjjga9OVUxM44KS6L+U44GZ44CCXG4gICAqL1xuICBwdWJsaWMgZ2V0TW9kZWwobm86IG51bWJlcik6IExBcHBNb2RlbCB7XG4gICAgaWYgKG5vIDwgdGhpcy5fbW9kZWxzLmdldFNpemUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVscy5hdChubyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICog54++5Zyo44Gu44K344O844Oz44Gn5L+d5oyB44GX44Gm44GE44KL44GZ44G544Gm44Gu44Oi44OH44Or44KS6Kej5pS+44GZ44KLXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZUFsbE1vZGVsKCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZWxzLmdldFNpemUoKTsgaSsrKSB7XG4gICAgICB0aGlzLl9tb2RlbHMuYXQoaSkucmVsZWFzZSgpO1xuICAgICAgdGhpcy5fbW9kZWxzLnNldChpLCBudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLl9tb2RlbHMuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvpnaLjgpLjg4njg6njg4PjgrDjgZfjgZ/mmYLjga7lh6bnkIZcbiAgICpcbiAgICogQHBhcmFtIHgg55S76Z2i44GuWOW6p+aomVxuICAgKiBAcGFyYW0geSDnlLvpnaLjga5Z5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25EcmFnKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tb2RlbHMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIGNvbnN0IG1vZGVsOiBMQXBwTW9kZWwgPSB0aGlzLmdldE1vZGVsKGkpO1xuXG4gICAgICBpZiAobW9kZWwpIHtcbiAgICAgICAgbW9kZWwuc2V0RHJhZ2dpbmcoeCwgeSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOeUu+mdouOCkuOCv+ODg+ODl+OBl+OBn+aZguOBruWHpueQhlxuICAgKlxuICAgKiBAcGFyYW0geCDnlLvpnaLjga5Y5bqn5qiZXG4gICAqIEBwYXJhbSB5IOeUu+mdouOBrlnluqfmqJlcbiAgICovXG4gIHB1YmxpYyBvblRhcCh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShcbiAgICAgICAgYFtBUFBddGFwIHBvaW50OiB7eDogJHt4LnRvRml4ZWQoMil9IHk6ICR7eS50b0ZpeGVkKDIpfX1gXG4gICAgICApO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZWxzLmdldFNpemUoKTsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5fbW9kZWxzLmF0KGkpLmhpdFRlc3QoTEFwcERlZmluZS5IaXRBcmVhTmFtZUhlYWQsIHgsIHkpKSB7XG4gICAgICAgIGlmIChMQXBwRGVmaW5lLkRlYnVnTG9nRW5hYmxlKSB7XG4gICAgICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXG4gICAgICAgICAgICBgW0FQUF1oaXQgYXJlYTogWyR7TEFwcERlZmluZS5IaXRBcmVhTmFtZUhlYWR9XWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21vZGVscy5hdChpKS5zZXRSYW5kb21FeHByZXNzaW9uKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX21vZGVscy5hdChpKS5oaXRUZXN0KExBcHBEZWZpbmUuSGl0QXJlYU5hbWVCb2R5LCB4LCB5KSkge1xuICAgICAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFxuICAgICAgICAgICAgYFtBUFBdaGl0IGFyZWE6IFske0xBcHBEZWZpbmUuSGl0QXJlYU5hbWVCb2R5fV1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tb2RlbHNcbiAgICAgICAgICAuYXQoaSlcbiAgICAgICAgICAuc3RhcnRSYW5kb21Nb3Rpb24oXG4gICAgICAgICAgICBMQXBwRGVmaW5lLk1vdGlvbkdyb3VwVGFwQm9keSxcbiAgICAgICAgICAgIExBcHBEZWZpbmUuUHJpb3JpdHlOb3JtYWwsXG4gICAgICAgICAgICB0aGlzLl9maW5pc2hlZE1vdGlvblxuICAgICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOeUu+mdouOCkuabtOaWsOOBmeOCi+OBqOOBjeOBruWHpueQhlxuICAgKiDjg6Ljg4fjg6vjga7mm7TmlrDlh6bnkIblj4rjgbPmj4/nlLvlh6bnkIbjgpLooYzjgYZcbiAgICovXG4gIHB1YmxpYyBvblVwZGF0ZSgpOiB2b2lkIHtcbiAgICBsZXQgcHJvamVjdGlvbjogQ3NtX0N1YmlzbU1hdHJpeDQ0ID0gbmV3IENzbV9DdWJpc21NYXRyaXg0NCgpO1xuXG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBjYW52YXM7XG4gICAgcHJvamVjdGlvbi5zY2FsZSgxLjAsIHdpZHRoIC8gaGVpZ2h0KTtcblxuICAgIGlmICh0aGlzLl92aWV3TWF0cml4ICE9IG51bGwpIHtcbiAgICAgIHByb2plY3Rpb24ubXVsdGlwbHlCeU1hdHJpeCh0aGlzLl92aWV3TWF0cml4KTtcbiAgICB9XG5cbiAgICBjb25zdCBzYXZlUHJvamVjdGlvbjogQ3NtX0N1YmlzbU1hdHJpeDQ0ID0gcHJvamVjdGlvbi5jbG9uZSgpO1xuICAgIGNvbnN0IG1vZGVsQ291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVscy5nZXRTaXplKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGVsQ291bnQ7ICsraSkge1xuICAgICAgY29uc3QgbW9kZWw6IExBcHBNb2RlbCA9IHRoaXMuZ2V0TW9kZWwoaSk7XG4gICAgICBwcm9qZWN0aW9uID0gc2F2ZVByb2plY3Rpb24uY2xvbmUoKTtcblxuICAgICAgbW9kZWwudXBkYXRlKCk7XG4gICAgICBtb2RlbC5kcmF3KHByb2plY3Rpb24pOyAvLyDlj4LnhafmuKHjgZfjgarjga7jgadwcm9qZWN0aW9u44Gv5aSJ6LOq44GZ44KL44CCXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOasoeOBruOCt+ODvOODs+OBq+WIh+OCiuOBi+OBiOOCi1xuICAgKiDjgrXjg7Pjg5fjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7Pjgafjga/jg6Ljg4fjg6vjgrvjg4Pjg4jjga7liIfjgormm7/jgYjjgpLooYzjgYbjgIJcbiAgICovXG4gIHB1YmxpYyBuZXh0U2NlbmUoKTogdm9pZCB7XG4gICAgY29uc3Qgbm86IG51bWJlciA9ICh0aGlzLl9zY2VuZUluZGV4ICsgMSkgJSBMQXBwRGVmaW5lLk1vZGVsRGlyU2l6ZTtcbiAgICB0aGlzLmNoYW5nZVNjZW5lKG5vKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgrfjg7zjg7PjgpLliIfjgormm7/jgYjjgotcbiAgICog44K144Oz44OX44Or44Ki44OX44Oq44Kx44O844K344On44Oz44Gn44Gv44Oi44OH44Or44K744OD44OI44Gu5YiH44KK5pu/44GI44KS6KGM44GG44CCXG4gICAqL1xuICBwdWJsaWMgY2hhbmdlU2NlbmUoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX3NjZW5lSW5kZXggPSBpbmRleDtcbiAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoYFtBUFBdbW9kZWwgaW5kZXg6ICR7dGhpcy5fc2NlbmVJbmRleH1gKTtcbiAgICB9XG5cbiAgICAvLyBNb2RlbERpcltd44Gr5L+d5oyB44GX44Gf44OH44Kj44Os44Kv44OI44Oq5ZCN44GL44KJXG4gICAgLy8gbW9kZWwzLmpzb27jga7jg5HjgrnjgpLmsbrlrprjgZnjgovjgIJcbiAgICAvLyDjg4fjgqPjg6zjgq/jg4jjg6rlkI3jgahtb2RlbDMuanNvbuOBruWQjeWJjeOCkuS4gOiHtOOBleOBm+OBpuOBiuOBj+OBk+OBqOOAglxuICAgIGNvbnN0IG1vZGVsOiBzdHJpbmcgPSBMQXBwRGVmaW5lLk1vZGVsRGlyW2luZGV4XTtcbiAgICBjb25zdCBtb2RlbFBhdGg6IHN0cmluZyA9IExBcHBEZWZpbmUuUmVzb3VyY2VzUGF0aCArIG1vZGVsICsgJy8nO1xuICAgIGxldCBtb2RlbEpzb25OYW1lOiBzdHJpbmcgPSBMQXBwRGVmaW5lLk1vZGVsRGlyW2luZGV4XTtcbiAgICBtb2RlbEpzb25OYW1lICs9ICcubW9kZWwzLmpzb24nO1xuXG4gICAgdGhpcy5yZWxlYXNlQWxsTW9kZWwoKTtcbiAgICB0aGlzLl9tb2RlbHMucHVzaEJhY2sobmV3IExBcHBNb2RlbCgpKTtcbiAgICB0aGlzLl9tb2RlbHMuYXQoMCkubG9hZEFzc2V0cyhtb2RlbFBhdGgsIG1vZGVsSnNvbk5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdmlld01hdHJpeCA9IG5ldyBDc21fQ3ViaXNtTWF0cml4NDQoKTtcbiAgICB0aGlzLl9tb2RlbHMgPSBuZXcgQ3NtX2NzbVZlY3RvcjxMQXBwTW9kZWw+KCk7XG4gICAgdGhpcy5fc2NlbmVJbmRleCA9IDA7XG4gICAgdGhpcy5jaGFuZ2VTY2VuZSh0aGlzLl9zY2VuZUluZGV4KTtcbiAgfVxuXG4gIF92aWV3TWF0cml4OiBDc21fQ3ViaXNtTWF0cml4NDQ7IC8vIOODouODh+ODq+aPj+eUu+OBq+eUqOOBhOOCi3ZpZXfooYzliJdcbiAgX21vZGVsczogQ3NtX2NzbVZlY3RvcjxMQXBwTW9kZWw+OyAvLyDjg6Ljg4fjg6vjgqTjg7Pjgrnjgr/jg7Pjgrnjga7jgrPjg7Pjg4bjg4pcbiAgX3NjZW5lSW5kZXg6IG51bWJlcjsgLy8g6KGo56S644GZ44KL44K344O844Oz44Gu44Kk44Oz44OH44OD44Kv44K55YCkXG4gIC8vIOODouODvOOCt+ODp+ODs+WGjeeUn+e1guS6huOBruOCs+ODvOODq+ODkOODg+OCr+mWouaVsFxuICBfZmluaXNoZWRNb3Rpb24gPSAoc2VsZjogQUN1YmlzbU1vdGlvbik6IHZvaWQgPT4ge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCdNb3Rpb24gRmluaXNoZWQ6Jyk7XG4gICAgY29uc29sZS5sb2coc2VsZik7XG4gIH07XG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgbGl2ZTJkY3ViaXNtZnJhbWV3b3JrIH0gZnJvbSAnQGZyYW1ld29yay9saXZlMmRjdWJpc21mcmFtZXdvcmsnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbWlkIH0gZnJvbSAnQGZyYW1ld29yay9pZC9jdWJpc21pZCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtdXNlcm1vZGVsIH0gZnJvbSAnQGZyYW1ld29yay9tb2RlbC9jdWJpc211c2VybW9kZWwnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGljdWJpc21tb2RlbHNldHRpbmcgfSBmcm9tICdAZnJhbWV3b3JrL2ljdWJpc21tb2RlbHNldHRpbmcnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbW1vZGVsc2V0dGluZ2pzb24gfSBmcm9tICdAZnJhbWV3b3JrL2N1YmlzbW1vZGVsc2V0dGluZ2pzb24nO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbWRlZmF1bHRwYXJhbWV0ZXJpZCB9IGZyb20gJ0BmcmFtZXdvcmsvY3ViaXNtZGVmYXVsdHBhcmFtZXRlcmlkJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBhY3ViaXNtbW90aW9uIH0gZnJvbSAnQGZyYW1ld29yay9tb3Rpb24vYWN1YmlzbW1vdGlvbic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtZXllYmxpbmsgfSBmcm9tICdAZnJhbWV3b3JrL2VmZmVjdC9jdWJpc21leWVibGluayc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtYnJlYXRoIH0gZnJvbSAnQGZyYW1ld29yay9lZmZlY3QvY3ViaXNtYnJlYXRoJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc212ZWN0b3IgfSBmcm9tICdAZnJhbWV3b3JrL3R5cGUvY3NtdmVjdG9yJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc21tYXAgfSBmcm9tICdAZnJhbWV3b3JrL3R5cGUvY3NtbWFwJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tYXRyaXg0NCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtbW90aW9uIH0gZnJvbSAnQGZyYW1ld29yay9tb3Rpb24vY3ViaXNtbW90aW9uJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tb3Rpb25xdWV1ZW1hbmFnZXIgfSBmcm9tICdAZnJhbWV3b3JrL21vdGlvbi9jdWJpc21tb3Rpb25xdWV1ZW1hbmFnZXInO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGNzbXN0cmluZyB9IGZyb20gJ0BmcmFtZXdvcmsvdHlwZS9jc21zdHJpbmcnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGNzbXJlY3QgfSBmcm9tICdAZnJhbWV3b3JrL3R5cGUvY3NtcmVjdGYnO1xuaW1wb3J0IHsgQ3ViaXNtTG9nSW5mbyB9IGZyb20gJ0BmcmFtZXdvcmsvdXRpbHMvY3ViaXNtZGVidWcnO1xuaW1wb3J0IGNzbVJlY3QgPSBjc21yZWN0LmNzbVJlY3Q7XG5pbXBvcnQgY3NtU3RyaW5nID0gY3Ntc3RyaW5nLmNzbVN0cmluZztcbmltcG9ydCBJbnZhbGlkTW90aW9uUXVldWVFbnRyeUhhbmRsZVZhbHVlID0gY3ViaXNtbW90aW9ucXVldWVtYW5hZ2VyLkludmFsaWRNb3Rpb25RdWV1ZUVudHJ5SGFuZGxlVmFsdWU7XG5pbXBvcnQgQ3ViaXNtTW90aW9uUXVldWVFbnRyeUhhbmRsZSA9IGN1YmlzbW1vdGlvbnF1ZXVlbWFuYWdlci5DdWJpc21Nb3Rpb25RdWV1ZUVudHJ5SGFuZGxlO1xuaW1wb3J0IEN1YmlzbU1vdGlvbiA9IGN1YmlzbW1vdGlvbi5DdWJpc21Nb3Rpb247XG5pbXBvcnQgQ3ViaXNtTWF0cml4NDQgPSBjdWJpc21tYXRyaXg0NC5DdWJpc21NYXRyaXg0NDtcbmltcG9ydCBjc21NYXAgPSBjc21tYXAuY3NtTWFwO1xuaW1wb3J0IGNzbVZlY3RvciA9IGNzbXZlY3Rvci5jc21WZWN0b3I7XG5pbXBvcnQgQ3ViaXNtQnJlYXRoID0gY3ViaXNtYnJlYXRoLkN1YmlzbUJyZWF0aDtcbmltcG9ydCBCcmVhdGhQYXJhbWV0ZXJEYXRhID0gY3ViaXNtYnJlYXRoLkJyZWF0aFBhcmFtZXRlckRhdGE7XG5pbXBvcnQgQ3ViaXNtRXllQmxpbmsgPSBjdWJpc21leWVibGluay5DdWJpc21FeWVCbGluaztcbmltcG9ydCBBQ3ViaXNtTW90aW9uID0gYWN1YmlzbW1vdGlvbi5BQ3ViaXNtTW90aW9uO1xuaW1wb3J0IEZpbmlzaGVkTW90aW9uQ2FsbGJhY2sgPSBhY3ViaXNtbW90aW9uLkZpbmlzaGVkTW90aW9uQ2FsbGJhY2s7XG5pbXBvcnQgQ3ViaXNtRnJhbWV3b3JrID0gbGl2ZTJkY3ViaXNtZnJhbWV3b3JrLkN1YmlzbUZyYW1ld29yaztcbmltcG9ydCBDdWJpc21JZEhhbmRsZSA9IGN1YmlzbWlkLkN1YmlzbUlkSGFuZGxlO1xuaW1wb3J0IEN1YmlzbVVzZXJNb2RlbCA9IGN1YmlzbXVzZXJtb2RlbC5DdWJpc21Vc2VyTW9kZWw7XG5pbXBvcnQgSUN1YmlzbU1vZGVsU2V0dGluZyA9IGljdWJpc21tb2RlbHNldHRpbmcuSUN1YmlzbU1vZGVsU2V0dGluZztcbmltcG9ydCBDdWJpc21Nb2RlbFNldHRpbmdKc29uID0gY3ViaXNtbW9kZWxzZXR0aW5nanNvbi5DdWJpc21Nb2RlbFNldHRpbmdKc29uO1xuaW1wb3J0IEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZCA9IGN1YmlzbWRlZmF1bHRwYXJhbWV0ZXJpZDtcblxuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5pbXBvcnQgeyBnbCwgY2FudmFzLCBmcmFtZUJ1ZmZlciwgTEFwcERlbGVnYXRlIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuaW1wb3J0IHsgVGV4dHVyZUluZm8gfSBmcm9tICcuL2xhcHB0ZXh0dXJlbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5pbXBvcnQgJ3doYXR3Zy1mZXRjaCc7XG5cbmVudW0gTG9hZFN0ZXAge1xuICBMb2FkQXNzZXRzLFxuICBMb2FkTW9kZWwsXG4gIFdhaXRMb2FkTW9kZWwsXG4gIExvYWRFeHByZXNzaW9uLFxuICBXYWl0TG9hZEV4cHJlc3Npb24sXG4gIExvYWRQaHlzaWNzLFxuICBXYWl0TG9hZFBoeXNpY3MsXG4gIExvYWRQb3NlLFxuICBXYWl0TG9hZFBvc2UsXG4gIFNldHVwRXllQmxpbmssXG4gIFNldHVwQnJlYXRoLFxuICBMb2FkVXNlckRhdGEsXG4gIFdhaXRMb2FkVXNlckRhdGEsXG4gIFNldHVwRXllQmxpbmtJZHMsXG4gIFNldHVwTGlwU3luY0lkcyxcbiAgU2V0dXBMYXlvdXQsXG4gIExvYWRNb3Rpb24sXG4gIFdhaXRMb2FkTW90aW9uLFxuICBDb21wbGV0ZUluaXRpYWxpemUsXG4gIENvbXBsZXRlU2V0dXBNb2RlbCxcbiAgTG9hZFRleHR1cmUsXG4gIFdhaXRMb2FkVGV4dHVyZSxcbiAgQ29tcGxldGVTZXR1cFxufVxuXG4vKipcbiAqIOODpuODvOOCtuODvOOBjOWun+mam+OBq+S9v+eUqOOBmeOCi+ODouODh+ODq+OBruWun+ijheOCr+ODqeOCuTxicj5cbiAqIOODouODh+ODq+eUn+aIkOOAgeapn+iDveOCs+ODs+ODneODvOODjeODs+ODiOeUn+aIkOOAgeabtOaWsOWHpueQhuOBqOODrOODs+ODgOODquODs+OCsOOBruWRvOOBs+WHuuOBl+OCkuihjOOBhuOAglxuICovXG5leHBvcnQgY2xhc3MgTEFwcE1vZGVsIGV4dGVuZHMgQ3ViaXNtVXNlck1vZGVsIHtcbiAgLyoqXG4gICAqIG1vZGVsMy5qc29u44GM572u44GL44KM44Gf44OH44Kj44Os44Kv44OI44Oq44Go44OV44Kh44Kk44Or44OR44K544GL44KJ44Oi44OH44Or44KS55Sf5oiQ44GZ44KLXG4gICAqIEBwYXJhbSBkaXJcbiAgICogQHBhcmFtIGZpbGVOYW1lXG4gICAqL1xuICBwdWJsaWMgbG9hZEFzc2V0cyhkaXI6IHN0cmluZywgZmlsZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX21vZGVsSG9tZURpciA9IGRpcjtcblxuICAgIGZldGNoKGAke3RoaXMuX21vZGVsSG9tZURpcn0vJHtmaWxlTmFtZX1gKVxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSlcbiAgICAgIC50aGVuKGFycmF5QnVmZmVyID0+IHtcbiAgICAgICAgY29uc3Qgc2V0dGluZzogSUN1YmlzbU1vZGVsU2V0dGluZyA9IG5ldyBDdWJpc21Nb2RlbFNldHRpbmdKc29uKFxuICAgICAgICAgIGFycmF5QnVmZmVyLFxuICAgICAgICAgIGFycmF5QnVmZmVyLmJ5dGVMZW5ndGhcbiAgICAgICAgKTtcblxuICAgICAgICAvLyDjgrnjg4bjg7zjg4jjgpLmm7TmlrBcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkTW9kZWw7XG5cbiAgICAgICAgLy8g57WQ5p6c44KS5L+d5a2YXG4gICAgICAgIHRoaXMuc2V0dXBNb2RlbChzZXR0aW5nKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIG1vZGVsMy5qc29u44GL44KJ44Oi44OH44Or44KS55Sf5oiQ44GZ44KL44CCXG4gICAqIG1vZGVsMy5qc29u44Gu6KiY6L+w44Gr5b6T44Gj44Gm44Oi44OH44Or55Sf5oiQ44CB44Oi44O844K344On44Oz44CB54mp55CG5ryU566X44Gq44Gp44Gu44Kz44Oz44Od44O844ON44Oz44OI55Sf5oiQ44KS6KGM44GG44CCXG4gICAqXG4gICAqIEBwYXJhbSBzZXR0aW5nIElDdWJpc21Nb2RlbFNldHRpbmfjga7jgqTjg7Pjgrnjgr/jg7PjgrlcbiAgICovXG4gIHByaXZhdGUgc2V0dXBNb2RlbChzZXR0aW5nOiBJQ3ViaXNtTW9kZWxTZXR0aW5nKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRpbmcgPSB0cnVlO1xuICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgICB0aGlzLl9tb2RlbFNldHRpbmcgPSBzZXR0aW5nO1xuXG4gICAgLy8gQ3ViaXNtTW9kZWxcbiAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vZGVsRmlsZU5hbWUoKSAhPSAnJykge1xuICAgICAgY29uc3QgbW9kZWxGaWxlTmFtZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb2RlbEZpbGVOYW1lKCk7XG5cbiAgICAgIGZldGNoKGAke3RoaXMuX21vZGVsSG9tZURpcn0vJHttb2RlbEZpbGVOYW1lfWApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAgIC50aGVuKGFycmF5QnVmZmVyID0+IHtcbiAgICAgICAgICB0aGlzLmxvYWRNb2RlbChhcnJheUJ1ZmZlcik7XG4gICAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkRXhwcmVzc2lvbjtcblxuICAgICAgICAgIC8vIGNhbGxiYWNrXG4gICAgICAgICAgbG9hZEN1YmlzbUV4cHJlc3Npb24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuV2FpdExvYWRNb2RlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ01vZGVsIGRhdGEgZG9lcyBub3QgZXhpc3QuJyk7XG4gICAgfVxuXG4gICAgLy8gRXhwcmVzc2lvblxuICAgIGNvbnN0IGxvYWRDdWJpc21FeHByZXNzaW9uID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRFeHByZXNzaW9uQ291bnQoKSA+IDApIHtcbiAgICAgICAgY29uc3QgY291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRFeHByZXNzaW9uQ291bnQoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uTmFtZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRFeHByZXNzaW9uTmFtZShpKTtcbiAgICAgICAgICBjb25zdCBleHByZXNzaW9uRmlsZU5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXhwcmVzc2lvbkZpbGVOYW1lKFxuICAgICAgICAgICAgaVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7ZXhwcmVzc2lvbkZpbGVOYW1lfWApXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5hcnJheUJ1ZmZlcigpKVxuICAgICAgICAgICAgLnRoZW4oYXJyYXlCdWZmZXIgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBtb3Rpb246IEFDdWJpc21Nb3Rpb24gPSB0aGlzLmxvYWRFeHByZXNzaW9uKFxuICAgICAgICAgICAgICAgIGFycmF5QnVmZmVyLFxuICAgICAgICAgICAgICAgIGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgsXG4gICAgICAgICAgICAgICAgZXhwcmVzc2lvbk5hbWVcbiAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICBpZiAodGhpcy5fZXhwcmVzc2lvbnMuZ2V0VmFsdWUoZXhwcmVzc2lvbk5hbWUpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBBQ3ViaXNtTW90aW9uLmRlbGV0ZShcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb25zLmdldFZhbHVlKGV4cHJlc3Npb25OYW1lKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhwcmVzc2lvbnMuc2V0VmFsdWUoZXhwcmVzc2lvbk5hbWUsIG51bGwpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdGhpcy5fZXhwcmVzc2lvbnMuc2V0VmFsdWUoZXhwcmVzc2lvbk5hbWUsIG1vdGlvbik7XG5cbiAgICAgICAgICAgICAgdGhpcy5fZXhwcmVzc2lvbkNvdW50Kys7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX2V4cHJlc3Npb25Db3VudCA+PSBjb3VudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFBoeXNpY3M7XG5cbiAgICAgICAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICAgICAgICAgIGxvYWRDdWJpc21QaHlzaWNzKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuV2FpdExvYWRFeHByZXNzaW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkUGh5c2ljcztcblxuICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICBsb2FkQ3ViaXNtUGh5c2ljcygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBQaHlzaWNzXG4gICAgY29uc3QgbG9hZEN1YmlzbVBoeXNpY3MgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldFBoeXNpY3NGaWxlTmFtZSgpICE9ICcnKSB7XG4gICAgICAgIGNvbnN0IHBoeXNpY3NGaWxlTmFtZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRQaHlzaWNzRmlsZU5hbWUoKTtcblxuICAgICAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7cGh5c2ljc0ZpbGVOYW1lfWApXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSlcbiAgICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRQaHlzaWNzKGFycmF5QnVmZmVyLCBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkUG9zZTtcblxuICAgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgICAgIGxvYWRDdWJpc21Qb3NlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuV2FpdExvYWRQaHlzaWNzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkUG9zZTtcblxuICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICBsb2FkQ3ViaXNtUG9zZSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBQb3NlXG4gICAgY29uc3QgbG9hZEN1YmlzbVBvc2UgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldFBvc2VGaWxlTmFtZSgpICE9ICcnKSB7XG4gICAgICAgIGNvbnN0IHBvc2VGaWxlTmFtZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRQb3NlRmlsZU5hbWUoKTtcblxuICAgICAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7cG9zZUZpbGVOYW1lfWApXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSlcbiAgICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRQb3NlKGFycmF5QnVmZmVyLCBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5TZXR1cEV5ZUJsaW5rO1xuXG4gICAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICAgICAgc2V0dXBFeWVCbGluaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkUG9zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuU2V0dXBFeWVCbGluaztcblxuICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICBzZXR1cEV5ZUJsaW5rKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIEV5ZUJsaW5rXG4gICAgY29uc3Qgc2V0dXBFeWVCbGluayA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXllQmxpbmtQYXJhbWV0ZXJDb3VudCgpID4gMCkge1xuICAgICAgICB0aGlzLl9leWVCbGluayA9IEN1YmlzbUV5ZUJsaW5rLmNyZWF0ZSh0aGlzLl9tb2RlbFNldHRpbmcpO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLlNldHVwQnJlYXRoO1xuICAgICAgfVxuXG4gICAgICAvLyBjYWxsYmFja1xuICAgICAgc2V0dXBCcmVhdGgoKTtcbiAgICB9O1xuXG4gICAgLy8gQnJlYXRoXG4gICAgY29uc3Qgc2V0dXBCcmVhdGggPSAoKTogdm9pZCA9PiB7XG4gICAgICB0aGlzLl9icmVhdGggPSBDdWJpc21CcmVhdGguY3JlYXRlKCk7XG5cbiAgICAgIGNvbnN0IGJyZWF0aFBhcmFtZXRlcnM6IGNzbVZlY3RvcjxCcmVhdGhQYXJhbWV0ZXJEYXRhPiA9IG5ldyBjc21WZWN0b3IoKTtcbiAgICAgIGJyZWF0aFBhcmFtZXRlcnMucHVzaEJhY2soXG4gICAgICAgIG5ldyBCcmVhdGhQYXJhbWV0ZXJEYXRhKHRoaXMuX2lkUGFyYW1BbmdsZVgsIDAuMCwgMTUuMCwgNi41MzQ1LCAwLjUpXG4gICAgICApO1xuICAgICAgYnJlYXRoUGFyYW1ldGVycy5wdXNoQmFjayhcbiAgICAgICAgbmV3IEJyZWF0aFBhcmFtZXRlckRhdGEodGhpcy5faWRQYXJhbUFuZ2xlWSwgMC4wLCA4LjAsIDMuNTM0NSwgMC41KVxuICAgICAgKTtcbiAgICAgIGJyZWF0aFBhcmFtZXRlcnMucHVzaEJhY2soXG4gICAgICAgIG5ldyBCcmVhdGhQYXJhbWV0ZXJEYXRhKHRoaXMuX2lkUGFyYW1BbmdsZVosIDAuMCwgMTAuMCwgNS41MzQ1LCAwLjUpXG4gICAgICApO1xuICAgICAgYnJlYXRoUGFyYW1ldGVycy5wdXNoQmFjayhcbiAgICAgICAgbmV3IEJyZWF0aFBhcmFtZXRlckRhdGEodGhpcy5faWRQYXJhbUJvZHlBbmdsZVgsIDAuMCwgNC4wLCAxNS41MzQ1LCAwLjUpXG4gICAgICApO1xuICAgICAgYnJlYXRoUGFyYW1ldGVycy5wdXNoQmFjayhcbiAgICAgICAgbmV3IEJyZWF0aFBhcmFtZXRlckRhdGEoXG4gICAgICAgICAgQ3ViaXNtRnJhbWV3b3JrLmdldElkTWFuYWdlcigpLmdldElkKFxuICAgICAgICAgICAgQ3ViaXNtRGVmYXVsdFBhcmFtZXRlcklkLlBhcmFtQnJlYXRoXG4gICAgICAgICAgKSxcbiAgICAgICAgICAwLjAsXG4gICAgICAgICAgMC41LFxuICAgICAgICAgIDMuMjM0NSxcbiAgICAgICAgICAwLjVcbiAgICAgICAgKVxuICAgICAgKTtcblxuICAgICAgdGhpcy5fYnJlYXRoLnNldFBhcmFtZXRlcnMoYnJlYXRoUGFyYW1ldGVycyk7XG4gICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLkxvYWRVc2VyRGF0YTtcblxuICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIGxvYWRVc2VyRGF0YSgpO1xuICAgIH07XG5cbiAgICAvLyBVc2VyRGF0YVxuICAgIGNvbnN0IGxvYWRVc2VyRGF0YSA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0VXNlckRhdGFGaWxlKCkgIT0gJycpIHtcbiAgICAgICAgY29uc3QgdXNlckRhdGFGaWxlID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldFVzZXJEYXRhRmlsZSgpO1xuXG4gICAgICAgIGZldGNoKGAke3RoaXMuX21vZGVsSG9tZURpcn0vJHt1c2VyRGF0YUZpbGV9YClcbiAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5hcnJheUJ1ZmZlcigpKVxuICAgICAgICAgIC50aGVuKGFycmF5QnVmZmVyID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZFVzZXJEYXRhKGFycmF5QnVmZmVyLCBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcblxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5TZXR1cEV5ZUJsaW5rSWRzO1xuXG4gICAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICAgICAgc2V0dXBFeWVCbGlua0lkcygpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuV2FpdExvYWRVc2VyRGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuU2V0dXBFeWVCbGlua0lkcztcblxuICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICBzZXR1cEV5ZUJsaW5rSWRzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIEV5ZUJsaW5rSWRzXG4gICAgY29uc3Qgc2V0dXBFeWVCbGlua0lkcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGV5ZUJsaW5rSWRDb3VudDogbnVtYmVyID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldEV5ZUJsaW5rUGFyYW1ldGVyQ291bnQoKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleWVCbGlua0lkQ291bnQ7ICsraSkge1xuICAgICAgICB0aGlzLl9leWVCbGlua0lkcy5wdXNoQmFjayhcbiAgICAgICAgICB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXllQmxpbmtQYXJhbWV0ZXJJZChpKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLlNldHVwTGlwU3luY0lkcztcblxuICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIHNldHVwTGlwU3luY0lkcygpO1xuICAgIH07XG5cbiAgICAvLyBMaXBTeW5jSWRzXG4gICAgY29uc3Qgc2V0dXBMaXBTeW5jSWRzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgbGlwU3luY0lkQ291bnQgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TGlwU3luY1BhcmFtZXRlckNvdW50KCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlwU3luY0lkQ291bnQ7ICsraSkge1xuICAgICAgICB0aGlzLl9saXBTeW5jSWRzLnB1c2hCYWNrKHRoaXMuX21vZGVsU2V0dGluZy5nZXRMaXBTeW5jUGFyYW1ldGVySWQoaSkpO1xuICAgICAgfVxuICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5TZXR1cExheW91dDtcblxuICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIHNldHVwTGF5b3V0KCk7XG4gICAgfTtcblxuICAgIC8vIExheW91dFxuICAgIGNvbnN0IHNldHVwTGF5b3V0ID0gKCk6IHZvaWQgPT4ge1xuICAgICAgY29uc3QgbGF5b3V0OiBjc21NYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IGNzbU1hcDxzdHJpbmcsIG51bWJlcj4oKTtcbiAgICAgIHRoaXMuX21vZGVsU2V0dGluZy5nZXRMYXlvdXRNYXAobGF5b3V0KTtcbiAgICAgIHRoaXMuX21vZGVsTWF0cml4LnNldHVwRnJvbUxheW91dChsYXlvdXQpO1xuICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkTW90aW9uO1xuXG4gICAgICAvLyBjYWxsYmFja1xuICAgICAgbG9hZEN1YmlzbU1vdGlvbigpO1xuICAgIH07XG5cbiAgICAvLyBNb3Rpb25cbiAgICBjb25zdCBsb2FkQ3ViaXNtTW90aW9uID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5XYWl0TG9hZE1vdGlvbjtcbiAgICAgIHRoaXMuX21vZGVsLnNhdmVQYXJhbWV0ZXJzKCk7XG4gICAgICB0aGlzLl9hbGxNb3Rpb25Db3VudCA9IDA7XG4gICAgICB0aGlzLl9tb3Rpb25Db3VudCA9IDA7XG4gICAgICBjb25zdCBncm91cDogc3RyaW5nW10gPSBbXTtcblxuICAgICAgY29uc3QgbW90aW9uR3JvdXBDb3VudDogbnVtYmVyID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkdyb3VwQ291bnQoKTtcblxuICAgICAgLy8g44Oi44O844K344On44Oz44Gu57eP5pWw44KS5rGC44KB44KLXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdGlvbkdyb3VwQ291bnQ7IGkrKykge1xuICAgICAgICBncm91cFtpXSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25Hcm91cE5hbWUoaSk7XG4gICAgICAgIHRoaXMuX2FsbE1vdGlvbkNvdW50ICs9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25Db3VudChncm91cFtpXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIOODouODvOOCt+ODp+ODs+OBruiqreOBv+i+vOOBv1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Rpb25Hcm91cENvdW50OyBpKyspIHtcbiAgICAgICAgdGhpcy5wcmVMb2FkTW90aW9uR3JvdXAoZ3JvdXBbaV0pO1xuICAgICAgfVxuXG4gICAgICAvLyDjg6Ljg7zjgrfjg6fjg7PjgYzjgarjgYTloLTlkIhcbiAgICAgIGlmIChtb3Rpb25Hcm91cENvdW50ID09IDApIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkVGV4dHVyZTtcblxuICAgICAgICAvLyDlhajjgabjga7jg6Ljg7zjgrfjg6fjg7PjgpLlgZzmraLjgZnjgotcbiAgICAgICAgdGhpcy5fbW90aW9uTWFuYWdlci5zdG9wQWxsTW90aW9ucygpO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVJlbmRlcmVyKCk7XG4gICAgICAgIHRoaXMuc2V0dXBUZXh0dXJlcygpO1xuICAgICAgICB0aGlzLmdldFJlbmRlcmVyKCkuc3RhcnRVcChnbCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4jjgavjg4bjgq/jgrnjg4Hjg6PjgpLjg63jg7zjg4njgZnjgotcbiAgICovXG4gIHByaXZhdGUgc2V0dXBUZXh0dXJlcygpOiB2b2lkIHtcbiAgICAvLyBpUGhvbmXjgafjga7jgqLjg6vjg5XjgqHlk4Hos6rlkJHkuIrjga7jgZ/jgoFUeXBlc2NyaXB044Gn44GvcHJlbXVsdGlwbGllZEFscGhh44KS5o6h55SoXG4gICAgY29uc3QgdXNlUHJlbXVsdGlwbHkgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlID09IExvYWRTdGVwLkxvYWRUZXh0dXJlKSB7XG4gICAgICAvLyDjg4bjgq/jgrnjg4Hjg6Poqq3jgb/ovrzjgb/nlKhcbiAgICAgIGNvbnN0IHRleHR1cmVDb3VudDogbnVtYmVyID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldFRleHR1cmVDb3VudCgpO1xuXG4gICAgICBmb3IgKFxuICAgICAgICBsZXQgbW9kZWxUZXh0dXJlTnVtYmVyID0gMDtcbiAgICAgICAgbW9kZWxUZXh0dXJlTnVtYmVyIDwgdGV4dHVyZUNvdW50O1xuICAgICAgICBtb2RlbFRleHR1cmVOdW1iZXIrK1xuICAgICAgKSB7XG4gICAgICAgIC8vIOODhuOCr+OCueODgeODo+WQjeOBjOepuuaWh+Wtl+OBoOOBo+OBn+WgtOWQiOOBr+ODreODvOODieODu+ODkOOCpOODs+ODieWHpueQhuOCkuOCueOCreODg+ODl1xuICAgICAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldFRleHR1cmVGaWxlTmFtZShtb2RlbFRleHR1cmVOdW1iZXIpID09ICcnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2dldFRleHR1cmVGaWxlTmFtZSBudWxsJyk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZWJHTOOBruODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiOOBq+ODhuOCr+OCueODgeODo+OCkuODreODvOODieOBmeOCi1xuICAgICAgICBsZXQgdGV4dHVyZVBhdGggPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0VGV4dHVyZUZpbGVOYW1lKFxuICAgICAgICAgIG1vZGVsVGV4dHVyZU51bWJlclxuICAgICAgICApO1xuICAgICAgICB0ZXh0dXJlUGF0aCA9IHRoaXMuX21vZGVsSG9tZURpciArIHRleHR1cmVQYXRoO1xuXG4gICAgICAgIC8vIOODreODvOODieWujOS6huaZguOBq+WRvOOBs+WHuuOBmeOCs+ODvOODq+ODkOODg+OCr+mWouaVsFxuICAgICAgICBjb25zdCBvbkxvYWQgPSAodGV4dHVyZUluZm86IFRleHR1cmVJbmZvKTogdm9pZCA9PiB7XG4gICAgICAgICAgdGhpcy5nZXRSZW5kZXJlcigpLmJpbmRUZXh0dXJlKG1vZGVsVGV4dHVyZU51bWJlciwgdGV4dHVyZUluZm8uaWQpO1xuXG4gICAgICAgICAgdGhpcy5fdGV4dHVyZUNvdW50Kys7XG5cbiAgICAgICAgICBpZiAodGhpcy5fdGV4dHVyZUNvdW50ID49IHRleHR1cmVDb3VudCkge1xuICAgICAgICAgICAgLy8g44Ot44O844OJ5a6M5LqGXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLkNvbXBsZXRlU2V0dXA7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIOiqreOBv+i+vOOBv1xuICAgICAgICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKVxuICAgICAgICAgIC5nZXRUZXh0dXJlTWFuYWdlcigpXG4gICAgICAgICAgLmNyZWF0ZVRleHR1cmVGcm9tUG5nRmlsZSh0ZXh0dXJlUGF0aCwgdXNlUHJlbXVsdGlwbHksIG9uTG9hZCk7XG4gICAgICAgIHRoaXMuZ2V0UmVuZGVyZXIoKS5zZXRJc1ByZW11bHRpcGxpZWRBbHBoYSh1c2VQcmVtdWx0aXBseSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuV2FpdExvYWRUZXh0dXJlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDjg6zjg7Pjg4Djg6njgpLlho3mp4vnr4njgZnjgotcbiAgICovXG4gIHB1YmxpYyByZWxvYWRSZW5kZXJlcigpOiB2b2lkIHtcbiAgICB0aGlzLmRlbGV0ZVJlbmRlcmVyKCk7XG4gICAgdGhpcy5jcmVhdGVSZW5kZXJlcigpO1xuICAgIHRoaXMuc2V0dXBUZXh0dXJlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIOabtOaWsFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc3RhdGUgIT0gTG9hZFN0ZXAuQ29tcGxldGVTZXR1cCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGVsdGFUaW1lU2Vjb25kczogbnVtYmVyID0gTEFwcFBhbC5nZXREZWx0YVRpbWUoKTtcbiAgICB0aGlzLl91c2VyVGltZVNlY29uZHMgKz0gZGVsdGFUaW1lU2Vjb25kcztcblxuICAgIHRoaXMuX2RyYWdNYW5hZ2VyLnVwZGF0ZShkZWx0YVRpbWVTZWNvbmRzKTtcbiAgICB0aGlzLl9kcmFnWCA9IHRoaXMuX2RyYWdNYW5hZ2VyLmdldFgoKTtcbiAgICB0aGlzLl9kcmFnWSA9IHRoaXMuX2RyYWdNYW5hZ2VyLmdldFkoKTtcblxuICAgIC8vIOODouODvOOCt+ODp+ODs+OBq+OCiOOCi+ODkeODqeODoeODvOOCv+abtOaWsOOBruacieeEoVxuICAgIGxldCBtb3Rpb25VcGRhdGVkID0gZmFsc2U7XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgdGhpcy5fbW9kZWwubG9hZFBhcmFtZXRlcnMoKTsgLy8g5YmN5Zue44K744O844OW44GV44KM44Gf54q25oWL44KS44Ot44O844OJXG4gICAgaWYgKHRoaXMuX21vdGlvbk1hbmFnZXIuaXNGaW5pc2hlZCgpKSB7XG4gICAgICAvLyDjg6Ljg7zjgrfjg6fjg7Pjga7lho3nlJ/jgYzjgarjgYTloLTlkIjjgIHlvoXmqZ/jg6Ljg7zjgrfjg6fjg7Pjga7kuK3jgYvjgonjg6njg7Pjg4Djg6Djgaflho3nlJ/jgZnjgotcbiAgICAgIHRoaXMuc3RhcnRSYW5kb21Nb3Rpb24oXG4gICAgICAgIExBcHBEZWZpbmUuTW90aW9uR3JvdXBJZGxlLFxuICAgICAgICBMQXBwRGVmaW5lLlByaW9yaXR5SWRsZVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW90aW9uVXBkYXRlZCA9IHRoaXMuX21vdGlvbk1hbmFnZXIudXBkYXRlTW90aW9uKFxuICAgICAgICB0aGlzLl9tb2RlbCxcbiAgICAgICAgZGVsdGFUaW1lU2Vjb25kc1xuICAgICAgKTsgLy8g44Oi44O844K344On44Oz44KS5pu05pawXG4gICAgfVxuICAgIHRoaXMuX21vZGVsLnNhdmVQYXJhbWV0ZXJzKCk7IC8vIOeKtuaFi+OCkuS/neWtmFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIOOBvuOBsOOBn+OBjVxuICAgIGlmICghbW90aW9uVXBkYXRlZCkge1xuICAgICAgaWYgKHRoaXMuX2V5ZUJsaW5rICE9IG51bGwpIHtcbiAgICAgICAgLy8g44Oh44Kk44Oz44Oi44O844K344On44Oz44Gu5pu05paw44GM44Gq44GE44Go44GNXG4gICAgICAgIHRoaXMuX2V5ZUJsaW5rLnVwZGF0ZVBhcmFtZXRlcnModGhpcy5fbW9kZWwsIGRlbHRhVGltZVNlY29uZHMpOyAvLyDnm67jg5Hjg4FcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXhwcmVzc2lvbk1hbmFnZXIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fZXhwcmVzc2lvbk1hbmFnZXIudXBkYXRlTW90aW9uKHRoaXMuX21vZGVsLCBkZWx0YVRpbWVTZWNvbmRzKTsgLy8g6KGo5oOF44Gn44OR44Op44Oh44O844K/5pu05paw77yI55u45a++5aSJ5YyW77yJXG4gICAgfVxuXG4gICAgLy8g44OJ44Op44OD44Kw44Gr44KI44KL5aSJ5YyWXG4gICAgLy8g44OJ44Op44OD44Kw44Gr44KI44KL6aGU44Gu5ZCR44GN44Gu6Kq/5pW0XG4gICAgdGhpcy5fbW9kZWwuYWRkUGFyYW1ldGVyVmFsdWVCeUlkKHRoaXMuX2lkUGFyYW1BbmdsZVgsIHRoaXMuX2RyYWdYICogMzApOyAvLyAtMzDjgYvjgokzMOOBruWApOOCkuWKoOOBiOOCi1xuICAgIHRoaXMuX21vZGVsLmFkZFBhcmFtZXRlclZhbHVlQnlJZCh0aGlzLl9pZFBhcmFtQW5nbGVZLCB0aGlzLl9kcmFnWSAqIDMwKTtcbiAgICB0aGlzLl9tb2RlbC5hZGRQYXJhbWV0ZXJWYWx1ZUJ5SWQoXG4gICAgICB0aGlzLl9pZFBhcmFtQW5nbGVaLFxuICAgICAgdGhpcy5fZHJhZ1ggKiB0aGlzLl9kcmFnWSAqIC0zMFxuICAgICk7XG5cbiAgICAvLyDjg4njg6njg4PjgrDjgavjgojjgovkvZPjga7lkJHjgY3jga7oqr/mlbRcbiAgICB0aGlzLl9tb2RlbC5hZGRQYXJhbWV0ZXJWYWx1ZUJ5SWQoXG4gICAgICB0aGlzLl9pZFBhcmFtQm9keUFuZ2xlWCxcbiAgICAgIHRoaXMuX2RyYWdYICogMTBcbiAgICApOyAvLyAtMTDjgYvjgokxMOOBruWApOOCkuWKoOOBiOOCi1xuXG4gICAgLy8g44OJ44Op44OD44Kw44Gr44KI44KL55uu44Gu5ZCR44GN44Gu6Kq/5pW0XG4gICAgdGhpcy5fbW9kZWwuYWRkUGFyYW1ldGVyVmFsdWVCeUlkKHRoaXMuX2lkUGFyYW1FeWVCYWxsWCwgdGhpcy5fZHJhZ1gpOyAvLyAtMeOBi+OCiTHjga7lgKTjgpLliqDjgYjjgotcbiAgICB0aGlzLl9tb2RlbC5hZGRQYXJhbWV0ZXJWYWx1ZUJ5SWQodGhpcy5faWRQYXJhbUV5ZUJhbGxZLCB0aGlzLl9kcmFnWSk7XG5cbiAgICAvLyDlkbzlkLjjgarjgalcbiAgICBpZiAodGhpcy5fYnJlYXRoICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX2JyZWF0aC51cGRhdGVQYXJhbWV0ZXJzKHRoaXMuX21vZGVsLCBkZWx0YVRpbWVTZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvLyDniannkIbmvJTnrpfjga7oqK3lrppcbiAgICBpZiAodGhpcy5fcGh5c2ljcyAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9waHlzaWNzLmV2YWx1YXRlKHRoaXMuX21vZGVsLCBkZWx0YVRpbWVTZWNvbmRzKTtcbiAgICB9XG5cbiAgICAvLyDjg6rjg4Pjg5fjgrfjg7Pjgq/jga7oqK3lrppcbiAgICBpZiAodGhpcy5fbGlwc3luYykge1xuICAgICAgY29uc3QgdmFsdWUgPSAwOyAvLyDjg6rjgqLjg6vjgr/jgqTjg6Djgafjg6rjg4Pjg5fjgrfjg7Pjgq/jgpLooYzjgYbloLTlkIjjgIHjgrfjgrnjg4bjg6DjgYvjgonpn7Pph4/jgpLlj5blvpfjgZfjgabjgIEwfjHjga7nr4Tlm7LjgaflgKTjgpLlhaXlipvjgZfjgb7jgZnjgIJcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9saXBTeW5jSWRzLmdldFNpemUoKTsgKytpKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLmFkZFBhcmFtZXRlclZhbHVlQnlJZCh0aGlzLl9saXBTeW5jSWRzLmF0KGkpLCB2YWx1ZSwgMC44KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDjg53jg7zjgrrjga7oqK3lrppcbiAgICBpZiAodGhpcy5fcG9zZSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9wb3NlLnVwZGF0ZVBhcmFtZXRlcnModGhpcy5fbW9kZWwsIGRlbHRhVGltZVNlY29uZHMpO1xuICAgIH1cblxuICAgIHRoaXMuX21vZGVsLnVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW8leaVsOOBp+aMh+WumuOBl+OBn+ODouODvOOCt+ODp+ODs+OBruWGjeeUn+OCkumWi+Wni+OBmeOCi1xuICAgKiBAcGFyYW0gZ3JvdXAg44Oi44O844K344On44Oz44Kw44Or44O844OX5ZCNXG4gICAqIEBwYXJhbSBubyDjgrDjg6vjg7zjg5flhoXjga7nlarlj7dcbiAgICogQHBhcmFtIHByaW9yaXR5IOWEquWFiOW6plxuICAgKiBAcGFyYW0gb25GaW5pc2hlZE1vdGlvbkhhbmRsZXIg44Oi44O844K344On44Oz5YaN55Sf57WC5LqG5pmC44Gr5ZG844Gz5Ye644GV44KM44KL44Kz44O844Or44OQ44OD44Kv6Zai5pWwXG4gICAqIEByZXR1cm4g6ZaL5aeL44GX44Gf44Oi44O844K344On44Oz44Gu6K2Y5Yil55Wq5Y+344KS6L+U44GZ44CC5YCL5Yil44Gu44Oi44O844K344On44Oz44GM57WC5LqG44GX44Gf44GL5ZCm44GL44KS5Yik5a6a44GZ44KLaXNGaW5pc2hlZCgp44Gu5byV5pWw44Gn5L2/55So44GZ44KL44CC6ZaL5aeL44Gn44GN44Gq44GE5pmC44GvWy0xXVxuICAgKi9cbiAgcHVibGljIHN0YXJ0TW90aW9uKFxuICAgIGdyb3VwOiBzdHJpbmcsXG4gICAgbm86IG51bWJlcixcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyPzogRmluaXNoZWRNb3Rpb25DYWxsYmFja1xuICApOiBDdWJpc21Nb3Rpb25RdWV1ZUVudHJ5SGFuZGxlIHtcbiAgICBpZiAocHJpb3JpdHkgPT0gTEFwcERlZmluZS5Qcmlvcml0eUZvcmNlKSB7XG4gICAgICB0aGlzLl9tb3Rpb25NYW5hZ2VyLnNldFJlc2VydmVQcmlvcml0eShwcmlvcml0eSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5fbW90aW9uTWFuYWdlci5yZXNlcnZlTW90aW9uKHByaW9yaXR5KSkge1xuICAgICAgaWYgKHRoaXMuX2RlYnVnTW9kZSkge1xuICAgICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShcIltBUFBdY2FuJ3Qgc3RhcnQgbW90aW9uLlwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBJbnZhbGlkTW90aW9uUXVldWVFbnRyeUhhbmRsZVZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IG1vdGlvbkZpbGVOYW1lID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkZpbGVOYW1lKGdyb3VwLCBubyk7XG5cbiAgICAvLyBleCkgaWRsZV8wXG4gICAgY29uc3QgbmFtZSA9IGAke2dyb3VwfV8ke25vfWA7XG4gICAgbGV0IG1vdGlvbjogQ3ViaXNtTW90aW9uID0gdGhpcy5fbW90aW9ucy5nZXRWYWx1ZShuYW1lKSBhcyBDdWJpc21Nb3Rpb247XG4gICAgbGV0IGF1dG9EZWxldGUgPSBmYWxzZTtcblxuICAgIGlmIChtb3Rpb24gPT0gbnVsbCkge1xuICAgICAgZmV0Y2goYCR7dGhpcy5fbW9kZWxIb21lRGlyfS8ke21vdGlvbkZpbGVOYW1lfWApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAgIC50aGVuKGFycmF5QnVmZmVyID0+IHtcbiAgICAgICAgICBtb3Rpb24gPSB0aGlzLmxvYWRNb3Rpb24oXG4gICAgICAgICAgICBhcnJheUJ1ZmZlcixcbiAgICAgICAgICAgIGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgb25GaW5pc2hlZE1vdGlvbkhhbmRsZXJcbiAgICAgICAgICApO1xuICAgICAgICAgIGxldCBmYWRlVGltZTogbnVtYmVyID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkZhZGVJblRpbWVWYWx1ZShcbiAgICAgICAgICAgIGdyb3VwLFxuICAgICAgICAgICAgbm9cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGZhZGVUaW1lID49IDAuMCkge1xuICAgICAgICAgICAgbW90aW9uLnNldEZhZGVJblRpbWUoZmFkZVRpbWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZhZGVUaW1lID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkZhZGVPdXRUaW1lVmFsdWUoZ3JvdXAsIG5vKTtcbiAgICAgICAgICBpZiAoZmFkZVRpbWUgPj0gMC4wKSB7XG4gICAgICAgICAgICBtb3Rpb24uc2V0RmFkZU91dFRpbWUoZmFkZVRpbWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1vdGlvbi5zZXRFZmZlY3RJZHModGhpcy5fZXllQmxpbmtJZHMsIHRoaXMuX2xpcFN5bmNJZHMpO1xuICAgICAgICAgIGF1dG9EZWxldGUgPSB0cnVlOyAvLyDntYLkuobmmYLjgavjg6Hjg6Ljg6rjgYvjgonliYrpmaRcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vdGlvbi5zZXRGaW5pc2hlZE1vdGlvbkhhbmRsZXIob25GaW5pc2hlZE1vdGlvbkhhbmRsZXIpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kZWJ1Z01vZGUpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbQVBQXXN0YXJ0IG1vdGlvbjogWyR7Z3JvdXB9XyR7bm99YCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9tb3Rpb25NYW5hZ2VyLnN0YXJ0TW90aW9uUHJpb3JpdHkoXG4gICAgICBtb3Rpb24sXG4gICAgICBhdXRvRGVsZXRlLFxuICAgICAgcHJpb3JpdHlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIOODqeODs+ODgOODoOOBq+mBuOOBsOOCjOOBn+ODouODvOOCt+ODp+ODs+OBruWGjeeUn+OCkumWi+Wni+OBmeOCi+OAglxuICAgKiBAcGFyYW0gZ3JvdXAg44Oi44O844K344On44Oz44Kw44Or44O844OX5ZCNXG4gICAqIEBwYXJhbSBwcmlvcml0eSDlhKrlhYjluqZcbiAgICogQHBhcmFtIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyIOODouODvOOCt+ODp+ODs+WGjeeUn+e1guS6huaZguOBq+WRvOOBs+WHuuOBleOCjOOCi+OCs+ODvOODq+ODkOODg+OCr+mWouaVsFxuICAgKiBAcmV0dXJuIOmWi+Wni+OBl+OBn+ODouODvOOCt+ODp+ODs+OBruitmOWIpeeVquWPt+OCkui/lOOBmeOAguWAi+WIpeOBruODouODvOOCt+ODp+ODs+OBjOe1guS6huOBl+OBn+OBi+WQpuOBi+OCkuWIpOWumuOBmeOCi2lzRmluaXNoZWQoKeOBruW8leaVsOOBp+S9v+eUqOOBmeOCi+OAgumWi+Wni+OBp+OBjeOBquOBhOaZguOBr1stMV1cbiAgICovXG4gIHB1YmxpYyBzdGFydFJhbmRvbU1vdGlvbihcbiAgICBncm91cDogc3RyaW5nLFxuICAgIHByaW9yaXR5OiBudW1iZXIsXG4gICAgb25GaW5pc2hlZE1vdGlvbkhhbmRsZXI/OiBGaW5pc2hlZE1vdGlvbkNhbGxiYWNrXG4gICk6IEN1YmlzbU1vdGlvblF1ZXVlRW50cnlIYW5kbGUge1xuICAgIGlmICh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW90aW9uQ291bnQoZ3JvdXApID09IDApIHtcbiAgICAgIHJldHVybiBJbnZhbGlkTW90aW9uUXVldWVFbnRyeUhhbmRsZVZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IG5vOiBudW1iZXIgPSBNYXRoLmZsb29yKFxuICAgICAgTWF0aC5yYW5kb20oKSAqIHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25Db3VudChncm91cClcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMuc3RhcnRNb3Rpb24oZ3JvdXAsIG5vLCBwcmlvcml0eSwgb25GaW5pc2hlZE1vdGlvbkhhbmRsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW8leaVsOOBp+aMh+WumuOBl+OBn+ihqOaDheODouODvOOCt+ODp+ODs+OCkuOCu+ODg+ODiOOBmeOCi1xuICAgKlxuICAgKiBAcGFyYW0gZXhwcmVzc2lvbklkIOihqOaDheODouODvOOCt+ODp+ODs+OBrklEXG4gICAqL1xuICBwdWJsaWMgc2V0RXhwcmVzc2lvbihleHByZXNzaW9uSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG1vdGlvbjogQUN1YmlzbU1vdGlvbiA9IHRoaXMuX2V4cHJlc3Npb25zLmdldFZhbHVlKGV4cHJlc3Npb25JZCk7XG5cbiAgICBpZiAodGhpcy5fZGVidWdNb2RlKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0FQUF1leHByZXNzaW9uOiBbJHtleHByZXNzaW9uSWR9XWApO1xuICAgIH1cblxuICAgIGlmIChtb3Rpb24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fZXhwcmVzc2lvbk1hbmFnZXIuc3RhcnRNb3Rpb25Qcmlvcml0eShcbiAgICAgICAgbW90aW9uLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgTEFwcERlZmluZS5Qcmlvcml0eUZvcmNlXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5fZGVidWdNb2RlKSB7XG4gICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbQVBQXWV4cHJlc3Npb25bJHtleHByZXNzaW9uSWR9XSBpcyBudWxsYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOODqeODs+ODgOODoOOBq+mBuOOBsOOCjOOBn+ihqOaDheODouODvOOCt+ODp+ODs+OCkuOCu+ODg+ODiOOBmeOCi1xuICAgKi9cbiAgcHVibGljIHNldFJhbmRvbUV4cHJlc3Npb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2V4cHJlc3Npb25zLmdldFNpemUoKSA9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgbm86IG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuX2V4cHJlc3Npb25zLmdldFNpemUoKSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2V4cHJlc3Npb25zLmdldFNpemUoKTsgaSsrKSB7XG4gICAgICBpZiAoaSA9PSBubykge1xuICAgICAgICBjb25zdCBuYW1lOiBzdHJpbmcgPSB0aGlzLl9leHByZXNzaW9ucy5fa2V5VmFsdWVzW2ldLmZpcnN0O1xuICAgICAgICB0aGlzLnNldEV4cHJlc3Npb24obmFtZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog44Kk44OZ44Oz44OI44Gu55m654Gr44KS5Y+X44GR5Y+W44KLXG4gICAqL1xuICBwdWJsaWMgbW90aW9uRXZlbnRGaXJlZChldmVudFZhbHVlOiBjc21TdHJpbmcpOiB2b2lkIHtcbiAgICBDdWJpc21Mb2dJbmZvKCd7MH0gaXMgZmlyZWQgb24gTEFwcE1vZGVsISEnLCBldmVudFZhbHVlLnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW9k+OBn+OCiuWIpOWumuODhuOCueODiFxuICAgKiDmjIflrprvvKnvvKTjga7poILngrnjg6rjgrnjg4jjgYvjgonnn6nlvaLjgpLoqIjnrpfjgZfjgIHluqfmqJnjgpLjgYznn6nlvaLnr4Tlm7LlhoXjgYvliKTlrprjgZnjgovjgIJcbiAgICpcbiAgICogQHBhcmFtIGhpdEFyZW5hTmFtZSAg5b2T44Gf44KK5Yik5a6a44KS44OG44K544OI44GZ44KL5a++6LGh44GuSURcbiAgICogQHBhcmFtIHggICAgICAgICAgICAg5Yik5a6a44KS6KGM44GGWOW6p+aomVxuICAgKiBAcGFyYW0geSAgICAgICAgICAgICDliKTlrprjgpLooYzjgYZZ5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgaGl0VGVzdChoaXRBcmVuYU5hbWU6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAvLyDpgI/mmI7mmYLjga/lvZPjgZ/jgorliKTlrprnhKHjgZfjgIJcbiAgICBpZiAodGhpcy5fb3BhY2l0eSA8IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudDogbnVtYmVyID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldEhpdEFyZWFzQ291bnQoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRIaXRBcmVhTmFtZShpKSA9PSBoaXRBcmVuYU5hbWUpIHtcbiAgICAgICAgY29uc3QgZHJhd0lkOiBDdWJpc21JZEhhbmRsZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRIaXRBcmVhSWQoaSk7XG4gICAgICAgIHJldHVybiB0aGlzLmlzSGl0KGRyYXdJZCwgeCwgeSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIOODouODvOOCt+ODp+ODs+ODh+ODvOOCv+OCkuOCsOODq+ODvOODl+WQjeOBi+OCieS4gOaLrOOBp+ODreODvOODieOBmeOCi+OAglxuICAgKiDjg6Ljg7zjgrfjg6fjg7Pjg4fjg7zjgr/jga7lkI3liY3jga/lhoXpg6jjgadNb2RlbFNldHRpbmfjgYvjgonlj5blvpfjgZnjgovjgIJcbiAgICpcbiAgICogQHBhcmFtIGdyb3VwIOODouODvOOCt+ODp+ODs+ODh+ODvOOCv+OBruOCsOODq+ODvOODl+WQjVxuICAgKi9cbiAgcHVibGljIHByZUxvYWRNb3Rpb25Hcm91cChncm91cDogc3RyaW5nKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW90aW9uQ291bnQoZ3JvdXApOyBpKyspIHtcbiAgICAgIGNvbnN0IG1vdGlvbkZpbGVOYW1lID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkZpbGVOYW1lKGdyb3VwLCBpKTtcblxuICAgICAgLy8gZXgpIGlkbGVfMFxuICAgICAgY29uc3QgbmFtZSA9IGAke2dyb3VwfV8ke2l9YDtcbiAgICAgIGlmICh0aGlzLl9kZWJ1Z01vZGUpIHtcbiAgICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXG4gICAgICAgICAgYFtBUFBdbG9hZCBtb3Rpb246ICR7bW90aW9uRmlsZU5hbWV9ID0+IFske25hbWV9XWBcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZmV0Y2goYCR7dGhpcy5fbW9kZWxIb21lRGlyfS8ke21vdGlvbkZpbGVOYW1lfWApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAgIC50aGVuKGFycmF5QnVmZmVyID0+IHtcbiAgICAgICAgICBjb25zdCB0bXBNb3Rpb246IEN1YmlzbU1vdGlvbiA9IHRoaXMubG9hZE1vdGlvbihcbiAgICAgICAgICAgIGFycmF5QnVmZmVyLFxuICAgICAgICAgICAgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCxcbiAgICAgICAgICAgIG5hbWVcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbGV0IGZhZGVUaW1lID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkZhZGVJblRpbWVWYWx1ZShncm91cCwgaSk7XG4gICAgICAgICAgaWYgKGZhZGVUaW1lID49IDAuMCkge1xuICAgICAgICAgICAgdG1wTW90aW9uLnNldEZhZGVJblRpbWUoZmFkZVRpbWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZhZGVUaW1lID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkZhZGVPdXRUaW1lVmFsdWUoZ3JvdXAsIGkpO1xuICAgICAgICAgIGlmIChmYWRlVGltZSA+PSAwLjApIHtcbiAgICAgICAgICAgIHRtcE1vdGlvbi5zZXRGYWRlT3V0VGltZShmYWRlVGltZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRtcE1vdGlvbi5zZXRFZmZlY3RJZHModGhpcy5fZXllQmxpbmtJZHMsIHRoaXMuX2xpcFN5bmNJZHMpO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX21vdGlvbnMuZ2V0VmFsdWUobmFtZSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgQUN1YmlzbU1vdGlvbi5kZWxldGUodGhpcy5fbW90aW9ucy5nZXRWYWx1ZShuYW1lKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fbW90aW9ucy5zZXRWYWx1ZShuYW1lLCB0bXBNb3Rpb24pO1xuXG4gICAgICAgICAgdGhpcy5fbW90aW9uQ291bnQrKztcbiAgICAgICAgICBpZiAodGhpcy5fbW90aW9uQ291bnQgPj0gdGhpcy5fYWxsTW90aW9uQ291bnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFRleHR1cmU7XG5cbiAgICAgICAgICAgIC8vIOWFqOOBpuOBruODouODvOOCt+ODp+ODs+OCkuWBnOatouOBmeOCi1xuICAgICAgICAgICAgdGhpcy5fbW90aW9uTWFuYWdlci5zdG9wQWxsTW90aW9ucygpO1xuXG4gICAgICAgICAgICB0aGlzLl91cGRhdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVJlbmRlcmVyKCk7XG4gICAgICAgICAgICB0aGlzLnNldHVwVGV4dHVyZXMoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVuZGVyZXIoKS5zdGFydFVwKGdsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDjgZnjgbnjgabjga7jg6Ljg7zjgrfjg6fjg7Pjg4fjg7zjgr/jgpLop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlTW90aW9ucygpOiB2b2lkIHtcbiAgICB0aGlzLl9tb3Rpb25zLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICog5YWo44Gm44Gu6KGo5oOF44OH44O844K/44KS6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZUV4cHJlc3Npb25zKCk6IHZvaWQge1xuICAgIHRoaXMuX2V4cHJlc3Npb25zLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICog44Oi44OH44Or44KS5o+P55S744GZ44KL5Yem55CG44CC44Oi44OH44Or44KS5o+P55S744GZ44KL56m66ZaT44GuVmlldy1Qcm9qZWN0aW9u6KGM5YiX44KS5rih44GZ44CCXG4gICAqL1xuICBwdWJsaWMgZG9EcmF3KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tb2RlbCA9PSBudWxsKSByZXR1cm47XG5cbiAgICAvLyDjgq3jg6Pjg7Pjg5DjgrnjgrXjgqTjgrrjgpLmuKHjgZlcbiAgICBjb25zdCB2aWV3cG9ydDogbnVtYmVyW10gPSBbMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0XTtcblxuICAgIHRoaXMuZ2V0UmVuZGVyZXIoKS5zZXRSZW5kZXJTdGF0ZShmcmFtZUJ1ZmZlciwgdmlld3BvcnQpO1xuICAgIHRoaXMuZ2V0UmVuZGVyZXIoKS5kcmF3TW9kZWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6Ljg4fjg6vjgpLmj4/nlLvjgZnjgovlh6bnkIbjgILjg6Ljg4fjg6vjgpLmj4/nlLvjgZnjgovnqbrplpPjga5WaWV3LVByb2plY3Rpb27ooYzliJfjgpLmuKHjgZnjgIJcbiAgICovXG4gIHB1YmxpYyBkcmF3KG1hdHJpeDogQ3ViaXNtTWF0cml4NDQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWQhOiqreOBv+i+vOOBv+e1guS6huW+jFxuICAgIGlmICh0aGlzLl9zdGF0ZSA9PSBMb2FkU3RlcC5Db21wbGV0ZVNldHVwKSB7XG4gICAgICBtYXRyaXgubXVsdGlwbHlCeU1hdHJpeCh0aGlzLl9tb2RlbE1hdHJpeCk7XG5cbiAgICAgIHRoaXMuZ2V0UmVuZGVyZXIoKS5zZXRNdnBNYXRyaXgobWF0cml4KTtcblxuICAgICAgdGhpcy5kb0RyYXcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/XG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX21vZGVsU2V0dGluZyA9IG51bGw7XG4gICAgdGhpcy5fbW9kZWxIb21lRGlyID0gbnVsbDtcbiAgICB0aGlzLl91c2VyVGltZVNlY29uZHMgPSAwLjA7XG5cbiAgICB0aGlzLl9leWVCbGlua0lkcyA9IG5ldyBjc21WZWN0b3I8Q3ViaXNtSWRIYW5kbGU+KCk7XG4gICAgdGhpcy5fbGlwU3luY0lkcyA9IG5ldyBjc21WZWN0b3I8Q3ViaXNtSWRIYW5kbGU+KCk7XG5cbiAgICB0aGlzLl9tb3Rpb25zID0gbmV3IGNzbU1hcDxzdHJpbmcsIEFDdWJpc21Nb3Rpb24+KCk7XG4gICAgdGhpcy5fZXhwcmVzc2lvbnMgPSBuZXcgY3NtTWFwPHN0cmluZywgQUN1YmlzbU1vdGlvbj4oKTtcblxuICAgIHRoaXMuX2hpdEFyZWEgPSBuZXcgY3NtVmVjdG9yPGNzbVJlY3Q+KCk7XG4gICAgdGhpcy5fdXNlckFyZWEgPSBuZXcgY3NtVmVjdG9yPGNzbVJlY3Q+KCk7XG5cbiAgICB0aGlzLl9pZFBhcmFtQW5nbGVYID0gQ3ViaXNtRnJhbWV3b3JrLmdldElkTWFuYWdlcigpLmdldElkKFxuICAgICAgQ3ViaXNtRGVmYXVsdFBhcmFtZXRlcklkLlBhcmFtQW5nbGVYXG4gICAgKTtcbiAgICB0aGlzLl9pZFBhcmFtQW5nbGVZID0gQ3ViaXNtRnJhbWV3b3JrLmdldElkTWFuYWdlcigpLmdldElkKFxuICAgICAgQ3ViaXNtRGVmYXVsdFBhcmFtZXRlcklkLlBhcmFtQW5nbGVZXG4gICAgKTtcbiAgICB0aGlzLl9pZFBhcmFtQW5nbGVaID0gQ3ViaXNtRnJhbWV3b3JrLmdldElkTWFuYWdlcigpLmdldElkKFxuICAgICAgQ3ViaXNtRGVmYXVsdFBhcmFtZXRlcklkLlBhcmFtQW5nbGVaXG4gICAgKTtcbiAgICB0aGlzLl9pZFBhcmFtRXllQmFsbFggPSBDdWJpc21GcmFtZXdvcmsuZ2V0SWRNYW5hZ2VyKCkuZ2V0SWQoXG4gICAgICBDdWJpc21EZWZhdWx0UGFyYW1ldGVySWQuUGFyYW1FeWVCYWxsWFxuICAgICk7XG4gICAgdGhpcy5faWRQYXJhbUV5ZUJhbGxZID0gQ3ViaXNtRnJhbWV3b3JrLmdldElkTWFuYWdlcigpLmdldElkKFxuICAgICAgQ3ViaXNtRGVmYXVsdFBhcmFtZXRlcklkLlBhcmFtRXllQmFsbFlcbiAgICApO1xuICAgIHRoaXMuX2lkUGFyYW1Cb2R5QW5nbGVYID0gQ3ViaXNtRnJhbWV3b3JrLmdldElkTWFuYWdlcigpLmdldElkKFxuICAgICAgQ3ViaXNtRGVmYXVsdFBhcmFtZXRlcklkLlBhcmFtQm9keUFuZ2xlWFxuICAgICk7XG5cbiAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLkxvYWRBc3NldHM7XG4gICAgdGhpcy5fZXhwcmVzc2lvbkNvdW50ID0gMDtcbiAgICB0aGlzLl90ZXh0dXJlQ291bnQgPSAwO1xuICAgIHRoaXMuX21vdGlvbkNvdW50ID0gMDtcbiAgICB0aGlzLl9hbGxNb3Rpb25Db3VudCA9IDA7XG4gIH1cblxuICBfbW9kZWxTZXR0aW5nOiBJQ3ViaXNtTW9kZWxTZXR0aW5nOyAvLyDjg6Ljg4fjg6vjgrvjg4Pjg4bjgqPjg7PjgrDmg4XloLFcbiAgX21vZGVsSG9tZURpcjogc3RyaW5nOyAvLyDjg6Ljg4fjg6vjgrvjg4Pjg4bjgqPjg7PjgrDjgYznva7jgYvjgozjgZ/jg4fjgqPjg6zjgq/jg4jjg6pcbiAgX3VzZXJUaW1lU2Vjb25kczogbnVtYmVyOyAvLyDjg4fjg6vjgr/mmYLplpPjga7nqY3nrpflgKRb56eSXVxuXG4gIF9leWVCbGlua0lkczogY3NtVmVjdG9yPEN1YmlzbUlkSGFuZGxlPjsgLy8g44Oi44OH44Or44Gr6Kit5a6a44GV44KM44Gf556s44GN5qmf6IO955So44OR44Op44Oh44O844K/SURcbiAgX2xpcFN5bmNJZHM6IGNzbVZlY3RvcjxDdWJpc21JZEhhbmRsZT47IC8vIOODouODh+ODq+OBq+ioreWumuOBleOCjOOBn+ODquODg+ODl+OCt+ODs+OCr+apn+iDveeUqOODkeODqeODoeODvOOCv0lEXG5cbiAgX21vdGlvbnM6IGNzbU1hcDxzdHJpbmcsIEFDdWJpc21Nb3Rpb24+OyAvLyDoqq3jgb/ovrzjgb7jgozjgabjgYTjgovjg6Ljg7zjgrfjg6fjg7Pjga7jg6rjgrnjg4hcbiAgX2V4cHJlc3Npb25zOiBjc21NYXA8c3RyaW5nLCBBQ3ViaXNtTW90aW9uPjsgLy8g6Kqt44G/6L6844G+44KM44Gm44GE44KL6KGo5oOF44Gu44Oq44K544OIXG5cbiAgX2hpdEFyZWE6IGNzbVZlY3Rvcjxjc21SZWN0PjtcbiAgX3VzZXJBcmVhOiBjc21WZWN0b3I8Y3NtUmVjdD47XG5cbiAgX2lkUGFyYW1BbmdsZVg6IEN1YmlzbUlkSGFuZGxlOyAvLyDjg5Hjg6njg6Hjg7zjgr9JRDogUGFyYW1BbmdsZVhcbiAgX2lkUGFyYW1BbmdsZVk6IEN1YmlzbUlkSGFuZGxlOyAvLyDjg5Hjg6njg6Hjg7zjgr9JRDogUGFyYW1BbmdsZVlcbiAgX2lkUGFyYW1BbmdsZVo6IEN1YmlzbUlkSGFuZGxlOyAvLyDjg5Hjg6njg6Hjg7zjgr9JRDogUGFyYW1BbmdsZVpcbiAgX2lkUGFyYW1FeWVCYWxsWDogQ3ViaXNtSWRIYW5kbGU7IC8vIOODkeODqeODoeODvOOCv0lEOiBQYXJhbUV5ZUJhbGxYXG4gIF9pZFBhcmFtRXllQmFsbFk6IEN1YmlzbUlkSGFuZGxlOyAvLyDjg5Hjg6njg6Hjg7zjgr9JRDogUGFyYW1FeWVCQWxsWVxuICBfaWRQYXJhbUJvZHlBbmdsZVg6IEN1YmlzbUlkSGFuZGxlOyAvLyDjg5Hjg6njg6Hjg7zjgr9JRDogUGFyYW1Cb2R5QW5nbGVYXG5cbiAgX3N0YXRlOiBudW1iZXI7IC8vIOePvuWcqOOBruOCueODhuODvOOCv+OCueeuoeeQhueUqFxuICBfZXhwcmVzc2lvbkNvdW50OiBudW1iZXI7IC8vIOihqOaDheODh+ODvOOCv+OCq+OCpuODs+ODiFxuICBfdGV4dHVyZUNvdW50OiBudW1iZXI7IC8vIOODhuOCr+OCueODgeODo+OCq+OCpuODs+ODiFxuICBfbW90aW9uQ291bnQ6IG51bWJlcjsgLy8g44Oi44O844K344On44Oz44OH44O844K/44Kr44Km44Oz44OIXG4gIF9hbGxNb3Rpb25Db3VudDogbnVtYmVyOyAvLyDjg6Ljg7zjgrfjg6fjg7Pnt4/mlbBcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IGdsLCBjYW52YXMgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5cbi8qKlxuICog44K544OX44Op44Kk44OI44KS5a6f6KOF44GZ44KL44Kv44Op44K5XG4gKlxuICog44OG44Kv44K544OB44Oj77yp77yk44CBUmVjdOOBrueuoeeQhlxuICovXG5leHBvcnQgY2xhc3MgTEFwcFNwcml0ZSB7XG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICogQHBhcmFtIHggICAgICAgICAgICB45bqn5qiZXG4gICAqIEBwYXJhbSB5ICAgICAgICAgICAgeeW6p+aomVxuICAgKiBAcGFyYW0gd2lkdGggICAgICAgIOaoquW5hVxuICAgKiBAcGFyYW0gaGVpZ2h0ICAgICAgIOmrmOOBlVxuICAgKiBAcGFyYW0gdGV4dHVyZUlkICAgIOODhuOCr+OCueODgeODo1xuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgeDogbnVtYmVyLFxuICAgIHk6IG51bWJlcixcbiAgICB3aWR0aDogbnVtYmVyLFxuICAgIGhlaWdodDogbnVtYmVyLFxuICAgIHRleHR1cmVJZDogV2ViR0xUZXh0dXJlXG4gICkge1xuICAgIHRoaXMuX3JlY3QgPSBuZXcgUmVjdCgpO1xuICAgIHRoaXMuX3JlY3QubGVmdCA9IHggLSB3aWR0aCAqIDAuNTtcbiAgICB0aGlzLl9yZWN0LnJpZ2h0ID0geCArIHdpZHRoICogMC41O1xuICAgIHRoaXMuX3JlY3QudXAgPSB5ICsgaGVpZ2h0ICogMC41O1xuICAgIHRoaXMuX3JlY3QuZG93biA9IHkgLSBoZWlnaHQgKiAwLjU7XG4gICAgdGhpcy5fdGV4dHVyZSA9IHRleHR1cmVJZDtcbiAgICB0aGlzLl92ZXJ0ZXhCdWZmZXIgPSBudWxsO1xuICAgIHRoaXMuX3V2QnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLl9pbmRleEJ1ZmZlciA9IG51bGw7XG5cbiAgICB0aGlzLl9wb3NpdGlvbkxvY2F0aW9uID0gbnVsbDtcbiAgICB0aGlzLl91dkxvY2F0aW9uID0gbnVsbDtcbiAgICB0aGlzLl90ZXh0dXJlTG9jYXRpb24gPSBudWxsO1xuXG4gICAgdGhpcy5fcG9zaXRpb25BcnJheSA9IG51bGw7XG4gICAgdGhpcy5fdXZBcnJheSA9IG51bGw7XG4gICAgdGhpcy5faW5kZXhBcnJheSA9IG51bGw7XG5cbiAgICB0aGlzLl9maXJzdERyYXcgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIOino+aUvuOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVjdCA9IG51bGw7XG5cbiAgICBnbC5kZWxldGVUZXh0dXJlKHRoaXMuX3RleHR1cmUpO1xuICAgIHRoaXMuX3RleHR1cmUgPSBudWxsO1xuXG4gICAgZ2wuZGVsZXRlQnVmZmVyKHRoaXMuX3V2QnVmZmVyKTtcbiAgICB0aGlzLl91dkJ1ZmZlciA9IG51bGw7XG5cbiAgICBnbC5kZWxldGVCdWZmZXIodGhpcy5fdmVydGV4QnVmZmVyKTtcbiAgICB0aGlzLl92ZXJ0ZXhCdWZmZXIgPSBudWxsO1xuXG4gICAgZ2wuZGVsZXRlQnVmZmVyKHRoaXMuX2luZGV4QnVmZmVyKTtcbiAgICB0aGlzLl9pbmRleEJ1ZmZlciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICog44OG44Kv44K544OB44Oj44KS6L+U44GZXG4gICAqL1xuICBwdWJsaWMgZ2V0VGV4dHVyZSgpOiBXZWJHTFRleHR1cmUge1xuICAgIHJldHVybiB0aGlzLl90ZXh0dXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIOaPj+eUu+OBmeOCi+OAglxuICAgKiBAcGFyYW0gcHJvZ3JhbUlkIOOCt+OCp+ODvOODgOODvOODl+ODreOCsOODqeODoFxuICAgKiBAcGFyYW0gY2FudmFzIOaPj+eUu+OBmeOCi+OCreODo+ODs+ODkeOCueaDheWgsVxuICAgKi9cbiAgcHVibGljIHJlbmRlcihwcm9ncmFtSWQ6IFdlYkdMUHJvZ3JhbSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl90ZXh0dXJlID09IG51bGwpIHtcbiAgICAgIC8vIOODreODvOODieOBjOWujOS6huOBl+OBpuOBhOOBquOBhFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWIneWbnuaPj+eUu+aZglxuICAgIGlmICh0aGlzLl9maXJzdERyYXcpIHtcbiAgICAgIC8vIOS9leeVquebruOBrmF0dHJpYnV0ZeWkieaVsOOBi+WPluW+l1xuICAgICAgdGhpcy5fcG9zaXRpb25Mb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW1JZCwgJ3Bvc2l0aW9uJyk7XG4gICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl9wb3NpdGlvbkxvY2F0aW9uKTtcblxuICAgICAgdGhpcy5fdXZMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW1JZCwgJ3V2Jyk7XG4gICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLl91dkxvY2F0aW9uKTtcblxuICAgICAgLy8g5L2V55Wq55uu44GudW5pZm9ybeWkieaVsOOBi+WPluW+l1xuICAgICAgdGhpcy5fdGV4dHVyZUxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHByb2dyYW1JZCwgJ3RleHR1cmUnKTtcblxuICAgICAgLy8gdW5pZm9ybeWxnuaAp+OBrueZu+mMslxuICAgICAgZ2wudW5pZm9ybTFpKHRoaXMuX3RleHR1cmVMb2NhdGlvbiwgMCk7XG5cbiAgICAgIC8vIHV244OQ44OD44OV44Kh44CB5bqn5qiZ5Yid5pyf5YyWXG4gICAgICB7XG4gICAgICAgIHRoaXMuX3V2QXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAxLjAsXG4gICAgICAgICAgMC4wLFxuICAgICAgICAgIDAuMCxcbiAgICAgICAgICAwLjAsXG4gICAgICAgICAgMC4wLFxuICAgICAgICAgIDEuMCxcbiAgICAgICAgICAxLjAsXG4gICAgICAgICAgMS4wXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIHV244OQ44OD44OV44Kh44KS5L2c5oiQXG4gICAgICAgIHRoaXMuX3V2QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIOmggueCueODkOODg+ODleOCoeOAgeW6p+aomeWIneacn+WMllxuICAgICAge1xuICAgICAgICBjb25zdCBtYXhXaWR0aCA9IGNhbnZhcy53aWR0aDtcbiAgICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gY2FudmFzLmhlaWdodDtcblxuICAgICAgICAvLyDpoILngrnjg4fjg7zjgr9cbiAgICAgICAgdGhpcy5fcG9zaXRpb25BcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoW1xuICAgICAgICAgICh0aGlzLl9yZWN0LnJpZ2h0IC0gbWF4V2lkdGggKiAwLjUpIC8gKG1heFdpZHRoICogMC41KSxcbiAgICAgICAgICAodGhpcy5fcmVjdC51cCAtIG1heEhlaWdodCAqIDAuNSkgLyAobWF4SGVpZ2h0ICogMC41KSxcbiAgICAgICAgICAodGhpcy5fcmVjdC5sZWZ0IC0gbWF4V2lkdGggKiAwLjUpIC8gKG1heFdpZHRoICogMC41KSxcbiAgICAgICAgICAodGhpcy5fcmVjdC51cCAtIG1heEhlaWdodCAqIDAuNSkgLyAobWF4SGVpZ2h0ICogMC41KSxcbiAgICAgICAgICAodGhpcy5fcmVjdC5sZWZ0IC0gbWF4V2lkdGggKiAwLjUpIC8gKG1heFdpZHRoICogMC41KSxcbiAgICAgICAgICAodGhpcy5fcmVjdC5kb3duIC0gbWF4SGVpZ2h0ICogMC41KSAvIChtYXhIZWlnaHQgKiAwLjUpLFxuICAgICAgICAgICh0aGlzLl9yZWN0LnJpZ2h0IC0gbWF4V2lkdGggKiAwLjUpIC8gKG1heFdpZHRoICogMC41KSxcbiAgICAgICAgICAodGhpcy5fcmVjdC5kb3duIC0gbWF4SGVpZ2h0ICogMC41KSAvIChtYXhIZWlnaHQgKiAwLjUpXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIOmggueCueODkOODg+ODleOCoeOCkuS9nOaIkFxuICAgICAgICB0aGlzLl92ZXJ0ZXhCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgIH1cblxuICAgICAgLy8g6aCC54K544Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh44CB5Yid5pyf5YyWXG4gICAgICB7XG4gICAgICAgIC8vIOOCpOODs+ODh+ODg+OCr+OCueODh+ODvOOCv1xuICAgICAgICB0aGlzLl9pbmRleEFycmF5ID0gbmV3IFVpbnQxNkFycmF5KFswLCAxLCAyLCAzLCAyLCAwXSk7XG5cbiAgICAgICAgLy8g44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44Kh44KS5L2c5oiQXG4gICAgICAgIHRoaXMuX2luZGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ZpcnN0RHJhdyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFVW5bqn5qiZ55m76YyyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuX3V2QnVmZmVyKTtcbiAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgdGhpcy5fdXZBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgLy8gYXR0cmlidXRl5bGe5oCn44KS55m76YyyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLl91dkxvY2F0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8g6aCC54K55bqn5qiZ44KS55m76YyyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuX3ZlcnRleEJ1ZmZlcik7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHRoaXMuX3Bvc2l0aW9uQXJyYXksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIGF0dHJpYnV0ZeWxnuaAp+OCkueZu+mMslxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fcG9zaXRpb25Mb2NhdGlvbiwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOmggueCueOCpOODs+ODh+ODg+OCr+OCueOCkuS9nOaIkFxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIHRoaXMuX2luZGV4QnVmZmVyKTtcbiAgICBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLl9pbmRleEFycmF5LCBnbC5EWU5BTUlDX0RSQVcpO1xuXG4gICAgLy8g44Oi44OH44Or44Gu5o+P55S7XG4gICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGhpcy5fdGV4dHVyZSk7XG4gICAgZ2wuZHJhd0VsZW1lbnRzKFxuICAgICAgZ2wuVFJJQU5HTEVTLFxuICAgICAgdGhpcy5faW5kZXhBcnJheS5sZW5ndGgsXG4gICAgICBnbC5VTlNJR05FRF9TSE9SVCxcbiAgICAgIDBcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIOW9k+OBn+OCiuWIpOWumlxuICAgKiBAcGFyYW0gcG9pbnRYIHjluqfmqJlcbiAgICogQHBhcmFtIHBvaW50WSB55bqn5qiZXG4gICAqL1xuICBwdWJsaWMgaXNIaXQocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgLy8g55S76Z2i44K144Kk44K644KS5Y+W5b6X44GZ44KL44CCXG4gICAgY29uc3QgeyBoZWlnaHQgfSA9IGNhbnZhcztcblxuICAgIC8vIFnluqfmqJnjga/lpInmj5vjgZnjgovlv4XopoHjgYLjgopcbiAgICBjb25zdCB5ID0gaGVpZ2h0IC0gcG9pbnRZO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIHBvaW50WCA+PSB0aGlzLl9yZWN0LmxlZnQgJiZcbiAgICAgIHBvaW50WCA8PSB0aGlzLl9yZWN0LnJpZ2h0ICYmXG4gICAgICB5IDw9IHRoaXMuX3JlY3QudXAgJiZcbiAgICAgIHkgPj0gdGhpcy5fcmVjdC5kb3duXG4gICAgKTtcbiAgfVxuXG4gIF90ZXh0dXJlOiBXZWJHTFRleHR1cmU7IC8vIOODhuOCr+OCueODgeODo1xuICBfdmVydGV4QnVmZmVyOiBXZWJHTEJ1ZmZlcjsgLy8g6aCC54K544OQ44OD44OV44KhXG4gIF91dkJ1ZmZlcjogV2ViR0xCdWZmZXI7IC8vIHV26aCC54K544OQ44OD44OV44KhXG4gIF9pbmRleEJ1ZmZlcjogV2ViR0xCdWZmZXI7IC8vIOmggueCueOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoVxuICBfcmVjdDogUmVjdDsgLy8g55+p5b2iXG5cbiAgX3Bvc2l0aW9uTG9jYXRpb246IG51bWJlcjtcbiAgX3V2TG9jYXRpb246IG51bWJlcjtcbiAgX3RleHR1cmVMb2NhdGlvbjogV2ViR0xVbmlmb3JtTG9jYXRpb247XG5cbiAgX3Bvc2l0aW9uQXJyYXk6IEZsb2F0MzJBcnJheTtcbiAgX3V2QXJyYXk6IEZsb2F0MzJBcnJheTtcbiAgX2luZGV4QXJyYXk6IFVpbnQxNkFycmF5O1xuXG4gIF9maXJzdERyYXc6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBSZWN0IHtcbiAgcHVibGljIGxlZnQ6IG51bWJlcjsgLy8g5bem6L66XG4gIHB1YmxpYyByaWdodDogbnVtYmVyOyAvLyDlj7PovrpcbiAgcHVibGljIHVwOiBudW1iZXI7IC8vIOS4iui+ulxuICBwdWJsaWMgZG93bjogbnVtYmVyOyAvLyDkuIvovrpcbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc212ZWN0b3IgfSBmcm9tICdAZnJhbWV3b3JrL3R5cGUvY3NtdmVjdG9yJztcbmltcG9ydCBDc21fY3NtVmVjdG9yID0gY3NtdmVjdG9yLmNzbVZlY3RvcjtcbmltcG9ydCBjc21WZWN0b3JfaXRlcmF0b3IgPSBjc212ZWN0b3IuaXRlcmF0b3I7XG5pbXBvcnQgeyBnbCB9IGZyb20gJy4vbGFwcGRlbGVnYXRlJztcblxuLyoqXG4gKiDjg4bjgq/jgrnjg4Hjg6PnrqHnkIbjgq/jg6njgrlcbiAqIOeUu+WDj+iqreOBv+i+vOOBv+OAgeeuoeeQhuOCkuihjOOBhuOCr+ODqeOCueOAglxuICovXG5leHBvcnQgY2xhc3MgTEFwcFRleHR1cmVNYW5hZ2VyIHtcbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdGV4dHVyZXMgPSBuZXcgQ3NtX2NzbVZlY3RvcjxUZXh0dXJlSW5mbz4oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIGZvciAoXG4gICAgICBsZXQgaXRlOiBjc21WZWN0b3JfaXRlcmF0b3I8VGV4dHVyZUluZm8+ID0gdGhpcy5fdGV4dHVyZXMuYmVnaW4oKTtcbiAgICAgIGl0ZS5ub3RFcXVhbCh0aGlzLl90ZXh0dXJlcy5lbmQoKSk7XG4gICAgICBpdGUucHJlSW5jcmVtZW50KClcbiAgICApIHtcbiAgICAgIGdsLmRlbGV0ZVRleHR1cmUoaXRlLnB0cigpLmlkKTtcbiAgICB9XG4gICAgdGhpcy5fdGV4dHVyZXMgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOeUu+WDj+iqreOBv+i+vOOBv1xuICAgKlxuICAgKiBAcGFyYW0gZmlsZU5hbWUg6Kqt44G/6L6844KA55S75YOP44OV44Kh44Kk44Or44OR44K55ZCNXG4gICAqIEBwYXJhbSB1c2VQcmVtdWx0aXBseSBQcmVtdWx05Yem55CG44KS5pyJ5Yq544Gr44GZ44KL44GLXG4gICAqIEByZXR1cm4g55S75YOP5oOF5aCx44CB6Kqt44G/6L6844G/5aSx5pWX5pmC44GvbnVsbOOCkui/lOOBmVxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVRleHR1cmVGcm9tUG5nRmlsZShcbiAgICBmaWxlTmFtZTogc3RyaW5nLFxuICAgIHVzZVByZW11bHRpcGx5OiBib29sZWFuLFxuICAgIGNhbGxiYWNrOiAodGV4dHVyZUluZm86IFRleHR1cmVJbmZvKSA9PiB2b2lkXG4gICk6IHZvaWQge1xuICAgIC8vIHNlYXJjaCBsb2FkZWQgdGV4dHVyZSBhbHJlYWR5XG4gICAgZm9yIChcbiAgICAgIGxldCBpdGU6IGNzbVZlY3Rvcl9pdGVyYXRvcjxUZXh0dXJlSW5mbz4gPSB0aGlzLl90ZXh0dXJlcy5iZWdpbigpO1xuICAgICAgaXRlLm5vdEVxdWFsKHRoaXMuX3RleHR1cmVzLmVuZCgpKTtcbiAgICAgIGl0ZS5wcmVJbmNyZW1lbnQoKVxuICAgICkge1xuICAgICAgaWYgKFxuICAgICAgICBpdGUucHRyKCkuZmlsZU5hbWUgPT0gZmlsZU5hbWUgJiZcbiAgICAgICAgaXRlLnB0cigpLnVzZVByZW11bHRwbHkgPT0gdXNlUHJlbXVsdGlwbHlcbiAgICAgICkge1xuICAgICAgICAvLyAy5Zue55uu5Lul6ZmN44Gv44Kt44Oj44OD44K344Ol44GM5L2/55So44GV44KM44KLKOW+heOBoeaZgumWk+OBquOBlylcbiAgICAgICAgLy8gV2ViS2l044Gn44Gv5ZCM44GYSW1hZ2Xjga5vbmxvYWTjgpLlho3luqblkbzjgbbjgavjga/lho3jgqTjg7Pjgrnjgr/jg7PjgrnjgYzlv4XopoFcbiAgICAgICAgLy8g6Kmz57Sw77yaaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzUwMjQxODFcbiAgICAgICAgaXRlLnB0cigpLmltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBpdGUucHRyKCkuaW1nLm9ubG9hZCA9ICgpOiB2b2lkID0+IGNhbGxiYWNrKGl0ZS5wdHIoKSk7XG4gICAgICAgIGl0ZS5wdHIoKS5pbWcuc3JjID0gZmlsZU5hbWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDjg4fjg7zjgr/jga7jgqrjg7Pjg63jg7zjg4njgpLjg4jjg6rjgqzjg7zjgavjgZnjgotcbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcub25sb2FkID0gKCk6IHZvaWQgPT4ge1xuICAgICAgLy8g44OG44Kv44K544OB44Oj44Kq44OW44K444Kn44Kv44OI44Gu5L2c5oiQXG4gICAgICBjb25zdCB0ZXg6IFdlYkdMVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44KS6YG45oqeXG4gICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCB0ZXgpO1xuXG4gICAgICAvLyDjg4bjgq/jgrnjg4Hjg6Pjgavjg5Tjgq/jgrvjg6vjgpLmm7jjgY3ovrzjgoBcbiAgICAgIGdsLnRleFBhcmFtZXRlcmkoXG4gICAgICAgIGdsLlRFWFRVUkVfMkQsXG4gICAgICAgIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUixcbiAgICAgICAgZ2wuTElORUFSX01JUE1BUF9MSU5FQVJcbiAgICAgICk7XG4gICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcblxuICAgICAgLy8gUHJlbXVsdOWHpueQhuOCkuihjOOCj+OBm+OCi1xuICAgICAgaWYgKHVzZVByZW11bHRpcGx5KSB7XG4gICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgMSk7XG4gICAgICB9XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OBq+ODlOOCr+OCu+ODq+OCkuabuOOBjei+vOOCgFxuICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBpbWcpO1xuXG4gICAgICAvLyDjg5/jg4Pjg5fjg57jg4Pjg5fjgpLnlJ/miJBcbiAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfMkQpO1xuXG4gICAgICAvLyDjg4bjgq/jgrnjg4Hjg6PjgpLjg5DjgqTjg7Pjg4lcbiAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xuXG4gICAgICBjb25zdCB0ZXh0dXJlSW5mbzogVGV4dHVyZUluZm8gPSBuZXcgVGV4dHVyZUluZm8oKTtcbiAgICAgIGlmICh0ZXh0dXJlSW5mbyAhPSBudWxsKSB7XG4gICAgICAgIHRleHR1cmVJbmZvLmZpbGVOYW1lID0gZmlsZU5hbWU7XG4gICAgICAgIHRleHR1cmVJbmZvLndpZHRoID0gaW1nLndpZHRoO1xuICAgICAgICB0ZXh0dXJlSW5mby5oZWlnaHQgPSBpbWcuaGVpZ2h0O1xuICAgICAgICB0ZXh0dXJlSW5mby5pZCA9IHRleDtcbiAgICAgICAgdGV4dHVyZUluZm8uaW1nID0gaW1nO1xuICAgICAgICB0ZXh0dXJlSW5mby51c2VQcmVtdWx0cGx5ID0gdXNlUHJlbXVsdGlwbHk7XG4gICAgICAgIHRoaXMuX3RleHR1cmVzLnB1c2hCYWNrKHRleHR1cmVJbmZvKTtcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2sodGV4dHVyZUluZm8pO1xuICAgIH07XG4gICAgaW1nLnNyYyA9IGZpbGVOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIOeUu+WDj+OBruino+aUvlxuICAgKlxuICAgKiDphY3liJfjgavlrZjlnKjjgZnjgovnlLvlg4/lhajjgabjgpLop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlVGV4dHVyZXMoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZXh0dXJlcy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgdGhpcy5fdGV4dHVyZXMuc2V0KGksIG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuX3RleHR1cmVzLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICog55S75YOP44Gu6Kej5pS+XG4gICAqXG4gICAqIOaMh+WumuOBl+OBn+ODhuOCr+OCueODgeODo+OBrueUu+WDj+OCkuino+aUvuOBmeOCi+OAglxuICAgKiBAcGFyYW0gdGV4dHVyZSDop6PmlL7jgZnjgovjg4bjgq/jgrnjg4Hjg6NcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlVGV4dHVyZUJ5VGV4dHVyZSh0ZXh0dXJlOiBXZWJHTFRleHR1cmUpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RleHR1cmVzLmdldFNpemUoKTsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5fdGV4dHVyZXMuYXQoaSkuaWQgIT0gdGV4dHVyZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdGV4dHVyZXMuc2V0KGksIG51bGwpO1xuICAgICAgdGhpcy5fdGV4dHVyZXMucmVtb3ZlKGkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOeUu+WDj+OBruino+aUvlxuICAgKlxuICAgKiDmjIflrprjgZfjgZ/lkI3liY3jga7nlLvlg4/jgpLop6PmlL7jgZnjgovjgIJcbiAgICogQHBhcmFtIGZpbGVOYW1lIOino+aUvuOBmeOCi+eUu+WDj+ODleOCoeOCpOODq+ODkeOCueWQjVxuICAgKi9cbiAgcHVibGljIHJlbGVhc2VUZXh0dXJlQnlGaWxlUGF0aChmaWxlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZXh0dXJlcy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX3RleHR1cmVzLmF0KGkpLmZpbGVOYW1lID09IGZpbGVOYW1lKSB7XG4gICAgICAgIHRoaXMuX3RleHR1cmVzLnNldChpLCBudWxsKTtcbiAgICAgICAgdGhpcy5fdGV4dHVyZXMucmVtb3ZlKGkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfdGV4dHVyZXM6IENzbV9jc21WZWN0b3I8VGV4dHVyZUluZm8+O1xufVxuXG4vKipcbiAqIOeUu+WDj+aDheWgseani+mAoOS9k1xuICovXG5leHBvcnQgY2xhc3MgVGV4dHVyZUluZm8ge1xuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7IC8vIOeUu+WDj1xuICBpZDogV2ViR0xUZXh0dXJlID0gbnVsbDsgLy8g44OG44Kv44K544OB44OjXG4gIHdpZHRoID0gMDsgLy8g5qiq5bmFXG4gIGhlaWdodCA9IDA7IC8vIOmrmOOBlVxuICB1c2VQcmVtdWx0cGx5OiBib29sZWFuOyAvLyBQcmVtdWx05Yem55CG44KS5pyJ5Yq544Gr44GZ44KL44GLXG4gIGZpbGVOYW1lOiBzdHJpbmc7IC8vIOODleOCoeOCpOODq+WQjVxufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbU1hdHJpeDQ0IH0gZnJvbSAnQGZyYW1ld29yay9tYXRoL2N1YmlzbW1hdHJpeDQ0JztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc212aWV3bWF0cml4IH0gZnJvbSAnQGZyYW1ld29yay9tYXRoL2N1YmlzbXZpZXdtYXRyaXgnO1xuaW1wb3J0IENzbV9DdWJpc21WaWV3TWF0cml4ID0gY3ViaXNtdmlld21hdHJpeC5DdWJpc21WaWV3TWF0cml4O1xuaW1wb3J0IENzbV9DdWJpc21NYXRyaXg0NCA9IGN1YmlzbU1hdHJpeDQ0LkN1YmlzbU1hdHJpeDQ0O1xuaW1wb3J0IHsgVG91Y2hNYW5hZ2VyIH0gZnJvbSAnLi90b3VjaG1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcExpdmUyRE1hbmFnZXIgfSBmcm9tICcuL2xhcHBsaXZlMmRtYW5hZ2VyJztcbmltcG9ydCB7IExBcHBEZWxlZ2F0ZSwgY2FudmFzLCBnbCB9IGZyb20gJy4vbGFwcGRlbGVnYXRlJztcbmltcG9ydCB7IExBcHBTcHJpdGUgfSBmcm9tICcuL2xhcHBzcHJpdGUnO1xuaW1wb3J0IHsgVGV4dHVyZUluZm8gfSBmcm9tICcuL2xhcHB0ZXh0dXJlbWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwUGFsIH0gZnJvbSAnLi9sYXBwcGFsJztcbmltcG9ydCAqIGFzIExBcHBEZWZpbmUgZnJvbSAnLi9sYXBwZGVmaW5lJztcblxuLyoqXG4gKiDmj4/nlLvjgq/jg6njgrnjgIJcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBWaWV3IHtcbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcHJvZ3JhbUlkID0gbnVsbDtcbiAgICB0aGlzLl9iYWNrID0gbnVsbDtcbiAgICB0aGlzLl9nZWFyID0gbnVsbDtcblxuICAgIC8vIOOCv+ODg+ODgemWouS/guOBruOCpOODmeODs+ODiOeuoeeQhlxuICAgIHRoaXMuX3RvdWNoTWFuYWdlciA9IG5ldyBUb3VjaE1hbmFnZXIoKTtcblxuICAgIC8vIOODh+ODkOOCpOOCueW6p+aomeOBi+OCieOCueOCr+ODquODvOODs+W6p+aomeOBq+WkieaPm+OBmeOCi+OBn+OCgeOBrlxuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuID0gbmV3IENzbV9DdWJpc21NYXRyaXg0NCgpO1xuXG4gICAgLy8g55S76Z2i44Gu6KGo56S644Gu5ouh5aSn57iu5bCP44KE56e75YuV44Gu5aSJ5o+b44KS6KGM44GG6KGM5YiXXG4gICAgdGhpcy5fdmlld01hdHJpeCA9IG5ldyBDc21fQ3ViaXNtVmlld01hdHJpeCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWIneacn+WMluOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBjYW52YXM7XG5cbiAgICBjb25zdCByYXRpbzogbnVtYmVyID0gaGVpZ2h0IC8gd2lkdGg7XG4gICAgY29uc3QgbGVmdDogbnVtYmVyID0gTEFwcERlZmluZS5WaWV3TG9naWNhbExlZnQ7XG4gICAgY29uc3QgcmlnaHQ6IG51bWJlciA9IExBcHBEZWZpbmUuVmlld0xvZ2ljYWxSaWdodDtcbiAgICBjb25zdCBib3R0b206IG51bWJlciA9IC1yYXRpbztcbiAgICBjb25zdCB0b3A6IG51bWJlciA9IHJhdGlvO1xuXG4gICAgdGhpcy5fdmlld01hdHJpeC5zZXRTY3JlZW5SZWN0KGxlZnQsIHJpZ2h0LCBib3R0b20sIHRvcCk7IC8vIOODh+ODkOOCpOOCueOBq+WvvuW/nOOBmeOCi+eUu+mdouOBruevhOWbsuOAgiBY44Gu5bem56uv44CBWOOBruWPs+err+OAgVnjga7kuIvnq6/jgIFZ44Gu5LiK56uvXG5cbiAgICBjb25zdCBzY3JlZW5XOiBudW1iZXIgPSBNYXRoLmFicyhsZWZ0IC0gcmlnaHQpO1xuICAgIHRoaXMuX2RldmljZVRvU2NyZWVuLnNjYWxlUmVsYXRpdmUoc2NyZWVuVyAvIHdpZHRoLCAtc2NyZWVuVyAvIHdpZHRoKTtcbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2xhdGVSZWxhdGl2ZSgtd2lkdGggKiAwLjUsIC1oZWlnaHQgKiAwLjUpO1xuXG4gICAgLy8g6KGo56S656+E5Zuy44Gu6Kit5a6aXG4gICAgdGhpcy5fdmlld01hdHJpeC5zZXRNYXhTY2FsZShMQXBwRGVmaW5lLlZpZXdNYXhTY2FsZSk7IC8vIOmZkOeVjOaLoeW8teeOh1xuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0TWluU2NhbGUoTEFwcERlZmluZS5WaWV3TWluU2NhbGUpOyAvLyDpmZDnlYznuK7lsI/njodcblxuICAgIC8vIOihqOekuuOBp+OBjeOCi+acgOWkp+evhOWbslxuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0TWF4U2NyZWVuUmVjdChcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhMZWZ0LFxuICAgICAgTEFwcERlZmluZS5WaWV3TG9naWNhbE1heFJpZ2h0LFxuICAgICAgTEFwcERlZmluZS5WaWV3TG9naWNhbE1heEJvdHRvbSxcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhUb3BcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIOino+aUvuOBmeOCi1xuICAgKi9cbiAgcHVibGljIHJlbGVhc2UoKTogdm9pZCB7XG4gICAgdGhpcy5fdmlld01hdHJpeCA9IG51bGw7XG4gICAgdGhpcy5fdG91Y2hNYW5hZ2VyID0gbnVsbDtcbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbiA9IG51bGw7XG5cbiAgICB0aGlzLl9nZWFyLnJlbGVhc2UoKTtcbiAgICB0aGlzLl9nZWFyID0gbnVsbDtcblxuICAgIHRoaXMuX2JhY2sucmVsZWFzZSgpO1xuICAgIHRoaXMuX2JhY2sgPSBudWxsO1xuXG4gICAgZ2wuZGVsZXRlUHJvZ3JhbSh0aGlzLl9wcm9ncmFtSWQpO1xuICAgIHRoaXMuX3Byb2dyYW1JZCA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICog5o+P55S744GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyKCk6IHZvaWQge1xuICAgIGdsLnVzZVByb2dyYW0odGhpcy5fcHJvZ3JhbUlkKTtcblxuICAgIGlmICh0aGlzLl9iYWNrKSB7XG4gICAgICB0aGlzLl9iYWNrLnJlbmRlcih0aGlzLl9wcm9ncmFtSWQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZ2Vhcikge1xuICAgICAgdGhpcy5fZ2Vhci5yZW5kZXIodGhpcy5fcHJvZ3JhbUlkKTtcbiAgICB9XG5cbiAgICBnbC5mbHVzaCgpO1xuXG4gICAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXG4gICAgbGl2ZTJETWFuYWdlci5vblVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOeUu+WDj+OBruWIneacn+WMluOCkuihjOOBhuOAglxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemVTcHJpdGUoKTogdm9pZCB7XG4gICAgY29uc3Qgd2lkdGg6IG51bWJlciA9IGNhbnZhcy53aWR0aDtcbiAgICBjb25zdCBoZWlnaHQ6IG51bWJlciA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgICBjb25zdCB0ZXh0dXJlTWFuYWdlciA9IExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLmdldFRleHR1cmVNYW5hZ2VyKCk7XG4gICAgY29uc3QgcmVzb3VyY2VzUGF0aCA9IExBcHBEZWZpbmUuUmVzb3VyY2VzUGF0aDtcblxuICAgIGxldCBpbWFnZU5hbWUgPSAnJztcblxuICAgIC8vIOiDjOaZr+eUu+WDj+WIneacn+WMllxuICAgIGltYWdlTmFtZSA9IExBcHBEZWZpbmUuQmFja0ltYWdlTmFtZTtcblxuICAgIC8vIOmdnuWQjOacn+OBquOBruOBp+OCs+ODvOODq+ODkOODg+OCr+mWouaVsOOCkuS9nOaIkFxuICAgIGNvbnN0IGluaXRCYWNrR3JvdW5kVGV4dHVyZSA9ICh0ZXh0dXJlSW5mbzogVGV4dHVyZUluZm8pOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHg6IG51bWJlciA9IHdpZHRoICogMC41O1xuICAgICAgY29uc3QgeTogbnVtYmVyID0gaGVpZ2h0ICogMC41O1xuXG4gICAgICBjb25zdCBmd2lkdGggPSB0ZXh0dXJlSW5mby53aWR0aCAqIDIuMDtcbiAgICAgIGNvbnN0IGZoZWlnaHQgPSBoZWlnaHQgKiAwLjk1O1xuICAgICAgdGhpcy5fYmFjayA9IG5ldyBMQXBwU3ByaXRlKHgsIHksIGZ3aWR0aCwgZmhlaWdodCwgdGV4dHVyZUluZm8uaWQpO1xuICAgIH07XG5cbiAgICAvLyB0ZXh0dXJlTWFuYWdlci5jcmVhdGVUZXh0dXJlRnJvbVBuZ0ZpbGUoXG4gICAgLy8gICByZXNvdXJjZXNQYXRoICsgaW1hZ2VOYW1lLFxuICAgIC8vICAgZmFsc2UsXG4gICAgLy8gICBpbml0QmFja0dyb3VuZFRleHR1cmVcbiAgICAvLyApO1xuXG4gICAgLy8g5q2v6LuK55S75YOP5Yid5pyf5YyWXG4gICAgaW1hZ2VOYW1lID0gTEFwcERlZmluZS5HZWFySW1hZ2VOYW1lO1xuICAgIGNvbnN0IGluaXRHZWFyVGV4dHVyZSA9ICh0ZXh0dXJlSW5mbzogVGV4dHVyZUluZm8pOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IHggPSB3aWR0aCAtIHRleHR1cmVJbmZvLndpZHRoICogMC41O1xuICAgICAgY29uc3QgeSA9IGhlaWdodCAtIHRleHR1cmVJbmZvLmhlaWdodCAqIDAuNTtcbiAgICAgIGNvbnN0IGZ3aWR0aCA9IHRleHR1cmVJbmZvLndpZHRoO1xuICAgICAgY29uc3QgZmhlaWdodCA9IHRleHR1cmVJbmZvLmhlaWdodDtcbiAgICAgIHRoaXMuX2dlYXIgPSBuZXcgTEFwcFNwcml0ZSh4LCB5LCBmd2lkdGgsIGZoZWlnaHQsIHRleHR1cmVJbmZvLmlkKTtcbiAgICB9O1xuXG4gICAgdGV4dHVyZU1hbmFnZXIuY3JlYXRlVGV4dHVyZUZyb21QbmdGaWxlKFxuICAgICAgcmVzb3VyY2VzUGF0aCArIGltYWdlTmFtZSxcbiAgICAgIGZhbHNlLFxuICAgICAgaW5pdEdlYXJUZXh0dXJlXG4gICAgKTtcblxuICAgIC8vIOOCt+OCp+ODvOODgOODvOOCkuS9nOaIkFxuICAgIGlmICh0aGlzLl9wcm9ncmFtSWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcHJvZ3JhbUlkID0gTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuY3JlYXRlU2hhZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOOCv+ODg+ODgeOBleOCjOOBn+aZguOBq+WRvOOBsOOCjOOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIOOCueOCr+ODquODvOODs1jluqfmqJlcbiAgICogQHBhcmFtIHBvaW50WSDjgrnjgq/jg6rjg7zjg7NZ5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzQmVnYW4ocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fdG91Y2hNYW5hZ2VyLnRvdWNoZXNCZWdhbihwb2ludFgsIHBvaW50WSk7XG4gIH1cblxuICAvKipcbiAgICog44K/44OD44OB44GX44Gm44GE44KL44Go44GN44Gr44Od44Kk44Oz44K/44GM5YuV44GE44Gf44KJ5ZG844Gw44KM44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBwb2ludFgg44K544Kv44Oq44O844OzWOW6p+aomVxuICAgKiBAcGFyYW0gcG9pbnRZIOOCueOCr+ODquODvOODs1nluqfmqJlcbiAgICovXG4gIHB1YmxpYyBvblRvdWNoZXNNb3ZlZChwb2ludFg6IG51bWJlciwgcG9pbnRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCB2aWV3WDogbnVtYmVyID0gdGhpcy50cmFuc2Zvcm1WaWV3WCh0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WCgpKTtcbiAgICBjb25zdCB2aWV3WTogbnVtYmVyID0gdGhpcy50cmFuc2Zvcm1WaWV3WSh0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WSgpKTtcblxuICAgIHRoaXMuX3RvdWNoTWFuYWdlci50b3VjaGVzTW92ZWQocG9pbnRYLCBwb2ludFkpO1xuXG4gICAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICAgIGxpdmUyRE1hbmFnZXIub25EcmFnKHZpZXdYLCB2aWV3WSk7XG4gIH1cblxuICAvKipcbiAgICog44K/44OD44OB44GM57WC5LqG44GX44Gf44KJ5ZG844Gw44KM44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBwb2ludFgg44K544Kv44Oq44O844OzWOW6p+aomVxuICAgKiBAcGFyYW0gcG9pbnRZIOOCueOCr+ODquODvOODs1nluqfmqJlcbiAgICovXG4gIHB1YmxpYyBvblRvdWNoZXNFbmRlZChwb2ludFg6IG51bWJlciwgcG9pbnRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyDjgr/jg4Pjg4HntYLkuoZcbiAgICBjb25zdCBsaXZlMkRNYW5hZ2VyOiBMQXBwTGl2ZTJETWFuYWdlciA9IExBcHBMaXZlMkRNYW5hZ2VyLmdldEluc3RhbmNlKCk7XG4gICAgbGl2ZTJETWFuYWdlci5vbkRyYWcoMC4wLCAwLjApO1xuXG4gICAge1xuICAgICAgLy8g44K344Oz44Kw44Or44K/44OD44OXXG4gICAgICBjb25zdCB4OiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1YKFxuICAgICAgICB0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WCgpXG4gICAgICApOyAvLyDoq5bnkIbluqfmqJnlpInmj5vjgZfjgZ/luqfmqJnjgpLlj5blvpfjgIJcbiAgICAgIGNvbnN0IHk6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVkoXG4gICAgICAgIHRoaXMuX3RvdWNoTWFuYWdlci5nZXRZKClcbiAgICAgICk7IC8vIOirlueQhuW6p+aomeWkieWMluOBl+OBn+W6p+aomeOCkuWPluW+l+OAglxuXG4gICAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z1RvdWNoTG9nRW5hYmxlKSB7XG4gICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbQVBQXXRvdWNoZXNFbmRlZCB4OiAke3h9IHk6ICR7eX1gKTtcbiAgICAgIH1cbiAgICAgIGxpdmUyRE1hbmFnZXIub25UYXAoeCwgeSk7XG5cbiAgICAgIC8vIOatr+i7iuOBq+OCv+ODg+ODl+OBl+OBn+OBi1xuICAgICAgaWYgKHRoaXMuX2dlYXIuaXNIaXQocG9pbnRYLCBwb2ludFkpKSB7XG4gICAgICAgIGxpdmUyRE1hbmFnZXIubmV4dFNjZW5lKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFjluqfmqJnjgpJWaWV35bqn5qiZ44Gr5aSJ5o+b44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VYIOODh+ODkOOCpOOCuVjluqfmqJlcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1WaWV3WChkZXZpY2VYOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHNjcmVlblg6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVgoZGV2aWNlWCk7IC8vIOirlueQhuW6p+aomeWkieaPm+OBl+OBn+W6p+aomeOCkuWPluW+l+OAglxuICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4LmludmVydFRyYW5zZm9ybVgoc2NyZWVuWCk7IC8vIOaLoeWkp+OAgee4ruWwj+OAgeenu+WLleW+jOOBruWApOOAglxuICB9XG5cbiAgLyoqXG4gICAqIFnluqfmqJnjgpJWaWV35bqn5qiZ44Gr5aSJ5o+b44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VZIOODh+ODkOOCpOOCuVnluqfmqJlcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1WaWV3WShkZXZpY2VZOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHNjcmVlblk6IG51bWJlciA9IHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVkoZGV2aWNlWSk7IC8vIOirlueQhuW6p+aomeWkieaPm+OBl+OBn+W6p+aomeOCkuWPluW+l+OAglxuICAgIHJldHVybiB0aGlzLl92aWV3TWF0cml4LmludmVydFRyYW5zZm9ybVkoc2NyZWVuWSk7XG4gIH1cblxuICAvKipcbiAgICogWOW6p+aomeOCklNjcmVlbuW6p+aomeOBq+WkieaPm+OBmeOCi+OAglxuICAgKiBAcGFyYW0gZGV2aWNlWCDjg4fjg5DjgqTjgrlY5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtU2NyZWVuWChkZXZpY2VYOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1YKGRldmljZVgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFnluqfmqJnjgpJTY3JlZW7luqfmqJnjgavlpInmj5vjgZnjgovjgIJcbiAgICpcbiAgICogQHBhcmFtIGRldmljZVkg44OH44OQ44Kk44K5WeW6p+aomVxuICAgKi9cbiAgcHVibGljIHRyYW5zZm9ybVNjcmVlblkoZGV2aWNlWTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWShkZXZpY2VZKTtcbiAgfVxuXG4gIF90b3VjaE1hbmFnZXI6IFRvdWNoTWFuYWdlcjsgLy8g44K/44OD44OB44Oe44ON44O844K444Oj44O8XG4gIF9kZXZpY2VUb1NjcmVlbjogQ3NtX0N1YmlzbU1hdHJpeDQ0OyAvLyDjg4fjg5DjgqTjgrnjgYvjgonjgrnjgq/jg6rjg7zjg7Pjgbjjga7ooYzliJdcbiAgX3ZpZXdNYXRyaXg6IENzbV9DdWJpc21WaWV3TWF0cml4OyAvLyB2aWV3TWF0cml4XG4gIF9wcm9ncmFtSWQ6IFdlYkdMUHJvZ3JhbTsgLy8g44K344Kn44O844OASURcbiAgX2JhY2s6IExBcHBTcHJpdGU7IC8vIOiDjOaZr+eUu+WDj1xuICBfZ2VhcjogTEFwcFNwcml0ZTsgLy8g44Ku44Ki55S75YOPXG4gIF9jaGFuZ2VNb2RlbDogYm9vbGVhbjsgLy8g44Oi44OH44Or5YiH44KK5pu/44GI44OV44Op44KwXG4gIF9pc0NsaWNrOiBib29sZWFuOyAvLyDjgq/jg6rjg4Pjgq/kuK1cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExBcHBEZWxlZ2F0ZSB9IGZyb20gJy4vbGFwcGRlbGVnYXRlJztcblxuLyoqXG4gKiDjg5bjg6njgqbjgrbjg63jg7zjg4nlvozjga7lh6bnkIZcbiAqL1xud2luZG93Lm9ubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgLy8gY3JlYXRlIHRoZSBhcHBsaWNhdGlvbiBpbnN0YW5jZVxuICBpZiAoTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuaW5pdGlhbGl6ZSgpID09IGZhbHNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkucnVuKCk7XG59O1xuXG4vKipcbiAqIOe1guS6huaZguOBruWHpueQhlxuICovXG53aW5kb3cub25iZWZvcmV1bmxvYWQgPSAoKTogdm9pZCA9PiBMQXBwRGVsZWdhdGUucmVsZWFzZUluc3RhbmNlKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9