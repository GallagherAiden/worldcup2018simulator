var team1json;
var team2json;
var team1;
var team2;
var matchjson;
var matchInfo;
var its = 0;
var loggingArray = ["", "", "", "", "", "", "", "", "", ""];
var lastHomeGoals = 0;
var lastAwayGoals = 0;
var homeInjured = false;
var awayInjured = false;

function loadTasks() {
	var url_string = window.location.href;
	var url = new URL(url_string);
	var fullQuery = url.searchParams.get("team1json");
	var splitJsons = fullQuery.split("team2json=");
	team1json = splitJsons[0];
	team2json = splitJsons[1];
	team1 = JSON.parse(team1json);
	team2 = JSON.parse(team2json);
	for (i = 0; i < team1.players.length; i++) {
		document.getElementById("hometeam").innerHTML += "<h6>" + team1.players[i].position + " " + team1.players[i].name + "</h6>";
		document.getElementById("awayteam").innerHTML += "<h6>" + team2.players[i].position + " " + team2.players[i].name + "</h6>";
	}
	document.getElementById("header").innerHTML = "<h2>" + team1.name + " 0 (0') 0 " + team2.name + "</h2";
}

function simulateMatch() {
	its = 0;
	document.getElementById("homeout").innerHTML = "";
	document.getElementById("awayout").innerHTML = "";
	document.getElementById("output").innerHTML = "";
	document.getElementById("pitch").innerHTML = "0 Goals 0<br> 0 Shots 0 <br>0 Corners 0 <br> 0 Freekicks 0 <br> 0 Penalties 0 <br>0 Fouls 0";
	document.getElementById("stats").innerHTML = "";
	var lastHomeGoals = 0;
	var lastAwayGoals = 0;
	setPositions();
}

function watchMatch() {
	its = 0;
	document.getElementById("homeout").innerHTML = "";
	document.getElementById("awayout").innerHTML = "";
	document.getElementById("output").innerHTML = "";
	document.getElementById("pitch").innerHTML = '<canvas id="map" style="border:1px solid #000000; background: url(\'img/pitch.jpg\'); background-size: 100% 100%;">';
	document.getElementById("stats").innerHTML = "0 Goals 0<br> 0 Shots 0 <br>0 Corners 0 <br> 0 Freekicks 0 <br> 0 Penalties 0 <br>0 Fouls 0";
	var lastHomeGoals = 0;
	var lastAwayGoals = 0;
	setPositionsWatch();
}

function startMatch() {
	its = 0;
	document.getElementById("homeout").innerHTML = "";
	document.getElementById("awayout").innerHTML = "";
	document.getElementById("output").innerHTML = "";
	var lastHomeGoals = 0;
	var lastAwayGoals = 0;
	setPositionsWatch();
}

function moveMatch() {
	document.getElementById("output").innerHTML = "";
	getMatchWatchSlow();
}

function switchMatch() {
	switchSidesWatch();
}

function getMatchWatchSlow() {
	var iterations = 10;
	for (i = 0; i < iterations; i++) {
		setTimeout(function () {
			movePlayersWatch();
		}, 3000);
	}
}

function setPositions() {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			matchInfo = result.positions[result.positions.length - 1];
			matchjson = result.matchjson;
			getMatch();
		}
	};
	http.open("POST", "/getStartPos", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("team1=" + team1json + "&team2=" + team2json);
}

function getMatch() {
	// var iterations = 10000;
	// for (i = 0; i < iterations; i++) {
	// 	setTimeout(function () {
	movePlayers();
	// 	}, 300);
	// }
}

