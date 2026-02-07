export interface GamesBySgp {
	endOfGameResult: string;
	gameCreation: number;
	gameDuration: number;
	gameEndTimestamp: number;
	gameId: number;
	gameMode: string;
	gameModeMutators: any[];
	gameName: string;
	gameStartTimestamp: number;
	gameType: string;
	gameVersion: string;
	mapId: number;
	participants: Participant[];
	platformId: string;
	queueId: number;
	seasonId: number;
	teams: Team[];
	tournamentCode: string;
}

export interface Participant {
	PlayerScore0: number;
	PlayerScore1: number;
	PlayerScore10: number;
	PlayerScore11: number;
	PlayerScore2: number;
	PlayerScore3: number;
	PlayerScore4: number;
	PlayerScore5: number;
	PlayerScore6: number;
	PlayerScore7: number;
	PlayerScore8: number;
	PlayerScore9: number;
	allInPings: number;
	assistMePings: number;
	assists: number;
	baronKills: number;
	basicPings: number;
	challenges: Challenges;
	champExperience: number;
	champLevel: number;
	championId: number;
	championName: string;
	championTransform: number;
	commandPings: number;
	consumablesPurchased: number;
	damageDealtToBuildings: number;
	damageDealtToEpicMonsters: number;
	damageDealtToObjectives: number;
	damageDealtToTurrets: number;
	damageSelfMitigated: number;
	dangerPings: number;
	deaths: number;
	detectorWardsPlaced: number;
	doubleKills: number;
	dragonKills: number;
	eligibleForProgression: boolean;
	enemyMissingPings: number;
	enemyVisionPings: number;
	firstBloodAssist: boolean;
	firstBloodKill: boolean;
	firstTowerAssist: boolean;
	firstTowerKill: boolean;
	gameEndedInEarlySurrender: boolean;
	gameEndedInSurrender: boolean;
	getBackPings: number;
	goldEarned: number;
	goldSpent: number;
	holdPings: number;
	individualPosition: IndividualPosition;
	inhibitorKills: number;
	inhibitorTakedowns: number;
	inhibitorsLost: number;
	item0: number;
	item1: number;
	item2: number;
	item3: number;
	item4: number;
	item5: number;
	item6: number;
	itemsPurchased: number;
	killingSprees: number;
	kills: number;
	lane: Lane;
	largestCriticalStrike: number;
	largestKillingSpree: number;
	largestMultiKill: number;
	longestTimeSpentLiving: number;
	magicDamageDealt: number;
	magicDamageDealtToChampions: number;
	magicDamageTaken: number;
	missions: { [key: string]: number };
	needVisionPings: number;
	neutralMinionsKilled: number;
	nexusKills: number;
	nexusLost: number;
	nexusTakedowns: number;
	objectivesStolen: number;
	objectivesStolenAssists: number;
	onMyWayPings: number;
	participantId: number;
	pentaKills: number;
	perks: Perks;
	physicalDamageDealt: number;
	physicalDamageDealtToChampions: number;
	physicalDamageTaken: number;
	placement: number;
	playerAugment1: number;
	playerAugment2: number;
	playerAugment3: number;
	playerAugment4: number;
	playerAugment5: number;
	playerAugment6: number;
	playerSubteamId: number;
	profileIcon: number;
	pushPings: number;
	puuid: string;
	quadraKills: number;
	retreatPings: number;
	riotIdGameName: string;
	riotIdTagline: string;
	role: Role;
	roleBoundItem: number;
	sightWardsBoughtInGame: number;
	spell1Casts: number;
	spell1Id: number;
	spell2Casts: number;
	spell2Id: number;
	spell3Casts: number;
	spell4Casts: number;
	subteamPlacement: number;
	summoner1Casts: number;
	summoner2Casts: number;
	summonerId: number;
	summonerLevel: number;
	summonerName: string;
	teamEarlySurrendered: boolean;
	teamId: number;
	teamPosition: string;
	timeCCingOthers: number;
	timePlayed: number;
	totalAllyJungleMinionsKilled: number;
	totalDamageDealt: number;
	totalDamageDealtToChampions: number;
	totalDamageShieldedOnTeammates: number;
	totalDamageTaken: number;
	totalEnemyJungleMinionsKilled: number;
	totalHeal: number;
	totalHealsOnTeammates: number;
	totalMinionsKilled: number;
	totalTimeCCDealt: number;
	totalTimeSpentDead: number;
	totalUnitsHealed: number;
	tripleKills: number;
	trueDamageDealt: number;
	trueDamageDealtToChampions: number;
	trueDamageTaken: number;
	turretKills: number;
	turretTakedowns: number;
	turretsLost: number;
	unrealKills: number;
	visionClearedPings: number;
	visionScore: number;
	visionWardsBoughtInGame: number;
	wardsKilled: number;
	wardsPlaced: number;
	win: boolean;
}

