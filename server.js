//------------------------
//    NPM Modules
//------------------------
var fs = require("fs");
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var async = require("async");
var http = require("http");
var footballEngine = require("footballsimulationengine");
var generateTeam = require("./lib/teamGenerator");
var prevIterationLog = [];

//---create a new express server-------
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

//------------------------
//    Express Endpoints
//------------------------
app.all("/", function (req, res) {
	return res.redirect('/home.html');
});

app.all("/home", function (req, res) {
	return res.redirect('/home.html');
});

app.all("/ho", function (req, res) {
	return res.redirect('/home.html');
});

app.all("/hom", function (req, res) {
	return res.redirect('/home.html');
});

app.all("/match", function (req, res) {
	return res.redirect('/home.html');
});

app.all("/info", function (req, res) {
	return res.redirect('/info.html');
});

app.all("/stats", function (req, res) {
	return res.redirect('/info.html');
});

app.all("/home.html", function (req, res, next) {
	next();
});

app.post("/getStartPos", function (req, res) {
	var team1 = req.body.team1;
	var team2 = req.body.team2;
	footballEngine.initiateGame(team1, team2, {
		"pitchWidth": 300,
		"pitchHeight": 450
	}).then(function (matchSetup) {
		if (typeof (matchSetup.kickOffTeam) !== "object") {
			matchSetup.kickOffTeam = JSON.parse(matchSetup.kickOffTeam);
		}
		if (typeof (matchSetup.secondTeam) !== "object") {
			matchSetup.secondTeam = JSON.parse(matchSetup.secondTeam);
		}
		processPositions(matchSetup.kickOffTeam, matchSetup.secondTeam, matchSetup).then(function (sendJson) {
			res.send(sendJson);
		}).catch(function (error) {
			console.error("Eror when processing positions: ", error);
		});
	}).catch(function (error) {
		console.error("Error: ", error);
	});
});

app.post("/startSecondHalf", function (req, res) {
	var matchInput = JSON.parse(req.body.matchjson);
	footballEngine.startSecondHalf(matchInput).then(function (matchSetup) {
		if (typeof (matchSetup.kickOffTeam) !== "object") {
			matchSetup.kickOffTeam = JSON.parse(matchSetup.kickOffTeam);
		}
		if (typeof (matchSetup.secondTeam) !== "object") {
			matchSetup.secondTeam = JSON.parse(matchSetup.secondTeam);
		}
		processPositions(matchSetup.kickOffTeam, matchSetup.secondTeam, matchSetup).then(function (sendJson) {
			res.send(sendJson);
		}).catch(function (error) {
			console.error("Eror when processing positions: ", error);
		});
	}).catch(function (error) {
		console.error("Error: ", error);
	});
});

app.post("/movePlayers", function (req, res) {
	var matchInput = JSON.parse(req.body.matchjson);
	var iterations = req.body.iterations;
	var iterationJSON = {
		"matchjson": matchInput
	};
	prevIterationLog = [];
	var responseJSON;
	var iterationsArray = [];
	for (i = 1; i < iterations; i++) {
		iterationsArray.push(i);
		if (i === (iterations - 1)) {
			async.eachSeries(iterationsArray, function eachPlayer(thisIteration, thisIterationCallback) {
				footballEngine.playIteration(iterationJSON.matchjson).then(function (matchSetup) {
					if (typeof (matchSetup.kickOffTeam) !== "object") {
						matchSetup.kickOffTeam = JSON.parse(matchSetup.kickOffTeam);
					}
					if (typeof (matchSetup.secondTeam) !== "object") {
						matchSetup.secondTeam = JSON.parse(matchSetup.secondTeam);
					}
					processPositions(matchSetup.kickOffTeam, matchSetup.secondTeam, matchSetup).then(function (sendJson) {
						iterationJSON = sendJson;
						thisIterationCallback();
					}).catch(function (error) {
						console.error("Error when processing positions: ", error);
					});
				}).catch(function (error) {
					console.error("Error when completing an iteration: ", error);
				});
			}, function afterAllIterations() {
				res.send(iterationJSON);
			});
		}
	}
});

