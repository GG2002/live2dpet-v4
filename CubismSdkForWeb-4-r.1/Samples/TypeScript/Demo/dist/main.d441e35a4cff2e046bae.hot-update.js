webpackHotUpdate("main",{

/***/ "../../../Framework/src/math/cubismmodelmatrix.ts":
/*!**************************************************************************************************!*\
  !*** D:/wamp64/www/desktop-live2d/CubismSdkForWeb-4-r.1/Framework/src/math/cubismmodelmatrix.ts ***!
  \**************************************************************************************************/
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
Object.defineProperty(exports, "__esModule", { value: true });
var cubismmatrix44_1 = __webpack_require__(/*! ./cubismmatrix44 */ "../../../Framework/src/math/cubismmatrix44.ts");
var CubismMatrix44 = cubismmatrix44_1.Live2DCubismFramework.CubismMatrix44;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismModelMatrix = (function (_super) {
        __extends(CubismModelMatrix, _super);
        function CubismModelMatrix(w, h) {
            var _this = _super.call(this) || this;
            _this._width = w !== undefined ? w : 0.0;
            _this._height = h !== undefined ? h : 0.0;
            _this.setHeight(1.0);
            return _this;
        }
        CubismModelMatrix.prototype.setWidth = function (w) {
            var scaleX = w / this._width;
            var scaleY = scaleX;
            this.scale(scaleX, scaleY);
        };
        CubismModelMatrix.prototype.setHeight = function (h) {
            var scaleX = h / this._height;
            var scaleY = scaleX;
            this.scale(scaleX, scaleY);
        };
        CubismModelMatrix.prototype.setPosition = function (x, y) {
            this.translate(x, y);
        };
        CubismModelMatrix.prototype.setCenterPosition = function (x, y) {
            this.centerX(x);
            this.centerY(y);
        };
        CubismModelMatrix.prototype.top = function (y) {
            this.setY(y);
        };
        CubismModelMatrix.prototype.bottom = function (y) {
            var h = this._height * this.getScaleY();
            this.translateY(y - h);
        };
        CubismModelMatrix.prototype.left = function (x) {
            this.setX(x);
        };
        CubismModelMatrix.prototype.right = function (x) {
            var w = this._width * this.getScaleX();
            this.translateX(x - w);
        };
        CubismModelMatrix.prototype.centerX = function (x) {
            var w = this._width * this.getScaleX();
            this.translateX(x - w / 2.0);
        };
        CubismModelMatrix.prototype.setX = function (x) {
            this.translateX(x);
        };
        CubismModelMatrix.prototype.centerY = function (y) {
            var h = this._height * this.getScaleY();
            this.translateY(y - h / 2.0);
        };
        CubismModelMatrix.prototype.setY = function (y) {
            this.translateY(y);
        };
        CubismModelMatrix.prototype.setupFromLayout = function (layout) {
            var keyWidth = 'width';
            var keyHeight = 'height';
            var keyX = 'x';
            var keyY = 'y';
            var keyCenterX = 'center_x';
            var keyCenterY = 'center_y';
            var keyTop = 'top';
            var keyBottom = 'bottom';
            var keyLeft = 'left';
            var keyRight = 'right';
            for (var ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
                var key = ite.ptr().first;
                var value = ite.ptr().second;
                if (key == keyWidth) {
                    this.setWidth(value);
                }
                else if (key == keyHeight) {
                    this.setHeight(value);
                }
            }
            for (var ite = layout.begin(); ite.notEqual(layout.end()); ite.preIncrement()) {
                var key = ite.ptr().first;
                var value = ite.ptr().second;
                if (key == keyX) {
                    this.setX(value);
                }
                else if (key == keyY) {
                    this.setY(value);
                }
                else if (key == keyCenterX) {
                    this.centerX(value);
                }
                else if (key == keyCenterY) {
                    this.centerY(value);
                }
                else if (key == keyTop) {
                    this.top(value);
                }
                else if (key == keyBottom) {
                    this.bottom(value);
                }
                else if (key == keyLeft) {
                    this.left(value);
                }
                else if (key == keyRight) {
                    this.right(value);
                }
            }
        };
        return CubismModelMatrix;
    }(CubismMatrix44));
    Live2DCubismFramework.CubismModelMatrix = CubismModelMatrix;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));


/***/ }),

/***/ "../../../Framework/src/model/cubismusermodel.ts":
/*!*************************************************************************************************!*\
  !*** D:/wamp64/www/desktop-live2d/CubismSdkForWeb-4-r.1/Framework/src/model/cubismusermodel.ts ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var live2dcubismframework_1 = __webpack_require__(/*! ../live2dcubismframework */ "../../../Framework/src/live2dcubismframework.ts");