function movePlayers() {
	//complete player movements in sets of movements
	var iterations = 50;
	var totalIterations = 10000;
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			matchjson = result.matchjson;
			matchInfo = result.positions[result.positions.length - 1];
			for (k = 0; k < iterations - 1; k++) {
				its++;
				var time = Math.round((90 / totalIterations) * its);
				document.getElementById("header").innerHTML = "<h2>" + team1.name + " " + matchInfo.kickOffTeamStatistics.goals + " ( " + time + "') " + matchInfo.secondTeamStatistics.goals + " " + team2.name + "</h2>";
				var events = matchInfo.iterationLog[k];
				for (i = 0; i < events.length; i++) {
					var thisEvent = events[i];
					if (thisEvent.includes("Player Injured - ")) {
						var split = thisEvent.split(" - ");
						var playerName = split[1];
						for (j = 0; j < team1.players.length; j++) {
							var comparePlayerA = team1.players[j].name;
							var comparePlayerB = team2.players[j].name;
							if (comparePlayerA === playerName) {
								homeInjured = true;
							}
							if (comparePlayerB === playerName) {
								awayInjured = true;
							}
						}
						if (homeInjured === true) {
							document.getElementById("homeout").innerHTML += playerName + "(+)";
							homeInjured = false;
							awayInjured = false;
						}
						if (awayInjured === true) {
							document.getElementById("awayout").innerHTML += playerName + "(+)";
							homeInjured = false;
							awayInjured = false;
						}
					}
					if (thisEvent.includes("Goal Scored by: ")) {
						// document.getElementById("output").innerHTML += "<br> " + JSON.stringify(matchInfo.iterationLog);
						var split = thisEvent.split(": ");
						var playerName = split[1];
						if (lastHomeGoals < matchInfo.kickOffTeamStatistics.goals) {
							lastHomeGoals++;
							document.getElementById("homeout").innerHTML += playerName + " (" + time + ") ";
						}
						if (lastAwayGoals < matchInfo.secondTeamStatistics.goals) {
							lastAwayGoals++;
							document.getElementById("awayout").innerHTML += playerName + " (" + time + ") ";
						}
					}
				}
			}
			document.getElementById("header").innerHTML = "<h2>" + team1.name + " " + matchInfo.kickOffTeamStatistics.goals + " ( " + time + "') " + matchInfo.secondTeamStatistics.goals + " " + team2.name + "</h2>";
			document.getElementById("pitch").innerHTML = matchInfo.kickOffTeamStatistics.goals + " Goals " + matchInfo.secondTeamStatistics.goals + "<br>";
			document.getElementById("pitch").innerHTML += matchInfo.kickOffTeamStatistics.shots + " Shots " + matchInfo.secondTeamStatistics.shots + "<br>";
			document.getElementById("pitch").innerHTML += matchInfo.kickOffTeamStatistics.corners + " Corners " + matchInfo.secondTeamStatistics.corners + "<br>";
			document.getElementById("pitch").innerHTML += matchInfo.kickOffTeamStatistics.freekicks + " Freekicks " + matchInfo.secondTeamStatistics.freekicks + "<br>";
			document.getElementById("pitch").innerHTML += matchInfo.kickOffTeamStatistics.penalties + " Penalties " + matchInfo.secondTeamStatistics.penalties + "<br>";
			document.getElementById("pitch").innerHTML += matchInfo.kickOffTeamStatistics.fouls + " Fouls " + matchInfo.secondTeamStatistics.fouls;
			matchjson.iterationLog = [];
			if (its > (totalIterations / 2) && its < ((totalIterations / 2) + 50)) {
				switchSides();
			} else if (its > totalIterations) {

			} else {
				movePlayers();
			}
		}
	};
	http.open("POST", "/movePlayers", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("matchjson=" + JSON.stringify(matchjson) + "&iterations=" + iterations);
}

function switchSides() {
	loggingArray = ["", "", "", "", "", "", "", "", "", ""];
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			matchjson = result.matchjson;
			matchInfo = result.positions[result.positions.length - 1];
			movePlayers();
		}
	};
	http.open("POST", "/startSecondHalf", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("matchjson=" + JSON.stringify(matchjson));
}

//--------------------------Watch Match-----------------------

function setPositionsWatch() {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			matchInfo = result.positions[result.positions.length - 1];
			matchjson = result.matchjson;
			var c = document.getElementById("map");
			var ctx = c.getContext("2d");
			ctx.canvas.width = result.positions[0];
			ctx.canvas.height = result.positions[1];
			for (i = 2; i < result.positions.length - 1; i++) {
				ctx.beginPath();
				ctx.moveTo(result.positions[i], result.positions[i + 1]);
				ctx.lineTo(result.positions[i] + 1, result.positions[i + 1] + 1);
				if (i < 24) {
					ctx.strokeStyle = '#ff0000';
				} else if (i > 12 && i < result.positions.length - 3) {
					ctx.strokeStyle = '#0000FF';
				} else {
					ctx.strokeStyle = '#000000';
				}
				ctx.stroke();
				i++;
			}
			ctx.moveTo(result.positions[result.positions.length - 3], result.positions[result.positions.length - 2]);
			ctx.lineTo(result.positions[result.positions.length - 3] + 1, result.positions[result.positions.length - 2] + 1);
			ctx.stroke();
			getMatchWatch();
		}
	};
	http.open("POST", "/getStartPos", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("team1=" + team1json + "&team2=" + team2json);
}

function getMatchWatch() {
	// var iterations = 10000;
	// for (i = 0; i < iterations; i++) {
	// 	setTimeout(function () {
	movePlayersWatch();
	// 	}, 300);
	// }
}

