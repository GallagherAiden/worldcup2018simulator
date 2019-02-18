var fs = require("fs");
var async = require("async");

function teamGenerator(formation, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, team) {
	return new Promise(function (resolve, reject) {
		readFile("squads/" + team + ".json").then(function (squad) {
			var formations = [];
			formations[0] = [
				[150, 0], "GK", [80, 55], "LB", [130, 55], "CB", [170, 55], "CB", [220, 55], "RB", [80, 130], "LM", [130, 130], "CM", [170, 130], "CM", [220, 130], "RM", [130, 185], "ST", [170, 185], "ST"
			];
			formations[1] = [
				[150, 0], "GK", [80, 55], "LB", [130, 55], "CB", [170, 55], "CB", [220, 55], "RB", [100, 130], "CM", [150, 130], "CM", [200, 130], "CM", [100, 185], "ST", [150, 185], "ST", [200, 185], "ST"
			];
			formations[2] = [
				[150, 0], "GK", [60, 65], "LB", [105, 55], "CB", [150, 55], "CB", [195, 55], "CB", [240, 65], "RB", [100, 130], "CM", [150, 130], "CM", [200, 130], "CM", [130, 185], "ST", [170, 185], "ST"
			];
			formations[3] = [
				[150, 0], "GK", [100, 55], "CB", [150, 55], "CB", [200, 55], "CB", [40, 140], "LM", [100, 130], "CM", [150, 130], "CM", [200, 130], "CM", [260, 140], "RM", [130, 185], "ST", [170, 185], "ST"
			];
			formations[4] = [
				[150, 0], "GK", [80, 55], "LB", [130, 55], "CB", [170, 55], "CB", [220, 55], "RB", [60, 140], "LM", [100, 130], "CM", [150, 130], "CM", [200, 130], "CM", [240, 140], "RM", [150, 185], "ST"
			];
			formations[5] = [
				[150, 0], "GK", [100, 55], "CB", [150, 55], "CB", [200, 55], "CB", [80, 130], "LM", [130, 130], "CM", [170, 130], "CM", [220, 130], "RM", [100, 185], "ST", [150, 185], "ST", [200, 185], "ST"
			];
			var thisFormation;
			var thisSquad = {
				"name": "",
				"players": []
			};
			var matchDayTeam = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11];
			if (formation !== "4-4-2" && formation !== "4-3-3" && formation !== "5-3-2" && formation !== "3-5-2" && formation !== "4-5-1" && formation !== "3-4-3") {
				formation = "4-4-2";
			}
			if (formation === "4-4-2") {
				thisFormation = formations[0];
			} else if (formation === "4-3-3") {
				thisFormation = formations[1];
			} else if (formation === "5-3-2") {
				thisFormation = formations[2];
			} else if (formation === "3-5-2") {
				thisFormation = formations[3];
			} else if (formation === "4-5-1") {
				thisFormation = formations[4];
			} else if (formation === "3-4-3") {
				thisFormation = formations[5];
			}
			thisSquad.name = squad.name;
			thisSquad.players = [];
			async.eachSeries(matchDayTeam, function eachPlayer(currentPlayer, currentPlayerCallback) {
				async.eachSeries(squad.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
					var tempPlayer = JSON.parse(JSON.stringify(thisPlayer));
					if (currentPlayer === tempPlayer.name) {
						thisSquad.players.push(tempPlayer);
						thisPlayerCallback();
					} else {
						thisPlayerCallback();
					}
				}, function afterAllSquadChecked() {
					currentPlayerCallback();
				});
			}, function afterAllPlayers() {
				thisSquad.players[0].startPOS = thisFormation[0];
				thisSquad.players[0].position = thisFormation[1];
				thisSquad.players[0].injured = false;
				thisSquad.players[1].startPOS = thisFormation[2];
				thisSquad.players[1].position = thisFormation[3];
				thisSquad.players[1].injured = false;
				thisSquad.players[2].startPOS = thisFormation[4];
				thisSquad.players[2].position = thisFormation[5];
				thisSquad.players[2].injured = false;
				thisSquad.players[3].startPOS = thisFormation[6];
				thisSquad.players[3].position = thisFormation[7];
				thisSquad.players[3].injured = false;
				thisSquad.players[4].startPOS = thisFormation[8];
				thisSquad.players[4].position = thisFormation[9];
				thisSquad.players[4].injured = false;
				thisSquad.players[5].startPOS = thisFormation[10];
				thisSquad.players[5].position = thisFormation[11];
				thisSquad.players[5].injured = false;
				thisSquad.players[6].startPOS = thisFormation[12];
				thisSquad.players[6].position = thisFormation[13];
				thisSquad.players[6].injured = false;
				thisSquad.players[7].startPOS = thisFormation[14];
				thisSquad.players[7].position = thisFormation[15];
				thisSquad.players[7].injured = false;
				thisSquad.players[8].startPOS = thisFormation[16];
				thisSquad.players[8].position = thisFormation[17];
				thisSquad.players[8].injured = false;
				thisSquad.players[9].startPOS = thisFormation[18];
				thisSquad.players[9].position = thisFormation[19];
				thisSquad.players[9].injured = false;
				thisSquad.players[10].startPOS = thisFormation[20];
				thisSquad.players[10].position = thisFormation[21];
				thisSquad.players[10].injured = false;
				resolve(thisSquad);
			});
		}).catch(function (err) {
			if (err) {
				console.error(err);
			}
		});
	});
}

function readFile(filePath) {
	return new Promise(function (resolve, reject) {
		fs.readFile(filePath, 'utf8', function (err, data) {
			if (err) {
				reject(err);
			} else {
				data = JSON.parse(data);
				resolve(data);
			}
		})
	});
}

module.exports = {
	teamGenerator: teamGenerator
};
