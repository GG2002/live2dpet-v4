/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from "@framework/live2dcubismframework";

/**
 * Sample Appで使用する定数
 */
// 画面
export const ViewMaxScale = 2.0;
export const ViewMinScale = 0.8;

export const ViewLogicalLeft = -1.0;
export const ViewLogicalRight = 1.0;

export const ViewLogicalMaxLeft = -2.0;
export const ViewLogicalMaxRight = 2.0;
export const ViewLogicalMaxBottom = -2.0;
export const ViewLogicalMaxTop = 2.0;

// // 相対パス
export let ResourcesPath = "../../Resources/";

// モデルの後ろにある背景の画像ファイル
export let BackImageName = "back_class_normal.png";

// 歯車
export const GearImageName = "icon_gear.png";

// 終了ボタン
export const PowerImageName = "CloseNormal.png";

// モデル定義---------------------------------------------
// モデルを配置したディレクトリ名の配列
// ディレクトリ名とmodel3.jsonの名前を一致させておくこと
export let ModelDir: string[] = [
  "螃蟹公",
  "Haru",
  "Hiyori",
  "Mark",
  "Natori",
  "Rice",
];
export let ModelDirSize: number = ModelDir.length;

// 外部定義ファイル（json）と合わせる
export const MotionGroupIdle = "Idle"; // アイドリング
export const MotionGroupTapBody = "TapBody"; // 体をタップしたとき

// 外部定義ファイル（json）と合わせる
export const HitAreaNameHead = "Head";
export const HitAreaNameBody = "Body";

// モーションの優先度定数
export const PriorityNone = 0;
export const PriorityIdle = 1;
export const PriorityNormal = 2;
export const PriorityForce = 3;

// デバッグ用ログの表示オプション
export const DebugLogEnable = true;
export const DebugTouchLogEnable = false;

// Frameworkから出力するログのレベル設定
export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;

// 模型画布大小
export const RenderTargetWidth = 900;
export const RenderTargetHeight = 900;

export const win: any = window;

win.initDefine = function(
  resourcesPath: string,
  backImageName: string,
  modelDir: string[]
) {
  ResourcesPath = resourcesPath || ResourcesPath;
  BackImageName = backImageName || BackImageName;
  if (modelDir) {
    ModelDir = modelDir;
    ModelDirSize = modelDir.length;
  }
};