function movePlayersWatch() {
	//complete player movements in sets of movements
	var iterations = 20;
	var totalIterations = 10000;
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			matchjson = result.matchjson;
			matchInfo = result.positions[result.positions.length - 1];
			for (k = 0; k < iterations - 1; k++) {
				its++;
				var time = Math.round((90 / totalIterations) * its);
				document.getElementById("header").innerHTML = "<h2>" + team1.name + " " + matchInfo.kickOffTeamStatistics.goals + " ( " + time + "') " + matchInfo.secondTeamStatistics.goals + " " + team2.name + "</h2>";
				var events = matchInfo.iterationLog[k];
				for (i = 0; i < events.length; i++) {
					var thisEvent = events[i];
					if (thisEvent.includes("Player Injured - ")) {
						var split = thisEvent.split(" - ");
						var playerName = split[1];
						for (j = 0; j < team1.players.length; j++) {
							var comparePlayerA = team1.players[j].name;
							var comparePlayerB = team2.players[j].name;
							if (comparePlayerA === playerName) {
								homeInjured = true;
							}
							if (comparePlayerB === playerName) {
								awayInjured = true;
							}
						}
						if (homeInjured === true) {
							document.getElementById("homeout").innerHTML += playerName + "(+)";
							homeInjured = false;
							awayInjured = false;
						}
						if (awayInjured === true) {
							document.getElementById("awayout").innerHTML += playerName + "(+)";
							homeInjured = false;
							awayInjured = false;
						}
					}
					if (thisEvent.includes("Goal Scored by: ")) {
						// document.getElementById("output").innerHTML += "<br> " + JSON.stringify(matchInfo.iterationLog);
						var split = thisEvent.split(": ");
						var playerName = split[1];
						if (lastHomeGoals < matchInfo.kickOffTeamStatistics.goals) {
							lastHomeGoals++;
							document.getElementById("homeout").innerHTML += playerName + " (" + time + ") ";
						}
						if (lastAwayGoals < matchInfo.secondTeamStatistics.goals) {
							lastAwayGoals++;
							document.getElementById("awayout").innerHTML += playerName + " (" + time + ") ";
						}
					}
				}
			}
			var c = document.getElementById("map");
			var ctx = c.getContext("2d");
			ctx.canvas.width = result.positions[0];
			ctx.canvas.height = result.positions[1];
			for (i = 2; i < result.positions.length - 1; i++) {
				ctx.beginPath();
				ctx.moveTo(result.positions[i], result.positions[i + 1]);
				ctx.lineTo(result.positions[i] + 1, result.positions[i + 1] + 1);
				if (i < 24) {
					ctx.strokeStyle = '#ff0000';
				} else if (i > 12 && i < result.positions.length - 3) {
					ctx.strokeStyle = '#0000FF';
				} else {
					ctx.strokeStyle = '#000000';
				}
				ctx.stroke();
				i++;
			}
			ctx.moveTo(result.positions[result.positions.length - 3], result.positions[result.positions.length - 2]);
			ctx.lineTo(result.positions[result.positions.length - 3] + 1, result.positions[result.positions.length - 2] + 1);
			ctx.stroke();
			document.getElementById("stats").innerHTML = matchInfo.kickOffTeamStatistics.goals + " Goals " + matchInfo.secondTeamStatistics.goals + "<br>";
			document.getElementById("stats").innerHTML += matchInfo.kickOffTeamStatistics.shots + " Shots " + matchInfo.secondTeamStatistics.shots + "<br>";
			document.getElementById("stats").innerHTML += matchInfo.kickOffTeamStatistics.corners + " Corners " + matchInfo.secondTeamStatistics.corners + "<br>";
			document.getElementById("stats").innerHTML += matchInfo.kickOffTeamStatistics.freekicks + " Freekicks " + matchInfo.secondTeamStatistics.freekicks + "<br>";
			document.getElementById("stats").innerHTML += matchInfo.kickOffTeamStatistics.penalties + " Penalties " + matchInfo.secondTeamStatistics.penalties + "<br>";
			document.getElementById("stats").innerHTML += matchInfo.kickOffTeamStatistics.fouls + " Fouls " + matchInfo.secondTeamStatistics.fouls;
			matchjson.iterationLog = [];
			if (its > (totalIterations / 2) && its < ((totalIterations / 2) + 50)) {
				switchSidesWatch();
			} else if (its > totalIterations) {
				document.getElementById("pitch").innerHTML = '<canvas id="map" style="border:1px solid #000000; background: url(\'img/pitch.jpg\'); background-size: 100% 100%;">';
			} else {
				movePlayersWatch();
			}
		}
	};
	http.open("POST", "/movePlayers", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("matchjson=" + JSON.stringify(matchjson) + "&iterations=" + iterations);
}

function switchSidesWatch() {
	loggingArray = ["", "", "", "", "", "", "", "", "", ""];
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			matchjson = result.matchjson;
			matchInfo = result.positions[result.positions.length - 1];
			var c = document.getElementById("map");
			var ctx = c.getContext("2d");
			ctx.canvas.width = result.positions[0];
			ctx.canvas.height = result.positions[1];
			for (i = 2; i < result.positions.length - 1; i++) {
				ctx.beginPath();
				ctx.moveTo(result.positions[i], result.positions[i + 1]);
				ctx.lineTo(result.positions[i] + 1, result.positions[i + 1] + 1);
				if (i < 24) {
					ctx.strokeStyle = '#ff0000';
				} else if (i > 12 && i < result.positions.length - 3) {
					ctx.strokeStyle = '#0000FF';
				} else {
					ctx.strokeStyle = '#000000';
				}
				ctx.stroke();
				i++;
			}
			ctx.moveTo(result.positions[result.positions.length - 3], result.positions[result.positions.length - 2]);
			ctx.lineTo(result.positions[result.positions.length - 3] + 1, result.positions[result.positions.length - 2] + 1);
			ctx.stroke();
			movePlayersWatch();
		}
	};
	http.open("POST", "/startSecondHalf", true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("matchjson=" + JSON.stringify(matchjson));
}

angular.module('ionicApp', ['ionic'])

	.controller('MyCtrl', function ($scope) {


	});