var cubismmotionmanager_1 = __webpack_require__(/*! ../motion/cubismmotionmanager */ "../../../Framework/src/motion/cubismmotionmanager.ts");
var cubismtargetpoint_1 = __webpack_require__(/*! ../math/cubismtargetpoint */ "../../../Framework/src/math/cubismtargetpoint.ts");
var cubismmodelmatrix_1 = __webpack_require__(/*! ../math/cubismmodelmatrix */ "../../../Framework/src/math/cubismmodelmatrix.ts");
var cubismmoc_1 = __webpack_require__(/*! ./cubismmoc */ "../../../Framework/src/model/cubismmoc.ts");
var cubismmotion_1 = __webpack_require__(/*! ../motion/cubismmotion */ "../../../Framework/src/motion/cubismmotion.ts");
var cubismexpressionmotion_1 = __webpack_require__(/*! ../motion/cubismexpressionmotion */ "../../../Framework/src/motion/cubismexpressionmotion.ts");
var cubismpose_1 = __webpack_require__(/*! ../effect/cubismpose */ "../../../Framework/src/effect/cubismpose.ts");
var cubismmodeluserdata_1 = __webpack_require__(/*! ./cubismmodeluserdata */ "../../../Framework/src/model/cubismmodeluserdata.ts");
var cubismphysics_1 = __webpack_require__(/*! ../physics/cubismphysics */ "../../../Framework/src/physics/cubismphysics.ts");
var cubismbreath_1 = __webpack_require__(/*! ../effect/cubismbreath */ "../../../Framework/src/effect/cubismbreath.ts");
var cubismeyeblink_1 = __webpack_require__(/*! ../effect/cubismeyeblink */ "../../../Framework/src/effect/cubismeyeblink.ts");
var cubismrenderer_webgl_1 = __webpack_require__(/*! ../rendering/cubismrenderer_webgl */ "../../../Framework/src/rendering/cubismrenderer_webgl.ts");
var cubismdebug_1 = __webpack_require__(/*! ../utils/cubismdebug */ "../../../Framework/src/utils/cubismdebug.ts");
var CubismRenderer_WebGL = cubismrenderer_webgl_1.Live2DCubismFramework.CubismRenderer_WebGL;
var CubismEyeBlink = cubismeyeblink_1.Live2DCubismFramework.CubismEyeBlink;
var CubismBreath = cubismbreath_1.Live2DCubismFramework.CubismBreath;
var Constant = live2dcubismframework_1.Live2DCubismFramework.Constant;
var CubismPhysics = cubismphysics_1.Live2DCubismFramework.CubismPhysics;
var CubismModelUserData = cubismmodeluserdata_1.Live2DCubismFramework.CubismModelUserData;
var CubismPose = cubismpose_1.Live2DCubismFramework.CubismPose;
var CubismExpressionMotion = cubismexpressionmotion_1.Live2DCubismFramework.CubismExpressionMotion;
var CubismMotion = cubismmotion_1.Live2DCubismFramework.CubismMotion;
var CubismMoc = cubismmoc_1.Live2DCubismFramework.CubismMoc;
var CubismModelMatrix = cubismmodelmatrix_1.Live2DCubismFramework.CubismModelMatrix;
var CubismTargetPoint = cubismtargetpoint_1.Live2DCubismFramework.CubismTargetPoint;
var CubismMotionManager = cubismmotionmanager_1.Live2DCubismFramework.CubismMotionManager;
var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    var CubismUserModel = (function () {
        function CubismUserModel() {
            this.loadMotion = function (buffer, size, name, onFinishedMotionHandler) { return CubismMotion.create(buffer, size, onFinishedMotionHandler); };
            this._moc = null;
            this._model = null;
            this._motionManager = null;
            this._expressionManager = null;
            this._eyeBlink = null;
            this._breath = null;
            this._modelMatrix = null;
            this._pose = null;
            this._dragManager = null;
            this._physics = null;
            this._modelUserData = null;
            this._initialized = false;
            this._updating = false;
            this._opacity = 1.0;
            this._lipsync = true;
            this._lastLipSyncValue = 0.0;
            this._dragX = 0.0;
            this._dragY = 0.0;
            this._accelerationX = 0.0;
            this._accelerationY = 0.0;
            this._accelerationZ = 0.0;
            this._debugMode = false;
            this._renderer = null;
            this._motionManager = new CubismMotionManager();
            this._motionManager.setEventCallback(CubismUserModel.cubismDefaultMotionEventCallback, this);
            this._expressionManager = new CubismMotionManager();
            this._dragManager = new CubismTargetPoint();
        }
        CubismUserModel.prototype.isInitialized = function () {
            return this._initialized;
        };
        CubismUserModel.prototype.setInitialized = function (v) {
            this._initialized = v;
        };
        CubismUserModel.prototype.isUpdating = function () {
            return this._updating;
        };
        CubismUserModel.prototype.setUpdating = function (v) {
            this._updating = v;
        };
        CubismUserModel.prototype.setDragging = function (x, y) {
            this._dragManager.set(x, y);
        };
        CubismUserModel.prototype.setAcceleration = function (x, y, z) {
            this._accelerationX = x;
            this._accelerationY = y;
            this._accelerationZ = z;
        };
        CubismUserModel.prototype.getModelMatrix = function () {
            return this._modelMatrix;
        };
        CubismUserModel.prototype.setOpacity = function (a) {
            this._opacity = a;
        };
        CubismUserModel.prototype.getOpacity = function () {
            return this._opacity;
        };
        CubismUserModel.prototype.loadModel = function (buffer) {
            this._moc = CubismMoc.create(buffer);
            this._model = this._moc.createModel();
            this._model.saveParameters();
            if (this._moc == null || this._model == null) {
                cubismdebug_1.CubismLogError('Failed to CreateModel().');
                return;
            }
            this._modelMatrix = new CubismModelMatrix(this._model.getCanvasWidth(), this._model.getCanvasHeight());
        };
        CubismUserModel.prototype.loadExpression = function (buffer, size, name) {
            return CubismExpressionMotion.create(buffer, size);
        };
        CubismUserModel.prototype.loadPose = function (buffer, size) {
            this._pose = CubismPose.create(buffer, size);
        };
        CubismUserModel.prototype.loadUserData = function (buffer, size) {
            this._modelUserData = CubismModelUserData.create(buffer, size);
        };
        CubismUserModel.prototype.loadPhysics = function (buffer, size) {
            this._physics = CubismPhysics.create(buffer, size);
        };
        CubismUserModel.prototype.isHit = function (drawableId, pointX, pointY) {
            var drawIndex = this._model.getDrawableIndex(drawableId);
            if (drawIndex < 0) {
                return false;
            }
            var count = this._model.getDrawableVertexCount(drawIndex);
            var vertices = this._model.getDrawableVertices(drawIndex);
            var left = vertices[0];
            var right = vertices[0];
            var top = vertices[1];
            var bottom = vertices[1];
            for (var j = 1; j < count; ++j) {
                var x = vertices[Constant.vertexOffset + j * Constant.vertexStep];
                var y = vertices[Constant.vertexOffset + j * Constant.vertexStep + 1];
                if (x < left) {
                    left = x;
                }
                if (x > right) {
                    right = x;
                }
                if (y < top) {
                    top = y;
                }
                if (y > bottom) {
                    bottom = y;
                }
            }
            var tx = this._modelMatrix.invertTransformX(pointX);
            var ty = this._modelMatrix.invertTransformY(pointY);
            return left <= tx && tx <= right && top <= ty && ty <= bottom;
        };
        CubismUserModel.prototype.getModel = function () {
            return this._model;
        };
        CubismUserModel.prototype.getRenderer = function () {
            return this._renderer;
        };
        CubismUserModel.prototype.createRenderer = function () {
            if (this._renderer) {
                this.deleteRenderer();
            }
            this._renderer = new CubismRenderer_WebGL();
            this._renderer.initialize(this._model);
        };
        CubismUserModel.prototype.deleteRenderer = function () {
            if (this._renderer != null) {
                this._renderer.release();
                this._renderer = null;
            }
        };
        CubismUserModel.prototype.motionEventFired = function (eventValue) {
            cubismdebug_1.CubismLogInfo('{0}', eventValue.s);
        };
        CubismUserModel.cubismDefaultMotionEventCallback = function (caller, eventValue, customData) {
            var model = customData;
            if (model != null) {
                model.motionEventFired(eventValue);
            }
        };
        CubismUserModel.prototype.release = function () {
            if (this._motionManager != null) {
                this._motionManager.release();
                this._motionManager = null;
            }
            if (this._expressionManager != null) {
                this._expressionManager.release();
                this._expressionManager = null;
            }
            if (this._moc != null) {
                this._moc.deleteModel(this._model);
                this._moc.release();
                this._moc = null;
            }
            this._modelMatrix = null;
            CubismPose.delete(this._pose);
            CubismEyeBlink.delete(this._eyeBlink);
            CubismBreath.delete(this._breath);
            this._dragManager = null;
            CubismPhysics.delete(this._physics);
            CubismModelUserData.delete(this._modelUserData);
            this.deleteRenderer();
        };
        return CubismUserModel;
    }());
    Live2DCubismFramework.CubismUserModel = CubismUserModel;
})(Live2DCubismFramework = exports.Live2DCubismFramework || (exports.Live2DCubismFramework = {}));


