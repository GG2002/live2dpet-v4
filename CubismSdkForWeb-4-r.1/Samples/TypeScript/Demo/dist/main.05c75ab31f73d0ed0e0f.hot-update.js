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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbGFwcGRlbGVnYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwbGl2ZTJkbWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGFwcG1vZGVsLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwc3ByaXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9sYXBwdGV4dHVyZW1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xhcHB2aWV3LnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQSw2SUFHMEM7QUFDMUMsSUFBTyxtQkFBbUIsR0FBRyw2Q0FBcUIsQ0FBQyxlQUFlLENBQUM7QUFDbkUsNEVBQXNDO0FBQ3RDLHlFQUFvQztBQUNwQywwR0FBMEQ7QUFDMUQsdUdBQXdEO0FBQ3hELDhGQUEyQztBQUVoQyxjQUFNLEdBQXNCLElBQUksQ0FBQztBQUNqQyxrQkFBVSxHQUFpQixJQUFJLENBQUM7QUFDaEMsVUFBRSxHQUEwQixJQUFJLENBQUM7QUFDakMsbUJBQVcsR0FBcUIsSUFBSSxDQUFDO0FBQ25DLFdBQUcsR0FBUSxNQUFNLENBQUM7QUFNL0I7SUFZRTtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRXBCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSw4QkFBVSxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBUWEsd0JBQVcsR0FBekI7UUFDRSxJQUFJLGtC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LENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQU1NLG1DQUFnQixHQUF2QixVQUF3QixPQUFlO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQU9NLG1DQUFnQixHQUF2QixVQUF3QixPQUFlO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQVVILGVBQUM7QUFBRCxDQUFDO0FBcFBZLDRCQUFROzs7Ozs7Ozs7Ozs7Ozs7QUNmckIsd0ZBQThDO0FBSzlDLE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFFZCxJQUFJLDJCQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxFQUFFLElBQUksS0FBSyxFQUFFO1FBQ3BELE9BQU87S0FDUjtJQUVELDJCQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbkMsQ0FBQyxDQUFDO0FBS0YsTUFBTSxDQUFDLGNBQWMsR0FBRyxjQUFZLGtDQUFZLENBQUMsZUFBZSxFQUFFLEVBQTlCLENBQThCLENBQUMiLCJmaWxlIjoibWFpbi4wNWM3NWFiMzFmNzNkMGVkMGUwZi5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2NvbnNpc3RlbnQtdHlwZS1hc3NlcnRpb25zICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvY2FtZWxjYXNlICovXG4vKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQge1xuICBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgbGl2ZTJkY3ViaXNtZnJhbWV3b3JrLFxuICBPcHRpb24gYXMgQ3NtX09wdGlvblxufSBmcm9tICdAZnJhbWV3b3JrL2xpdmUyZGN1YmlzbWZyYW1ld29yayc7XG5pbXBvcnQgQ3NtX0N1YmlzbUZyYW1ld29yayA9IGxpdmUyZGN1YmlzbWZyYW1ld29yay5DdWJpc21GcmFtZXdvcms7XG5pbXBvcnQgeyBMQXBwVmlldyB9IGZyb20gJy4vbGFwcHZpZXcnO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5pbXBvcnQgeyBMQXBwVGV4dHVyZU1hbmFnZXIgfSBmcm9tICcuL2xhcHB0ZXh0dXJlbWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwTGl2ZTJETWFuYWdlciB9IGZyb20gJy4vbGFwcGxpdmUyZG1hbmFnZXInO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuXG5leHBvcnQgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBudWxsO1xuZXhwb3J0IGxldCBzX2luc3RhbmNlOiBMQXBwRGVsZWdhdGUgPSBudWxsO1xuZXhwb3J0IGxldCBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0ID0gbnVsbDtcbmV4cG9ydCBsZXQgZnJhbWVCdWZmZXI6IFdlYkdMRnJhbWVidWZmZXIgPSBudWxsO1xuZXhwb3J0IGNvbnN0IHdpbjogYW55ID0gd2luZG93O1xuXG4vKipcbiAqIOOCouODl+ODquOCseODvOOCt+ODp+ODs+OCr+ODqeOCueOAglxuICogQ3ViaXNtIFNES+OBrueuoeeQhuOCkuihjOOBhuOAglxuICovXG5leHBvcnQgY2xhc3MgTEFwcERlbGVnYXRlIHtcbiAgX2N1YmlzbU9wdGlvbjogQ3NtX09wdGlvbjsgLy8gQ3ViaXNtIFNESyBPcHRpb25cbiAgX3ZpZXc6IExBcHBWaWV3OyAvLyBWaWV35oOF5aCxXG4gIF9jYXB0dXJlZDogYm9vbGVhbjsgLy8g44Kv44Oq44OD44Kv44GX44Gm44GE44KL44GLXG4gIF9tb3VzZVg6IG51bWJlcjsgLy8g44Oe44Km44K5WOW6p+aomVxuICBfbW91c2VZOiBudW1iZXI7IC8vIOODnuOCpuOCuVnluqfmqJlcbiAgX2lzRW5kOiBib29sZWFuOyAvLyBBUFDntYLkuobjgZfjgabjgYTjgovjgYtcbiAgX3RleHR1cmVNYW5hZ2VyOiBMQXBwVGV4dHVyZU1hbmFnZXI7IC8vIOODhuOCr+OCueODgeODo+ODnuODjeODvOOCuOODo+ODvFxuXG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NhcHR1cmVkID0gZmFsc2U7XG4gICAgdGhpcy5fbW91c2VYID0gMC4wO1xuICAgIHRoaXMuX21vdXNlWSA9IDAuMDtcbiAgICB0aGlzLl9pc0VuZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fY3ViaXNtT3B0aW9uID0gbmV3IENzbV9PcHRpb24oKTtcbiAgICB0aGlzLl92aWV3ID0gbmV3IExBcHBWaWV3KCk7XG4gICAgdGhpcy5fdGV4dHVyZU1hbmFnZXIgPSBuZXcgTEFwcFRleHR1cmVNYW5hZ2VyKCk7XG4gIH1cblxuICAvKipcbiAgICog44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K577yI44K344Oz44Kw44Or44OI44Oz77yJ44KS6L+U44GZ44CCXG4gICAqIOOCpOODs+OCueOCv+ODs+OCueOBjOeUn+aIkOOBleOCjOOBpuOBhOOBquOBhOWgtOWQiOOBr+WGhemDqOOBp+OCpOODs+OCueOCv+ODs+OCueOCkueUn+aIkOOBmeOCi+OAglxuICAgKlxuICAgKiBAcmV0dXJuIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBMQXBwRGVsZWdhdGUge1xuICAgIGlmIChzX2luc3RhbmNlID09IG51bGwpIHtcbiAgICAgIHNfaW5zdGFuY2UgPSBuZXcgTEFwcERlbGVnYXRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNfaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICog44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K577yI44K344Oz44Kw44Or44OI44Oz77yJ44KS6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlbGVhc2VJbnN0YW5jZSgpOiB2b2lkIHtcbiAgICBpZiAoc19pbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICBzX2luc3RhbmNlLnJlbGVhc2UoKTtcbiAgICB9XG5cbiAgICBzX2luc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUFDjgavlv4XopoHjgarnianjgpLliJ3mnJ/ljJbjgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplKCk6IGJvb2xlYW4ge1xuICAgIC8vIOOCreODo+ODs+ODkOOCueOBruS9nOaIkFxuICAgIGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XG5cbiAgICAvLyBnbOOCs+ODs+ODhuOCreOCueODiOOCkuWIneacn+WMllxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcblxuICAgIGlmICghZ2wpIHtcbiAgICAgIGFsZXJ0KCdDYW5ub3QgaW5pdGlhbGl6ZSBXZWJHTC4gVGhpcyBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQuJyk7XG4gICAgICBnbCA9IG51bGw7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID1cbiAgICAgICAgJ1RoaXMgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSA8Y29kZT4mbHQ7Y2FudmFzJmd0OzwvY29kZT4gZWxlbWVudC4nO1xuXG4gICAgICAvLyBnbOWIneacn+WMluWkseaVl1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghZnJhbWVCdWZmZXIpIHtcbiAgICAgIGZyYW1lQnVmZmVyID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLkZSQU1FQlVGRkVSX0JJTkRJTkcpO1xuICAgIH1cblxuICAgIC8vIOmAj+mBjuioreWumlxuICAgIGdsLmVuYWJsZShnbC5CTEVORCk7XG4gICAgZ2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cbiAgICBjb25zdCBzdXBwb3J0VG91Y2g6IGJvb2xlYW4gPSAnb250b3VjaGVuZCcgaW4gY2FudmFzO1xuXG4gICAgaWYgKHN1cHBvcnRUb3VjaCkge1xuICAgICAgLy8g44K/44OD44OB6Zai6YCj44Kz44O844Or44OQ44OD44Kv6Zai5pWw55m76YyyXG4gICAgICBjYW52YXMub250b3VjaHN0YXJ0ID0gb25Ub3VjaEJlZ2FuO1xuICAgICAgY2FudmFzLm9udG91Y2htb3ZlID0gb25Ub3VjaE1vdmVkO1xuICAgICAgY2FudmFzLm9udG91Y2hlbmQgPSBvblRvdWNoRW5kZWQ7XG4gICAgICBjYW52YXMub250b3VjaGNhbmNlbCA9IG9uVG91Y2hDYW5jZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOODnuOCpuOCuemWoumAo+OCs+ODvOODq+ODkOODg+OCr+mWouaVsOeZu+mMslxuICAgICAgY2FudmFzLm9ubW91c2Vkb3duID0gb25DbGlja0JlZ2FuO1xuICAgICAgd2luZG93Lm9ubW91c2Vtb3ZlID0gb25Nb3VzZU1vdmVkO1xuICAgICAgY2FudmFzLm9ubW91c2V1cCA9IG9uQ2xpY2tFbmRlZDtcbiAgICAgIHdpbmRvdy5vbm1vdXNlbGVhdmUgPSBvbm1vdXNlbGVhdmU7XG4gICAgfVxuXG4gICAgLy8gd2luLmluaXREZWZpbmUoJy5cXFxcU2FtcGxlc1xcXFxSZXNvdXJjZXNcXFxcJyk7XG4gICAgLy8gQXBwVmlld+OBruWIneacn+WMllxuICAgIHRoaXMuX3ZpZXcuaW5pdGlhbGl6ZSgpO1xuXG4gICAgLy8gQ3ViaXNtIFNES+OBruWIneacn+WMllxuICAgIHRoaXMuaW5pdGlhbGl6ZUN1YmlzbSgpO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICog6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICB0aGlzLl90ZXh0dXJlTWFuYWdlci5yZWxlYXNlKCk7XG4gICAgdGhpcy5fdGV4dHVyZU1hbmFnZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fdmlldy5yZWxlYXNlKCk7XG4gICAgdGhpcy5fdmlldyA9IG51bGw7XG5cbiAgICAvLyDjg6rjgr3jg7zjgrnjgpLop6PmlL5cbiAgICBMQXBwTGl2ZTJETWFuYWdlci5yZWxlYXNlSW5zdGFuY2UoKTtcblxuICAgIC8vIEN1YmlzbSBTREvjga7op6PmlL5cbiAgICBDc21fQ3ViaXNtRnJhbWV3b3JrLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlrp/ooYzlh6bnkIbjgIJcbiAgICovXG4gIHB1YmxpYyBydW4oKTogdm9pZCB7XG4gICAgLy8g44Oh44Kk44Oz44Or44O844OXXG4gICAgY29uc3QgbG9vcCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIC8vIOOCpOODs+OCueOCv+ODs+OCueOBruacieeEoeOBrueiuuiqjVxuICAgICAgaWYgKHNfaW5zdGFuY2UgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIOaZgumWk+abtOaWsFxuICAgICAgTEFwcFBhbC51cGRhdGVUaW1lKCk7XG5cbiAgICAgIC8vIOeUu+mdouOBruWIneacn+WMllxuICAgICAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAwLjApO1xuXG4gICAgICAvLyDmt7Hluqbjg4bjgrnjg4jjgpLmnInlirnljJZcbiAgICAgIGdsLmVuYWJsZShnbC5ERVBUSF9URVNUKTtcblxuICAgICAgLy8g6L+R44GP44Gr44GC44KL54mp5L2T44Gv44CB6YGg44GP44Gr44GC44KL54mp5L2T44KS6KaG44GE6Zqg44GZXG4gICAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcblxuICAgICAgLy8g44Kr44Op44O844OQ44OD44OV44Kh44KE5rex5bqm44OQ44OD44OV44Kh44KS44Kv44Oq44Ki44GZ44KLXG4gICAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cbiAgICAgIGdsLmNsZWFyRGVwdGgoMS4wKTtcblxuICAgICAgLy8g6YCP6YGO6Kit5a6aXG4gICAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgICAgZ2wuYmxlbmRGdW5jKGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG5cbiAgICAgIC8vIOaPj+eUu+abtOaWsFxuICAgICAgdGhpcy5fdmlldy5yZW5kZXIoKTtcblxuICAgICAgLy8g44Or44O844OX44Gu44Gf44KB44Gr5YaN5biw5ZG844Gz5Ye644GXXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfTtcbiAgICBsb29wKCk7XG4gIH1cblxuICAvKipcbiAgICog44K344Kn44O844OA44O844KS55m76Yyy44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgY3JlYXRlU2hhZGVyKCk6IFdlYkdMUHJvZ3JhbSB7XG4gICAgLy8g44OQ44O844OG44OD44Kv44K544K344Kn44O844OA44O844Gu44Kz44Oz44OR44Kk44OrXG4gICAgY29uc3QgdmVydGV4U2hhZGVySWQgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUik7XG5cbiAgICBpZiAodmVydGV4U2hhZGVySWQgPT0gbnVsbCkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ2ZhaWxlZCB0byBjcmVhdGUgdmVydGV4U2hhZGVyJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXI6IHN0cmluZyA9XG4gICAgICAncHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7JyArXG4gICAgICAnYXR0cmlidXRlIHZlYzMgcG9zaXRpb247JyArXG4gICAgICAnYXR0cmlidXRlIHZlYzIgdXY7JyArXG4gICAgICAndmFyeWluZyB2ZWMyIHZ1djsnICtcbiAgICAgICd2b2lkIG1haW4odm9pZCknICtcbiAgICAgICd7JyArXG4gICAgICAnICAgZ2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAxLjApOycgK1xuICAgICAgJyAgIHZ1diA9IHV2OycgK1xuICAgICAgJ30nO1xuXG4gICAgZ2wuc2hhZGVyU291cmNlKHZlcnRleFNoYWRlcklkLCB2ZXJ0ZXhTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIodmVydGV4U2hhZGVySWQpO1xuXG4gICAgLy8g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44Kz44Oz44OR44Kk44OrXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXJJZCA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xuXG4gICAgaWYgKGZyYWdtZW50U2hhZGVySWQgPT0gbnVsbCkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ2ZhaWxlZCB0byBjcmVhdGUgZnJhZ21lbnRTaGFkZXInKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyOiBzdHJpbmcgPVxuICAgICAgJ3ByZWNpc2lvbiBtZWRpdW1wIGZsb2F0OycgK1xuICAgICAgJ3ZhcnlpbmcgdmVjMiB2dXY7JyArXG4gICAgICAndW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTsnICtcbiAgICAgICd2b2lkIG1haW4odm9pZCknICtcbiAgICAgICd7JyArXG4gICAgICAnICAgZ2xfRnJhZ0NvbG9yID0gdGV4dHVyZTJEKHRleHR1cmUsIHZ1dik7JyArXG4gICAgICAnfSc7XG5cbiAgICBnbC5zaGFkZXJTb3VyY2UoZnJhZ21lbnRTaGFkZXJJZCwgZnJhZ21lbnRTaGFkZXIpO1xuICAgIGdsLmNvbXBpbGVTaGFkZXIoZnJhZ21lbnRTaGFkZXJJZCk7XG5cbiAgICAvLyDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjga7kvZzmiJBcbiAgICBjb25zdCBwcm9ncmFtSWQgPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW1JZCwgdmVydGV4U2hhZGVySWQpO1xuICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtSWQsIGZyYWdtZW50U2hhZGVySWQpO1xuXG4gICAgZ2wuZGVsZXRlU2hhZGVyKHZlcnRleFNoYWRlcklkKTtcbiAgICBnbC5kZWxldGVTaGFkZXIoZnJhZ21lbnRTaGFkZXJJZCk7XG5cbiAgICAvLyDjg6rjg7Pjgq9cbiAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtSWQpO1xuXG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtSWQpO1xuXG4gICAgcmV0dXJuIHByb2dyYW1JZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWaWV35oOF5aCx44KS5Y+W5b6X44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgZ2V0VmlldygpOiBMQXBwVmlldyB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXc7XG4gIH1cblxuICBwdWJsaWMgZ2V0VGV4dHVyZU1hbmFnZXIoKTogTEFwcFRleHR1cmVNYW5hZ2VyIHtcbiAgICByZXR1cm4gdGhpcy5fdGV4dHVyZU1hbmFnZXI7XG4gIH1cblxuICAvKipcbiAgICogQ3ViaXNtIFNES+OBruWIneacn+WMllxuICAgKi9cbiAgcHVibGljIGluaXRpYWxpemVDdWJpc20oKTogdm9pZCB7XG4gICAgLy8gc2V0dXAgY3ViaXNtXG4gICAgdGhpcy5fY3ViaXNtT3B0aW9uLmxvZ0Z1bmN0aW9uID0gTEFwcFBhbC5wcmludE1lc3NhZ2U7XG4gICAgdGhpcy5fY3ViaXNtT3B0aW9uLmxvZ2dpbmdMZXZlbCA9IExBcHBEZWZpbmUuQ3ViaXNtTG9nZ2luZ0xldmVsO1xuICAgIENzbV9DdWJpc21GcmFtZXdvcmsuc3RhcnRVcCh0aGlzLl9jdWJpc21PcHRpb24pO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBjdWJpc21cbiAgICBDc21fQ3ViaXNtRnJhbWV3b3JrLmluaXRpYWxpemUoKTtcblxuICAgIC8vIGxvYWQgbW9kZWxcbiAgICBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuXG4gICAgTEFwcFBhbC51cGRhdGVUaW1lKCk7XG5cbiAgICB0aGlzLl92aWV3LmluaXRpYWxpemVTcHJpdGUoKTtcbiAgfVxufVxuXG4vKipcbiAqIOOCr+ODquODg+OCr+OBl+OBn+OBqOOBjeOBq+WRvOOBsOOCjOOCi+OAglxuICovXG5mdW5jdGlvbiBvbkNsaWNrQmVnYW4oZTogTW91c2VFdmVudCk6IHZvaWQge1xuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gdHJ1ZTtcblxuICBjb25zdCBwb3NYOiBudW1iZXIgPSBlLnBhZ2VYO1xuICBjb25zdCBwb3NZOiBudW1iZXIgPSBlLnBhZ2VZO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0JlZ2FuKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIOODnuOCpuOCueODneOCpOODs+OCv+OBjOWLleOBhOOBn+OCieWRvOOBsOOCjOOCi+OAglxuICovXG5mdW5jdGlvbiBvbk1vdXNlTW92ZWQoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAvL+eCueWHu+W3pumUruaJjeinpuWPkVxuICAvLyBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCkge1xuICAvLyAgIHJldHVybjtcbiAgLy8gfVxuXG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJlY3QgPSAoZS50YXJnZXQgYXMgRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHBvc1g6IG51bWJlciA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgY29uc3QgcG9zWTogbnVtYmVyID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzTW92ZWQocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICog44Kv44Oq44OD44Kv44GM57WC5LqG44GX44Gf44KJ5ZG844Gw44KM44KL44CCXG4gKi9cbmZ1bmN0aW9uIG9uQ2xpY2tFbmRlZChlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCA9IGZhbHNlO1xuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWN0ID0gKGUudGFyZ2V0IGFzIEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBwb3NYOiBudW1iZXIgPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1k6IG51bWJlciA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc0VuZGVkKHBvc1gsIHBvc1kpO1xufVxuXG4vKipcbiAqIOOCv+ODg+ODgeOBl+OBn+OBqOOBjeOBq+WRvOOBsOOCjOOCi+OAglxuICovXG5mdW5jdGlvbiBvblRvdWNoQmVnYW4oZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSB0cnVlO1xuXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNCZWdhbihwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiDjgrnjg6/jgqTjg5fjgZnjgovjgajlkbzjgbDjgozjgovjgIJcbiAqL1xuZnVuY3Rpb24gb25Ub3VjaE1vdmVkKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgLy/ngrnlh7vmiY3op6blj5FcbiAgLy8gaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQpIHtcbiAgLy8gICByZXR1cm47XG4gIC8vIH1cblxuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWN0ID0gKGUudGFyZ2V0IGFzIEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1kgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNNb3ZlZChwb3NYLCBwb3NZKTtcbn1cblxuLyoqXG4gKiDjgr/jg4Pjg4HjgYzntYLkuobjgZfjgZ/jgonlkbzjgbDjgozjgovjgIJcbiAqL1xuZnVuY3Rpb24gb25Ub3VjaEVuZGVkKGU6IFRvdWNoRXZlbnQpOiB2b2lkIHtcbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX2NhcHR1cmVkID0gZmFsc2U7XG5cbiAgaWYgKCFMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldykge1xuICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCd2aWV3IG5vdGZvdW5kJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVjdCA9IChlLnRhcmdldCBhcyBFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICBjb25zdCBwb3NYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xuICBjb25zdCBwb3NZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcub25Ub3VjaGVzRW5kZWQocG9zWCwgcG9zWSk7XG59XG5cbi8qKlxuICog44K/44OD44OB44GM44Kt44Oj44Oz44K744Or44GV44KM44KL44Go5ZG844Gw44KM44KL44CCXG4gKi9cbmZ1bmN0aW9uIG9uVG91Y2hDYW5jZWwoZTogVG91Y2hFdmVudCk6IHZvaWQge1xuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fY2FwdHVyZWQgPSBmYWxzZTtcblxuICBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3KSB7XG4gICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoJ3ZpZXcgbm90Zm91bmQnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWN0ID0gKGUudGFyZ2V0IGFzIEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIGNvbnN0IHBvc1ggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSByZWN0LmxlZnQ7XG4gIGNvbnN0IHBvc1kgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkgLSByZWN0LnRvcDtcblxuICBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5fdmlldy5vblRvdWNoZXNFbmRlZChwb3NYLCBwb3NZKTtcbn1cblxuZnVuY3Rpb24gb25tb3VzZWxlYXZlKCk6IHZvaWQge1xuICAvL+eCueWHu+aJjeinpuWPkVxuICAvLyBpZiAoIUxBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl9jYXB0dXJlZCkge1xuICAvLyAgIHJldHVybjtcbiAgLy8gfVxuXG4gIGlmICghTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKCkuX3ZpZXcpIHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgndmlldyBub3Rmb3VuZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLl92aWV3Lm9uVG91Y2hlc01vdmVkKDAsIDApO1xufSIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tYXRyaXg0NCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtdmVjdG9yIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXZlY3Rvcic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgYWN1YmlzbW1vdGlvbiB9IGZyb20gJ0BmcmFtZXdvcmsvbW90aW9uL2FjdWJpc21tb3Rpb24nO1xuaW1wb3J0IENzbV9jc21WZWN0b3IgPSBjc212ZWN0b3IuY3NtVmVjdG9yO1xuaW1wb3J0IENzbV9DdWJpc21NYXRyaXg0NCA9IGN1YmlzbW1hdHJpeDQ0LkN1YmlzbU1hdHJpeDQ0O1xuaW1wb3J0IEFDdWJpc21Nb3Rpb24gPSBhY3ViaXNtbW90aW9uLkFDdWJpc21Nb3Rpb247XG5cbmltcG9ydCB7IExBcHBNb2RlbCB9IGZyb20gJy4vbGFwcG1vZGVsJztcbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0IHsgY2FudmFzIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuXG5leHBvcnQgbGV0IHNfaW5zdGFuY2U6IExBcHBMaXZlMkRNYW5hZ2VyID0gbnVsbDtcblxuLyoqXG4gKiDjgrXjg7Pjg5fjg6vjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7PjgavjgYrjgYTjgaZDdWJpc21Nb2RlbOOCkueuoeeQhuOBmeOCi+OCr+ODqeOCuVxuICog44Oi44OH44Or55Sf5oiQ44Go56C05qOE44CB44K/44OD44OX44Kk44OZ44Oz44OI44Gu5Yem55CG44CB44Oi44OH44Or5YiH44KK5pu/44GI44KS6KGM44GG44CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwTGl2ZTJETWFuYWdlciB7XG4gIC8qKlxuICAgKiDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrnvvIjjgrfjg7PjgrDjg6vjg4jjg7PvvInjgpLov5TjgZnjgIJcbiAgICog44Kk44Oz44K544K/44Oz44K544GM55Sf5oiQ44GV44KM44Gm44GE44Gq44GE5aC05ZCI44Gv5YaF6YOo44Gn44Kk44Oz44K544K/44Oz44K544KS55Sf5oiQ44GZ44KL44CCXG4gICAqXG4gICAqIEByZXR1cm4g44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IExBcHBMaXZlMkRNYW5hZ2VyIHtcbiAgICBpZiAoc19pbnN0YW5jZSA9PSBudWxsKSB7XG4gICAgICBzX2luc3RhbmNlID0gbmV3IExBcHBMaXZlMkRNYW5hZ2VyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNfaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICog44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K577yI44K344Oz44Kw44Or44OI44Oz77yJ44KS6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlbGVhc2VJbnN0YW5jZSgpOiB2b2lkIHtcbiAgICBpZiAoc19pbnN0YW5jZSAhPSBudWxsKSB7XG4gICAgICBzX2luc3RhbmNlID0gdm9pZCAwO1xuICAgIH1cblxuICAgIHNfaW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOePvuWcqOOBruOCt+ODvOODs+OBp+S/neaMgeOBl+OBpuOBhOOCi+ODouODh+ODq+OCkui/lOOBmeOAglxuICAgKlxuICAgKiBAcGFyYW0gbm8g44Oi44OH44Or44Oq44K544OI44Gu44Kk44Oz44OH44OD44Kv44K55YCkXG4gICAqIEByZXR1cm4g44Oi44OH44Or44Gu44Kk44Oz44K544K/44Oz44K544KS6L+U44GZ44CC44Kk44Oz44OH44OD44Kv44K55YCk44GM56+E5Zuy5aSW44Gu5aC05ZCI44GvTlVMTOOCkui/lOOBmeOAglxuICAgKi9cbiAgcHVibGljIGdldE1vZGVsKG5vOiBudW1iZXIpOiBMQXBwTW9kZWwge1xuICAgIGlmIChubyA8IHRoaXMuX21vZGVscy5nZXRTaXplKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbHMuYXQobm8pO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOePvuWcqOOBruOCt+ODvOODs+OBp+S/neaMgeOBl+OBpuOBhOOCi+OBmeOBueOBpuOBruODouODh+ODq+OCkuino+aUvuOBmeOCi1xuICAgKi9cbiAgcHVibGljIHJlbGVhc2VBbGxNb2RlbCgpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21vZGVscy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgdGhpcy5fbW9kZWxzLmF0KGkpLnJlbGVhc2UoKTtcbiAgICAgIHRoaXMuX21vZGVscy5zZXQoaSwgbnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbW9kZWxzLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICog55S76Z2i44KS44OJ44Op44OD44Kw44GX44Gf5pmC44Gu5Yem55CGXG4gICAqXG4gICAqIEBwYXJhbSB4IOeUu+mdouOBrljluqfmqJlcbiAgICogQHBhcmFtIHkg55S76Z2i44GuWeW6p+aomVxuICAgKi9cbiAgcHVibGljIG9uRHJhZyh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZWxzLmdldFNpemUoKTsgaSsrKSB7XG4gICAgICBjb25zdCBtb2RlbDogTEFwcE1vZGVsID0gdGhpcy5nZXRNb2RlbChpKTtcblxuICAgICAgaWYgKG1vZGVsKSB7XG4gICAgICAgIG1vZGVsLnNldERyYWdnaW5nKHgsIHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvpnaLjgpLjgr/jg4Pjg5fjgZfjgZ/mmYLjga7lh6bnkIZcbiAgICpcbiAgICogQHBhcmFtIHgg55S76Z2i44GuWOW6p+aomVxuICAgKiBAcGFyYW0geSDnlLvpnaLjga5Z5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25UYXAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXG4gICAgICAgIGBbQVBQXXRhcCBwb2ludDoge3g6ICR7eC50b0ZpeGVkKDIpfSB5OiAke3kudG9GaXhlZCgyKX19YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21vZGVscy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX21vZGVscy5hdChpKS5oaXRUZXN0KExBcHBEZWZpbmUuSGl0QXJlYU5hbWVIZWFkLCB4LCB5KSkge1xuICAgICAgICBpZiAoTEFwcERlZmluZS5EZWJ1Z0xvZ0VuYWJsZSkge1xuICAgICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFxuICAgICAgICAgICAgYFtBUFBdaGl0IGFyZWE6IFske0xBcHBEZWZpbmUuSGl0QXJlYU5hbWVIZWFkfV1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tb2RlbHMuYXQoaSkuc2V0UmFuZG9tRXhwcmVzc2lvbigpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbHMuYXQoaSkuaGl0VGVzdChMQXBwRGVmaW5lLkhpdEFyZWFOYW1lQm9keSwgeCwgeSkpIHtcbiAgICAgICAgaWYgKExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUpIHtcbiAgICAgICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShcbiAgICAgICAgICAgIGBbQVBQXWhpdCBhcmVhOiBbJHtMQXBwRGVmaW5lLkhpdEFyZWFOYW1lQm9keX1dYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbW9kZWxzXG4gICAgICAgICAgLmF0KGkpXG4gICAgICAgICAgLnN0YXJ0UmFuZG9tTW90aW9uKFxuICAgICAgICAgICAgTEFwcERlZmluZS5Nb3Rpb25Hcm91cFRhcEJvZHksXG4gICAgICAgICAgICBMQXBwRGVmaW5lLlByaW9yaXR5Tm9ybWFsLFxuICAgICAgICAgICAgdGhpcy5fZmluaXNoZWRNb3Rpb25cbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvpnaLjgpLmm7TmlrDjgZnjgovjgajjgY3jga7lh6bnkIZcbiAgICog44Oi44OH44Or44Gu5pu05paw5Yem55CG5Y+K44Gz5o+P55S75Yem55CG44KS6KGM44GGXG4gICAqL1xuICBwdWJsaWMgb25VcGRhdGUoKTogdm9pZCB7XG4gICAgbGV0IHByb2plY3Rpb246IENzbV9DdWJpc21NYXRyaXg0NCA9IG5ldyBDc21fQ3ViaXNtTWF0cml4NDQoKTtcblxuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY2FudmFzO1xuICAgIHByb2plY3Rpb24uc2NhbGUoMS4wLCB3aWR0aCAvIGhlaWdodCk7XG5cbiAgICBpZiAodGhpcy5fdmlld01hdHJpeCAhPSBudWxsKSB7XG4gICAgICBwcm9qZWN0aW9uLm11bHRpcGx5QnlNYXRyaXgodGhpcy5fdmlld01hdHJpeCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2F2ZVByb2plY3Rpb246IENzbV9DdWJpc21NYXRyaXg0NCA9IHByb2plY3Rpb24uY2xvbmUoKTtcbiAgICBjb25zdCBtb2RlbENvdW50OiBudW1iZXIgPSB0aGlzLl9tb2RlbHMuZ2V0U2l6ZSgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RlbENvdW50OyArK2kpIHtcbiAgICAgIGNvbnN0IG1vZGVsOiBMQXBwTW9kZWwgPSB0aGlzLmdldE1vZGVsKGkpO1xuICAgICAgcHJvamVjdGlvbiA9IHNhdmVQcm9qZWN0aW9uLmNsb25lKCk7XG5cbiAgICAgIG1vZGVsLnVwZGF0ZSgpO1xuICAgICAgbW9kZWwuZHJhdyhwcm9qZWN0aW9uKTsgLy8g5Y+C54Wn5rih44GX44Gq44Gu44GncHJvamVjdGlvbuOBr+WkieizquOBmeOCi+OAglxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDmrKHjga7jgrfjg7zjg7PjgavliIfjgorjgYvjgYjjgotcbiAgICog44K144Oz44OX44Or44Ki44OX44Oq44Kx44O844K344On44Oz44Gn44Gv44Oi44OH44Or44K744OD44OI44Gu5YiH44KK5pu/44GI44KS6KGM44GG44CCXG4gICAqL1xuICBwdWJsaWMgbmV4dFNjZW5lKCk6IHZvaWQge1xuICAgIGNvbnN0IG5vOiBudW1iZXIgPSAodGhpcy5fc2NlbmVJbmRleCArIDEpICUgTEFwcERlZmluZS5Nb2RlbERpclNpemU7XG4gICAgdGhpcy5jaGFuZ2VTY2VuZShubyk7XG4gIH1cblxuICAvKipcbiAgICog44K344O844Oz44KS5YiH44KK5pu/44GI44KLXG4gICAqIOOCteODs+ODl+ODq+OCouODl+ODquOCseODvOOCt+ODp+ODs+OBp+OBr+ODouODh+ODq+OCu+ODg+ODiOOBruWIh+OCiuabv+OBiOOCkuihjOOBhuOAglxuICAgKi9cbiAgcHVibGljIGNoYW5nZVNjZW5lKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9zY2VuZUluZGV4ID0gaW5kZXg7XG4gICAgaWYgKExBcHBEZWZpbmUuRGVidWdMb2dFbmFibGUpIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKGBbQVBQXW1vZGVsIGluZGV4OiAke3RoaXMuX3NjZW5lSW5kZXh9YCk7XG4gICAgfVxuXG4gICAgLy8gTW9kZWxEaXJbXeOBq+S/neaMgeOBl+OBn+ODh+OCo+ODrOOCr+ODiOODquWQjeOBi+OCiVxuICAgIC8vIG1vZGVsMy5qc29u44Gu44OR44K544KS5rG65a6a44GZ44KL44CCXG4gICAgLy8g44OH44Kj44Os44Kv44OI44Oq5ZCN44GobW9kZWwzLmpzb27jga7lkI3liY3jgpLkuIDoh7TjgZXjgZvjgabjgYrjgY/jgZPjgajjgIJcbiAgICBjb25zdCBtb2RlbDogc3RyaW5nID0gTEFwcERlZmluZS5Nb2RlbERpcltpbmRleF07XG4gICAgY29uc3QgbW9kZWxQYXRoOiBzdHJpbmcgPSBMQXBwRGVmaW5lLlJlc291cmNlc1BhdGggKyBtb2RlbCArICcvJztcbiAgICBsZXQgbW9kZWxKc29uTmFtZTogc3RyaW5nID0gTEFwcERlZmluZS5Nb2RlbERpcltpbmRleF07XG4gICAgbW9kZWxKc29uTmFtZSArPSAnLm1vZGVsMy5qc29uJztcblxuICAgIHRoaXMucmVsZWFzZUFsbE1vZGVsKCk7XG4gICAgdGhpcy5fbW9kZWxzLnB1c2hCYWNrKG5ldyBMQXBwTW9kZWwoKSk7XG4gICAgdGhpcy5fbW9kZWxzLmF0KDApLmxvYWRBc3NldHMobW9kZWxQYXRoLCBtb2RlbEpzb25OYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBuZXcgQ3NtX0N1YmlzbU1hdHJpeDQ0KCk7XG4gICAgdGhpcy5fbW9kZWxzID0gbmV3IENzbV9jc21WZWN0b3I8TEFwcE1vZGVsPigpO1xuICAgIHRoaXMuX3NjZW5lSW5kZXggPSAwO1xuICAgIHRoaXMuY2hhbmdlU2NlbmUodGhpcy5fc2NlbmVJbmRleCk7XG4gIH1cblxuICBfdmlld01hdHJpeDogQ3NtX0N1YmlzbU1hdHJpeDQ0OyAvLyDjg6Ljg4fjg6vmj4/nlLvjgavnlKjjgYTjgot2aWV36KGM5YiXXG4gIF9tb2RlbHM6IENzbV9jc21WZWN0b3I8TEFwcE1vZGVsPjsgLy8g44Oi44OH44Or44Kk44Oz44K544K/44Oz44K544Gu44Kz44Oz44OG44OKXG4gIF9zY2VuZUluZGV4OiBudW1iZXI7IC8vIOihqOekuuOBmeOCi+OCt+ODvOODs+OBruOCpOODs+ODh+ODg+OCr+OCueWApFxuICAvLyDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/ntYLkuobjga7jgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbBcbiAgX2ZpbmlzaGVkTW90aW9uID0gKHNlbGY6IEFDdWJpc21Nb3Rpb24pOiB2b2lkID0+IHtcbiAgICBMQXBwUGFsLnByaW50TWVzc2FnZSgnTW90aW9uIEZpbmlzaGVkOicpO1xuICAgIGNvbnNvbGUubG9nKHNlbGYpO1xuICB9O1xufVxuIiwiLyoqXG4gKiBDb3B5cmlnaHQoYykgTGl2ZTJEIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSB0aGUgTGl2ZTJEIE9wZW4gU29mdHdhcmUgbGljZW5zZVxuICogdGhhdCBjYW4gYmUgZm91bmQgYXQgaHR0cHM6Ly93d3cubGl2ZTJkLmNvbS9ldWxhL2xpdmUyZC1vcGVuLXNvZnR3YXJlLWxpY2Vuc2UtYWdyZWVtZW50X2VuLmh0bWwuXG4gKi9cblxuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGxpdmUyZGN1YmlzbWZyYW1ld29yayB9IGZyb20gJ0BmcmFtZXdvcmsvbGl2ZTJkY3ViaXNtZnJhbWV3b3JrJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21pZCB9IGZyb20gJ0BmcmFtZXdvcmsvaWQvY3ViaXNtaWQnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbXVzZXJtb2RlbCB9IGZyb20gJ0BmcmFtZXdvcmsvbW9kZWwvY3ViaXNtdXNlcm1vZGVsJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBpY3ViaXNtbW9kZWxzZXR0aW5nIH0gZnJvbSAnQGZyYW1ld29yay9pY3ViaXNtbW9kZWxzZXR0aW5nJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tb2RlbHNldHRpbmdqc29uIH0gZnJvbSAnQGZyYW1ld29yay9jdWJpc21tb2RlbHNldHRpbmdqc29uJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21kZWZhdWx0cGFyYW1ldGVyaWQgfSBmcm9tICdAZnJhbWV3b3JrL2N1YmlzbWRlZmF1bHRwYXJhbWV0ZXJpZCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgYWN1YmlzbW1vdGlvbiB9IGZyb20gJ0BmcmFtZXdvcmsvbW90aW9uL2FjdWJpc21tb3Rpb24nO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbWV5ZWJsaW5rIH0gZnJvbSAnQGZyYW1ld29yay9lZmZlY3QvY3ViaXNtZXllYmxpbmsnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbWJyZWF0aCB9IGZyb20gJ0BmcmFtZXdvcmsvZWZmZWN0L2N1YmlzbWJyZWF0aCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtdmVjdG9yIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXZlY3Rvcic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtbWFwIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbW1hcCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtbWF0cml4NDQgfSBmcm9tICdAZnJhbWV3b3JrL21hdGgvY3ViaXNtbWF0cml4NDQnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbW1vdGlvbiB9IGZyb20gJ0BmcmFtZXdvcmsvbW90aW9uL2N1YmlzbW1vdGlvbic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtbW90aW9ucXVldWVtYW5hZ2VyIH0gZnJvbSAnQGZyYW1ld29yay9tb3Rpb24vY3ViaXNtbW90aW9ucXVldWVtYW5hZ2VyJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc21zdHJpbmcgfSBmcm9tICdAZnJhbWV3b3JrL3R5cGUvY3Ntc3RyaW5nJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc21yZWN0IH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXJlY3RmJztcbmltcG9ydCB7IEN1YmlzbUxvZ0luZm8gfSBmcm9tICdAZnJhbWV3b3JrL3V0aWxzL2N1YmlzbWRlYnVnJztcbmltcG9ydCBjc21SZWN0ID0gY3NtcmVjdC5jc21SZWN0O1xuaW1wb3J0IGNzbVN0cmluZyA9IGNzbXN0cmluZy5jc21TdHJpbmc7XG5pbXBvcnQgSW52YWxpZE1vdGlvblF1ZXVlRW50cnlIYW5kbGVWYWx1ZSA9IGN1YmlzbW1vdGlvbnF1ZXVlbWFuYWdlci5JbnZhbGlkTW90aW9uUXVldWVFbnRyeUhhbmRsZVZhbHVlO1xuaW1wb3J0IEN1YmlzbU1vdGlvblF1ZXVlRW50cnlIYW5kbGUgPSBjdWJpc21tb3Rpb25xdWV1ZW1hbmFnZXIuQ3ViaXNtTW90aW9uUXVldWVFbnRyeUhhbmRsZTtcbmltcG9ydCBDdWJpc21Nb3Rpb24gPSBjdWJpc21tb3Rpb24uQ3ViaXNtTW90aW9uO1xuaW1wb3J0IEN1YmlzbU1hdHJpeDQ0ID0gY3ViaXNtbWF0cml4NDQuQ3ViaXNtTWF0cml4NDQ7XG5pbXBvcnQgY3NtTWFwID0gY3NtbWFwLmNzbU1hcDtcbmltcG9ydCBjc21WZWN0b3IgPSBjc212ZWN0b3IuY3NtVmVjdG9yO1xuaW1wb3J0IEN1YmlzbUJyZWF0aCA9IGN1YmlzbWJyZWF0aC5DdWJpc21CcmVhdGg7XG5pbXBvcnQgQnJlYXRoUGFyYW1ldGVyRGF0YSA9IGN1YmlzbWJyZWF0aC5CcmVhdGhQYXJhbWV0ZXJEYXRhO1xuaW1wb3J0IEN1YmlzbUV5ZUJsaW5rID0gY3ViaXNtZXllYmxpbmsuQ3ViaXNtRXllQmxpbms7XG5pbXBvcnQgQUN1YmlzbU1vdGlvbiA9IGFjdWJpc21tb3Rpb24uQUN1YmlzbU1vdGlvbjtcbmltcG9ydCBGaW5pc2hlZE1vdGlvbkNhbGxiYWNrID0gYWN1YmlzbW1vdGlvbi5GaW5pc2hlZE1vdGlvbkNhbGxiYWNrO1xuaW1wb3J0IEN1YmlzbUZyYW1ld29yayA9IGxpdmUyZGN1YmlzbWZyYW1ld29yay5DdWJpc21GcmFtZXdvcms7XG5pbXBvcnQgQ3ViaXNtSWRIYW5kbGUgPSBjdWJpc21pZC5DdWJpc21JZEhhbmRsZTtcbmltcG9ydCBDdWJpc21Vc2VyTW9kZWwgPSBjdWJpc211c2VybW9kZWwuQ3ViaXNtVXNlck1vZGVsO1xuaW1wb3J0IElDdWJpc21Nb2RlbFNldHRpbmcgPSBpY3ViaXNtbW9kZWxzZXR0aW5nLklDdWJpc21Nb2RlbFNldHRpbmc7XG5pbXBvcnQgQ3ViaXNtTW9kZWxTZXR0aW5nSnNvbiA9IGN1YmlzbW1vZGVsc2V0dGluZ2pzb24uQ3ViaXNtTW9kZWxTZXR0aW5nSnNvbjtcbmltcG9ydCBDdWJpc21EZWZhdWx0UGFyYW1ldGVySWQgPSBjdWJpc21kZWZhdWx0cGFyYW1ldGVyaWQ7XG5cbmltcG9ydCB7IExBcHBQYWwgfSBmcm9tICcuL2xhcHBwYWwnO1xuaW1wb3J0IHsgZ2wsIGNhbnZhcywgZnJhbWVCdWZmZXIsIExBcHBEZWxlZ2F0ZSB9IGZyb20gJy4vbGFwcGRlbGVnYXRlJztcbmltcG9ydCB7IFRleHR1cmVJbmZvIH0gZnJvbSAnLi9sYXBwdGV4dHVyZW1hbmFnZXInO1xuaW1wb3J0ICogYXMgTEFwcERlZmluZSBmcm9tICcuL2xhcHBkZWZpbmUnO1xuaW1wb3J0ICd3aGF0d2ctZmV0Y2gnO1xuXG5lbnVtIExvYWRTdGVwIHtcbiAgTG9hZEFzc2V0cyxcbiAgTG9hZE1vZGVsLFxuICBXYWl0TG9hZE1vZGVsLFxuICBMb2FkRXhwcmVzc2lvbixcbiAgV2FpdExvYWRFeHByZXNzaW9uLFxuICBMb2FkUGh5c2ljcyxcbiAgV2FpdExvYWRQaHlzaWNzLFxuICBMb2FkUG9zZSxcbiAgV2FpdExvYWRQb3NlLFxuICBTZXR1cEV5ZUJsaW5rLFxuICBTZXR1cEJyZWF0aCxcbiAgTG9hZFVzZXJEYXRhLFxuICBXYWl0TG9hZFVzZXJEYXRhLFxuICBTZXR1cEV5ZUJsaW5rSWRzLFxuICBTZXR1cExpcFN5bmNJZHMsXG4gIFNldHVwTGF5b3V0LFxuICBMb2FkTW90aW9uLFxuICBXYWl0TG9hZE1vdGlvbixcbiAgQ29tcGxldGVJbml0aWFsaXplLFxuICBDb21wbGV0ZVNldHVwTW9kZWwsXG4gIExvYWRUZXh0dXJlLFxuICBXYWl0TG9hZFRleHR1cmUsXG4gIENvbXBsZXRlU2V0dXBcbn1cblxuLyoqXG4gKiDjg6bjg7zjgrbjg7zjgYzlrp/pmpvjgavkvb/nlKjjgZnjgovjg6Ljg4fjg6vjga7lrp/oo4Xjgq/jg6njgrk8YnI+XG4gKiDjg6Ljg4fjg6vnlJ/miJDjgIHmqZ/og73jgrPjg7Pjg53jg7zjg43jg7Pjg4jnlJ/miJDjgIHmm7TmlrDlh6bnkIbjgajjg6zjg7Pjg4Djg6rjg7PjgrDjga7lkbzjgbPlh7rjgZfjgpLooYzjgYbjgIJcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBNb2RlbCBleHRlbmRzIEN1YmlzbVVzZXJNb2RlbCB7XG4gIC8qKlxuICAgKiBtb2RlbDMuanNvbuOBjOe9ruOBi+OCjOOBn+ODh+OCo+ODrOOCr+ODiOODquOBqOODleOCoeOCpOODq+ODkeOCueOBi+OCieODouODh+ODq+OCkueUn+aIkOOBmeOCi1xuICAgKiBAcGFyYW0gZGlyXG4gICAqIEBwYXJhbSBmaWxlTmFtZVxuICAgKi9cbiAgcHVibGljIGxvYWRBc3NldHMoZGlyOiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9tb2RlbEhvbWVEaXIgPSBkaXI7XG5cbiAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7ZmlsZU5hbWV9YClcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgIGNvbnN0IHNldHRpbmc6IElDdWJpc21Nb2RlbFNldHRpbmcgPSBuZXcgQ3ViaXNtTW9kZWxTZXR0aW5nSnNvbihcbiAgICAgICAgICBhcnJheUJ1ZmZlcixcbiAgICAgICAgICBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8g44K544OG44O844OI44KS5pu05pawXG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZE1vZGVsO1xuXG4gICAgICAgIC8vIOe1kOaenOOCkuS/neWtmFxuICAgICAgICB0aGlzLnNldHVwTW9kZWwoc2V0dGluZyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBtb2RlbDMuanNvbuOBi+OCieODouODh+ODq+OCkueUn+aIkOOBmeOCi+OAglxuICAgKiBtb2RlbDMuanNvbuOBruiomOi/sOOBq+W+k+OBo+OBpuODouODh+ODq+eUn+aIkOOAgeODouODvOOCt+ODp+ODs+OAgeeJqeeQhua8lOeul+OBquOBqeOBruOCs+ODs+ODneODvOODjeODs+ODiOeUn+aIkOOCkuihjOOBhuOAglxuICAgKlxuICAgKiBAcGFyYW0gc2V0dGluZyBJQ3ViaXNtTW9kZWxTZXR0aW5n44Gu44Kk44Oz44K544K/44Oz44K5XG4gICAqL1xuICBwcml2YXRlIHNldHVwTW9kZWwoc2V0dGluZzogSUN1YmlzbU1vZGVsU2V0dGluZyk6IHZvaWQge1xuICAgIHRoaXMuX3VwZGF0aW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9pbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fbW9kZWxTZXR0aW5nID0gc2V0dGluZztcblxuICAgIC8vIEN1YmlzbU1vZGVsXG4gICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb2RlbEZpbGVOYW1lKCkgIT0gJycpIHtcbiAgICAgIGNvbnN0IG1vZGVsRmlsZU5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW9kZWxGaWxlTmFtZSgpO1xuXG4gICAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7bW9kZWxGaWxlTmFtZX1gKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5hcnJheUJ1ZmZlcigpKVxuICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgdGhpcy5sb2FkTW9kZWwoYXJyYXlCdWZmZXIpO1xuICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZEV4cHJlc3Npb247XG5cbiAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgICAgIGxvYWRDdWJpc21FeHByZXNzaW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkTW9kZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKCdNb2RlbCBkYXRhIGRvZXMgbm90IGV4aXN0LicpO1xuICAgIH1cblxuICAgIC8vIEV4cHJlc3Npb25cbiAgICBjb25zdCBsb2FkQ3ViaXNtRXhwcmVzc2lvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXhwcmVzc2lvbkNvdW50KCkgPiAwKSB7XG4gICAgICAgIGNvbnN0IGNvdW50OiBudW1iZXIgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXhwcmVzc2lvbkNvdW50KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbk5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0RXhwcmVzc2lvbk5hbWUoaSk7XG4gICAgICAgICAgY29uc3QgZXhwcmVzc2lvbkZpbGVOYW1lID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldEV4cHJlc3Npb25GaWxlTmFtZShcbiAgICAgICAgICAgIGlcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgZmV0Y2goYCR7dGhpcy5fbW9kZWxIb21lRGlyfS8ke2V4cHJlc3Npb25GaWxlTmFtZX1gKVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSlcbiAgICAgICAgICAgIC50aGVuKGFycmF5QnVmZmVyID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbW90aW9uOiBBQ3ViaXNtTW90aW9uID0gdGhpcy5sb2FkRXhwcmVzc2lvbihcbiAgICAgICAgICAgICAgICBhcnJheUJ1ZmZlcixcbiAgICAgICAgICAgICAgICBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoLFxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25OYW1lXG4gICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuX2V4cHJlc3Npb25zLmdldFZhbHVlKGV4cHJlc3Npb25OYW1lKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgQUN1YmlzbU1vdGlvbi5kZWxldGUoXG4gICAgICAgICAgICAgICAgICB0aGlzLl9leHByZXNzaW9ucy5nZXRWYWx1ZShleHByZXNzaW9uTmFtZSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb25zLnNldFZhbHVlKGV4cHJlc3Npb25OYW1lLCBudWxsKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb25zLnNldFZhbHVlKGV4cHJlc3Npb25OYW1lLCBtb3Rpb24pO1xuXG4gICAgICAgICAgICAgIHRoaXMuX2V4cHJlc3Npb25Db3VudCsrO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLl9leHByZXNzaW9uQ291bnQgPj0gY291bnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLkxvYWRQaHlzaWNzO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgICAgICAgICBsb2FkQ3ViaXNtUGh5c2ljcygpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkRXhwcmVzc2lvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFBoeXNpY3M7XG5cbiAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgbG9hZEN1YmlzbVBoeXNpY3MoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gUGh5c2ljc1xuICAgIGNvbnN0IGxvYWRDdWJpc21QaHlzaWNzID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRQaHlzaWNzRmlsZU5hbWUoKSAhPSAnJykge1xuICAgICAgICBjb25zdCBwaHlzaWNzRmlsZU5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0UGh5c2ljc0ZpbGVOYW1lKCk7XG5cbiAgICAgICAgZmV0Y2goYCR7dGhpcy5fbW9kZWxIb21lRGlyfS8ke3BoeXNpY3NGaWxlTmFtZX1gKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAgICAgLnRoZW4oYXJyYXlCdWZmZXIgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkUGh5c2ljcyhhcnJheUJ1ZmZlciwgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFBvc2U7XG5cbiAgICAgICAgICAgIC8vIGNhbGxiYWNrXG4gICAgICAgICAgICBsb2FkQ3ViaXNtUG9zZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkUGh5c2ljcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFBvc2U7XG5cbiAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgbG9hZEN1YmlzbVBvc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gUG9zZVxuICAgIGNvbnN0IGxvYWRDdWJpc21Qb3NlID0gKCk6IHZvaWQgPT4ge1xuICAgICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRQb3NlRmlsZU5hbWUoKSAhPSAnJykge1xuICAgICAgICBjb25zdCBwb3NlRmlsZU5hbWUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0UG9zZUZpbGVOYW1lKCk7XG5cbiAgICAgICAgZmV0Y2goYCR7dGhpcy5fbW9kZWxIb21lRGlyfS8ke3Bvc2VGaWxlTmFtZX1gKVxuICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmFycmF5QnVmZmVyKCkpXG4gICAgICAgICAgLnRoZW4oYXJyYXlCdWZmZXIgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkUG9zZShhcnJheUJ1ZmZlciwgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuU2V0dXBFeWVCbGluaztcblxuICAgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgICAgIHNldHVwRXllQmxpbmsoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5XYWl0TG9hZFBvc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLlNldHVwRXllQmxpbms7XG5cbiAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgc2V0dXBFeWVCbGluaygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBFeWVCbGlua1xuICAgIGNvbnN0IHNldHVwRXllQmxpbmsgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldEV5ZUJsaW5rUGFyYW1ldGVyQ291bnQoKSA+IDApIHtcbiAgICAgICAgdGhpcy5fZXllQmxpbmsgPSBDdWJpc21FeWVCbGluay5jcmVhdGUodGhpcy5fbW9kZWxTZXR0aW5nKTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5TZXR1cEJyZWF0aDtcbiAgICAgIH1cblxuICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIHNldHVwQnJlYXRoKCk7XG4gICAgfTtcblxuICAgIC8vIEJyZWF0aFxuICAgIGNvbnN0IHNldHVwQnJlYXRoID0gKCk6IHZvaWQgPT4ge1xuICAgICAgdGhpcy5fYnJlYXRoID0gQ3ViaXNtQnJlYXRoLmNyZWF0ZSgpO1xuXG4gICAgICBjb25zdCBicmVhdGhQYXJhbWV0ZXJzOiBjc21WZWN0b3I8QnJlYXRoUGFyYW1ldGVyRGF0YT4gPSBuZXcgY3NtVmVjdG9yKCk7XG4gICAgICBicmVhdGhQYXJhbWV0ZXJzLnB1c2hCYWNrKFxuICAgICAgICBuZXcgQnJlYXRoUGFyYW1ldGVyRGF0YSh0aGlzLl9pZFBhcmFtQW5nbGVYLCAwLjAsIDE1LjAsIDYuNTM0NSwgMC41KVxuICAgICAgKTtcbiAgICAgIGJyZWF0aFBhcmFtZXRlcnMucHVzaEJhY2soXG4gICAgICAgIG5ldyBCcmVhdGhQYXJhbWV0ZXJEYXRhKHRoaXMuX2lkUGFyYW1BbmdsZVksIDAuMCwgOC4wLCAzLjUzNDUsIDAuNSlcbiAgICAgICk7XG4gICAgICBicmVhdGhQYXJhbWV0ZXJzLnB1c2hCYWNrKFxuICAgICAgICBuZXcgQnJlYXRoUGFyYW1ldGVyRGF0YSh0aGlzLl9pZFBhcmFtQW5nbGVaLCAwLjAsIDEwLjAsIDUuNTM0NSwgMC41KVxuICAgICAgKTtcbiAgICAgIGJyZWF0aFBhcmFtZXRlcnMucHVzaEJhY2soXG4gICAgICAgIG5ldyBCcmVhdGhQYXJhbWV0ZXJEYXRhKHRoaXMuX2lkUGFyYW1Cb2R5QW5nbGVYLCAwLjAsIDQuMCwgMTUuNTM0NSwgMC41KVxuICAgICAgKTtcbiAgICAgIGJyZWF0aFBhcmFtZXRlcnMucHVzaEJhY2soXG4gICAgICAgIG5ldyBCcmVhdGhQYXJhbWV0ZXJEYXRhKFxuICAgICAgICAgIEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgICAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUJyZWF0aFxuICAgICAgICAgICksXG4gICAgICAgICAgMC4wLFxuICAgICAgICAgIDAuNSxcbiAgICAgICAgICAzLjIzNDUsXG4gICAgICAgICAgMC41XG4gICAgICAgIClcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuX2JyZWF0aC5zZXRQYXJhbWV0ZXJzKGJyZWF0aFBhcmFtZXRlcnMpO1xuICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkVXNlckRhdGE7XG5cbiAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBsb2FkVXNlckRhdGEoKTtcbiAgICB9O1xuXG4gICAgLy8gVXNlckRhdGFcbiAgICBjb25zdCBsb2FkVXNlckRhdGEgPSAoKTogdm9pZCA9PiB7XG4gICAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldFVzZXJEYXRhRmlsZSgpICE9ICcnKSB7XG4gICAgICAgIGNvbnN0IHVzZXJEYXRhRmlsZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRVc2VyRGF0YUZpbGUoKTtcblxuICAgICAgICBmZXRjaChgJHt0aGlzLl9tb2RlbEhvbWVEaXJ9LyR7dXNlckRhdGFGaWxlfWApXG4gICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSlcbiAgICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWRVc2VyRGF0YShhcnJheUJ1ZmZlciwgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG5cbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuU2V0dXBFeWVCbGlua0lkcztcblxuICAgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgICAgIHNldHVwRXllQmxpbmtJZHMoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkVXNlckRhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLlNldHVwRXllQmxpbmtJZHM7XG5cbiAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgICAgc2V0dXBFeWVCbGlua0lkcygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBFeWVCbGlua0lkc1xuICAgIGNvbnN0IHNldHVwRXllQmxpbmtJZHMgPSAoKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBleWVCbGlua0lkQ291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRFeWVCbGlua1BhcmFtZXRlckNvdW50KCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXllQmxpbmtJZENvdW50OyArK2kpIHtcbiAgICAgICAgdGhpcy5fZXllQmxpbmtJZHMucHVzaEJhY2soXG4gICAgICAgICAgdGhpcy5fbW9kZWxTZXR0aW5nLmdldEV5ZUJsaW5rUGFyYW1ldGVySWQoaSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5TZXR1cExpcFN5bmNJZHM7XG5cbiAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBzZXR1cExpcFN5bmNJZHMoKTtcbiAgICB9O1xuXG4gICAgLy8gTGlwU3luY0lkc1xuICAgIGNvbnN0IHNldHVwTGlwU3luY0lkcyA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGxpcFN5bmNJZENvdW50ID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldExpcFN5bmNQYXJhbWV0ZXJDb3VudCgpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpcFN5bmNJZENvdW50OyArK2kpIHtcbiAgICAgICAgdGhpcy5fbGlwU3luY0lkcy5wdXNoQmFjayh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TGlwU3luY1BhcmFtZXRlcklkKGkpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuU2V0dXBMYXlvdXQ7XG5cbiAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBzZXR1cExheW91dCgpO1xuICAgIH07XG5cbiAgICAvLyBMYXlvdXRcbiAgICBjb25zdCBzZXR1cExheW91dCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGxheW91dDogY3NtTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBjc21NYXA8c3RyaW5nLCBudW1iZXI+KCk7XG4gICAgICB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TGF5b3V0TWFwKGxheW91dCk7XG4gICAgICB0aGlzLl9tb2RlbE1hdHJpeC5zZXR1cEZyb21MYXlvdXQobGF5b3V0KTtcbiAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZE1vdGlvbjtcblxuICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIGxvYWRDdWJpc21Nb3Rpb24oKTtcbiAgICB9O1xuXG4gICAgLy8gTW90aW9uXG4gICAgY29uc3QgbG9hZEN1YmlzbU1vdGlvbiA9ICgpOiB2b2lkID0+IHtcbiAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuV2FpdExvYWRNb3Rpb247XG4gICAgICB0aGlzLl9tb2RlbC5zYXZlUGFyYW1ldGVycygpO1xuICAgICAgdGhpcy5fYWxsTW90aW9uQ291bnQgPSAwO1xuICAgICAgdGhpcy5fbW90aW9uQ291bnQgPSAwO1xuICAgICAgY29uc3QgZ3JvdXA6IHN0cmluZ1tdID0gW107XG5cbiAgICAgIGNvbnN0IG1vdGlvbkdyb3VwQ291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25Hcm91cENvdW50KCk7XG5cbiAgICAgIC8vIOODouODvOOCt+ODp+ODs+OBrue3j+aVsOOCkuaxguOCgeOCi1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Rpb25Hcm91cENvdW50OyBpKyspIHtcbiAgICAgICAgZ3JvdXBbaV0gPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW90aW9uR3JvdXBOYW1lKGkpO1xuICAgICAgICB0aGlzLl9hbGxNb3Rpb25Db3VudCArPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW90aW9uQ291bnQoZ3JvdXBbaV0pO1xuICAgICAgfVxuXG4gICAgICAvLyDjg6Ljg7zjgrfjg6fjg7Pjga7oqq3jgb/ovrzjgb9cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW90aW9uR3JvdXBDb3VudDsgaSsrKSB7XG4gICAgICAgIHRoaXMucHJlTG9hZE1vdGlvbkdyb3VwKGdyb3VwW2ldKTtcbiAgICAgIH1cblxuICAgICAgLy8g44Oi44O844K344On44Oz44GM44Gq44GE5aC05ZCIXG4gICAgICBpZiAobW90aW9uR3JvdXBDb3VudCA9PSAwKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gTG9hZFN0ZXAuTG9hZFRleHR1cmU7XG5cbiAgICAgICAgLy8g5YWo44Gm44Gu44Oi44O844K344On44Oz44KS5YGc5q2i44GZ44KLXG4gICAgICAgIHRoaXMuX21vdGlvbk1hbmFnZXIuc3RvcEFsbE1vdGlvbnMoKTtcblxuICAgICAgICB0aGlzLl91cGRhdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVSZW5kZXJlcigpO1xuICAgICAgICB0aGlzLnNldHVwVGV4dHVyZXMoKTtcbiAgICAgICAgdGhpcy5nZXRSZW5kZXJlcigpLnN0YXJ0VXAoZ2wpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog44OG44Kv44K544OB44Oj44Om44OL44OD44OI44Gr44OG44Kv44K544OB44Oj44KS44Ot44O844OJ44GZ44KLXG4gICAqL1xuICBwcml2YXRlIHNldHVwVGV4dHVyZXMoKTogdm9pZCB7XG4gICAgLy8gaVBob25l44Gn44Gu44Ki44Or44OV44Kh5ZOB6LOq5ZCR5LiK44Gu44Gf44KBVHlwZXNjcmlwdOOBp+OBr3ByZW11bHRpcGxpZWRBbHBoYeOCkuaOoeeUqFxuICAgIGNvbnN0IHVzZVByZW11bHRpcGx5ID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9zdGF0ZSA9PSBMb2FkU3RlcC5Mb2FkVGV4dHVyZSkge1xuICAgICAgLy8g44OG44Kv44K544OB44Oj6Kqt44G/6L6844G/55SoXG4gICAgICBjb25zdCB0ZXh0dXJlQ291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRUZXh0dXJlQ291bnQoKTtcblxuICAgICAgZm9yIChcbiAgICAgICAgbGV0IG1vZGVsVGV4dHVyZU51bWJlciA9IDA7XG4gICAgICAgIG1vZGVsVGV4dHVyZU51bWJlciA8IHRleHR1cmVDb3VudDtcbiAgICAgICAgbW9kZWxUZXh0dXJlTnVtYmVyKytcbiAgICAgICkge1xuICAgICAgICAvLyDjg4bjgq/jgrnjg4Hjg6PlkI3jgYznqbrmloflrZfjgaDjgaPjgZ/loLTlkIjjga/jg63jg7zjg4njg7vjg5DjgqTjg7Pjg4nlh6bnkIbjgpLjgrnjgq3jg4Pjg5dcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsU2V0dGluZy5nZXRUZXh0dXJlRmlsZU5hbWUobW9kZWxUZXh0dXJlTnVtYmVyKSA9PSAnJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdnZXRUZXh0dXJlRmlsZU5hbWUgbnVsbCcpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2ViR0zjga7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4jjgavjg4bjgq/jgrnjg4Hjg6PjgpLjg63jg7zjg4njgZnjgotcbiAgICAgICAgbGV0IHRleHR1cmVQYXRoID0gdGhpcy5fbW9kZWxTZXR0aW5nLmdldFRleHR1cmVGaWxlTmFtZShcbiAgICAgICAgICBtb2RlbFRleHR1cmVOdW1iZXJcbiAgICAgICAgKTtcbiAgICAgICAgdGV4dHVyZVBhdGggPSB0aGlzLl9tb2RlbEhvbWVEaXIgKyB0ZXh0dXJlUGF0aDtcblxuICAgICAgICAvLyDjg63jg7zjg4nlrozkuobmmYLjgavlkbzjgbPlh7rjgZnjgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbBcbiAgICAgICAgY29uc3Qgb25Mb2FkID0gKHRleHR1cmVJbmZvOiBUZXh0dXJlSW5mbyk6IHZvaWQgPT4ge1xuICAgICAgICAgIHRoaXMuZ2V0UmVuZGVyZXIoKS5iaW5kVGV4dHVyZShtb2RlbFRleHR1cmVOdW1iZXIsIHRleHR1cmVJbmZvLmlkKTtcblxuICAgICAgICAgIHRoaXMuX3RleHR1cmVDb3VudCsrO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX3RleHR1cmVDb3VudCA+PSB0ZXh0dXJlQ291bnQpIHtcbiAgICAgICAgICAgIC8vIOODreODvOODieWujOS6hlxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Db21wbGV0ZVNldHVwO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyDoqq3jgb/ovrzjgb9cbiAgICAgICAgTEFwcERlbGVnYXRlLmdldEluc3RhbmNlKClcbiAgICAgICAgICAuZ2V0VGV4dHVyZU1hbmFnZXIoKVxuICAgICAgICAgIC5jcmVhdGVUZXh0dXJlRnJvbVBuZ0ZpbGUodGV4dHVyZVBhdGgsIHVzZVByZW11bHRpcGx5LCBvbkxvYWQpO1xuICAgICAgICB0aGlzLmdldFJlbmRlcmVyKCkuc2V0SXNQcmVtdWx0aXBsaWVkQWxwaGEodXNlUHJlbXVsdGlwbHkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLldhaXRMb2FkVGV4dHVyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog44Os44Oz44OA44Op44KS5YaN5qeL56+J44GZ44KLXG4gICAqL1xuICBwdWJsaWMgcmVsb2FkUmVuZGVyZXIoKTogdm9pZCB7XG4gICAgdGhpcy5kZWxldGVSZW5kZXJlcigpO1xuICAgIHRoaXMuY3JlYXRlUmVuZGVyZXIoKTtcbiAgICB0aGlzLnNldHVwVGV4dHVyZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmm7TmlrBcbiAgICovXG4gIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3N0YXRlICE9IExvYWRTdGVwLkNvbXBsZXRlU2V0dXApIHJldHVybjtcblxuICAgIGNvbnN0IGRlbHRhVGltZVNlY29uZHM6IG51bWJlciA9IExBcHBQYWwuZ2V0RGVsdGFUaW1lKCk7XG4gICAgdGhpcy5fdXNlclRpbWVTZWNvbmRzICs9IGRlbHRhVGltZVNlY29uZHM7XG5cbiAgICB0aGlzLl9kcmFnTWFuYWdlci51cGRhdGUoZGVsdGFUaW1lU2Vjb25kcyk7XG4gICAgdGhpcy5fZHJhZ1ggPSB0aGlzLl9kcmFnTWFuYWdlci5nZXRYKCk7XG4gICAgdGhpcy5fZHJhZ1kgPSB0aGlzLl9kcmFnTWFuYWdlci5nZXRZKCk7XG5cbiAgICAvLyDjg6Ljg7zjgrfjg6fjg7Pjgavjgojjgovjg5Hjg6njg6Hjg7zjgr/mm7TmlrDjga7mnInnhKFcbiAgICBsZXQgbW90aW9uVXBkYXRlZCA9IGZhbHNlO1xuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIHRoaXMuX21vZGVsLmxvYWRQYXJhbWV0ZXJzKCk7IC8vIOWJjeWbnuOCu+ODvOODluOBleOCjOOBn+eKtuaFi+OCkuODreODvOODiVxuICAgIGlmICh0aGlzLl9tb3Rpb25NYW5hZ2VyLmlzRmluaXNoZWQoKSkge1xuICAgICAgLy8g44Oi44O844K344On44Oz44Gu5YaN55Sf44GM44Gq44GE5aC05ZCI44CB5b6F5qmf44Oi44O844K344On44Oz44Gu5Lit44GL44KJ44Op44Oz44OA44Og44Gn5YaN55Sf44GZ44KLXG4gICAgICB0aGlzLnN0YXJ0UmFuZG9tTW90aW9uKFxuICAgICAgICBMQXBwRGVmaW5lLk1vdGlvbkdyb3VwSWRsZSxcbiAgICAgICAgTEFwcERlZmluZS5Qcmlvcml0eUlkbGVcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vdGlvblVwZGF0ZWQgPSB0aGlzLl9tb3Rpb25NYW5hZ2VyLnVwZGF0ZU1vdGlvbihcbiAgICAgICAgdGhpcy5fbW9kZWwsXG4gICAgICAgIGRlbHRhVGltZVNlY29uZHNcbiAgICAgICk7IC8vIOODouODvOOCt+ODp+ODs+OCkuabtOaWsFxuICAgIH1cbiAgICB0aGlzLl9tb2RlbC5zYXZlUGFyYW1ldGVycygpOyAvLyDnirbmhYvjgpLkv53lrZhcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyDjgb7jgbDjgZ/jgY1cbiAgICBpZiAoIW1vdGlvblVwZGF0ZWQpIHtcbiAgICAgIGlmICh0aGlzLl9leWVCbGluayAhPSBudWxsKSB7XG4gICAgICAgIC8vIOODoeOCpOODs+ODouODvOOCt+ODp+ODs+OBruabtOaWsOOBjOOBquOBhOOBqOOBjVxuICAgICAgICB0aGlzLl9leWVCbGluay51cGRhdGVQYXJhbWV0ZXJzKHRoaXMuX21vZGVsLCBkZWx0YVRpbWVTZWNvbmRzKTsgLy8g55uu44OR44OBXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V4cHJlc3Npb25NYW5hZ2VyICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX2V4cHJlc3Npb25NYW5hZ2VyLnVwZGF0ZU1vdGlvbih0aGlzLl9tb2RlbCwgZGVsdGFUaW1lU2Vjb25kcyk7IC8vIOihqOaDheOBp+ODkeODqeODoeODvOOCv+abtOaWsO+8iOebuOWvvuWkieWMlu+8iVxuICAgIH1cblxuICAgIC8vIOODieODqeODg+OCsOOBq+OCiOOCi+WkieWMllxuICAgIC8vIOODieODqeODg+OCsOOBq+OCiOOCi+mhlOOBruWQkeOBjeOBruiqv+aVtFxuICAgIHRoaXMuX21vZGVsLmFkZFBhcmFtZXRlclZhbHVlQnlJZCh0aGlzLl9pZFBhcmFtQW5nbGVYLCB0aGlzLl9kcmFnWCAqIDMwKTsgLy8gLTMw44GL44KJMzDjga7lgKTjgpLliqDjgYjjgotcbiAgICB0aGlzLl9tb2RlbC5hZGRQYXJhbWV0ZXJWYWx1ZUJ5SWQodGhpcy5faWRQYXJhbUFuZ2xlWSwgdGhpcy5fZHJhZ1kgKiAzMCk7XG4gICAgdGhpcy5fbW9kZWwuYWRkUGFyYW1ldGVyVmFsdWVCeUlkKFxuICAgICAgdGhpcy5faWRQYXJhbUFuZ2xlWixcbiAgICAgIHRoaXMuX2RyYWdYICogdGhpcy5fZHJhZ1kgKiAtMzBcbiAgICApO1xuXG4gICAgLy8g44OJ44Op44OD44Kw44Gr44KI44KL5L2T44Gu5ZCR44GN44Gu6Kq/5pW0XG4gICAgdGhpcy5fbW9kZWwuYWRkUGFyYW1ldGVyVmFsdWVCeUlkKFxuICAgICAgdGhpcy5faWRQYXJhbUJvZHlBbmdsZVgsXG4gICAgICB0aGlzLl9kcmFnWCAqIDEwXG4gICAgKTsgLy8gLTEw44GL44KJMTDjga7lgKTjgpLliqDjgYjjgotcblxuICAgIC8vIOODieODqeODg+OCsOOBq+OCiOOCi+ebruOBruWQkeOBjeOBruiqv+aVtFxuICAgIHRoaXMuX21vZGVsLmFkZFBhcmFtZXRlclZhbHVlQnlJZCh0aGlzLl9pZFBhcmFtRXllQmFsbFgsIHRoaXMuX2RyYWdYKTsgLy8gLTHjgYvjgokx44Gu5YCk44KS5Yqg44GI44KLXG4gICAgdGhpcy5fbW9kZWwuYWRkUGFyYW1ldGVyVmFsdWVCeUlkKHRoaXMuX2lkUGFyYW1FeWVCYWxsWSwgdGhpcy5fZHJhZ1kpO1xuXG4gICAgLy8g5ZG85ZC444Gq44GpXG4gICAgaWYgKHRoaXMuX2JyZWF0aCAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9icmVhdGgudXBkYXRlUGFyYW1ldGVycyh0aGlzLl9tb2RlbCwgZGVsdGFUaW1lU2Vjb25kcyk7XG4gICAgfVxuXG4gICAgLy8g54mp55CG5ryU566X44Gu6Kit5a6aXG4gICAgaWYgKHRoaXMuX3BoeXNpY3MgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fcGh5c2ljcy5ldmFsdWF0ZSh0aGlzLl9tb2RlbCwgZGVsdGFUaW1lU2Vjb25kcyk7XG4gICAgfVxuXG4gICAgLy8g44Oq44OD44OX44K344Oz44Kv44Gu6Kit5a6aXG4gICAgaWYgKHRoaXMuX2xpcHN5bmMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gMDsgLy8g44Oq44Ki44Or44K/44Kk44Og44Gn44Oq44OD44OX44K344Oz44Kv44KS6KGM44GG5aC05ZCI44CB44K344K544OG44Og44GL44KJ6Z+z6YeP44KS5Y+W5b6X44GX44Gm44CBMH4x44Gu56+E5Zuy44Gn5YCk44KS5YWl5Yqb44GX44G+44GZ44CCXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGlwU3luY0lkcy5nZXRTaXplKCk7ICsraSkge1xuICAgICAgICB0aGlzLl9tb2RlbC5hZGRQYXJhbWV0ZXJWYWx1ZUJ5SWQodGhpcy5fbGlwU3luY0lkcy5hdChpKSwgdmFsdWUsIDAuOCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g44Od44O844K644Gu6Kit5a6aXG4gICAgaWYgKHRoaXMuX3Bvc2UgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fcG9zZS51cGRhdGVQYXJhbWV0ZXJzKHRoaXMuX21vZGVsLCBkZWx0YVRpbWVTZWNvbmRzKTtcbiAgICB9XG5cbiAgICB0aGlzLl9tb2RlbC51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlvJXmlbDjgafmjIflrprjgZfjgZ/jg6Ljg7zjgrfjg6fjg7Pjga7lho3nlJ/jgpLplovlp4vjgZnjgotcbiAgICogQHBhcmFtIGdyb3VwIOODouODvOOCt+ODp+ODs+OCsOODq+ODvOODl+WQjVxuICAgKiBAcGFyYW0gbm8g44Kw44Or44O844OX5YaF44Gu55Wq5Y+3XG4gICAqIEBwYXJhbSBwcmlvcml0eSDlhKrlhYjluqZcbiAgICogQHBhcmFtIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyIOODouODvOOCt+ODp+ODs+WGjeeUn+e1guS6huaZguOBq+WRvOOBs+WHuuOBleOCjOOCi+OCs+ODvOODq+ODkOODg+OCr+mWouaVsFxuICAgKiBAcmV0dXJuIOmWi+Wni+OBl+OBn+ODouODvOOCt+ODp+ODs+OBruitmOWIpeeVquWPt+OCkui/lOOBmeOAguWAi+WIpeOBruODouODvOOCt+ODp+ODs+OBjOe1guS6huOBl+OBn+OBi+WQpuOBi+OCkuWIpOWumuOBmeOCi2lzRmluaXNoZWQoKeOBruW8leaVsOOBp+S9v+eUqOOBmeOCi+OAgumWi+Wni+OBp+OBjeOBquOBhOaZguOBr1stMV1cbiAgICovXG4gIHB1YmxpYyBzdGFydE1vdGlvbihcbiAgICBncm91cDogc3RyaW5nLFxuICAgIG5vOiBudW1iZXIsXG4gICAgcHJpb3JpdHk6IG51bWJlcixcbiAgICBvbkZpbmlzaGVkTW90aW9uSGFuZGxlcj86IEZpbmlzaGVkTW90aW9uQ2FsbGJhY2tcbiAgKTogQ3ViaXNtTW90aW9uUXVldWVFbnRyeUhhbmRsZSB7XG4gICAgaWYgKHByaW9yaXR5ID09IExBcHBEZWZpbmUuUHJpb3JpdHlGb3JjZSkge1xuICAgICAgdGhpcy5fbW90aW9uTWFuYWdlci5zZXRSZXNlcnZlUHJpb3JpdHkocHJpb3JpdHkpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX21vdGlvbk1hbmFnZXIucmVzZXJ2ZU1vdGlvbihwcmlvcml0eSkpIHtcbiAgICAgIGlmICh0aGlzLl9kZWJ1Z01vZGUpIHtcbiAgICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoXCJbQVBQXWNhbid0IHN0YXJ0IG1vdGlvbi5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gSW52YWxpZE1vdGlvblF1ZXVlRW50cnlIYW5kbGVWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBtb3Rpb25GaWxlTmFtZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GaWxlTmFtZShncm91cCwgbm8pO1xuXG4gICAgLy8gZXgpIGlkbGVfMFxuICAgIGNvbnN0IG5hbWUgPSBgJHtncm91cH1fJHtub31gO1xuICAgIGxldCBtb3Rpb246IEN1YmlzbU1vdGlvbiA9IHRoaXMuX21vdGlvbnMuZ2V0VmFsdWUobmFtZSkgYXMgQ3ViaXNtTW90aW9uO1xuICAgIGxldCBhdXRvRGVsZXRlID0gZmFsc2U7XG5cbiAgICBpZiAobW90aW9uID09IG51bGwpIHtcbiAgICAgIGZldGNoKGAke3RoaXMuX21vZGVsSG9tZURpcn0vJHttb3Rpb25GaWxlTmFtZX1gKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5hcnJheUJ1ZmZlcigpKVxuICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgbW90aW9uID0gdGhpcy5sb2FkTW90aW9uKFxuICAgICAgICAgICAgYXJyYXlCdWZmZXIsXG4gICAgICAgICAgICBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyXG4gICAgICAgICAgKTtcbiAgICAgICAgICBsZXQgZmFkZVRpbWU6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GYWRlSW5UaW1lVmFsdWUoXG4gICAgICAgICAgICBncm91cCxcbiAgICAgICAgICAgIG5vXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChmYWRlVGltZSA+PSAwLjApIHtcbiAgICAgICAgICAgIG1vdGlvbi5zZXRGYWRlSW5UaW1lKGZhZGVUaW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmYWRlVGltZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GYWRlT3V0VGltZVZhbHVlKGdyb3VwLCBubyk7XG4gICAgICAgICAgaWYgKGZhZGVUaW1lID49IDAuMCkge1xuICAgICAgICAgICAgbW90aW9uLnNldEZhZGVPdXRUaW1lKGZhZGVUaW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtb3Rpb24uc2V0RWZmZWN0SWRzKHRoaXMuX2V5ZUJsaW5rSWRzLCB0aGlzLl9saXBTeW5jSWRzKTtcbiAgICAgICAgICBhdXRvRGVsZXRlID0gdHJ1ZTsgLy8g57WC5LqG5pmC44Gr44Oh44Oi44Oq44GL44KJ5YmK6ZmkXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb3Rpb24uc2V0RmluaXNoZWRNb3Rpb25IYW5kbGVyKG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGVidWdNb2RlKSB7XG4gICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0FQUF1zdGFydCBtb3Rpb246IFske2dyb3VwfV8ke25vfWApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fbW90aW9uTWFuYWdlci5zdGFydE1vdGlvblByaW9yaXR5KFxuICAgICAgbW90aW9uLFxuICAgICAgYXV0b0RlbGV0ZSxcbiAgICAgIHByaW9yaXR5XG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6njg7Pjg4Djg6DjgavpgbjjgbDjgozjgZ/jg6Ljg7zjgrfjg6fjg7Pjga7lho3nlJ/jgpLplovlp4vjgZnjgovjgIJcbiAgICogQHBhcmFtIGdyb3VwIOODouODvOOCt+ODp+ODs+OCsOODq+ODvOODl+WQjVxuICAgKiBAcGFyYW0gcHJpb3JpdHkg5YSq5YWI5bqmXG4gICAqIEBwYXJhbSBvbkZpbmlzaGVkTW90aW9uSGFuZGxlciDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/ntYLkuobmmYLjgavlkbzjgbPlh7rjgZXjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbBcbiAgICogQHJldHVybiDplovlp4vjgZfjgZ/jg6Ljg7zjgrfjg6fjg7Pjga7orZjliKXnlarlj7fjgpLov5TjgZnjgILlgIvliKXjga7jg6Ljg7zjgrfjg6fjg7PjgYzntYLkuobjgZfjgZ/jgYvlkKbjgYvjgpLliKTlrprjgZnjgotpc0ZpbmlzaGVkKCnjga7lvJXmlbDjgafkvb/nlKjjgZnjgovjgILplovlp4vjgafjgY3jgarjgYTmmYLjga9bLTFdXG4gICAqL1xuICBwdWJsaWMgc3RhcnRSYW5kb21Nb3Rpb24oXG4gICAgZ3JvdXA6IHN0cmluZyxcbiAgICBwcmlvcml0eTogbnVtYmVyLFxuICAgIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyPzogRmluaXNoZWRNb3Rpb25DYWxsYmFja1xuICApOiBDdWJpc21Nb3Rpb25RdWV1ZUVudHJ5SGFuZGxlIHtcbiAgICBpZiAodGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkNvdW50KGdyb3VwKSA9PSAwKSB7XG4gICAgICByZXR1cm4gSW52YWxpZE1vdGlvblF1ZXVlRW50cnlIYW5kbGVWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBubzogbnVtYmVyID0gTWF0aC5mbG9vcihcbiAgICAgIE1hdGgucmFuZG9tKCkgKiB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0TW90aW9uQ291bnQoZ3JvdXApXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLnN0YXJ0TW90aW9uKGdyb3VwLCBubywgcHJpb3JpdHksIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlvJXmlbDjgafmjIflrprjgZfjgZ/ooajmg4Xjg6Ljg7zjgrfjg6fjg7PjgpLjgrvjg4Pjg4jjgZnjgotcbiAgICpcbiAgICogQHBhcmFtIGV4cHJlc3Npb25JZCDooajmg4Xjg6Ljg7zjgrfjg6fjg7Pjga5JRFxuICAgKi9cbiAgcHVibGljIHNldEV4cHJlc3Npb24oZXhwcmVzc2lvbklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBtb3Rpb246IEFDdWJpc21Nb3Rpb24gPSB0aGlzLl9leHByZXNzaW9ucy5nZXRWYWx1ZShleHByZXNzaW9uSWQpO1xuXG4gICAgaWYgKHRoaXMuX2RlYnVnTW9kZSkge1xuICAgICAgTEFwcFBhbC5wcmludE1lc3NhZ2UoYFtBUFBdZXhwcmVzc2lvbjogWyR7ZXhwcmVzc2lvbklkfV1gKTtcbiAgICB9XG5cbiAgICBpZiAobW90aW9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX2V4cHJlc3Npb25NYW5hZ2VyLnN0YXJ0TW90aW9uUHJpb3JpdHkoXG4gICAgICAgIG1vdGlvbixcbiAgICAgICAgZmFsc2UsXG4gICAgICAgIExBcHBEZWZpbmUuUHJpb3JpdHlGb3JjZVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX2RlYnVnTW9kZSkge1xuICAgICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0FQUF1leHByZXNzaW9uWyR7ZXhwcmVzc2lvbklkfV0gaXMgbnVsbGApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDjg6njg7Pjg4Djg6DjgavpgbjjgbDjgozjgZ/ooajmg4Xjg6Ljg7zjgrfjg6fjg7PjgpLjgrvjg4Pjg4jjgZnjgotcbiAgICovXG4gIHB1YmxpYyBzZXRSYW5kb21FeHByZXNzaW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9leHByZXNzaW9ucy5nZXRTaXplKCkgPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5vOiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLl9leHByZXNzaW9ucy5nZXRTaXplKCkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9leHByZXNzaW9ucy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgaWYgKGkgPT0gbm8pIHtcbiAgICAgICAgY29uc3QgbmFtZTogc3RyaW5nID0gdGhpcy5fZXhwcmVzc2lvbnMuX2tleVZhbHVlc1tpXS5maXJzdDtcbiAgICAgICAgdGhpcy5zZXRFeHByZXNzaW9uKG5hbWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOOCpOODmeODs+ODiOOBrueZuueBq+OCkuWPl+OBkeWPluOCi1xuICAgKi9cbiAgcHVibGljIG1vdGlvbkV2ZW50RmlyZWQoZXZlbnRWYWx1ZTogY3NtU3RyaW5nKTogdm9pZCB7XG4gICAgQ3ViaXNtTG9nSW5mbygnezB9IGlzIGZpcmVkIG9uIExBcHBNb2RlbCEhJywgZXZlbnRWYWx1ZS5zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlvZPjgZ/jgorliKTlrprjg4bjgrnjg4hcbiAgICog5oyH5a6a77yp77yk44Gu6aCC54K544Oq44K544OI44GL44KJ55+p5b2i44KS6KiI566X44GX44CB5bqn5qiZ44KS44GM55+p5b2i56+E5Zuy5YaF44GL5Yik5a6a44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBoaXRBcmVuYU5hbWUgIOW9k+OBn+OCiuWIpOWumuOCkuODhuOCueODiOOBmeOCi+WvvuixoeOBrklEXG4gICAqIEBwYXJhbSB4ICAgICAgICAgICAgIOWIpOWumuOCkuihjOOBhljluqfmqJlcbiAgICogQHBhcmFtIHkgICAgICAgICAgICAg5Yik5a6a44KS6KGM44GGWeW6p+aomVxuICAgKi9cbiAgcHVibGljIGhpdFRlc3QoaGl0QXJlbmFOYW1lOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgLy8g6YCP5piO5pmC44Gv5b2T44Gf44KK5Yik5a6a54Sh44GX44CCXG4gICAgaWYgKHRoaXMuX29wYWNpdHkgPCAxKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgY291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRIaXRBcmVhc0NvdW50KCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbFNldHRpbmcuZ2V0SGl0QXJlYU5hbWUoaSkgPT0gaGl0QXJlbmFOYW1lKSB7XG4gICAgICAgIGNvbnN0IGRyYXdJZDogQ3ViaXNtSWRIYW5kbGUgPSB0aGlzLl9tb2RlbFNldHRpbmcuZ2V0SGl0QXJlYUlkKGkpO1xuICAgICAgICByZXR1cm4gdGhpcy5pc0hpdChkcmF3SWQsIHgsIHkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDjg6Ljg7zjgrfjg6fjg7Pjg4fjg7zjgr/jgpLjgrDjg6vjg7zjg5flkI3jgYvjgonkuIDmi6zjgafjg63jg7zjg4njgZnjgovjgIJcbiAgICog44Oi44O844K344On44Oz44OH44O844K/44Gu5ZCN5YmN44Gv5YaF6YOo44GnTW9kZWxTZXR0aW5n44GL44KJ5Y+W5b6X44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBncm91cCDjg6Ljg7zjgrfjg6fjg7Pjg4fjg7zjgr/jga7jgrDjg6vjg7zjg5flkI1cbiAgICovXG4gIHB1YmxpYyBwcmVMb2FkTW90aW9uR3JvdXAoZ3JvdXA6IHN0cmluZyk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZWxTZXR0aW5nLmdldE1vdGlvbkNvdW50KGdyb3VwKTsgaSsrKSB7XG4gICAgICBjb25zdCBtb3Rpb25GaWxlTmFtZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GaWxlTmFtZShncm91cCwgaSk7XG5cbiAgICAgIC8vIGV4KSBpZGxlXzBcbiAgICAgIGNvbnN0IG5hbWUgPSBgJHtncm91cH1fJHtpfWA7XG4gICAgICBpZiAodGhpcy5fZGVidWdNb2RlKSB7XG4gICAgICAgIExBcHBQYWwucHJpbnRNZXNzYWdlKFxuICAgICAgICAgIGBbQVBQXWxvYWQgbW90aW9uOiAke21vdGlvbkZpbGVOYW1lfSA9PiBbJHtuYW1lfV1gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGZldGNoKGAke3RoaXMuX21vZGVsSG9tZURpcn0vJHttb3Rpb25GaWxlTmFtZX1gKVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5hcnJheUJ1ZmZlcigpKVxuICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgY29uc3QgdG1wTW90aW9uOiBDdWJpc21Nb3Rpb24gPSB0aGlzLmxvYWRNb3Rpb24oXG4gICAgICAgICAgICBhcnJheUJ1ZmZlcixcbiAgICAgICAgICAgIGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgsXG4gICAgICAgICAgICBuYW1lXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGxldCBmYWRlVGltZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GYWRlSW5UaW1lVmFsdWUoZ3JvdXAsIGkpO1xuICAgICAgICAgIGlmIChmYWRlVGltZSA+PSAwLjApIHtcbiAgICAgICAgICAgIHRtcE1vdGlvbi5zZXRGYWRlSW5UaW1lKGZhZGVUaW1lKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmYWRlVGltZSA9IHRoaXMuX21vZGVsU2V0dGluZy5nZXRNb3Rpb25GYWRlT3V0VGltZVZhbHVlKGdyb3VwLCBpKTtcbiAgICAgICAgICBpZiAoZmFkZVRpbWUgPj0gMC4wKSB7XG4gICAgICAgICAgICB0bXBNb3Rpb24uc2V0RmFkZU91dFRpbWUoZmFkZVRpbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0bXBNb3Rpb24uc2V0RWZmZWN0SWRzKHRoaXMuX2V5ZUJsaW5rSWRzLCB0aGlzLl9saXBTeW5jSWRzKTtcblxuICAgICAgICAgIGlmICh0aGlzLl9tb3Rpb25zLmdldFZhbHVlKG5hbWUpICE9IG51bGwpIHtcbiAgICAgICAgICAgIEFDdWJpc21Nb3Rpb24uZGVsZXRlKHRoaXMuX21vdGlvbnMuZ2V0VmFsdWUobmFtZSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX21vdGlvbnMuc2V0VmFsdWUobmFtZSwgdG1wTW90aW9uKTtcblxuICAgICAgICAgIHRoaXMuX21vdGlvbkNvdW50Kys7XG4gICAgICAgICAgaWYgKHRoaXMuX21vdGlvbkNvdW50ID49IHRoaXMuX2FsbE1vdGlvbkNvdW50KSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IExvYWRTdGVwLkxvYWRUZXh0dXJlO1xuXG4gICAgICAgICAgICAvLyDlhajjgabjga7jg6Ljg7zjgrfjg6fjg7PjgpLlgZzmraLjgZnjgotcbiAgICAgICAgICAgIHRoaXMuX21vdGlvbk1hbmFnZXIuc3RvcEFsbE1vdGlvbnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fdXBkYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5jcmVhdGVSZW5kZXJlcigpO1xuICAgICAgICAgICAgdGhpcy5zZXR1cFRleHR1cmVzKCk7XG4gICAgICAgICAgICB0aGlzLmdldFJlbmRlcmVyKCkuc3RhcnRVcChnbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog44GZ44G544Gm44Gu44Oi44O844K344On44Oz44OH44O844K/44KS6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZU1vdGlvbnMoKTogdm9pZCB7XG4gICAgdGhpcy5fbW90aW9ucy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWFqOOBpuOBruihqOaDheODh+ODvOOCv+OCkuino+aUvuOBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbGVhc2VFeHByZXNzaW9ucygpOiB2b2lkIHtcbiAgICB0aGlzLl9leHByZXNzaW9ucy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOODouODh+ODq+OCkuaPj+eUu+OBmeOCi+WHpueQhuOAguODouODh+ODq+OCkuaPj+eUu+OBmeOCi+epuumWk+OBrlZpZXctUHJvamVjdGlvbuihjOWIl+OCkua4oeOBmeOAglxuICAgKi9cbiAgcHVibGljIGRvRHJhdygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgLy8g44Kt44Oj44Oz44OQ44K544K144Kk44K644KS5rih44GZXG4gICAgY29uc3Qgdmlld3BvcnQ6IG51bWJlcltdID0gWzAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodF07XG5cbiAgICB0aGlzLmdldFJlbmRlcmVyKCkuc2V0UmVuZGVyU3RhdGUoZnJhbWVCdWZmZXIsIHZpZXdwb3J0KTtcbiAgICB0aGlzLmdldFJlbmRlcmVyKCkuZHJhd01vZGVsKCk7XG4gIH1cblxuICAvKipcbiAgICog44Oi44OH44Or44KS5o+P55S744GZ44KL5Yem55CG44CC44Oi44OH44Or44KS5o+P55S744GZ44KL56m66ZaT44GuVmlldy1Qcm9qZWN0aW9u6KGM5YiX44KS5rih44GZ44CCXG4gICAqL1xuICBwdWJsaWMgZHJhdyhtYXRyaXg6IEN1YmlzbU1hdHJpeDQ0KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX21vZGVsID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlkIToqq3jgb/ovrzjgb/ntYLkuoblvoxcbiAgICBpZiAodGhpcy5fc3RhdGUgPT0gTG9hZFN0ZXAuQ29tcGxldGVTZXR1cCkge1xuICAgICAgbWF0cml4Lm11bHRpcGx5QnlNYXRyaXgodGhpcy5fbW9kZWxNYXRyaXgpO1xuXG4gICAgICB0aGlzLmdldFJlbmRlcmVyKCkuc2V0TXZwTWF0cml4KG1hdHJpeCk7XG5cbiAgICAgIHRoaXMuZG9EcmF3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgKi9cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9tb2RlbFNldHRpbmcgPSBudWxsO1xuICAgIHRoaXMuX21vZGVsSG9tZURpciA9IG51bGw7XG4gICAgdGhpcy5fdXNlclRpbWVTZWNvbmRzID0gMC4wO1xuXG4gICAgdGhpcy5fZXllQmxpbmtJZHMgPSBuZXcgY3NtVmVjdG9yPEN1YmlzbUlkSGFuZGxlPigpO1xuICAgIHRoaXMuX2xpcFN5bmNJZHMgPSBuZXcgY3NtVmVjdG9yPEN1YmlzbUlkSGFuZGxlPigpO1xuXG4gICAgdGhpcy5fbW90aW9ucyA9IG5ldyBjc21NYXA8c3RyaW5nLCBBQ3ViaXNtTW90aW9uPigpO1xuICAgIHRoaXMuX2V4cHJlc3Npb25zID0gbmV3IGNzbU1hcDxzdHJpbmcsIEFDdWJpc21Nb3Rpb24+KCk7XG5cbiAgICB0aGlzLl9oaXRBcmVhID0gbmV3IGNzbVZlY3Rvcjxjc21SZWN0PigpO1xuICAgIHRoaXMuX3VzZXJBcmVhID0gbmV3IGNzbVZlY3Rvcjxjc21SZWN0PigpO1xuXG4gICAgdGhpcy5faWRQYXJhbUFuZ2xlWCA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUFuZ2xlWFxuICAgICk7XG4gICAgdGhpcy5faWRQYXJhbUFuZ2xlWSA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUFuZ2xlWVxuICAgICk7XG4gICAgdGhpcy5faWRQYXJhbUFuZ2xlWiA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUFuZ2xlWlxuICAgICk7XG4gICAgdGhpcy5faWRQYXJhbUV5ZUJhbGxYID0gQ3ViaXNtRnJhbWV3b3JrLmdldElkTWFuYWdlcigpLmdldElkKFxuICAgICAgQ3ViaXNtRGVmYXVsdFBhcmFtZXRlcklkLlBhcmFtRXllQmFsbFhcbiAgICApO1xuICAgIHRoaXMuX2lkUGFyYW1FeWVCYWxsWSA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUV5ZUJhbGxZXG4gICAgKTtcbiAgICB0aGlzLl9pZFBhcmFtQm9keUFuZ2xlWCA9IEN1YmlzbUZyYW1ld29yay5nZXRJZE1hbmFnZXIoKS5nZXRJZChcbiAgICAgIEN1YmlzbURlZmF1bHRQYXJhbWV0ZXJJZC5QYXJhbUJvZHlBbmdsZVhcbiAgICApO1xuXG4gICAgdGhpcy5fc3RhdGUgPSBMb2FkU3RlcC5Mb2FkQXNzZXRzO1xuICAgIHRoaXMuX2V4cHJlc3Npb25Db3VudCA9IDA7XG4gICAgdGhpcy5fdGV4dHVyZUNvdW50ID0gMDtcbiAgICB0aGlzLl9tb3Rpb25Db3VudCA9IDA7XG4gICAgdGhpcy5fYWxsTW90aW9uQ291bnQgPSAwO1xuICB9XG5cbiAgX21vZGVsU2V0dGluZzogSUN1YmlzbU1vZGVsU2V0dGluZzsgLy8g44Oi44OH44Or44K744OD44OG44Kj44Oz44Kw5oOF5aCxXG4gIF9tb2RlbEhvbWVEaXI6IHN0cmluZzsgLy8g44Oi44OH44Or44K744OD44OG44Kj44Oz44Kw44GM572u44GL44KM44Gf44OH44Kj44Os44Kv44OI44OqXG4gIF91c2VyVGltZVNlY29uZHM6IG51bWJlcjsgLy8g44OH44Or44K/5pmC6ZaT44Gu56mN566X5YCkW+enkl1cblxuICBfZXllQmxpbmtJZHM6IGNzbVZlY3RvcjxDdWJpc21JZEhhbmRsZT47IC8vIOODouODh+ODq+OBq+ioreWumuOBleOCjOOBn+eerOOBjeapn+iDveeUqOODkeODqeODoeODvOOCv0lEXG4gIF9saXBTeW5jSWRzOiBjc21WZWN0b3I8Q3ViaXNtSWRIYW5kbGU+OyAvLyDjg6Ljg4fjg6vjgavoqK3lrprjgZXjgozjgZ/jg6rjg4Pjg5fjgrfjg7Pjgq/mqZ/og73nlKjjg5Hjg6njg6Hjg7zjgr9JRFxuXG4gIF9tb3Rpb25zOiBjc21NYXA8c3RyaW5nLCBBQ3ViaXNtTW90aW9uPjsgLy8g6Kqt44G/6L6844G+44KM44Gm44GE44KL44Oi44O844K344On44Oz44Gu44Oq44K544OIXG4gIF9leHByZXNzaW9uczogY3NtTWFwPHN0cmluZywgQUN1YmlzbU1vdGlvbj47IC8vIOiqreOBv+i+vOOBvuOCjOOBpuOBhOOCi+ihqOaDheOBruODquOCueODiFxuXG4gIF9oaXRBcmVhOiBjc21WZWN0b3I8Y3NtUmVjdD47XG4gIF91c2VyQXJlYTogY3NtVmVjdG9yPGNzbVJlY3Q+O1xuXG4gIF9pZFBhcmFtQW5nbGVYOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtQW5nbGVYXG4gIF9pZFBhcmFtQW5nbGVZOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtQW5nbGVZXG4gIF9pZFBhcmFtQW5nbGVaOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtQW5nbGVaXG4gIF9pZFBhcmFtRXllQmFsbFg6IEN1YmlzbUlkSGFuZGxlOyAvLyDjg5Hjg6njg6Hjg7zjgr9JRDogUGFyYW1FeWVCYWxsWFxuICBfaWRQYXJhbUV5ZUJhbGxZOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtRXllQkFsbFlcbiAgX2lkUGFyYW1Cb2R5QW5nbGVYOiBDdWJpc21JZEhhbmRsZTsgLy8g44OR44Op44Oh44O844K/SUQ6IFBhcmFtQm9keUFuZ2xlWFxuXG4gIF9zdGF0ZTogbnVtYmVyOyAvLyDnj77lnKjjga7jgrnjg4bjg7zjgr/jgrnnrqHnkIbnlKhcbiAgX2V4cHJlc3Npb25Db3VudDogbnVtYmVyOyAvLyDooajmg4Xjg4fjg7zjgr/jgqvjgqbjg7Pjg4hcbiAgX3RleHR1cmVDb3VudDogbnVtYmVyOyAvLyDjg4bjgq/jgrnjg4Hjg6Pjgqvjgqbjg7Pjg4hcbiAgX21vdGlvbkNvdW50OiBudW1iZXI7IC8vIOODouODvOOCt+ODp+ODs+ODh+ODvOOCv+OCq+OCpuODs+ODiFxuICBfYWxsTW90aW9uQ291bnQ6IG51bWJlcjsgLy8g44Oi44O844K344On44Oz57eP5pWwXG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBnbCwgY2FudmFzIH0gZnJvbSAnLi9sYXBwZGVsZWdhdGUnO1xuXG4vKipcbiAqIOOCueODl+ODqeOCpOODiOOCkuWun+ijheOBmeOCi+OCr+ODqeOCuVxuICpcbiAqIOODhuOCr+OCueODgeODo++8qe+8pOOAgVJlY3Tjga7nrqHnkIZcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBTcHJpdGUge1xuICAvKipcbiAgICog44Kz44Oz44K544OI44Op44Kv44K/XG4gICAqIEBwYXJhbSB4ICAgICAgICAgICAgeOW6p+aomVxuICAgKiBAcGFyYW0geSAgICAgICAgICAgIHnluqfmqJlcbiAgICogQHBhcmFtIHdpZHRoICAgICAgICDmqKrluYVcbiAgICogQHBhcmFtIGhlaWdodCAgICAgICDpq5jjgZVcbiAgICogQHBhcmFtIHRleHR1cmVJZCAgICDjg4bjgq/jgrnjg4Hjg6NcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHg6IG51bWJlcixcbiAgICB5OiBudW1iZXIsXG4gICAgd2lkdGg6IG51bWJlcixcbiAgICBoZWlnaHQ6IG51bWJlcixcbiAgICB0ZXh0dXJlSWQ6IFdlYkdMVGV4dHVyZVxuICApIHtcbiAgICB0aGlzLl9yZWN0ID0gbmV3IFJlY3QoKTtcbiAgICB0aGlzLl9yZWN0LmxlZnQgPSB4IC0gd2lkdGggKiAwLjU7XG4gICAgdGhpcy5fcmVjdC5yaWdodCA9IHggKyB3aWR0aCAqIDAuNTtcbiAgICB0aGlzLl9yZWN0LnVwID0geSArIGhlaWdodCAqIDAuNTtcbiAgICB0aGlzLl9yZWN0LmRvd24gPSB5IC0gaGVpZ2h0ICogMC41O1xuICAgIHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlSWQ7XG4gICAgdGhpcy5fdmVydGV4QnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLl91dkJ1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5faW5kZXhCdWZmZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fcG9zaXRpb25Mb2NhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fdXZMb2NhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5fdGV4dHVyZUxvY2F0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuX3Bvc2l0aW9uQXJyYXkgPSBudWxsO1xuICAgIHRoaXMuX3V2QXJyYXkgPSBudWxsO1xuICAgIHRoaXMuX2luZGV4QXJyYXkgPSBudWxsO1xuXG4gICAgdGhpcy5fZmlyc3REcmF3ID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmlL7jgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIHRoaXMuX3JlY3QgPSBudWxsO1xuXG4gICAgZ2wuZGVsZXRlVGV4dHVyZSh0aGlzLl90ZXh0dXJlKTtcbiAgICB0aGlzLl90ZXh0dXJlID0gbnVsbDtcblxuICAgIGdsLmRlbGV0ZUJ1ZmZlcih0aGlzLl91dkJ1ZmZlcik7XG4gICAgdGhpcy5fdXZCdWZmZXIgPSBudWxsO1xuXG4gICAgZ2wuZGVsZXRlQnVmZmVyKHRoaXMuX3ZlcnRleEJ1ZmZlcik7XG4gICAgdGhpcy5fdmVydGV4QnVmZmVyID0gbnVsbDtcblxuICAgIGdsLmRlbGV0ZUJ1ZmZlcih0aGlzLl9pbmRleEJ1ZmZlcik7XG4gICAgdGhpcy5faW5kZXhCdWZmZXIgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOODhuOCr+OCueODgeODo+OCkui/lOOBmVxuICAgKi9cbiAgcHVibGljIGdldFRleHR1cmUoKTogV2ViR0xUZXh0dXJlIHtcbiAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmj4/nlLvjgZnjgovjgIJcbiAgICogQHBhcmFtIHByb2dyYW1JZCDjgrfjgqfjg7zjg4Djg7zjg5fjg63jgrDjg6njg6BcbiAgICogQHBhcmFtIGNhbnZhcyDmj4/nlLvjgZnjgovjgq3jg6Pjg7Pjg5Hjgrnmg4XloLFcbiAgICovXG4gIHB1YmxpYyByZW5kZXIocHJvZ3JhbUlkOiBXZWJHTFByb2dyYW0pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdGV4dHVyZSA9PSBudWxsKSB7XG4gICAgICAvLyDjg63jg7zjg4njgYzlrozkuobjgZfjgabjgYTjgarjgYRcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDliJ3lm57mj4/nlLvmmYJcbiAgICBpZiAodGhpcy5fZmlyc3REcmF3KSB7XG4gICAgICAvLyDkvZXnlarnm67jga5hdHRyaWJ1dGXlpInmlbDjgYvlj5blvpdcbiAgICAgIHRoaXMuX3Bvc2l0aW9uTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtSWQsICdwb3NpdGlvbicpO1xuICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fcG9zaXRpb25Mb2NhdGlvbik7XG5cbiAgICAgIHRoaXMuX3V2TG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtSWQsICd1dicpO1xuICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5fdXZMb2NhdGlvbik7XG5cbiAgICAgIC8vIOS9leeVquebruOBrnVuaWZvcm3lpInmlbDjgYvlj5blvpdcbiAgICAgIHRoaXMuX3RleHR1cmVMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihwcm9ncmFtSWQsICd0ZXh0dXJlJyk7XG5cbiAgICAgIC8vIHVuaWZvcm3lsZ7mgKfjga7nmbvpjLJcbiAgICAgIGdsLnVuaWZvcm0xaSh0aGlzLl90ZXh0dXJlTG9jYXRpb24sIDApO1xuXG4gICAgICAvLyB1duODkOODg+ODleOCoeOAgeW6p+aomeWIneacn+WMllxuICAgICAge1xuICAgICAgICB0aGlzLl91dkFycmF5ID0gbmV3IEZsb2F0MzJBcnJheShbXG4gICAgICAgICAgMS4wLFxuICAgICAgICAgIDAuMCxcbiAgICAgICAgICAwLjAsXG4gICAgICAgICAgMC4wLFxuICAgICAgICAgIDAuMCxcbiAgICAgICAgICAxLjAsXG4gICAgICAgICAgMS4wLFxuICAgICAgICAgIDEuMFxuICAgICAgICBdKTtcblxuICAgICAgICAvLyB1duODkOODg+ODleOCoeOCkuS9nOaIkFxuICAgICAgICB0aGlzLl91dkJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgfVxuXG4gICAgICAvLyDpoILngrnjg5Djg4Pjg5XjgqHjgIHluqfmqJnliJ3mnJ/ljJZcbiAgICAgIHtcbiAgICAgICAgY29uc3QgbWF4V2lkdGggPSBjYW52YXMud2lkdGg7XG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9IGNhbnZhcy5oZWlnaHQ7XG5cbiAgICAgICAgLy8g6aCC54K544OH44O844K/XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uQXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KFtcbiAgICAgICAgICAodGhpcy5fcmVjdC5yaWdodCAtIG1heFdpZHRoICogMC41KSAvIChtYXhXaWR0aCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QudXAgLSBtYXhIZWlnaHQgKiAwLjUpIC8gKG1heEhlaWdodCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QubGVmdCAtIG1heFdpZHRoICogMC41KSAvIChtYXhXaWR0aCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QudXAgLSBtYXhIZWlnaHQgKiAwLjUpIC8gKG1heEhlaWdodCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QubGVmdCAtIG1heFdpZHRoICogMC41KSAvIChtYXhXaWR0aCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QuZG93biAtIG1heEhlaWdodCAqIDAuNSkgLyAobWF4SGVpZ2h0ICogMC41KSxcbiAgICAgICAgICAodGhpcy5fcmVjdC5yaWdodCAtIG1heFdpZHRoICogMC41KSAvIChtYXhXaWR0aCAqIDAuNSksXG4gICAgICAgICAgKHRoaXMuX3JlY3QuZG93biAtIG1heEhlaWdodCAqIDAuNSkgLyAobWF4SGVpZ2h0ICogMC41KVxuICAgICAgICBdKTtcblxuICAgICAgICAvLyDpoILngrnjg5Djg4Pjg5XjgqHjgpLkvZzmiJBcbiAgICAgICAgdGhpcy5fdmVydGV4QnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIOmggueCueOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOAgeWIneacn+WMllxuICAgICAge1xuICAgICAgICAvLyDjgqTjg7Pjg4fjg4Pjgq/jgrnjg4fjg7zjgr9cbiAgICAgICAgdGhpcy5faW5kZXhBcnJheSA9IG5ldyBVaW50MTZBcnJheShbMCwgMSwgMiwgMywgMiwgMF0pO1xuXG4gICAgICAgIC8vIOOCpOODs+ODh+ODg+OCr+OCueODkOODg+ODleOCoeOCkuS9nOaIkFxuICAgICAgICB0aGlzLl9pbmRleEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9maXJzdERyYXcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBVVuW6p+aomeeZu+mMslxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl91dkJ1ZmZlcik7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHRoaXMuX3V2QXJyYXksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIGF0dHJpYnV0ZeWxnuaAp+OCkueZu+mMslxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5fdXZMb2NhdGlvbiwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIOmggueCueW6p+aomeOCkueZu+mMslxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl92ZXJ0ZXhCdWZmZXIpO1xuICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLl9wb3NpdGlvbkFycmF5LCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyBhdHRyaWJ1dGXlsZ7mgKfjgpLnmbvpjLJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuX3Bvc2l0aW9uTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLkvZzmiJBcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLl9pbmRleEJ1ZmZlcik7XG4gICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgdGhpcy5faW5kZXhBcnJheSwgZ2wuRFlOQU1JQ19EUkFXKTtcblxuICAgIC8vIOODouODh+ODq+OBruaPj+eUu1xuICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRoaXMuX3RleHR1cmUpO1xuICAgIGdsLmRyYXdFbGVtZW50cyhcbiAgICAgIGdsLlRSSUFOR0xFUyxcbiAgICAgIHRoaXMuX2luZGV4QXJyYXkubGVuZ3RoLFxuICAgICAgZ2wuVU5TSUdORURfU0hPUlQsXG4gICAgICAwXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlvZPjgZ/jgorliKTlrppcbiAgICogQHBhcmFtIHBvaW50WCB45bqn5qiZXG4gICAqIEBwYXJhbSBwb2ludFkgeeW6p+aomVxuICAgKi9cbiAgcHVibGljIGlzSGl0KHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIC8vIOeUu+mdouOCteOCpOOCuuOCkuWPluW+l+OBmeOCi+OAglxuICAgIGNvbnN0IHsgaGVpZ2h0IH0gPSBjYW52YXM7XG5cbiAgICAvLyBZ5bqn5qiZ44Gv5aSJ5o+b44GZ44KL5b+F6KaB44GC44KKXG4gICAgY29uc3QgeSA9IGhlaWdodCAtIHBvaW50WTtcblxuICAgIHJldHVybiAoXG4gICAgICBwb2ludFggPj0gdGhpcy5fcmVjdC5sZWZ0ICYmXG4gICAgICBwb2ludFggPD0gdGhpcy5fcmVjdC5yaWdodCAmJlxuICAgICAgeSA8PSB0aGlzLl9yZWN0LnVwICYmXG4gICAgICB5ID49IHRoaXMuX3JlY3QuZG93blxuICAgICk7XG4gIH1cblxuICBfdGV4dHVyZTogV2ViR0xUZXh0dXJlOyAvLyDjg4bjgq/jgrnjg4Hjg6NcbiAgX3ZlcnRleEJ1ZmZlcjogV2ViR0xCdWZmZXI7IC8vIOmggueCueODkOODg+ODleOCoVxuICBfdXZCdWZmZXI6IFdlYkdMQnVmZmVyOyAvLyB1dumggueCueODkOODg+ODleOCoVxuICBfaW5kZXhCdWZmZXI6IFdlYkdMQnVmZmVyOyAvLyDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnjg5Djg4Pjg5XjgqFcbiAgX3JlY3Q6IFJlY3Q7IC8vIOefqeW9olxuXG4gIF9wb3NpdGlvbkxvY2F0aW9uOiBudW1iZXI7XG4gIF91dkxvY2F0aW9uOiBudW1iZXI7XG4gIF90ZXh0dXJlTG9jYXRpb246IFdlYkdMVW5pZm9ybUxvY2F0aW9uO1xuXG4gIF9wb3NpdGlvbkFycmF5OiBGbG9hdDMyQXJyYXk7XG4gIF91dkFycmF5OiBGbG9hdDMyQXJyYXk7XG4gIF9pbmRleEFycmF5OiBVaW50MTZBcnJheTtcblxuICBfZmlyc3REcmF3OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgUmVjdCB7XG4gIHB1YmxpYyBsZWZ0OiBudW1iZXI7IC8vIOW3pui+ulxuICBwdWJsaWMgcmlnaHQ6IG51bWJlcjsgLy8g5Y+z6L66XG4gIHB1YmxpYyB1cDogbnVtYmVyOyAvLyDkuIrovrpcbiAgcHVibGljIGRvd246IG51bWJlcjsgLy8g5LiL6L66XG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtdmVjdG9yIH0gZnJvbSAnQGZyYW1ld29yay90eXBlL2NzbXZlY3Rvcic7XG5pbXBvcnQgQ3NtX2NzbVZlY3RvciA9IGNzbXZlY3Rvci5jc21WZWN0b3I7XG5pbXBvcnQgY3NtVmVjdG9yX2l0ZXJhdG9yID0gY3NtdmVjdG9yLml0ZXJhdG9yO1xuaW1wb3J0IHsgZ2wgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5cbi8qKlxuICog44OG44Kv44K544OB44Oj566h55CG44Kv44Op44K5XG4gKiDnlLvlg4/oqq3jgb/ovrzjgb/jgIHnrqHnkIbjgpLooYzjgYbjgq/jg6njgrnjgIJcbiAqL1xuZXhwb3J0IGNsYXNzIExBcHBUZXh0dXJlTWFuYWdlciB7XG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3RleHR1cmVzID0gbmV3IENzbV9jc21WZWN0b3I8VGV4dHVyZUluZm8+KCk7XG4gIH1cblxuICAvKipcbiAgICog6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZSgpOiB2b2lkIHtcbiAgICBmb3IgKFxuICAgICAgbGV0IGl0ZTogY3NtVmVjdG9yX2l0ZXJhdG9yPFRleHR1cmVJbmZvPiA9IHRoaXMuX3RleHR1cmVzLmJlZ2luKCk7XG4gICAgICBpdGUubm90RXF1YWwodGhpcy5fdGV4dHVyZXMuZW5kKCkpO1xuICAgICAgaXRlLnByZUluY3JlbWVudCgpXG4gICAgKSB7XG4gICAgICBnbC5kZWxldGVUZXh0dXJlKGl0ZS5wdHIoKS5pZCk7XG4gICAgfVxuICAgIHRoaXMuX3RleHR1cmVzID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/oqq3jgb/ovrzjgb9cbiAgICpcbiAgICogQHBhcmFtIGZpbGVOYW1lIOiqreOBv+i+vOOCgOeUu+WDj+ODleOCoeOCpOODq+ODkeOCueWQjVxuICAgKiBAcGFyYW0gdXNlUHJlbXVsdGlwbHkgUHJlbXVsdOWHpueQhuOCkuacieWKueOBq+OBmeOCi+OBi1xuICAgKiBAcmV0dXJuIOeUu+WDj+aDheWgseOAgeiqreOBv+i+vOOBv+WkseaVl+aZguOBr251bGzjgpLov5TjgZlcbiAgICovXG4gIHB1YmxpYyBjcmVhdGVUZXh0dXJlRnJvbVBuZ0ZpbGUoXG4gICAgZmlsZU5hbWU6IHN0cmluZyxcbiAgICB1c2VQcmVtdWx0aXBseTogYm9vbGVhbixcbiAgICBjYWxsYmFjazogKHRleHR1cmVJbmZvOiBUZXh0dXJlSW5mbykgPT4gdm9pZFxuICApOiB2b2lkIHtcbiAgICAvLyBzZWFyY2ggbG9hZGVkIHRleHR1cmUgYWxyZWFkeVxuICAgIGZvciAoXG4gICAgICBsZXQgaXRlOiBjc21WZWN0b3JfaXRlcmF0b3I8VGV4dHVyZUluZm8+ID0gdGhpcy5fdGV4dHVyZXMuYmVnaW4oKTtcbiAgICAgIGl0ZS5ub3RFcXVhbCh0aGlzLl90ZXh0dXJlcy5lbmQoKSk7XG4gICAgICBpdGUucHJlSW5jcmVtZW50KClcbiAgICApIHtcbiAgICAgIGlmIChcbiAgICAgICAgaXRlLnB0cigpLmZpbGVOYW1lID09IGZpbGVOYW1lICYmXG4gICAgICAgIGl0ZS5wdHIoKS51c2VQcmVtdWx0cGx5ID09IHVzZVByZW11bHRpcGx5XG4gICAgICApIHtcbiAgICAgICAgLy8gMuWbnuebruS7pemZjeOBr+OCreODo+ODg+OCt+ODpeOBjOS9v+eUqOOBleOCjOOCiyjlvoXjgaHmmYLplpPjgarjgZcpXG4gICAgICAgIC8vIFdlYktpdOOBp+OBr+WQjOOBmEltYWdl44Gub25sb2Fk44KS5YaN5bqm5ZG844G244Gr44Gv5YaN44Kk44Oz44K544K/44Oz44K544GM5b+F6KaBXG4gICAgICAgIC8vIOips+e0sO+8mmh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS81MDI0MTgxXG4gICAgICAgIGl0ZS5wdHIoKS5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaXRlLnB0cigpLmltZy5vbmxvYWQgPSAoKTogdm9pZCA9PiBjYWxsYmFjayhpdGUucHRyKCkpO1xuICAgICAgICBpdGUucHRyKCkuaW1nLnNyYyA9IGZpbGVOYW1lO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g44OH44O844K/44Gu44Kq44Oz44Ot44O844OJ44KS44OI44Oq44Ks44O844Gr44GZ44KLXG4gICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLm9ubG9hZCA9ICgpOiB2b2lkID0+IHtcbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxuICAgICAgY29uc3QgdGV4OiBXZWJHTFRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cbiAgICAgIC8vIOODhuOCr+OCueODgeODo+OCkumBuOaKnlxuICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4KTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44Gr44OU44Kv44K744Or44KS5pu444GN6L6844KAXG4gICAgICBnbC50ZXhQYXJhbWV0ZXJpKFxuICAgICAgICBnbC5URVhUVVJFXzJELFxuICAgICAgICBnbC5URVhUVVJFX01JTl9GSUxURVIsXG4gICAgICAgIGdsLkxJTkVBUl9NSVBNQVBfTElORUFSXG4gICAgICApO1xuICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XG5cbiAgICAgIC8vIFByZW11bHTlh6bnkIbjgpLooYzjgo/jgZvjgotcbiAgICAgIGlmICh1c2VQcmVtdWx0aXBseSkge1xuICAgICAgICBnbC5waXhlbFN0b3JlaShnbC5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIDEpO1xuICAgICAgfVxuXG4gICAgICAvLyDjg4bjgq/jgrnjg4Hjg6Pjgavjg5Tjgq/jgrvjg6vjgpLmm7jjgY3ovrzjgoBcbiAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1nKTtcblxuICAgICAgLy8g44Of44OD44OX44Oe44OD44OX44KS55Sf5oiQXG4gICAgICBnbC5nZW5lcmF0ZU1pcG1hcChnbC5URVhUVVJFXzJEKTtcblxuICAgICAgLy8g44OG44Kv44K544OB44Oj44KS44OQ44Kk44Oz44OJXG4gICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBudWxsKTtcblxuICAgICAgY29uc3QgdGV4dHVyZUluZm86IFRleHR1cmVJbmZvID0gbmV3IFRleHR1cmVJbmZvKCk7XG4gICAgICBpZiAodGV4dHVyZUluZm8gIT0gbnVsbCkge1xuICAgICAgICB0ZXh0dXJlSW5mby5maWxlTmFtZSA9IGZpbGVOYW1lO1xuICAgICAgICB0ZXh0dXJlSW5mby53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgdGV4dHVyZUluZm8uaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICAgICAgdGV4dHVyZUluZm8uaWQgPSB0ZXg7XG4gICAgICAgIHRleHR1cmVJbmZvLmltZyA9IGltZztcbiAgICAgICAgdGV4dHVyZUluZm8udXNlUHJlbXVsdHBseSA9IHVzZVByZW11bHRpcGx5O1xuICAgICAgICB0aGlzLl90ZXh0dXJlcy5wdXNoQmFjayh0ZXh0dXJlSW5mbyk7XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKHRleHR1cmVJbmZvKTtcbiAgICB9O1xuICAgIGltZy5zcmMgPSBmaWxlTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/jga7op6PmlL5cbiAgICpcbiAgICog6YWN5YiX44Gr5a2Y5Zyo44GZ44KL55S75YOP5YWo44Gm44KS6Kej5pS+44GZ44KL44CCXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZVRleHR1cmVzKCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGV4dHVyZXMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIHRoaXMuX3RleHR1cmVzLnNldChpLCBudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLl90ZXh0dXJlcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOeUu+WDj+OBruino+aUvlxuICAgKlxuICAgKiDmjIflrprjgZfjgZ/jg4bjgq/jgrnjg4Hjg6Pjga7nlLvlg4/jgpLop6PmlL7jgZnjgovjgIJcbiAgICogQHBhcmFtIHRleHR1cmUg6Kej5pS+44GZ44KL44OG44Kv44K544OB44OjXG4gICAqL1xuICBwdWJsaWMgcmVsZWFzZVRleHR1cmVCeVRleHR1cmUodGV4dHVyZTogV2ViR0xUZXh0dXJlKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZXh0dXJlcy5nZXRTaXplKCk7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX3RleHR1cmVzLmF0KGkpLmlkICE9IHRleHR1cmUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RleHR1cmVzLnNldChpLCBudWxsKTtcbiAgICAgIHRoaXMuX3RleHR1cmVzLnJlbW92ZShpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/jga7op6PmlL5cbiAgICpcbiAgICog5oyH5a6a44GX44Gf5ZCN5YmN44Gu55S75YOP44KS6Kej5pS+44GZ44KL44CCXG4gICAqIEBwYXJhbSBmaWxlTmFtZSDop6PmlL7jgZnjgovnlLvlg4/jg5XjgqHjgqTjg6vjg5HjgrnlkI1cbiAgICovXG4gIHB1YmxpYyByZWxlYXNlVGV4dHVyZUJ5RmlsZVBhdGgoZmlsZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGV4dHVyZXMuZ2V0U2l6ZSgpOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLl90ZXh0dXJlcy5hdChpKS5maWxlTmFtZSA9PSBmaWxlTmFtZSkge1xuICAgICAgICB0aGlzLl90ZXh0dXJlcy5zZXQoaSwgbnVsbCk7XG4gICAgICAgIHRoaXMuX3RleHR1cmVzLnJlbW92ZShpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3RleHR1cmVzOiBDc21fY3NtVmVjdG9yPFRleHR1cmVJbmZvPjtcbn1cblxuLyoqXG4gKiDnlLvlg4/mg4XloLHmp4vpgKDkvZNcbiAqL1xuZXhwb3J0IGNsYXNzIFRleHR1cmVJbmZvIHtcbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50OyAvLyDnlLvlg49cbiAgaWQ6IFdlYkdMVGV4dHVyZSA9IG51bGw7IC8vIOODhuOCr+OCueODgeODo1xuICB3aWR0aCA9IDA7IC8vIOaoquW5hVxuICBoZWlnaHQgPSAwOyAvLyDpq5jjgZVcbiAgdXNlUHJlbXVsdHBseTogYm9vbGVhbjsgLy8gUHJlbXVsdOWHpueQhuOCkuacieWKueOBq+OBmeOCi+OBi1xuICBmaWxlTmFtZTogc3RyaW5nOyAvLyDjg5XjgqHjgqTjg6vlkI1cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21NYXRyaXg0NCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtdmlld21hdHJpeCB9IGZyb20gJ0BmcmFtZXdvcmsvbWF0aC9jdWJpc212aWV3bWF0cml4JztcbmltcG9ydCBDc21fQ3ViaXNtVmlld01hdHJpeCA9IGN1YmlzbXZpZXdtYXRyaXguQ3ViaXNtVmlld01hdHJpeDtcbmltcG9ydCBDc21fQ3ViaXNtTWF0cml4NDQgPSBjdWJpc21NYXRyaXg0NC5DdWJpc21NYXRyaXg0NDtcbmltcG9ydCB7IFRvdWNoTWFuYWdlciB9IGZyb20gJy4vdG91Y2htYW5hZ2VyJztcbmltcG9ydCB7IExBcHBMaXZlMkRNYW5hZ2VyIH0gZnJvbSAnLi9sYXBwbGl2ZTJkbWFuYWdlcic7XG5pbXBvcnQgeyBMQXBwRGVsZWdhdGUsIGNhbnZhcywgZ2wgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5pbXBvcnQgeyBMQXBwU3ByaXRlIH0gZnJvbSAnLi9sYXBwc3ByaXRlJztcbmltcG9ydCB7IFRleHR1cmVJbmZvIH0gZnJvbSAnLi9sYXBwdGV4dHVyZW1hbmFnZXInO1xuaW1wb3J0IHsgTEFwcFBhbCB9IGZyb20gJy4vbGFwcHBhbCc7XG5pbXBvcnQgKiBhcyBMQXBwRGVmaW5lIGZyb20gJy4vbGFwcGRlZmluZSc7XG5cbi8qKlxuICog5o+P55S744Kv44Op44K544CCXG4gKi9cbmV4cG9ydCBjbGFzcyBMQXBwVmlldyB7XG4gIC8qKlxuICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Byb2dyYW1JZCA9IG51bGw7XG4gICAgdGhpcy5fYmFjayA9IG51bGw7XG4gICAgdGhpcy5fZ2VhciA9IG51bGw7XG5cbiAgICAvLyDjgr/jg4Pjg4HplqLkv4Ljga7jgqTjg5njg7Pjg4jnrqHnkIZcbiAgICB0aGlzLl90b3VjaE1hbmFnZXIgPSBuZXcgVG91Y2hNYW5hZ2VyKCk7XG5cbiAgICAvLyDjg4fjg5DjgqTjgrnluqfmqJnjgYvjgonjgrnjgq/jg6rjg7zjg7PluqfmqJnjgavlpInmj5vjgZnjgovjgZ/jgoHjga5cbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbiA9IG5ldyBDc21fQ3ViaXNtTWF0cml4NDQoKTtcblxuICAgIC8vIOeUu+mdouOBruihqOekuuOBruaLoeWkp+e4ruWwj+OChOenu+WLleOBruWkieaPm+OCkuihjOOBhuihjOWIl1xuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBuZXcgQ3NtX0N1YmlzbVZpZXdNYXRyaXgoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDliJ3mnJ/ljJbjgZnjgovjgIJcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gY2FudmFzO1xuXG4gICAgY29uc3QgcmF0aW86IG51bWJlciA9IGhlaWdodCAvIHdpZHRoO1xuICAgIGNvbnN0IGxlZnQ6IG51bWJlciA9IExBcHBEZWZpbmUuVmlld0xvZ2ljYWxMZWZ0O1xuICAgIGNvbnN0IHJpZ2h0OiBudW1iZXIgPSBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsUmlnaHQ7XG4gICAgY29uc3QgYm90dG9tOiBudW1iZXIgPSAtcmF0aW87XG4gICAgY29uc3QgdG9wOiBudW1iZXIgPSByYXRpbztcblxuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0U2NyZWVuUmVjdChsZWZ0LCByaWdodCwgYm90dG9tLCB0b3ApOyAvLyDjg4fjg5DjgqTjgrnjgavlr77lv5zjgZnjgovnlLvpnaLjga7nr4Tlm7LjgIIgWOOBruW3puerr+OAgVjjga7lj7Pnq6/jgIFZ44Gu5LiL56uv44CBWeOBruS4iuerr1xuXG4gICAgY29uc3Qgc2NyZWVuVzogbnVtYmVyID0gTWF0aC5hYnMobGVmdCAtIHJpZ2h0KTtcbiAgICB0aGlzLl9kZXZpY2VUb1NjcmVlbi5zY2FsZVJlbGF0aXZlKHNjcmVlblcgLyB3aWR0aCwgLXNjcmVlblcgLyB3aWR0aCk7XG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNsYXRlUmVsYXRpdmUoLXdpZHRoICogMC41LCAtaGVpZ2h0ICogMC41KTtcblxuICAgIC8vIOihqOekuuevhOWbsuOBruioreWumlxuICAgIHRoaXMuX3ZpZXdNYXRyaXguc2V0TWF4U2NhbGUoTEFwcERlZmluZS5WaWV3TWF4U2NhbGUpOyAvLyDpmZDnlYzmi6HlvLXnjodcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldE1pblNjYWxlKExBcHBEZWZpbmUuVmlld01pblNjYWxlKTsgLy8g6ZmQ55WM57iu5bCP546HXG5cbiAgICAvLyDooajnpLrjgafjgY3jgovmnIDlpKfnr4Tlm7JcbiAgICB0aGlzLl92aWV3TWF0cml4LnNldE1heFNjcmVlblJlY3QoXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4TGVmdCxcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhSaWdodCxcbiAgICAgIExBcHBEZWZpbmUuVmlld0xvZ2ljYWxNYXhCb3R0b20sXG4gICAgICBMQXBwRGVmaW5lLlZpZXdMb2dpY2FsTWF4VG9wXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDop6PmlL7jgZnjgotcbiAgICovXG4gIHB1YmxpYyByZWxlYXNlKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZpZXdNYXRyaXggPSBudWxsO1xuICAgIHRoaXMuX3RvdWNoTWFuYWdlciA9IG51bGw7XG4gICAgdGhpcy5fZGV2aWNlVG9TY3JlZW4gPSBudWxsO1xuXG4gICAgdGhpcy5fZ2Vhci5yZWxlYXNlKCk7XG4gICAgdGhpcy5fZ2VhciA9IG51bGw7XG5cbiAgICB0aGlzLl9iYWNrLnJlbGVhc2UoKTtcbiAgICB0aGlzLl9iYWNrID0gbnVsbDtcblxuICAgIGdsLmRlbGV0ZVByb2dyYW0odGhpcy5fcHJvZ3JhbUlkKTtcbiAgICB0aGlzLl9wcm9ncmFtSWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIOaPj+eUu+OBmeOCi+OAglxuICAgKi9cbiAgcHVibGljIHJlbmRlcigpOiB2b2lkIHtcbiAgICBnbC51c2VQcm9ncmFtKHRoaXMuX3Byb2dyYW1JZCk7XG5cbiAgICBpZiAodGhpcy5fYmFjaykge1xuICAgICAgdGhpcy5fYmFjay5yZW5kZXIodGhpcy5fcHJvZ3JhbUlkKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2dlYXIpIHtcbiAgICAgIHRoaXMuX2dlYXIucmVuZGVyKHRoaXMuX3Byb2dyYW1JZCk7XG4gICAgfVxuXG4gICAgZ2wuZmx1c2goKTtcblxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuICAgIGxpdmUyRE1hbmFnZXIub25VcGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlLvlg4/jga7liJ3mnJ/ljJbjgpLooYzjgYbjgIJcbiAgICovXG4gIHB1YmxpYyBpbml0aWFsaXplU3ByaXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IHdpZHRoOiBudW1iZXIgPSBjYW52YXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0OiBudW1iZXIgPSBjYW52YXMuaGVpZ2h0O1xuXG4gICAgY29uc3QgdGV4dHVyZU1hbmFnZXIgPSBMQXBwRGVsZWdhdGUuZ2V0SW5zdGFuY2UoKS5nZXRUZXh0dXJlTWFuYWdlcigpO1xuICAgIGNvbnN0IHJlc291cmNlc1BhdGggPSBMQXBwRGVmaW5lLlJlc291cmNlc1BhdGg7XG5cbiAgICBsZXQgaW1hZ2VOYW1lID0gJyc7XG5cbiAgICAvLyDog4zmma/nlLvlg4/liJ3mnJ/ljJZcbiAgICBpbWFnZU5hbWUgPSBMQXBwRGVmaW5lLkJhY2tJbWFnZU5hbWU7XG5cbiAgICAvLyDpnZ7lkIzmnJ/jgarjga7jgafjgrPjg7zjg6vjg5Djg4Pjgq/plqLmlbDjgpLkvZzmiJBcbiAgICBjb25zdCBpbml0QmFja0dyb3VuZFRleHR1cmUgPSAodGV4dHVyZUluZm86IFRleHR1cmVJbmZvKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB4OiBudW1iZXIgPSB3aWR0aCAqIDAuNTtcbiAgICAgIGNvbnN0IHk6IG51bWJlciA9IGhlaWdodCAqIDAuNTtcblxuICAgICAgY29uc3QgZndpZHRoID0gdGV4dHVyZUluZm8ud2lkdGggKiAyLjA7XG4gICAgICBjb25zdCBmaGVpZ2h0ID0gaGVpZ2h0ICogMC45NTtcbiAgICAgIHRoaXMuX2JhY2sgPSBuZXcgTEFwcFNwcml0ZSh4LCB5LCBmd2lkdGgsIGZoZWlnaHQsIHRleHR1cmVJbmZvLmlkKTtcbiAgICB9O1xuXG4gICAgLy8gdGV4dHVyZU1hbmFnZXIuY3JlYXRlVGV4dHVyZUZyb21QbmdGaWxlKFxuICAgIC8vICAgcmVzb3VyY2VzUGF0aCArIGltYWdlTmFtZSxcbiAgICAvLyAgIGZhbHNlLFxuICAgIC8vICAgaW5pdEJhY2tHcm91bmRUZXh0dXJlXG4gICAgLy8gKTtcblxuICAgIC8vIOatr+i7iueUu+WDj+WIneacn+WMllxuICAgIGltYWdlTmFtZSA9IExBcHBEZWZpbmUuR2VhckltYWdlTmFtZTtcbiAgICBjb25zdCBpbml0R2VhclRleHR1cmUgPSAodGV4dHVyZUluZm86IFRleHR1cmVJbmZvKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB4ID0gd2lkdGggLSB0ZXh0dXJlSW5mby53aWR0aCAqIDAuNTtcbiAgICAgIGNvbnN0IHkgPSBoZWlnaHQgLSB0ZXh0dXJlSW5mby5oZWlnaHQgKiAwLjU7XG4gICAgICBjb25zdCBmd2lkdGggPSB0ZXh0dXJlSW5mby53aWR0aDtcbiAgICAgIGNvbnN0IGZoZWlnaHQgPSB0ZXh0dXJlSW5mby5oZWlnaHQ7XG4gICAgICB0aGlzLl9nZWFyID0gbmV3IExBcHBTcHJpdGUoeCwgeSwgZndpZHRoLCBmaGVpZ2h0LCB0ZXh0dXJlSW5mby5pZCk7XG4gICAgfTtcblxuICAgIHRleHR1cmVNYW5hZ2VyLmNyZWF0ZVRleHR1cmVGcm9tUG5nRmlsZShcbiAgICAgIHJlc291cmNlc1BhdGggKyBpbWFnZU5hbWUsXG4gICAgICBmYWxzZSxcbiAgICAgIGluaXRHZWFyVGV4dHVyZVxuICAgICk7XG5cbiAgICAvLyDjgrfjgqfjg7zjg4Djg7zjgpLkvZzmiJBcbiAgICBpZiAodGhpcy5fcHJvZ3JhbUlkID09IG51bGwpIHtcbiAgICAgIHRoaXMuX3Byb2dyYW1JZCA9IExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLmNyZWF0ZVNoYWRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDjgr/jg4Pjg4HjgZXjgozjgZ/mmYLjgavlkbzjgbDjgozjgovjgIJcbiAgICpcbiAgICogQHBhcmFtIHBvaW50WCDjgrnjgq/jg6rjg7zjg7NY5bqn5qiZXG4gICAqIEBwYXJhbSBwb2ludFkg44K544Kv44Oq44O844OzWeW6p+aomVxuICAgKi9cbiAgcHVibGljIG9uVG91Y2hlc0JlZ2FuKHBvaW50WDogbnVtYmVyLCBwb2ludFk6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuX3RvdWNoTWFuYWdlci50b3VjaGVzQmVnYW4ocG9pbnRYLCBwb2ludFkpO1xuICB9XG5cbiAgLyoqXG4gICAqIOOCv+ODg+ODgeOBl+OBpuOBhOOCi+OBqOOBjeOBq+ODneOCpOODs+OCv+OBjOWLleOBhOOBn+OCieWRvOOBsOOCjOOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIOOCueOCr+ODquODvOODs1jluqfmqJlcbiAgICogQHBhcmFtIHBvaW50WSDjgrnjgq/jg6rjg7zjg7NZ5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzTW92ZWQocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3Qgdmlld1g6IG51bWJlciA9IHRoaXMudHJhbnNmb3JtVmlld1godGhpcy5fdG91Y2hNYW5hZ2VyLmdldFgoKSk7XG4gICAgY29uc3Qgdmlld1k6IG51bWJlciA9IHRoaXMudHJhbnNmb3JtVmlld1kodGhpcy5fdG91Y2hNYW5hZ2VyLmdldFkoKSk7XG5cbiAgICB0aGlzLl90b3VjaE1hbmFnZXIudG91Y2hlc01vdmVkKHBvaW50WCwgcG9pbnRZKTtcblxuICAgIGNvbnN0IGxpdmUyRE1hbmFnZXI6IExBcHBMaXZlMkRNYW5hZ2VyID0gTEFwcExpdmUyRE1hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICBsaXZlMkRNYW5hZ2VyLm9uRHJhZyh2aWV3WCwgdmlld1kpO1xuICB9XG5cbiAgLyoqXG4gICAqIOOCv+ODg+ODgeOBjOe1guS6huOBl+OBn+OCieWRvOOBsOOCjOOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gcG9pbnRYIOOCueOCr+ODquODvOODs1jluqfmqJlcbiAgICogQHBhcmFtIHBvaW50WSDjgrnjgq/jg6rjg7zjg7NZ5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgb25Ub3VjaGVzRW5kZWQocG9pbnRYOiBudW1iZXIsIHBvaW50WTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8g44K/44OD44OB57WC5LqGXG4gICAgY29uc3QgbGl2ZTJETWFuYWdlcjogTEFwcExpdmUyRE1hbmFnZXIgPSBMQXBwTGl2ZTJETWFuYWdlci5nZXRJbnN0YW5jZSgpO1xuICAgIGxpdmUyRE1hbmFnZXIub25EcmFnKDAuMCwgMC4wKTtcblxuICAgIHtcbiAgICAgIC8vIOOCt+ODs+OCsOODq+OCv+ODg+ODl1xuICAgICAgY29uc3QgeDogbnVtYmVyID0gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWChcbiAgICAgICAgdGhpcy5fdG91Y2hNYW5hZ2VyLmdldFgoKVxuICAgICAgKTsgLy8g6KuW55CG5bqn5qiZ5aSJ5o+b44GX44Gf5bqn5qiZ44KS5Y+W5b6X44CCXG4gICAgICBjb25zdCB5OiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1ZKFxuICAgICAgICB0aGlzLl90b3VjaE1hbmFnZXIuZ2V0WSgpXG4gICAgICApOyAvLyDoq5bnkIbluqfmqJnlpInljJbjgZfjgZ/luqfmqJnjgpLlj5blvpfjgIJcblxuICAgICAgaWYgKExBcHBEZWZpbmUuRGVidWdUb3VjaExvZ0VuYWJsZSkge1xuICAgICAgICBMQXBwUGFsLnByaW50TWVzc2FnZShgW0FQUF10b3VjaGVzRW5kZWQgeDogJHt4fSB5OiAke3l9YCk7XG4gICAgICB9XG4gICAgICBsaXZlMkRNYW5hZ2VyLm9uVGFwKHgsIHkpO1xuXG4gICAgICAvLyDmra/ou4rjgavjgr/jg4Pjg5fjgZfjgZ/jgYtcbiAgICAgIGlmICh0aGlzLl9nZWFyLmlzSGl0KHBvaW50WCwgcG9pbnRZKSkge1xuICAgICAgICBsaXZlMkRNYW5hZ2VyLm5leHRTY2VuZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBY5bqn5qiZ44KSVmlld+W6p+aomeOBq+WkieaPm+OBmeOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gZGV2aWNlWCDjg4fjg5DjgqTjgrlY5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtVmlld1goZGV2aWNlWDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBzY3JlZW5YOiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1YKGRldmljZVgpOyAvLyDoq5bnkIbluqfmqJnlpInmj5vjgZfjgZ/luqfmqJnjgpLlj5blvpfjgIJcbiAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeC5pbnZlcnRUcmFuc2Zvcm1YKHNjcmVlblgpOyAvLyDmi6HlpKfjgIHnuK7lsI/jgIHnp7vli5Xlvozjga7lgKTjgIJcbiAgfVxuXG4gIC8qKlxuICAgKiBZ5bqn5qiZ44KSVmlld+W6p+aomeOBq+WkieaPm+OBmeOCi+OAglxuICAgKlxuICAgKiBAcGFyYW0gZGV2aWNlWSDjg4fjg5DjgqTjgrlZ5bqn5qiZXG4gICAqL1xuICBwdWJsaWMgdHJhbnNmb3JtVmlld1koZGV2aWNlWTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBzY3JlZW5ZOiBudW1iZXIgPSB0aGlzLl9kZXZpY2VUb1NjcmVlbi50cmFuc2Zvcm1ZKGRldmljZVkpOyAvLyDoq5bnkIbluqfmqJnlpInmj5vjgZfjgZ/luqfmqJnjgpLlj5blvpfjgIJcbiAgICByZXR1cm4gdGhpcy5fdmlld01hdHJpeC5pbnZlcnRUcmFuc2Zvcm1ZKHNjcmVlblkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFjluqfmqJnjgpJTY3JlZW7luqfmqJnjgavlpInmj5vjgZnjgovjgIJcbiAgICogQHBhcmFtIGRldmljZVgg44OH44OQ44Kk44K5WOW6p+aomVxuICAgKi9cbiAgcHVibGljIHRyYW5zZm9ybVNjcmVlblgoZGV2aWNlWDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZGV2aWNlVG9TY3JlZW4udHJhbnNmb3JtWChkZXZpY2VYKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBZ5bqn5qiZ44KSU2NyZWVu5bqn5qiZ44Gr5aSJ5o+b44GZ44KL44CCXG4gICAqXG4gICAqIEBwYXJhbSBkZXZpY2VZIOODh+ODkOOCpOOCuVnluqfmqJlcbiAgICovXG4gIHB1YmxpYyB0cmFuc2Zvcm1TY3JlZW5ZKGRldmljZVk6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RldmljZVRvU2NyZWVuLnRyYW5zZm9ybVkoZGV2aWNlWSk7XG4gIH1cblxuICBfdG91Y2hNYW5hZ2VyOiBUb3VjaE1hbmFnZXI7IC8vIOOCv+ODg+ODgeODnuODjeODvOOCuOODo+ODvFxuICBfZGV2aWNlVG9TY3JlZW46IENzbV9DdWJpc21NYXRyaXg0NDsgLy8g44OH44OQ44Kk44K544GL44KJ44K544Kv44Oq44O844Oz44G444Gu6KGM5YiXXG4gIF92aWV3TWF0cml4OiBDc21fQ3ViaXNtVmlld01hdHJpeDsgLy8gdmlld01hdHJpeFxuICBfcHJvZ3JhbUlkOiBXZWJHTFByb2dyYW07IC8vIOOCt+OCp+ODvOODgElEXG4gIF9iYWNrOiBMQXBwU3ByaXRlOyAvLyDog4zmma/nlLvlg49cbiAgX2dlYXI6IExBcHBTcHJpdGU7IC8vIOOCruOCoueUu+WDj1xuICBfY2hhbmdlTW9kZWw6IGJvb2xlYW47IC8vIOODouODh+ODq+WIh+OCiuabv+OBiOODleODqeOCsFxuICBfaXNDbGljazogYm9vbGVhbjsgLy8g44Kv44Oq44OD44Kv5LitXG59XG4iLCIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBMQXBwRGVsZWdhdGUgfSBmcm9tICcuL2xhcHBkZWxlZ2F0ZSc7XG5cbi8qKlxuICog44OW44Op44Km44K244Ot44O844OJ5b6M44Gu5Yem55CGXG4gKi9cbndpbmRvdy5vbmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gIC8vIGNyZWF0ZSB0aGUgYXBwbGljYXRpb24gaW5zdGFuY2VcbiAgaWYgKExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLmluaXRpYWxpemUoKSA9PSBmYWxzZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIExBcHBEZWxlZ2F0ZS5nZXRJbnN0YW5jZSgpLnJ1bigpO1xufTtcblxuLyoqXG4gKiDntYLkuobmmYLjga7lh6bnkIZcbiAqL1xud2luZG93Lm9uYmVmb3JldW5sb2FkID0gKCk6IHZvaWQgPT4gTEFwcERlbGVnYXRlLnJlbGVhc2VJbnN0YW5jZSgpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==