import { fetch } from "@tauri-apps/plugin-http";
import { sumInfoTypes } from "@/lcu/types/SummonerTypes";
import { SgpServers } from "@/resources/areaList";
import { GamesBySgp, Participant } from "./types/queryMatchSgpGameTypes";

export interface SgpRequestParams {
	playerPuuid: string;
	start: number;
	count: number;
	tag?: string | null;
}

// learn from https://github.com/LeagueAkari/LeagueAkari
export class SgpMatchHistoryService {
	private _cachedToken: string | null = null;
	private sgpBaseUrl: string | null = null;
	private readonly USER_AGENT = "LeagueClient/14.3.558.1234 (SGP)";
	private readonly TIMEOUT = 10000;

	/**
	 * @param _tokenProvider 一个异步函数，调用你提到的“其他接口”来获取最新的 Token
	 */
	constructor(private _tokenProvider: () => Promise<string | null>) {}

	private getBaseUrl() {
		const localSumInfo: sumInfoTypes | null = JSON.parse(
			localStorage.getItem("sumInfo") as string,
		);

		if (!localSumInfo) {
			return null;
		}

		const sgpServer = SgpServers[localSumInfo.newPlatformId];
		if (sgpServer === undefined) {
			return null;
		}
		return sgpServer.matchHistory;
	}

	/**
	 * 公开的查询方法：具备自动重试机制
	 */
	async getMatchHistory(params: SgpRequestParams): Promise<GamesBySgp[]> {
		try {
			// 1. 如果没有缓存的 Token，先获取一个
			if (!this._cachedToken) {
				const token = await this._tokenProvider();
				if (!token) {
					throw new Error("Failed to fetch token");
				}
				this._cachedToken = token;
			}

			// 2. 尝试第一次请求
			return await this._doRequest(params, this._cachedToken);
		} catch (error: any) {
			// 3. 如果失败，尝试检查是否需要重试（通常是 401 Unauthorized）
			console.warn(
				"First SGP request failed, attempting to refresh token...",
				error.message,
			);

			try {
				// 4. 重新调用接口获取 Token 并更新缓存
				const tokenSecond = await this._tokenProvider();
				if (!tokenSecond) {
					throw new Error("Failed to fetch token second");
				}
				this._cachedToken = tokenSecond;

				// 5. 使用新 Token 进行第二次尝试
				console.log("Retrying with new token...");
				return await this._doRequest(params, this._cachedToken);
			} catch (retryError) {
				// 6. 如果第二次也失败了，抛出错误给上层
				console.error("SGP request failed after token refresh.");
				throw retryError;
			}
		}
	}

	/**
	 * 内部底层请求逻辑
	 */
	private async _doRequest(
		params: SgpRequestParams,
		token: string,
	): Promise<GamesBySgp[]> {
		if (this.sgpBaseUrl === null) {
			const baseUrl = this.getBaseUrl();
			if (!baseUrl) {
				throw new Error(`sgpBaseUrl is null`);
			}
			this.sgpBaseUrl = baseUrl;
		}

		const { playerPuuid, start, count, tag } = params;

		// 构建 URL
		const query = new URLSearchParams({
			startIndex: start.toString(),
			count: count.toString(),
		});
		if (tag) query.append("tag", tag);

		const baseUrl = this.sgpBaseUrl.endsWith("/")
			? this.sgpBaseUrl.slice(0, -1)
			: this.sgpBaseUrl;
		const url = `${baseUrl}/match-history-query/v1/products/lol/player/${playerPuuid}/SUMMARY?${query.toString()}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"User-Agent": this.USER_AGENT,
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
			connectTimeout: this.TIMEOUT,
		});

		if (!response.ok) {
			// 如果状态码是 401，说明 Token 过期，此处抛出错误触发 catch 块中的重试
			const errorText = await response.text();
			throw new Error(`SGP_HTTP_ERROR_${response.status}: ${errorText}`);
		}

		// 解析数据
		const data = await response.json();

		const gamesList: GamesBySgp[] = data.games.map((item: any) => {
			const games: GamesBySgp = item.json;

			const participant = games.participants.find(
				(participant: Participant) => participant.puuid === playerPuuid,
			);

			if (participant) {
				games.participants = [participant];
			} else {
				games.participants = [];
			}

			return games;
		});

		return gamesList;
	}
}