/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vRDovd2FtcDY0L3d3dy9kZXNrdG9wLWxpdmUyZC9DdWJpc21TZGtGb3JXZWItNC1yLjEvRnJhbWV3b3JrL3NyYy9tYXRoL2N1YmlzbW1vZGVsbWF0cml4LnRzIiwid2VicGFjazovLy9EOi93YW1wNjQvd3d3L2Rlc2t0b3AtbGl2ZTJkL0N1YmlzbVNka0ZvcldlYi00LXIuMS9GcmFtZXdvcmsvc3JjL21vZGVsL2N1YmlzbXVzZXJtb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUEsb0hBQTJFO0FBRzNFLElBQU8sY0FBYyxHQUFHLHNDQUFjLENBQUMsY0FBYyxDQUFDO0FBRXRELElBQWlCLHFCQUFxQixDQWdOckM7QUFoTkQsV0FBaUIscUJBQXFCO0lBTXBDO1FBQXVDLHFDQUFjO1FBT25ELDJCQUFZLENBQVUsRUFBRSxDQUFVO1lBQWxDLFlBQ0UsaUJBQU8sU0FLa0I7WUFIekIsS0FBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUN4QyxLQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBRXpDLEtBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBQUksQ0FBQztRQU9wQixvQ0FBUSxHQUFmLFVBQWdCLENBQVM7WUFDdkIsSUFBTSxNQUFNLEdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdkMsSUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFNTSxxQ0FBUyxHQUFoQixVQUFpQixDQUFTO1lBQ3hCLElBQU0sTUFBTSxHQUFXLENBQUMsR0FB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YUFDaEM7WUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO2dCQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2xCO1lBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFFekIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7WUFFekIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUVoRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsQ0FBQztRQTRCSCxzQkFBQztJQUFELENBQUM7SUEvWVkscUNBQWUsa0JBK1kzQjtBQUNILENBQUMsRUF0WmdCLHFCQUFxQixHQUFyQiw2QkFBcUIsS0FBckIsNkJBQXFCLFFBc1pyQyIsImZpbGUiOiJtYWluLmQ0NDFlMzVhNGNmZjJlMDQ2YmFlLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodChjKSBMaXZlMkQgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IHRoZSBMaXZlMkQgT3BlbiBTb2Z0d2FyZSBsaWNlbnNlXG4gKiB0aGF0IGNhbiBiZSBmb3VuZCBhdCBodHRwczovL3d3dy5saXZlMmQuY29tL2V1bGEvbGl2ZTJkLW9wZW4tc29mdHdhcmUtbGljZW5zZS1hZ3JlZW1lbnRfZW4uaHRtbC5cbiAqL1xuXG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3NtbWFwIH0gZnJvbSAnLi4vdHlwZS9jc21tYXAnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbW1hdHJpeDQ0IH0gZnJvbSAnLi9jdWJpc21tYXRyaXg0NCc7XG5pbXBvcnQgY3NtTWFwID0gY3NtbWFwLmNzbU1hcDtcbmltcG9ydCBpdGVyYXRvciA9IGNzbW1hcC5pdGVyYXRvcjtcbmltcG9ydCBDdWJpc21NYXRyaXg0NCA9IGN1YmlzbW1hdHJpeDQ0LkN1YmlzbU1hdHJpeDQ0O1xuXG5leHBvcnQgbmFtZXNwYWNlIExpdmUyREN1YmlzbUZyYW1ld29yayB7XG4gIC8qKlxuICAgKiDjg6Ljg4fjg6vluqfmqJnoqK3lrprnlKjjga40eDTooYzliJdcbiAgICpcbiAgICog44Oi44OH44Or5bqn5qiZ6Kit5a6a55So44GuNHg06KGM5YiX44Kv44Op44K5XG4gICAqL1xuICBleHBvcnQgY2xhc3MgQ3ViaXNtTW9kZWxNYXRyaXggZXh0ZW5kcyBDdWJpc21NYXRyaXg0NCB7XG4gICAgLyoqXG4gICAgICog44Kz44Oz44K544OI44Op44Kv44K/XG4gICAgICpcbiAgICAgKiBAcGFyYW0gdyDmqKrluYVcbiAgICAgKiBAcGFyYW0gaCDnuKbluYVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih3PzogbnVtYmVyLCBoPzogbnVtYmVyKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICB0aGlzLl93aWR0aCA9IHcgIT09IHVuZGVmaW5lZCA/IHcgOiAwLjA7XG4gICAgICB0aGlzLl9oZWlnaHQgPSBoICE9PSB1bmRlZmluZWQgPyBoIDogMC4wO1xuXG4gICAgICB0aGlzLnNldEhlaWdodCgxLjApOyAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmqKrluYXjgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSB3IOaoquW5hVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRXaWR0aCh3OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHNjYWxlWDogbnVtYmVyID0gdyAvIHRoaXMuX3dpZHRoO1xuICAgICAgY29uc3Qgc2NhbGVZOiBudW1iZXIgPSBzY2FsZVg7XG4gICAgICB0aGlzLnNjYWxlKHNjYWxlWCwgc2NhbGVZKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnuKbluYXjgpLoqK3lrppcbiAgICAgKiBAcGFyYW0gaCDnuKbluYVcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0SGVpZ2h0KGg6IG51bWJlcik6IHZvaWQge1xuICAgICAgY29uc3Qgc2NhbGVYOiBudW1iZXIgPSBoIC8gdGhpcy5faGVpZ2h0O1xuICAgICAgY29uc3Qgc2NhbGVZOiBudW1iZXIgPSBzY2FsZVg7XG4gICAgICB0aGlzLnNjYWxlKHNjYWxlWCwgc2NhbGVZKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDkvY3nva7jgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IFjou7jjga7kvY3nva5cbiAgICAgKiBAcGFyYW0geSBZ6Lu444Gu5L2N572uXG4gICAgICovXG4gICAgcHVibGljIHNldFBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLnRyYW5zbGF0ZSh4LCB5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDkuK3lv4PkvY3nva7jgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IFjou7jjga7kuK3lv4PkvY3nva5cbiAgICAgKiBAcGFyYW0geSBZ6Lu444Gu5Lit5b+D5L2N572uXG4gICAgICpcbiAgICAgKiBAbm90ZSB3aWR0aOOBi2hlaWdodOOCkuioreWumuOBl+OBn+OBguOBqOOBp+OBquOBhOOBqOOAgeaLoeWkp+eOh+OBjOato+OBl+OBj+WPluW+l+OBp+OBjeOBquOBhOOBn+OCgeOBmuOCjOOCi+OAglxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRDZW50ZXJQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgdGhpcy5jZW50ZXJYKHgpO1xuICAgICAgdGhpcy5jZW50ZXJZKHkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS4iui+uuOBruS9jee9ruOCkuioreWumuOBmeOCi1xuICAgICAqXG4gICAgICogQHBhcmFtIHkg5LiK6L6644GuWei7uOS9jee9rlxuICAgICAqL1xuICAgIHB1YmxpYyB0b3AoeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLnNldFkoeSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LiL6L6644Gu5L2N572u44KS6Kit5a6a44GZ44KLXG4gICAgICpcbiAgICAgKiBAcGFyYW0geSDkuIvovrrjga5Z6Lu45L2N572uXG4gICAgICovXG4gICAgcHVibGljIGJvdHRvbSh5OiBudW1iZXIpIHtcbiAgICAgIGNvbnN0IGg6IG51bWJlciA9IHRoaXMuX2hlaWdodCAqIHRoaXMuZ2V0U2NhbGVZKCk7XG5cbiAgICAgIHRoaXMudHJhbnNsYXRlWSh5IC0gaCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5bem6L6644Gu5L2N572u44KS6Kit5a6aXG4gICAgICpcbiAgICAgKiBAcGFyYW0geCDlt6bovrrjga5Y6Lu45L2N572uXG4gICAgICovXG4gICAgcHVibGljIGxlZnQoeDogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLnNldFgoeCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Y+z6L6644Gu5L2N572u44KS6Kit5a6aXG4gICAgICpcbiAgICAgKiBAcGFyYW0geCDlj7Povrrjga5Y6Lu45L2N572uXG4gICAgICovXG4gICAgcHVibGljIHJpZ2h0KHg6IG51bWJlcik6IHZvaWQge1xuICAgICAgY29uc3QgdyA9IHRoaXMuX3dpZHRoICogdGhpcy5nZXRTY2FsZVgoKTtcblxuICAgICAgdGhpcy50cmFuc2xhdGVYKHggLSB3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBY6Lu444Gu5Lit5b+D5L2N572u44KS6Kit5a6aXG4gICAgICpcbiAgICAgKiBAcGFyYW0geCBY6Lu444Gu5Lit5b+D5L2N572uXG4gICAgICovXG4gICAgcHVibGljIGNlbnRlclgoeDogbnVtYmVyKTogdm9pZCB7XG4gICAgICBjb25zdCB3ID0gdGhpcy5fd2lkdGggKiB0aGlzLmdldFNjYWxlWCgpO1xuXG4gICAgICB0aGlzLnRyYW5zbGF0ZVgoeCAtIHcgLyAyLjApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFjou7jjga7kvY3nva7jgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IFjou7jjga7kvY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0WCh4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMudHJhbnNsYXRlWCh4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBZ6Lu444Gu5Lit5b+D5L2N572u44KS6Kit5a6aXG4gICAgICpcbiAgICAgKiBAcGFyYW0geSBZ6Lu444Gu5Lit5b+D5L2N572uXG4gICAgICovXG4gICAgcHVibGljIGNlbnRlclkoeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICBjb25zdCBoOiBudW1iZXIgPSB0aGlzLl9oZWlnaHQgKiB0aGlzLmdldFNjYWxlWSgpO1xuXG4gICAgICB0aGlzLnRyYW5zbGF0ZVkoeSAtIGggLyAyLjApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFnou7jjga7kvY3nva7jgpLoqK3lrprjgZnjgotcbiAgICAgKlxuICAgICAqIEBwYXJhbSB5IFnou7jjga7kvY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0WSh5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMudHJhbnNsYXRlWSh5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6zjgqTjgqLjgqbjg4jmg4XloLHjgYvjgonkvY3nva7jgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSBsYXlvdXQg44Os44Kk44Ki44Km44OI5oOF5aCxXG4gICAgICovXG4gICAgcHVibGljIHNldHVwRnJvbUxheW91dChsYXlvdXQ6IGNzbU1hcDxzdHJpbmcsIG51bWJlcj4pOiB2b2lkIHtcbiAgICAgIGNvbnN0IGtleVdpZHRoID0gJ3dpZHRoJztcbiAgICAgIGNvbnN0IGtleUhlaWdodCA9ICdoZWlnaHQnO1xuICAgICAgY29uc3Qga2V5WCA9ICd4JztcbiAgICAgIGNvbnN0IGtleVkgPSAneSc7XG4gICAgICBjb25zdCBrZXlDZW50ZXJYID0gJ2NlbnRlcl94JztcbiAgICAgIGNvbnN0IGtleUNlbnRlclkgPSAnY2VudGVyX3knO1xuICAgICAgY29uc3Qga2V5VG9wID0gJ3RvcCc7XG4gICAgICBjb25zdCBrZXlCb3R0b20gPSAnYm90dG9tJztcbiAgICAgIGNvbnN0IGtleUxlZnQgPSAnbGVmdCc7XG4gICAgICBjb25zdCBrZXlSaWdodCA9ICdyaWdodCc7XG5cbiAgICAgIGZvciAoXG4gICAgICAgIGNvbnN0IGl0ZTogaXRlcmF0b3I8c3RyaW5nLCBudW1iZXI+ID0gbGF5b3V0LmJlZ2luKCk7XG4gICAgICAgIGl0ZS5ub3RFcXVhbChsYXlvdXQuZW5kKCkpO1xuICAgICAgICBpdGUucHJlSW5jcmVtZW50KClcbiAgICAgICkge1xuICAgICAgICBjb25zdCBrZXk6IHN0cmluZyA9IGl0ZS5wdHIoKS5maXJzdDtcbiAgICAgICAgY29uc3QgdmFsdWU6IG51bWJlciA9IGl0ZS5wdHIoKS5zZWNvbmQ7XG5cbiAgICAgICAgaWYgKGtleSA9PSBrZXlXaWR0aCkge1xuICAgICAgICAgIHRoaXMuc2V0V2lkdGgodmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBrZXlIZWlnaHQpIHtcbiAgICAgICAgICB0aGlzLnNldEhlaWdodCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChcbiAgICAgICAgY29uc3QgaXRlOiBpdGVyYXRvcjxzdHJpbmcsIG51bWJlcj4gPSBsYXlvdXQuYmVnaW4oKTtcbiAgICAgICAgaXRlLm5vdEVxdWFsKGxheW91dC5lbmQoKSk7XG4gICAgICAgIGl0ZS5wcmVJbmNyZW1lbnQoKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGtleTogc3RyaW5nID0gaXRlLnB0cigpLmZpcnN0O1xuICAgICAgICBjb25zdCB2YWx1ZTogbnVtYmVyID0gaXRlLnB0cigpLnNlY29uZDtcblxuICAgICAgICBpZiAoa2V5ID09IGtleVgpIHtcbiAgICAgICAgICB0aGlzLnNldFgodmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBrZXlZKSB7XG4gICAgICAgICAgdGhpcy5zZXRZKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0ga2V5Q2VudGVyWCkge1xuICAgICAgICAgIHRoaXMuY2VudGVyWCh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IGtleUNlbnRlclkpIHtcbiAgICAgICAgICB0aGlzLmNlbnRlclkodmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBrZXlUb3ApIHtcbiAgICAgICAgICB0aGlzLnRvcCh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IGtleUJvdHRvbSkge1xuICAgICAgICAgIHRoaXMuYm90dG9tKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0ga2V5TGVmdCkge1xuICAgICAgICAgIHRoaXMubGVmdCh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IGtleVJpZ2h0KSB7XG4gICAgICAgICAgdGhpcy5yaWdodCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF93aWR0aDogbnVtYmVyOyAvLyDmqKrluYVcbiAgICBwcml2YXRlIF9oZWlnaHQ6IG51bWJlcjsgLy8g57im5bmFXG4gIH1cbn1cbiIsIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21mcmFtZXdvcmsgfSBmcm9tICcuLi9saXZlMmRjdWJpc21mcmFtZXdvcmsnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbW1vdGlvbm1hbmFnZXIgfSBmcm9tICcuLi9tb3Rpb24vY3ViaXNtbW90aW9ubWFuYWdlcic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtdGFyZ2V0cG9pbnQgfSBmcm9tICcuLi9tYXRoL2N1YmlzbXRhcmdldHBvaW50JztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tb2RlbG1hdHJpeCB9IGZyb20gJy4uL21hdGgvY3ViaXNtbW9kZWxtYXRyaXgnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbW1vYyB9IGZyb20gJy4vY3ViaXNtbW9jJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tb2RlbCB9IGZyb20gJy4vY3ViaXNtbW9kZWwnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGFjdWJpc21tb3Rpb24gfSBmcm9tICcuLi9tb3Rpb24vYWN1YmlzbW1vdGlvbic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtbW90aW9uIH0gZnJvbSAnLi4vbW90aW9uL2N1YmlzbW1vdGlvbic7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtZXhwcmVzc2lvbm1vdGlvbiB9IGZyb20gJy4uL21vdGlvbi9jdWJpc21leHByZXNzaW9ubW90aW9uJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21wb3NlIH0gZnJvbSAnLi4vZWZmZWN0L2N1YmlzbXBvc2UnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbW1vZGVsdXNlcmRhdGEgfSBmcm9tICcuL2N1YmlzbW1vZGVsdXNlcmRhdGEnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbXBoeXNpY3MgfSBmcm9tICcuLi9waHlzaWNzL2N1YmlzbXBoeXNpY3MnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGN1YmlzbWlkIH0gZnJvbSAnLi4vaWQvY3ViaXNtaWQnO1xuaW1wb3J0IHsgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIGFzIGNzbXN0cmluZyB9IGZyb20gJy4uL3R5cGUvY3Ntc3RyaW5nJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21tb3Rpb25xdWV1ZW1hbmFnZXIgfSBmcm9tICcuLi9tb3Rpb24vY3ViaXNtbW90aW9ucXVldWVtYW5hZ2VyJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21icmVhdGggfSBmcm9tICcuLi9lZmZlY3QvY3ViaXNtYnJlYXRoJztcbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjdWJpc21leWVibGluayB9IGZyb20gJy4uL2VmZmVjdC9jdWJpc21leWVibGluayc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtcmVuZGVyZXJfd2ViZ2wgfSBmcm9tICcuLi9yZW5kZXJpbmcvY3ViaXNtcmVuZGVyZXJfd2ViZ2wnO1xuaW1wb3J0IHsgQ3ViaXNtTG9nRXJyb3IsIEN1YmlzbUxvZ0luZm8gfSBmcm9tICcuLi91dGlscy9jdWJpc21kZWJ1Zyc7XG5pbXBvcnQgQ3ViaXNtUmVuZGVyZXJfV2ViR0wgPSBjdWJpc21yZW5kZXJlcl93ZWJnbC5DdWJpc21SZW5kZXJlcl9XZWJHTDtcbmltcG9ydCBDdWJpc21FeWVCbGluayA9IGN1YmlzbWV5ZWJsaW5rLkN1YmlzbUV5ZUJsaW5rO1xuaW1wb3J0IEN1YmlzbUJyZWF0aCA9IGN1YmlzbWJyZWF0aC5DdWJpc21CcmVhdGg7XG5pbXBvcnQgQ3ViaXNtTW90aW9uUXVldWVNYW5hZ2VyID0gY3ViaXNtbW90aW9ucXVldWVtYW5hZ2VyLkN1YmlzbU1vdGlvblF1ZXVlTWFuYWdlcjtcbmltcG9ydCBjc21TdHJpbmcgPSBjc21zdHJpbmcuY3NtU3RyaW5nO1xuaW1wb3J0IENvbnN0YW50ID0gY3ViaXNtZnJhbWV3b3JrLkNvbnN0YW50O1xuaW1wb3J0IEN1YmlzbUlkSGFuZGxlID0gY3ViaXNtaWQuQ3ViaXNtSWRIYW5kbGU7XG5pbXBvcnQgQ3ViaXNtUGh5c2ljcyA9IGN1YmlzbXBoeXNpY3MuQ3ViaXNtUGh5c2ljcztcbmltcG9ydCBDdWJpc21Nb2RlbFVzZXJEYXRhID0gY3ViaXNtbW9kZWx1c2VyZGF0YS5DdWJpc21Nb2RlbFVzZXJEYXRhO1xuaW1wb3J0IEN1YmlzbVBvc2UgPSBjdWJpc21wb3NlLkN1YmlzbVBvc2U7XG5pbXBvcnQgQ3ViaXNtRXhwcmVzc2lvbk1vdGlvbiA9IGN1YmlzbWV4cHJlc3Npb25tb3Rpb24uQ3ViaXNtRXhwcmVzc2lvbk1vdGlvbjtcbmltcG9ydCBDdWJpc21Nb3Rpb24gPSBjdWJpc21tb3Rpb24uQ3ViaXNtTW90aW9uO1xuaW1wb3J0IEFDdWJpc21Nb3Rpb24gPSBhY3ViaXNtbW90aW9uLkFDdWJpc21Nb3Rpb247XG5pbXBvcnQgRmluaXNoZWRNb3Rpb25DYWxsYmFjayA9IGFjdWJpc21tb3Rpb24uRmluaXNoZWRNb3Rpb25DYWxsYmFjaztcbmltcG9ydCBDdWJpc21Nb2RlbCA9IGN1YmlzbW1vZGVsLkN1YmlzbU1vZGVsO1xuaW1wb3J0IEN1YmlzbU1vYyA9IGN1YmlzbW1vYy5DdWJpc21Nb2M7XG5pbXBvcnQgQ3ViaXNtTW9kZWxNYXRyaXggPSBjdWJpc21tb2RlbG1hdHJpeC5DdWJpc21Nb2RlbE1hdHJpeDtcbmltcG9ydCBDdWJpc21UYXJnZXRQb2ludCA9IGN1YmlzbXRhcmdldHBvaW50LkN1YmlzbVRhcmdldFBvaW50O1xuaW1wb3J0IEN1YmlzbU1vdGlvbk1hbmFnZXIgPSBjdWJpc21tb3Rpb25tYW5hZ2VyLkN1YmlzbU1vdGlvbk1hbmFnZXI7XG5cbmV4cG9ydCBuYW1lc3BhY2UgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIHtcbiAgLyoqXG4gICAqIOODpuODvOOCtuODvOOBjOWun+mam+OBq+S9v+eUqOOBmeOCi+ODouODh+ODq1xuICAgKlxuICAgKiDjg6bjg7zjgrbjg7zjgYzlrp/pmpvjgavkvb/nlKjjgZnjgovjg6Ljg4fjg6vjga7ln7rlupXjgq/jg6njgrnjgILjgZPjgozjgpLntpnmib/jgZfjgabjg6bjg7zjgrbjg7zjgYzlrp/oo4XjgZnjgovjgIJcbiAgICovXG4gIGV4cG9ydCBjbGFzcyBDdWJpc21Vc2VyTW9kZWwge1xuICAgIC8qKlxuICAgICAqIOWIneacn+WMlueKtuaFi+OBruWPluW+l1xuICAgICAqXG4gICAgICog5Yid5pyf5YyW44GV44KM44Gm44GE44KL54q25oWL44GL77yfXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHRydWUgICAgIOWIneacn+WMluOBleOCjOOBpuOBhOOCi1xuICAgICAqIEByZXR1cm4gZmFsc2UgICAg5Yid5pyf5YyW44GV44KM44Gm44GE44Gq44GEXG4gICAgICovXG4gICAgcHVibGljIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGl6ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5pyf5YyW54q25oWL44Gu6Kit5a6aXG4gICAgICpcbiAgICAgKiDliJ3mnJ/ljJbnirbmhYvjgpLoqK3lrprjgZnjgovjgIJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB2IOWIneacn+WMlueKtuaFi1xuICAgICAqL1xuICAgIHB1YmxpYyBzZXRJbml0aWFsaXplZCh2OiBib29sZWFuKTogdm9pZCB7XG4gICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHY7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pu05paw54q25oWL44Gu5Y+W5b6XXG4gICAgICpcbiAgICAgKiDmm7TmlrDjgZXjgozjgabjgYTjgovnirbmhYvjgYvvvJ9cbiAgICAgKlxuICAgICAqIEByZXR1cm4gdHJ1ZSAgICAg5pu05paw44GV44KM44Gm44GE44KLXG4gICAgICogQHJldHVybiBmYWxzZSAgICDmm7TmlrDjgZXjgozjgabjgYTjgarjgYRcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNVcGRhdGluZygpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLl91cGRhdGluZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmm7TmlrDnirbmhYvjga7oqK3lrppcbiAgICAgKlxuICAgICAqIOabtOaWsOeKtuaFi+OCkuioreWumuOBmeOCi1xuICAgICAqXG4gICAgICogQHBhcmFtIHYg5pu05paw54q25oWLXG4gICAgICovXG4gICAgcHVibGljIHNldFVwZGF0aW5nKHY6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgIHRoaXMuX3VwZGF0aW5nID0gdjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg57jgqbjgrnjg4njg6njg4PjgrDmg4XloLHjga7oqK3lrppcbiAgICAgKiBAcGFyYW0g44OJ44Op44OD44Kw44GX44Gm44GE44KL44Kr44O844K944Or44GuWOS9jee9rlxuICAgICAqIEBwYXJhbSDjg4njg6njg4PjgrDjgZfjgabjgYTjgovjgqvjg7zjgr3jg6vjga5Z5L2N572uXG4gICAgICovXG4gICAgcHVibGljIHNldERyYWdnaW5nKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLl9kcmFnTWFuYWdlci5zZXQoeCwgeSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yqg6YCf5bqm44Gu5oOF5aCx44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHggWOi7uOaWueWQkeOBruWKoOmAn+W6plxuICAgICAqIEBwYXJhbSB5IFnou7jmlrnlkJHjga7liqDpgJ/luqZcbiAgICAgKiBAcGFyYW0geiBa6Lu45pa55ZCR44Gu5Yqg6YCf5bqmXG4gICAgICovXG4gICAgcHVibGljIHNldEFjY2VsZXJhdGlvbih4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLl9hY2NlbGVyYXRpb25YID0geDtcbiAgICAgIHRoaXMuX2FjY2VsZXJhdGlvblkgPSB5O1xuICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uWiA9IHo7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44OH44Or6KGM5YiX44KS5Y+W5b6X44GZ44KLXG4gICAgICogQHJldHVybiDjg6Ljg4fjg6vooYzliJdcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TW9kZWxNYXRyaXgoKTogQ3ViaXNtTW9kZWxNYXRyaXgge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsTWF0cml4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS4jemAj+aYjuW6puOBruioreWumlxuICAgICAqIEBwYXJhbSBhIOS4jemAj+aYjuW6plxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRPcGFjaXR5KGE6IG51bWJlcik6IHZvaWQge1xuICAgICAgdGhpcy5fb3BhY2l0eSA9IGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LiN6YCP5piO5bqm44Gu5Y+W5b6XXG4gICAgICogQHJldHVybiDkuI3pgI/mmI7luqZcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0T3BhY2l0eSgpOiBudW1iZXIge1xuICAgICAgcmV0dXJuIHRoaXMuX29wYWNpdHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44OH44Or44OH44O844K/44KS6Kqt44G/6L6844KAXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYnVmZmVyICAgIG1vYzPjg5XjgqHjgqTjg6vjgYzoqq3jgb/ovrzjgb7jgozjgabjgYTjgovjg5Djg4Pjg5XjgqFcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZE1vZGVsKGJ1ZmZlcjogQXJyYXlCdWZmZXIpIHtcbiAgICAgIHRoaXMuX21vYyA9IEN1YmlzbU1vYy5jcmVhdGUoYnVmZmVyKTtcbiAgICAgIHRoaXMuX21vZGVsID0gdGhpcy5fbW9jLmNyZWF0ZU1vZGVsKCk7XG4gICAgICB0aGlzLl9tb2RlbC5zYXZlUGFyYW1ldGVycygpO1xuXG4gICAgICBpZiAodGhpcy5fbW9jID09IG51bGwgfHwgdGhpcy5fbW9kZWwgPT0gbnVsbCkge1xuICAgICAgICBDdWJpc21Mb2dFcnJvcignRmFpbGVkIHRvIENyZWF0ZU1vZGVsKCkuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbW9kZWxNYXRyaXggPSBuZXcgQ3ViaXNtTW9kZWxNYXRyaXgoXG4gICAgICAgIHRoaXMuX21vZGVsLmdldENhbnZhc1dpZHRoKCksXG4gICAgICAgIHRoaXMuX21vZGVsLmdldENhbnZhc0hlaWdodCgpXG4gICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCt+ODp+ODs+ODh+ODvOOCv+OCkuiqreOBv+i+vOOCgFxuICAgICAqIEBwYXJhbSBidWZmZXIgbW90aW9uMy5qc29u44OV44Kh44Kk44Or44GM6Kqt44G/6L6844G+44KM44Gm44GE44KL44OQ44OD44OV44KhXG4gICAgICogQHBhcmFtIHNpemUg44OQ44OD44OV44Kh44Gu44K144Kk44K6XG4gICAgICogQHBhcmFtIG5hbWUg44Oi44O844K344On44Oz44Gu5ZCN5YmNXG4gICAgICogQHBhcmFtIG9uRmluaXNoZWRNb3Rpb25IYW5kbGVyIOODouODvOOCt+ODp+ODs+WGjeeUn+e1guS6huaZguOBq+WRvOOBs+WHuuOBleOCjOOCi+OCs+ODvOODq+ODkOODg+OCr+mWouaVsFxuICAgICAqIEByZXR1cm4g44Oi44O844K344On44Oz44Kv44Op44K5XG4gICAgICovXG4gICAgcHVibGljIGxvYWRNb3Rpb24gPSAoXG4gICAgICBidWZmZXI6IEFycmF5QnVmZmVyLFxuICAgICAgc2l6ZTogbnVtYmVyLFxuICAgICAgbmFtZTogc3RyaW5nLFxuICAgICAgb25GaW5pc2hlZE1vdGlvbkhhbmRsZXI/OiBGaW5pc2hlZE1vdGlvbkNhbGxiYWNrXG4gICAgKSA9PiBDdWJpc21Nb3Rpb24uY3JlYXRlKGJ1ZmZlciwgc2l6ZSwgb25GaW5pc2hlZE1vdGlvbkhhbmRsZXIpO1xuXG4gICAgLyoqXG4gICAgICog6KGo5oOF44OH44O844K/44Gu6Kqt44G/6L6844G/XG4gICAgICogQHBhcmFtIGJ1ZmZlciBleHDjg5XjgqHjgqTjg6vjgYzoqq3jgb/ovrzjgb7jgozjgabjgYTjgovjg5Djg4Pjg5XjgqFcbiAgICAgKiBAcGFyYW0gc2l6ZSDjg5Djg4Pjg5XjgqHjga7jgrXjgqTjgrpcbiAgICAgKiBAcGFyYW0gbmFtZSDooajmg4Xjga7lkI3liY1cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZEV4cHJlc3Npb24oXG4gICAgICBidWZmZXI6IEFycmF5QnVmZmVyLFxuICAgICAgc2l6ZTogbnVtYmVyLFxuICAgICAgbmFtZTogc3RyaW5nXG4gICAgKTogQUN1YmlzbU1vdGlvbiB7XG4gICAgICByZXR1cm4gQ3ViaXNtRXhwcmVzc2lvbk1vdGlvbi5jcmVhdGUoYnVmZmVyLCBzaXplKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg53jg7zjgrrjg4fjg7zjgr/jga7oqq3jgb/ovrzjgb9cbiAgICAgKiBAcGFyYW0gYnVmZmVyIHBvc2UzLmpzb27jgYzoqq3jgb/ovrzjgb7jgozjgabjgYTjgovjg5Djg4Pjg5XjgqFcbiAgICAgKiBAcGFyYW0gc2l6ZSDjg5Djg4Pjg5XjgqHjga7jgrXjgqTjgrpcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZFBvc2UoYnVmZmVyOiBBcnJheUJ1ZmZlciwgc2l6ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLl9wb3NlID0gQ3ViaXNtUG9zZS5jcmVhdGUoYnVmZmVyLCBzaXplKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg4fjg6vjgavku5jlsZ7jgZnjgovjg6bjg7zjgrbjg7zjg4fjg7zjgr/jgpLoqq3jgb/ovrzjgoBcbiAgICAgKiBAcGFyYW0gYnVmZmVyIHVzZXJkYXRhMy5qc29u44GM6Kqt44G/6L6844G+44KM44Gm44GE44KL44OQ44OD44OV44KhXG4gICAgICogQHBhcmFtIHNpemUg44OQ44OD44OV44Kh44Gu44K144Kk44K6XG4gICAgICovXG4gICAgcHVibGljIGxvYWRVc2VyRGF0YShidWZmZXI6IEFycmF5QnVmZmVyLCBzaXplOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMuX21vZGVsVXNlckRhdGEgPSBDdWJpc21Nb2RlbFVzZXJEYXRhLmNyZWF0ZShidWZmZXIsIHNpemUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOeJqeeQhua8lOeul+ODh+ODvOOCv+OBruiqreOBv+i+vOOBv1xuICAgICAqIEBwYXJhbSBidWZmZXIgIHBoeXNpY3MzLmpzb27jgYzoqq3jgb/ovrzjgb7jgozjgabjgYTjgovjg5Djg4Pjg5XjgqFcbiAgICAgKiBAcGFyYW0gc2l6ZSAgICDjg5Djg4Pjg5XjgqHjga7jgrXjgqTjgrpcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZFBoeXNpY3MoYnVmZmVyOiBBcnJheUJ1ZmZlciwgc2l6ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICB0aGlzLl9waHlzaWNzID0gQ3ViaXNtUGh5c2ljcy5jcmVhdGUoYnVmZmVyLCBzaXplKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlvZPjgZ/jgorliKTlrprjga7lj5blvpdcbiAgICAgKiBAcGFyYW0gZHJhd2FibGVJZCDmpJzoqLzjgZfjgZ/jgYREcmF3YWJsZeOBrklEXG4gICAgICogQHBhcmFtIHBvaW50WCBY5L2N572uXG4gICAgICogQHBhcmFtIHBvaW50WSBZ5L2N572uXG4gICAgICogQHJldHVybiB0cnVlIOODkuODg+ODiOOBl+OBpuOBhOOCi1xuICAgICAqIEByZXR1cm4gZmFsc2Ug44OS44OD44OI44GX44Gm44GE44Gq44GEXG4gICAgICovXG4gICAgcHVibGljIGlzSGl0KFxuICAgICAgZHJhd2FibGVJZDogQ3ViaXNtSWRIYW5kbGUsXG4gICAgICBwb2ludFg6IG51bWJlcixcbiAgICAgIHBvaW50WTogbnVtYmVyXG4gICAgKTogYm9vbGVhbiB7XG4gICAgICBjb25zdCBkcmF3SW5kZXg6IG51bWJlciA9IHRoaXMuX21vZGVsLmdldERyYXdhYmxlSW5kZXgoZHJhd2FibGVJZCk7XG5cbiAgICAgIGlmIChkcmF3SW5kZXggPCAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8g5a2Y5Zyo44GX44Gq44GE5aC05ZCI44GvZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgY291bnQ6IG51bWJlciA9IHRoaXMuX21vZGVsLmdldERyYXdhYmxlVmVydGV4Q291bnQoZHJhd0luZGV4KTtcbiAgICAgIGNvbnN0IHZlcnRpY2VzOiBGbG9hdDMyQXJyYXkgPSB0aGlzLl9tb2RlbC5nZXREcmF3YWJsZVZlcnRpY2VzKGRyYXdJbmRleCk7XG5cbiAgICAgIGxldCBsZWZ0OiBudW1iZXIgPSB2ZXJ0aWNlc1swXTtcbiAgICAgIGxldCByaWdodDogbnVtYmVyID0gdmVydGljZXNbMF07XG4gICAgICBsZXQgdG9wOiBudW1iZXIgPSB2ZXJ0aWNlc1sxXTtcbiAgICAgIGxldCBib3R0b206IG51bWJlciA9IHZlcnRpY2VzWzFdO1xuXG4gICAgICBmb3IgKGxldCBqID0gMTsgaiA8IGNvdW50OyArK2opIHtcbiAgICAgICAgY29uc3QgeCA9IHZlcnRpY2VzW0NvbnN0YW50LnZlcnRleE9mZnNldCArIGogKiBDb25zdGFudC52ZXJ0ZXhTdGVwXTtcbiAgICAgICAgY29uc3QgeSA9IHZlcnRpY2VzW0NvbnN0YW50LnZlcnRleE9mZnNldCArIGogKiBDb25zdGFudC52ZXJ0ZXhTdGVwICsgMV07XG5cbiAgICAgICAgaWYgKHggPCBsZWZ0KSB7XG4gICAgICAgICAgbGVmdCA9IHg7IC8vIE1pbiB4XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoeCA+IHJpZ2h0KSB7XG4gICAgICAgICAgcmlnaHQgPSB4OyAvLyBNYXggeFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHkgPCB0b3ApIHtcbiAgICAgICAgICB0b3AgPSB5OyAvLyBNaW4geVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHkgPiBib3R0b20pIHtcbiAgICAgICAgICBib3R0b20gPSB5OyAvLyBNYXggeVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHR4OiBudW1iZXIgPSB0aGlzLl9tb2RlbE1hdHJpeC5pbnZlcnRUcmFuc2Zvcm1YKHBvaW50WCk7XG4gICAgICBjb25zdCB0eTogbnVtYmVyID0gdGhpcy5fbW9kZWxNYXRyaXguaW52ZXJ0VHJhbnNmb3JtWShwb2ludFkpO1xuXG4gICAgICByZXR1cm4gbGVmdCA8PSB0eCAmJiB0eCA8PSByaWdodCAmJiB0b3AgPD0gdHkgJiYgdHkgPD0gYm90dG9tO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODh+ODq+OBruWPluW+l1xuICAgICAqIEByZXR1cm4g44Oi44OH44OrXG4gICAgICovXG4gICAgcHVibGljIGdldE1vZGVsKCk6IEN1YmlzbU1vZGVsIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6zjg7Pjg4Djg6njga7lj5blvpdcbiAgICAgKiBAcmV0dXJuIOODrOODs+ODgOODqVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSZW5kZXJlcigpOiBDdWJpc21SZW5kZXJlcl9XZWJHTCB7XG4gICAgICByZXR1cm4gdGhpcy5fcmVuZGVyZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Os44Oz44OA44Op44KS5L2c5oiQ44GX44Gm5Yid5pyf5YyW44KS5a6f6KGM44GZ44KLXG4gICAgICovXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyKCk6IHZvaWQge1xuICAgICAgaWYgKHRoaXMuX3JlbmRlcmVyKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlUmVuZGVyZXIoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcmVuZGVyZXIgPSBuZXcgQ3ViaXNtUmVuZGVyZXJfV2ViR0woKTtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLmluaXRpYWxpemUodGhpcy5fbW9kZWwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODrOODs+ODgOODqeOBruino+aUvlxuICAgICAqL1xuICAgIHB1YmxpYyBkZWxldGVSZW5kZXJlcigpOiB2b2lkIHtcbiAgICAgIGlmICh0aGlzLl9yZW5kZXJlciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbGVhc2UoKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOOCpOODmeODs+ODiOeZuueBq+aZguOBruaomea6luWHpueQhlxuICAgICAqXG4gICAgICogRXZlbnTjgYzlho3nlJ/lh6bnkIbmmYLjgavjgYLjgaPjgZ/loLTlkIjjga7lh6bnkIbjgpLjgZnjgovjgIJcbiAgICAgKiDntpnmib/jgafkuIrmm7jjgY3jgZnjgovjgZPjgajjgpLmg7PlrprjgZfjgabjgYTjgovjgIJcbiAgICAgKiDkuIrmm7jjgY3jgZfjgarjgYTloLTlkIjjga/jg63jgrDlh7rlipvjgpLjgZnjgovjgIJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudFZhbHVlIOeZuueBq+OBl+OBn+OCpOODmeODs+ODiOOBruaWh+Wtl+WIl+ODh+ODvOOCv1xuICAgICAqL1xuICAgIHB1YmxpYyBtb3Rpb25FdmVudEZpcmVkKGV2ZW50VmFsdWU6IGNzbVN0cmluZyk6IHZvaWQge1xuICAgICAgQ3ViaXNtTG9nSW5mbygnezB9JywgZXZlbnRWYWx1ZS5zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjgqTjg5njg7Pjg4jnlKjjga7jgrPjg7zjg6vjg5Djg4Pjgq9cbiAgICAgKlxuICAgICAqIEN1YmlzbU1vdGlvblF1ZXVlTWFuYWdlcuOBq+OCpOODmeODs+ODiOeUqOOBq+eZu+mMsuOBmeOCi+OBn+OCgeOBrkNhbGxiYWNr44CCXG4gICAgICogQ3ViaXNtVXNlck1vZGVs44Gu57aZ5om/5YWI44GuRXZlbnRGaXJlZOOCkuWRvOOBtuOAglxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxlciDnmbrngavjgZfjgZ/jgqTjg5njg7Pjg4jjgpLnrqHnkIbjgZfjgabjgYTjgZ/jg6Ljg7zjgrfjg6fjg7Pjg57jg43jg7zjgrjjg6Pjg7zjgIHmr5TovIPnlKhcbiAgICAgKiBAcGFyYW0gZXZlbnRWYWx1ZSDnmbrngavjgZfjgZ/jgqTjg5njg7Pjg4jjga7mloflrZfliJfjg4fjg7zjgr9cbiAgICAgKiBAcGFyYW0gY3VzdG9tRGF0YSBDdWJpc21Vc2VyTW9kZWzjgpLntpnmib/jgZfjgZ/jgqTjg7Pjgrnjgr/jg7PjgrnjgpLmg7PlrppcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGN1YmlzbURlZmF1bHRNb3Rpb25FdmVudENhbGxiYWNrKFxuICAgICAgY2FsbGVyOiBDdWJpc21Nb3Rpb25RdWV1ZU1hbmFnZXIsXG4gICAgICBldmVudFZhbHVlOiBjc21TdHJpbmcsXG4gICAgICBjdXN0b21EYXRhOiBDdWJpc21Vc2VyTW9kZWxcbiAgICApOiB2b2lkIHtcbiAgICAgIGNvbnN0IG1vZGVsOiBDdWJpc21Vc2VyTW9kZWwgPSBjdXN0b21EYXRhO1xuXG4gICAgICBpZiAobW9kZWwgIT0gbnVsbCkge1xuICAgICAgICBtb2RlbC5tb3Rpb25FdmVudEZpcmVkKGV2ZW50VmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIC8vIOWQhOWkieaVsOWIneacn+WMllxuICAgICAgdGhpcy5fbW9jID0gbnVsbDtcbiAgICAgIHRoaXMuX21vZGVsID0gbnVsbDtcbiAgICAgIHRoaXMuX21vdGlvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgdGhpcy5fZXhwcmVzc2lvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgdGhpcy5fZXllQmxpbmsgPSBudWxsO1xuICAgICAgdGhpcy5fYnJlYXRoID0gbnVsbDtcbiAgICAgIHRoaXMuX21vZGVsTWF0cml4ID0gbnVsbDtcbiAgICAgIHRoaXMuX3Bvc2UgPSBudWxsO1xuICAgICAgdGhpcy5fZHJhZ01hbmFnZXIgPSBudWxsO1xuICAgICAgdGhpcy5fcGh5c2ljcyA9IG51bGw7XG4gICAgICB0aGlzLl9tb2RlbFVzZXJEYXRhID0gbnVsbDtcbiAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICB0aGlzLl91cGRhdGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5fb3BhY2l0eSA9IDEuMDtcbiAgICAgIHRoaXMuX2xpcHN5bmMgPSB0cnVlO1xuICAgICAgdGhpcy5fbGFzdExpcFN5bmNWYWx1ZSA9IDAuMDtcbiAgICAgIHRoaXMuX2RyYWdYID0gMC4wO1xuICAgICAgdGhpcy5fZHJhZ1kgPSAwLjA7XG4gICAgICB0aGlzLl9hY2NlbGVyYXRpb25YID0gMC4wO1xuICAgICAgdGhpcy5fYWNjZWxlcmF0aW9uWSA9IDAuMDtcbiAgICAgIHRoaXMuX2FjY2VsZXJhdGlvblogPSAwLjA7XG4gICAgICB0aGlzLl9kZWJ1Z01vZGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX3JlbmRlcmVyID0gbnVsbDtcblxuICAgICAgLy8g44Oi44O844K344On44Oz44Oe44ON44O844K444Oj44O844KS5L2c5oiQXG4gICAgICB0aGlzLl9tb3Rpb25NYW5hZ2VyID0gbmV3IEN1YmlzbU1vdGlvbk1hbmFnZXIoKTtcbiAgICAgIHRoaXMuX21vdGlvbk1hbmFnZXIuc2V0RXZlbnRDYWxsYmFjayhcbiAgICAgICAgQ3ViaXNtVXNlck1vZGVsLmN1YmlzbURlZmF1bHRNb3Rpb25FdmVudENhbGxiYWNrLFxuICAgICAgICB0aGlzXG4gICAgICApO1xuXG4gICAgICAvLyDooajmg4Xjg57jg43jg7zjgrjjg6Pjg7zjgpLkvZzmiJBcbiAgICAgIHRoaXMuX2V4cHJlc3Npb25NYW5hZ2VyID0gbmV3IEN1YmlzbU1vdGlvbk1hbmFnZXIoKTtcblxuICAgICAgLy8g44OJ44Op44OD44Kw44Gr44KI44KL44Ki44OL44Oh44O844K344On44OzXG4gICAgICB0aGlzLl9kcmFnTWFuYWdlciA9IG5ldyBDdWJpc21UYXJnZXRQb2ludCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODh+OCueODiOODqeOCr+OCv+OBq+ebuOW9k+OBmeOCi+WHpueQhlxuICAgICAqL1xuICAgIHB1YmxpYyByZWxlYXNlKCkge1xuICAgICAgaWYgKHRoaXMuX21vdGlvbk1hbmFnZXIgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9tb3Rpb25NYW5hZ2VyLnJlbGVhc2UoKTtcbiAgICAgICAgdGhpcy5fbW90aW9uTWFuYWdlciA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9leHByZXNzaW9uTWFuYWdlciAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2V4cHJlc3Npb25NYW5hZ2VyLnJlbGVhc2UoKTtcbiAgICAgICAgdGhpcy5fZXhwcmVzc2lvbk1hbmFnZXIgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fbW9jICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5fbW9jLmRlbGV0ZU1vZGVsKHRoaXMuX21vZGVsKTtcbiAgICAgICAgdGhpcy5fbW9jLnJlbGVhc2UoKTtcbiAgICAgICAgdGhpcy5fbW9jID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbW9kZWxNYXRyaXggPSBudWxsO1xuXG4gICAgICBDdWJpc21Qb3NlLmRlbGV0ZSh0aGlzLl9wb3NlKTtcbiAgICAgIEN1YmlzbUV5ZUJsaW5rLmRlbGV0ZSh0aGlzLl9leWVCbGluayk7XG4gICAgICBDdWJpc21CcmVhdGguZGVsZXRlKHRoaXMuX2JyZWF0aCk7XG5cbiAgICAgIHRoaXMuX2RyYWdNYW5hZ2VyID0gbnVsbDtcblxuICAgICAgQ3ViaXNtUGh5c2ljcy5kZWxldGUodGhpcy5fcGh5c2ljcyk7XG4gICAgICBDdWJpc21Nb2RlbFVzZXJEYXRhLmRlbGV0ZSh0aGlzLl9tb2RlbFVzZXJEYXRhKTtcblxuICAgICAgdGhpcy5kZWxldGVSZW5kZXJlcigpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfbW9jOiBDdWJpc21Nb2M7IC8vIE1vY+ODh+ODvOOCv1xuICAgIHByb3RlY3RlZCBfbW9kZWw6IEN1YmlzbU1vZGVsOyAvLyBNb2RlbOOCpOODs+OCueOCv+ODs+OCuVxuXG4gICAgcHJvdGVjdGVkIF9tb3Rpb25NYW5hZ2VyOiBDdWJpc21Nb3Rpb25NYW5hZ2VyOyAvLyDjg6Ljg7zjgrfjg6fjg7PnrqHnkIZcbiAgICBwcm90ZWN0ZWQgX2V4cHJlc3Npb25NYW5hZ2VyOiBDdWJpc21Nb3Rpb25NYW5hZ2VyOyAvLyDooajmg4XnrqHnkIZcbiAgICBwcm90ZWN0ZWQgX2V5ZUJsaW5rOiBDdWJpc21FeWVCbGluazsgLy8g6Ieq5YuV44G+44Gw44Gf44GNXG4gICAgcHJvdGVjdGVkIF9icmVhdGg6IEN1YmlzbUJyZWF0aDsgLy8g5ZG85ZC4XG4gICAgcHJvdGVjdGVkIF9tb2RlbE1hdHJpeDogQ3ViaXNtTW9kZWxNYXRyaXg7IC8vIOODouODh+ODq+ihjOWIl1xuICAgIHByb3RlY3RlZCBfcG9zZTogQ3ViaXNtUG9zZTsgLy8g44Od44O844K6566h55CGXG4gICAgcHJvdGVjdGVkIF9kcmFnTWFuYWdlcjogQ3ViaXNtVGFyZ2V0UG9pbnQ7IC8vIOODnuOCpuOCueODieODqeODg+OCsFxuICAgIHByb3RlY3RlZCBfcGh5c2ljczogQ3ViaXNtUGh5c2ljczsgLy8g54mp55CG5ryU566XXG4gICAgcHJvdGVjdGVkIF9tb2RlbFVzZXJEYXRhOiBDdWJpc21Nb2RlbFVzZXJEYXRhOyAvLyDjg6bjg7zjgrbjg7zjg4fjg7zjgr9cblxuICAgIHByb3RlY3RlZCBfaW5pdGlhbGl6ZWQ6IGJvb2xlYW47IC8vIOWIneacn+WMluOBleOCjOOBn+OBi+OBqeOBhuOBi1xuICAgIHByb3RlY3RlZCBfdXBkYXRpbmc6IGJvb2xlYW47IC8vIOabtOaWsOOBleOCjOOBn+OBi+OBqeOBhuOBi1xuICAgIHByb3RlY3RlZCBfb3BhY2l0eTogbnVtYmVyOyAvLyDkuI3pgI/mmI7luqZcbiAgICBwcm90ZWN0ZWQgX2xpcHN5bmM6IGJvb2xlYW47IC8vIOODquODg+ODl+OCt+ODs+OCr+OBmeOCi+OBi+OBqeOBhuOBi1xuICAgIHByb3RlY3RlZCBfbGFzdExpcFN5bmNWYWx1ZTogbnVtYmVyOyAvLyDmnIDlvozjga7jg6rjg4Pjg5fjgrfjg7Pjgq/jga7liLblvqHlnLBcbiAgICBwcm90ZWN0ZWQgX2RyYWdYOiBudW1iZXI7IC8vIOODnuOCpuOCueODieODqeODg+OCsOOBrljkvY3nva5cbiAgICBwcm90ZWN0ZWQgX2RyYWdZOiBudW1iZXI7IC8vIOODnuOCpuOCueODieODqeODg+OCsOOBrlnkvY3nva5cbiAgICBwcm90ZWN0ZWQgX2FjY2VsZXJhdGlvblg6IG51bWJlcjsgLy8gWOi7uOaWueWQkeOBruWKoOmAn+W6plxuICAgIHByb3RlY3RlZCBfYWNjZWxlcmF0aW9uWTogbnVtYmVyOyAvLyBZ6Lu45pa55ZCR44Gu5Yqg6YCf5bqmXG4gICAgcHJvdGVjdGVkIF9hY2NlbGVyYXRpb25aOiBudW1iZXI7IC8vIFrou7jmlrnlkJHjga7liqDpgJ/luqZcbiAgICBwcm90ZWN0ZWQgX2RlYnVnTW9kZTogYm9vbGVhbjsgLy8g44OH44OQ44OD44Kw44Oi44O844OJ44GL44Gp44GG44GLXG5cbiAgICBwcml2YXRlIF9yZW5kZXJlcjogQ3ViaXNtUmVuZGVyZXJfV2ViR0w7IC8vIOODrOODs+ODgOODqVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9