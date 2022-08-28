/* eslint-disable no-inline-comments */

const PATH = "D:/VSMS/server";
// server.jar 所在路徑

const option = {
	player: {
		DataClear         : true, // 玩家數據清除 ( .dat & .dat_old )
		StatsClear        : true, // 玩家統計數據清除 ( .json )
		AdvancementsClear : true, // 玩家成就數據清除 ( .json )
	},
	world: {
		SmallFileClear: 1024000, // 低於此數值的世界檔案會被清除 ( 單位 位元組 )
	},
};


// #region 依賴
const fs = require("fs");
// #endregion


// #region 玩家數據清除
// 清除不在 whitelist.json & ops.json 的玩家數據 ( .dat & .dat_old )
// 我自己 >> 清除前 764 KB | 清除後 241 KB
if (option.player.DataClear) {
	const Player = [];
	const Ban = [];
	const white = JSON.parse(fs.readFileSync(`${PATH}/whitelist.json`).toString());
	const ban = JSON.parse(fs.readFileSync(`${PATH}/banned-players.json`).toString());
	for (let index = 0; index < ban.length; index++) {
		Ban.push(ban[index].uuid);
		Ban.push(ban[index].name);
	}
	for (let index = 0; index < white.length; index++)
		if (Ban.includes(white[index].uuid) || Ban.includes(white[index].name))
			white.splice(0, 1);
	fs.writeFileSync(`${PATH}/whitelist.json`, JSON.stringify(white));
	for (let index = 0; index < white.length; index++)
		Player.push(white[index].uuid);
	const ops = JSON.parse(fs.readFileSync(`${PATH}/ops.json`).toString());
	for (let index = 0; index < ops.length; index++)
		Player.push(ops[index].uuid);
	const List = fs.readdirSync(`${PATH}/world/playerdata`);
	for (let index = 0; index < List.length; index++)
		if (!Player.includes(List[index].replace(".dat", "").replace(".dat_old", "")))
			fs.unlinkSync(`${PATH}/world/playerdata/${List[index]}`);

	// #region 玩家統計數據清除
	// 清除不在 whitelist.json & ops.json 的玩家數據 ( .json )
	// 我自己 >> 清除前 821 KB | 清除後 728 KB
	if (option.player.StatsClear) {
		const SList = fs.readdirSync(`${PATH}/world/stats`);
		for (let index = 0; index < SList.length; index++)
			if (!Player.includes(SList[index].replace(".json", "")))
				fs.unlinkSync(`${PATH}/world/stats/${SList[index]}`);
	}
	// #endregion

	// #region 玩家成就數據清除
	// 清除不在 whitelist.json & ops.json 的玩家數據 ( .json )
	// 我自己 >> 清除前 3.21 MB | 清除後 2.77 MB
	if (option.player.AdvancementsClear) {
		const AList = fs.readdirSync(`${PATH}/world/advancements`);
		for (let index = 0; index < AList.length; index++)
			if (!Player.includes(AList[index].replace(".json", "")))
				fs.unlinkSync(`${PATH}/world/advancements/${AList[index]}`);
	}
	// #endregion
}
// #endregion


// #region 世界檔案清除
// if (option.world.SmallFileClear != 0) {
// 	// 我自己 >> 清除前 12.9 GB (13,950,295,282 位元組) | 清除後 12.8 GB (13,754,439,835 位元組)
// 	const WList = fs.readdirSync(`${PATH}/world/region`);
// 	for (let index = 0; index < WList.length; index++) {
// 		const S = fs.statSync(`${PATH}/world/region/${WList[index]}`);
// 		if (S.size < option.world.SmallFileClear)
// 			fs.unlinkSync(`${PATH}/world/region/${WList[index]}`);
// 	}
// 	// 我自己 >> 清除前 1.90 GB (2,045,203,288 位元組) | 清除後 1.85 GB (1,994,933,339 位元組)
// 	const WList1 = fs.readdirSync(`${PATH}/world/DIM1/region`);
// 	for (let index = 0; index < WList1.length; index++) {
// 		const S = fs.statSync(`${PATH}/world/DIM1/region/${WList1[index]}`);
// 		if (S.size < option.world.SmallFileClear)
// 			fs.unlinkSync(`${PATH}/world/DIM1/region/${WList1[index]}`);
// 	}
// 	// 我自己 >> 清除前 789 MB (828,119,496 位元組) | 清除後 764 MB (801,674,298 位元組)
// 	const WList2 = fs.readdirSync(`${PATH}/world/DIM-1/region`);
// 	for (let index = 0; index < WList2.length; index++) {
// 		const S = fs.statSync(`${PATH}/world/DIM-1/region/${WList2[index]}`);
// 		if (S.size < option.world.SmallFileClear)
// 			fs.unlinkSync(`${PATH}/world/DIM-1/region/${WList2[index]}`);
// 	}
// }
// #endregion