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
            _this.setHeight(1.5);
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


/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vRDovd2FtcDY0L3d3dy9kZXNrdG9wLWxpdmUyZC9DdWJpc21TZGtGb3JXZWItNC1yLjEvRnJhbWV3b3JrL3NyYy9tYXRoL2N1YmlzbW1vZGVsbWF0cml4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQSxvSEFBMkU7QUFHM0UsSUFBTyxjQUFjLEdBQUcsc0NBQWMsQ0FBQyxjQUFjLENBQUM7QUFFdEQsSUFBaUIscUJBQXFCLENBZ05yQztBQWhORCxXQUFpQixxQkFBcUI7SUFNcEM7UUFBdUMscUNBQWM7UUFPbkQsMkJBQVksQ0FBVSxFQUFFLENBQVU7WUFBbEMsWUFDRSxpQkFBTyxTQUtrQjtZQUh6QixLQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3hDLEtBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFFekMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFBSSxDQUFDO1FBT3BCLG9DQUFRLEdBQWYsVUFBZ0IsQ0FBUztZQUN2QixJQUFNLE1BQU0sR0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2QyxJQUFNLE1BQU0sR0FBVyxNQUFNLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQU1NLHFDQUFTLEdBQWhCLFVBQWlCLENBQVM7WUFDeEIsSUFBTSxNQUFNLEdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDeEMsSUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFD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QUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2xCO3FCQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRTtvQkFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDbkI7YUFDRjtRQUNILENBQUM7UUFJSCx3QkFBQztJQUFELENBQUMsQ0F6TXNDLGNBQWMsR0F5TXBEO0lBek1ZLHVDQUFpQixvQkF5TTdCO0FBQ0gsQ0FBQyxFQWhOZ0IscUJBQXFCLEdBQXJCLDZCQUFxQixLQUFyQiw2QkFBcUIsUUFnTnJDIiwiZmlsZSI6Im1haW4uMTYyZjBiM2I2MzJiOTc0ZWNhYTcuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0KGMpIExpdmUyRCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgdGhlIExpdmUyRCBPcGVuIFNvZnR3YXJlIGxpY2Vuc2VcbiAqIHRoYXQgY2FuIGJlIGZvdW5kIGF0IGh0dHBzOi8vd3d3LmxpdmUyZC5jb20vZXVsYS9saXZlMmQtb3Blbi1zb2Z0d2FyZS1saWNlbnNlLWFncmVlbWVudF9lbi5odG1sLlxuICovXG5cbmltcG9ydCB7IExpdmUyREN1YmlzbUZyYW1ld29yayBhcyBjc21tYXAgfSBmcm9tICcuLi90eXBlL2NzbW1hcCc7XG5pbXBvcnQgeyBMaXZlMkRDdWJpc21GcmFtZXdvcmsgYXMgY3ViaXNtbWF0cml4NDQgfSBmcm9tICcuL2N1YmlzbW1hdHJpeDQ0JztcbmltcG9ydCBjc21NYXAgPSBjc21tYXAuY3NtTWFwO1xuaW1wb3J0IGl0ZXJhdG9yID0gY3NtbWFwLml0ZXJhdG9yO1xuaW1wb3J0IEN1YmlzbU1hdHJpeDQ0ID0gY3ViaXNtbWF0cml4NDQuQ3ViaXNtTWF0cml4NDQ7XG5cbmV4cG9ydCBuYW1lc3BhY2UgTGl2ZTJEQ3ViaXNtRnJhbWV3b3JrIHtcbiAgLyoqXG4gICAqIOODouODh+ODq+W6p+aomeioreWumueUqOOBrjR4NOihjOWIl1xuICAgKlxuICAgKiDjg6Ljg4fjg6vluqfmqJnoqK3lrprnlKjjga40eDTooYzliJfjgq/jg6njgrlcbiAgICovXG4gIGV4cG9ydCBjbGFzcyBDdWJpc21Nb2RlbE1hdHJpeCBleHRlbmRzIEN1YmlzbU1hdHJpeDQ0IHtcbiAgICAvKipcbiAgICAgKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cbiAgICAgKlxuICAgICAqIEBwYXJhbSB3IOaoquW5hVxuICAgICAqIEBwYXJhbSBoIOe4puW5hVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHc/OiBudW1iZXIsIGg/OiBudW1iZXIpIHtcbiAgICAgIHN1cGVyKCk7XG5cbiAgICAgIHRoaXMuX3dpZHRoID0gdyAhPT0gdW5kZWZpbmVkID8gdyA6IDAuMDtcbiAgICAgIHRoaXMuX2hlaWdodCA9IGggIT09IHVuZGVmaW5lZCA/IGggOiAwLjA7XG5cbiAgICAgIHRoaXMuc2V0SGVpZ2h0KDEuNSk7ICAgIH1cblxuICAgIC8qKlxuICAgICAqIOaoquW5heOCkuioreWumlxuICAgICAqXG4gICAgICogQHBhcmFtIHcg5qiq5bmFXG4gICAgICovXG4gICAgcHVibGljIHNldFdpZHRoKHc6IG51bWJlcik6IHZvaWQge1xuICAgICAgY29uc3Qgc2NhbGVYOiBudW1iZXIgPSB3IC8gdGhpcy5fd2lkdGg7XG4gICAgICBjb25zdCBzY2FsZVk6IG51bWJlciA9IHNjYWxlWDtcbiAgICAgIHRoaXMuc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOe4puW5heOCkuioreWumlxuICAgICAqIEBwYXJhbSBoIOe4puW5hVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRIZWlnaHQoaDogbnVtYmVyKTogdm9pZCB7XG4gICAgICBjb25zdCBzY2FsZVg6IG51bWJlciA9IGggLyB0aGlzLl9oZWlnaHQ7XG4gICAgICBjb25zdCBzY2FsZVk6IG51bWJlciA9IHNjYWxlWDtcbiAgICAgIHRoaXMuc2NhbGUoc2NhbGVYLCBzY2FsZVkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS9jee9ruOCkuioreWumlxuICAgICAqXG4gICAgICogQHBhcmFtIHggWOi7uOOBruS9jee9rlxuICAgICAqIEBwYXJhbSB5IFnou7jjga7kvY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMudHJhbnNsYXRlKHgsIHkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS4reW/g+S9jee9ruOCkuioreWumlxuICAgICAqXG4gICAgICogQHBhcmFtIHggWOi7uOOBruS4reW/g+S9jee9rlxuICAgICAqIEBwYXJhbSB5IFnou7jjga7kuK3lv4PkvY3nva5cbiAgICAgKlxuICAgICAqIEBub3RlIHdpZHRo44GLaGVpZ2h044KS6Kit5a6a44GX44Gf44GC44Go44Gn44Gq44GE44Go44CB5ouh5aSn546H44GM5q2j44GX44GP5Y+W5b6X44Gn44GN44Gq44GE44Gf44KB44Ga44KM44KL44CCXG4gICAgICovXG4gICAgcHVibGljIHNldENlbnRlclBvc2l0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICB0aGlzLmNlbnRlclgoeCk7XG4gICAgICB0aGlzLmNlbnRlclkoeSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LiK6L6644Gu5L2N572u44KS6Kit5a6a44GZ44KLXG4gICAgICpcbiAgICAgKiBAcGFyYW0geSDkuIrovrrjga5Z6Lu45L2N572uXG4gICAgICovXG4gICAgcHVibGljIHRvcCh5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMuc2V0WSh5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDkuIvovrrjga7kvY3nva7jgpLoqK3lrprjgZnjgotcbiAgICAgKlxuICAgICAqIEBwYXJhbSB5IOS4i+i+uuOBrlnou7jkvY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgYm90dG9tKHk6IG51bWJlcikge1xuICAgICAgY29uc3QgaDogbnVtYmVyID0gdGhpcy5faGVpZ2h0ICogdGhpcy5nZXRTY2FsZVkoKTtcblxuICAgICAgdGhpcy50cmFuc2xhdGVZKHkgLSBoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlt6bovrrjga7kvY3nva7jgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IOW3pui+uuOBrljou7jkvY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgbGVmdCh4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIHRoaXMuc2V0WCh4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlj7Povrrjga7kvY3nva7jgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IOWPs+i+uuOBrljou7jkvY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmlnaHQoeDogbnVtYmVyKTogdm9pZCB7XG4gICAgICBjb25zdCB3ID0gdGhpcy5fd2lkdGggKiB0aGlzLmdldFNjYWxlWCgpO1xuXG4gICAgICB0aGlzLnRyYW5zbGF0ZVgoeCAtIHcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFjou7jjga7kuK3lv4PkvY3nva7jgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IFjou7jjga7kuK3lv4PkvY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2VudGVyWCh4OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIGNvbnN0IHcgPSB0aGlzLl93aWR0aCAqIHRoaXMuZ2V0U2NhbGVYKCk7XG5cbiAgICAgIHRoaXMudHJhbnNsYXRlWCh4IC0gdyAvIDIuMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogWOi7uOOBruS9jee9ruOCkuioreWumlxuICAgICAqXG4gICAgICogQHBhcmFtIHggWOi7uOOBruS9jee9rlxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRYKHg6IG51bWJlcik6IHZvaWQge1xuICAgICAgdGhpcy50cmFuc2xhdGVYKHgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFnou7jjga7kuK3lv4PkvY3nva7jgpLoqK3lrppcbiAgICAgKlxuICAgICAqIEBwYXJhbSB5IFnou7jjga7kuK3lv4PkvY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2VudGVyWSh5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgIGNvbnN0IGg6IG51bWJlciA9IHRoaXMuX2hlaWdodCAqIHRoaXMuZ2V0U2NhbGVZKCk7XG5cbiAgICAgIHRoaXMudHJhbnNsYXRlWSh5IC0gaCAvIDIuMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogWei7uOOBruS9jee9ruOCkuioreWumuOBmeOCi1xuICAgICAqXG4gICAgICogQHBhcmFtIHkgWei7uOOBruS9jee9rlxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRZKHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgdGhpcy50cmFuc2xhdGVZKHkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODrOOCpOOCouOCpuODiOaDheWgseOBi+OCieS9jee9ruOCkuioreWumlxuICAgICAqXG4gICAgICogQHBhcmFtIGxheW91dCDjg6zjgqTjgqLjgqbjg4jmg4XloLFcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0dXBGcm9tTGF5b3V0KGxheW91dDogY3NtTWFwPHN0cmluZywgbnVtYmVyPik6IHZvaWQge1xuICAgICAgY29uc3Qga2V5V2lkdGggPSAnd2lkdGgnO1xuICAgICAgY29uc3Qga2V5SGVpZ2h0ID0gJ2hlaWdodCc7XG4gICAgICBjb25zdCBrZXlYID0gJ3gnO1xuICAgICAgY29uc3Qga2V5WSA9ICd5JztcbiAgICAgIGNvbnN0IGtleUNlbnRlclggPSAnY2VudGVyX3gnO1xuICAgICAgY29uc3Qga2V5Q2VudGVyWSA9ICdjZW50ZXJfeSc7XG4gICAgICBjb25zdCBrZXlUb3AgPSAndG9wJztcbiAgICAgIGNvbnN0IGtleUJvdHRvbSA9ICdib3R0b20nO1xuICAgICAgY29uc3Qga2V5TGVmdCA9ICdsZWZ0JztcbiAgICAgIGNvbnN0IGtleVJpZ2h0ID0gJ3JpZ2h0JztcblxuICAgICAgZm9yIChcbiAgICAgICAgY29uc3QgaXRlOiBpdGVyYXRvcjxzdHJpbmcsIG51bWJlcj4gPSBsYXlvdXQuYmVnaW4oKTtcbiAgICAgICAgaXRlLm5vdEVxdWFsKGxheW91dC5lbmQoKSk7XG4gICAgICAgIGl0ZS5wcmVJbmNyZW1lbnQoKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IGtleTogc3RyaW5nID0gaXRlLnB0cigpLmZpcnN0O1xuICAgICAgICBjb25zdCB2YWx1ZTogbnVtYmVyID0gaXRlLnB0cigpLnNlY29uZDtcblxuICAgICAgICBpZiAoa2V5ID09IGtleVdpZHRoKSB7XG4gICAgICAgICAgdGhpcy5zZXRXaWR0aCh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IGtleUhlaWdodCkge1xuICAgICAgICAgIHRoaXMuc2V0SGVpZ2h0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKFxuICAgICAgICBjb25zdCBpdGU6IGl0ZXJhdG9yPHN0cmluZywgbnVtYmVyPiA9IGxheW91dC5iZWdpbigpO1xuICAgICAgICBpdGUubm90RXF1YWwobGF5b3V0LmVuZCgpKTtcbiAgICAgICAgaXRlLnByZUluY3JlbWVudCgpXG4gICAgICApIHtcbiAgICAgICAgY29uc3Qga2V5OiBzdHJpbmcgPSBpdGUucHRyKCkuZmlyc3Q7XG4gICAgICAgIGNvbnN0IHZhbHVlOiBudW1iZXIgPSBpdGUucHRyKCkuc2Vjb25kO1xuXG4gICAgICAgIGlmIChrZXkgPT0ga2V5WCkge1xuICAgICAgICAgIHRoaXMuc2V0WCh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IGtleVkpIHtcbiAgICAgICAgICB0aGlzLnNldFkodmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBrZXlDZW50ZXJYKSB7XG4gICAgICAgICAgdGhpcy5jZW50ZXJYKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0ga2V5Q2VudGVyWSkge1xuICAgICAgICAgIHRoaXMuY2VudGVyWSh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IGtleVRvcCkge1xuICAgICAgICAgIHRoaXMudG9wKHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0ga2V5Qm90dG9tKSB7XG4gICAgICAgICAgdGhpcy5ib3R0b20odmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBrZXlMZWZ0KSB7XG4gICAgICAgICAgdGhpcy5sZWZ0KHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT0ga2V5UmlnaHQpIHtcbiAgICAgICAgICB0aGlzLnJpZ2h0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3dpZHRoOiBudW1iZXI7IC8vIOaoquW5hVxuICAgIHByaXZhdGUgX2hlaWdodDogbnVtYmVyOyAvLyDnuKbluYVcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==