app.post("/getTeamPlayers", function (req, res) {
	var allPlayers = {
		"team1": [],
		"team2": []
	};
	var teamPlayers = req.body;
	readFile("squads/" + teamPlayers.team1 + ".json").then(function (squad1) {
		async.eachSeries(squad1.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
			allPlayers.team1.push(thisPlayer);
			thisPlayerCallback();
		}, function afterAll1Players() {
			readFile("squads/" + teamPlayers.team2 + ".json").then(function (squad2) {
				async.eachSeries(squad2.players, function eachPlayer(thisPlayer, thisPlayerCallback) {
					allPlayers.team2.push(thisPlayer);
					thisPlayerCallback();
				}, function afterAll2Players() {
					res.send(allPlayers);
				})
			}).catch(function (err) {
				console.error(err);
				res.send(err);
			});
		});
	}).catch(function (err) {
		console.error(err);
		res.send(err);
	});
});

app.post("/generateTeam", function (req, res) {
	var team = {
		"formation": req.body.formation,
		"p1": req.body.p1,
		"p2": req.body.p2,
		"p3": req.body.p3,
		"p4": req.body.p4,
		"p5": req.body.p5,
		"p6": req.body.p6,
		"p7": req.body.p7,
		"p8": req.body.p8,
		"p9": req.body.p9,
		"p10": req.body.p10,
		"p11": req.body.p11,
		"team": req.body.team
	}
	generateTeam.teamGenerator(team.formation, team.p1, team.p2, team.p3, team.p4, team.p5, team.p6, team.p7, team.p8, team.p9, team.p10, team.p11, team.team).then(function (matchDayTeam) {
		res.send(matchDayTeam);
	}).catch(function (err) {
		console.error("Could not generate team: " + err);
		res.send(err);
	});
});

app.get("/getAllStats", function (req, res) {
	readDir("squads").then(function (allPlayerData) {
		res.send(allPlayerData);
	})
});

//------------------------
//   Functions
//------------------------
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

function readDir(dirPath) {
	return new Promise(function (resolve, reject) {
		var allData = [];
		fs.readdirSync(dirPath).forEach(file => {
			readFile(dirPath + "/" + file).then(function (filecontent) {
				if (filecontent.name) {
					if (filecontent.name === "Uruguay") {
						allData.push(filecontent);
						resolve(allData);
					} else {
						allData.push(filecontent);
					}
				} else {
					reject("Please select team or player stats to collect");
				}
			}).catch(function (err) {
				console.error(err);
			})
		});
	});
}

function processPositions(A, B, C) {
	return new Promise(function (resolve, reject) {
		var sendArray = [];
		sendArray.push(C.pitchSize[0]);
		sendArray.push(C.pitchSize[1]);
		async.eachSeries(A.players, function eachPlayer(thisPlayerA, thisPlayerACallback) {
			sendArray.push(thisPlayerA.startPOS[0]);
			sendArray.push(thisPlayerA.startPOS[1]);
			thisPlayerACallback();
		}, function afterAllAPlayers() {
			async.eachSeries(B.players, function eachPlayer(thisPlayerB, thisPlayerBCallback) {
				sendArray.push(thisPlayerB.startPOS[0]);
				sendArray.push(thisPlayerB.startPOS[1]);
				thisPlayerBCallback();
			}, function afterAllBPlayers() {
				sendArray.push(C.ball.position[0]);
				sendArray.push(C.ball.position[1]);
				var thisIterationLog = C.iterationLog;
				prevIterationLog.push(thisIterationLog);
				C.iterationLog = prevIterationLog;
				sendArray.push(C);
				var returnJson = {
					"matchjson": C,
					"positions": sendArray
				}
				resolve(returnJson);
			});
		});
	});
}
//------------------------
//    Express HTTP
//------------------------

// serve the files out of ./public as our main files
app.use(express.static("public"));

//create a HTTP listener
http.createServer(app).listen(1442);
console.log("server starting on IP using port 1442 for HTTP");