export interface Challenges {
	"12AssistStreakCount": number;
	HealFromMapSources: number;
	InfernalScalePickup: number;
	SWARM_DefeatAatrox: number;
	SWARM_DefeatBriar: number;
	SWARM_DefeatMiniBosses: number;
	SWARM_EvolveWeapon: number;
	SWARM_Have3Passives: number;
	SWARM_KillEnemy: number;
	SWARM_PickupGold: number;
	SWARM_ReachLevel50: number;
	SWARM_Survive15Min: number;
	SWARM_WinWith5EvolvedWeapons: number;
	abilityUses: number;
	acesBefore15Minutes: number;
	alliedJungleMonsterKills: number;
	baronTakedowns: number;
	blastConeOppositeOpponentCount: number;
	bountyGold: number;
	buffsStolen: number;
	completeSupportQuestInTime: number;
	controlWardsPlaced: number;
	damagePerMinute: number;
	damageTakenOnTeamPercentage: number;
	dancedWithRiftHerald: number;
	deathsByEnemyChamps: number;
	dodgeSkillShotsSmallWindow: number;
	doubleAces: number;
	dragonTakedowns: number;
	effectiveHealAndShielding: number;
	elderDragonKillsWithOpposingSoul: number;
	elderDragonMultikills: number;
	enemyChampionImmobilizations: number;
	enemyJungleMonsterKills: number;
	epicMonsterKillsNearEnemyJungler: number;
	epicMonsterKillsWithin30SecondsOfSpawn: number;
	epicMonsterSteals: number;
	epicMonsterStolenWithoutSmite: number;
	firstTurretKilled: number;
	firstTurretKilledTime?: number;
	fistBumpParticipation: number;
	flawlessAces: number;
	fullTeamTakedown: number;
	gameLength: number;
	getTakedownsInAllLanesEarlyJungleAsLaner: number;
	goldPerMinute: number;
	hadOpenNexus: number;
	immobilizeAndKillWithAlly: number;
	initialBuffCount: number;
	initialCrabCount: number;
	jungleCsBefore10Minutes: number;
	junglerTakedownsNearDamagedEpicMonster: number;
	kTurretsDestroyedBeforePlatesFall: number;
	kda: number;
	killAfterHiddenWithAlly: number;
	killParticipation: number;
	killedChampTookFullTeamDamageSurvived: number;
	killingSprees: number;
	killsNearEnemyTurret: number;
	killsOnOtherLanesEarlyJungleAsLaner: number;
	killsOnRecentlyHealedByAramPack: number;
	killsUnderOwnTurret: number;
	killsWithHelpFromEpicMonster: number;
	knockEnemyIntoTeamAndKill: number;
	landSkillShotsEarlyGame: number;
	laneMinionsFirst10Minutes: number;
	legendaryCount: number;
	legendaryItemUsed: number[];
	lostAnInhibitor: number;
	maxKillDeficit: number;
	mejaisFullStackInTime: number;
	moreEnemyJungleThanOpponent: number;
	multiKillOneSpell: number;
	multiTurretRiftHeraldCount: number;
	multikills: number;
	multikillsAfterAggressiveFlash: number;
	outerTurretExecutesBefore10Minutes: number;
	outnumberedKills: number;
	outnumberedNexusKill: number;
	perfectDragonSoulsTaken: number;
	perfectGame: number;
	pickKillWithAlly: number;
	poroExplosions: number;
	quickCleanse: number;
	quickFirstTurret: number;
	quickSoloKills: number;
	riftHeraldTakedowns: number;
	saveAllyFromDeath: number;
	scuttleCrabKills: number;
	shortestTimeToAceFromFirstTakedown?: number;
	skillshotsDodged: number;
	skillshotsHit: number;
	snowballsHit: number;
	soloBaronKills: number;
	soloKills: number;
	stealthWardsPlaced: number;
	survivedSingleDigitHpCount: number;
	survivedThreeImmobilizesInFight: number;
	takedownOnFirstTurret: number;
	takedowns: number;
	takedownsAfterGainingLevelAdvantage: number;
	takedownsBeforeJungleMinionSpawn: number;
	takedownsFirstXMinutes: number;
	takedownsInAlcove: number;
	takedownsInEnemyFountain: number;
	teamBaronKills: number;
	teamDamagePercentage: number;
	teamElderDragonKills: number;
	teamRiftHeraldKills: number;
	tookLargeDamageSurvived: number;
	turretPlatesTaken: number;
	turretTakedowns: number;
	turretsTakenWithRiftHerald: number;
	twentyMinionsIn3SecondsCount: number;
	twoWardsOneSweeperCount: number;
	unseenRecalls: number;
	visionScorePerMinute: number;
	voidMonsterKill: number;
	wardTakedowns: number;
	wardTakedownsBefore20M: number;
	wardsGuarded: number;
	highestChampionDamage?: number;
	highestCrowdControlScore?: number;
}

export enum IndividualPosition {
	Invalid = "Invalid",
}

export enum Lane {
	Bottom = "BOTTOM",
	Middle = "MIDDLE",
	Top = "TOP",
}

export interface Perks {
	statPerks: StatPerks;
	styles: Style[];
}

export interface StatPerks {
	defense: number;
	flex: number;
	offense: number;
}

export interface Style {
	description: Description;
	selections: Selection[];
	style: number;
}

export enum Description {
	PrimaryStyle = "primaryStyle",
	SubStyle = "subStyle",
}

export interface Selection {
	perk: number;
	var1: number;
	var2: number;
	var3: number;
}

export enum Role {
	Duo = "DUO",
	Solo = "SOLO",
	Support = "SUPPORT",
}

export interface Team {
	bans: any[];
	feats: Feats;
	objectives: Objectives;
	teamId: number;
	win: boolean;
}

export interface Feats {
	EPIC_MONSTER_KILL: EpicMonsterKill;
	FIRST_BLOOD: EpicMonsterKill;
	FIRST_TURRET: EpicMonsterKill;
}

export interface EpicMonsterKill {
	featState: number;
}

export interface Objectives {
	atakhan: Atakhan;
	baron: Atakhan;
	champion: Atakhan;
	dragon: Atakhan;
	horde: Atakhan;
	inhibitor: Atakhan;
	riftHerald: Atakhan;
	tower: Atakhan;
}

export interface Atakhan {
	first: boolean;
	kills: number;
}
