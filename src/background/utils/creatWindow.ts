import { invoke } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { currentMonitor, LogicalPosition } from "@tauri-apps/api/window";
import { ConfigSettingTypes } from "../types";

export class MainWindow {
	constructor() {
		const webview = new WebviewWindow("mainWindow", {
			title: "Frank",
			url: "src/main/index.html",
			width: 320,
			height: 720,
			visible: false,
			resizable: false,
			decorations: false,
			center: true,
			transparent: true,
		});
		webview.once("tauri://created", async function () {
			webview.show();
			const isTracker: ConfigSettingTypes = JSON.parse(
				localStorage.getItem("configSetting") as string,
			);

			const enabled = isTracker.lolTracker > 0;
			const side = isTracker.lolTracker === 1 ? "Left" : "Right";
			// 1. 同步配置到后端状态
			await invoke("sync_tracker_config", { enabled, side });

			// 2. 尝试启动循环（内部有锁，不怕多次执行）
			await invoke("start_tracking_loop");
		});
	}
}

export class QueryMatchWindow {
	constructor() {
		const webview = new WebviewWindow("queryMatchWindow", {
			title: "我的战绩",
			url: "src/queryMatch/index.html",
			width: 1174,
			height: 668,
			resizable: false,
			decorations: false,
			center: true,
			visible: false,
			transparent: true,
		});
		webview.once("tauri://created", async function () {
			webview.show();
		});
	}
}

export class MatchAnalysisWindow {
	constructor() {
		const webview = new WebviewWindow("matchAnalysisWindow", {
			title: "战绩分析",
			url: "src/matchAnalysis/index.html",
			width: 1024,
			height: 576,
			resizable: false,
			decorations: false,
			center: true,
			visible: false,
			transparent: true,
		});
		webview.once("tauri://created", async function () {
			webview.show();
		});
	}
}

export class RecentMatchWindow {
	constructor() {
		const webview = new WebviewWindow("recentMatchWindow", {
			title: "对局详情",
			url: "src/recentMatch/index.html",
			width: 1254,
			height: 562,
			resizable: false,
			decorations: false,
			center: true,
			visible: false,
			skipTaskbar: true,
			alwaysOnTop: true,
			transparent: true,
		});
		webview.once("tauri://created", async function () {
			webview.show();
		});
	}
}

export class HexRecommend {
	constructor() {
		const winWidth = 320;
		const winHeight = 495;

		const webview = new WebviewWindow("hexRecommend", {
			title: "海克斯推荐",
			url: "src/hexRecommend/index.html",
			width: winWidth,
			height: winHeight,
			resizable: false,
			decorations: false,
			center: false,
			visible: false,
			skipTaskbar: true,
			alwaysOnTop: true,
			transparent: true,
		});

		webview.once("tauri://created", async function () {
			// 1. 获取当前显示器信息
			const monitor = await currentMonitor();

			if (monitor) {
				// 2. 计算位置
				// monitor.size 是物理像素，需要除以 scaleFactor 得到逻辑像素
				const scaleFactor = monitor.scaleFactor;
				const screenHeight = monitor.size.height / scaleFactor;

				// 左下角坐标：x=0, y=屏幕高度 - 窗口高度
				// 如果你想距离边缘有一点边距，可以适当调整，例如 x: 10, y: screenHeight - winHeight - 10
				const x = -8;
				const y = screenHeight - winHeight - 2;

				// 3. 设置窗口位置
				await webview.setPosition(new LogicalPosition(x, y));
			}
		});
	}
}
