var team1;
var team1players;
var team1json = {};
var team2;
var team2players;
var team2json = {};
var selectTeamButtonClicked = false;

function loadTasks() {
	if (isMobileDevice) {
		document.getElementById("warning").innerHTML = "Hint: Mobile devices display better horizontally";
	}
}

function isMobileDevice() {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}

function selectTeam() {
	var tempArray = [];
	var e = document.getElementById("team1");
	team1 = e.options[e.selectedIndex].value;
	var f = document.getElementById("team2");
	team2 = f.options[f.selectedIndex].value;
	for (i = 1; i < 32; i++) {
		tempArray.push(i);
	}
	if (team1 === "" || team2 === "") {
		var num = getRandomNumber(1, tempArray.length);
		document.getElementById("team1").selectedIndex = tempArray[num];
		tempArray.splice(num, 1);
		e = document.getElementById("team1");
		team1 = e.options[e.selectedIndex].value;
		num = getRandomNumber(1, tempArray.length);
		document.getElementById("team2").selectedIndex = tempArray[num];
		f = document.getElementById("team2");
		team2 = f.options[f.selectedIndex].value;
		team1json.name = team1;
		team2json.name = team2;
		getTeams();
	} else {
		team1json.name = team1;
		team2json.name = team2;
		getTeams();
	}
}

function getTeams() {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			team1players = result.team1;
			team2players = result.team2;
			var team1html;
			document.getElementById("home").innerHTML = "<h2>" + team1 + "</h2>" + "<select id='formation1'><option team='none'></option><option team='442'>4-4-2</option><option team='433'>4-3-3</option><option team='532'>5-3-2</option><option team='352'>3-5-2</option><option team='451'>4-5-1</option><option team='343'>3-4-3</option></select>";
			var team2html;
			document.getElementById("away").innerHTML = "<h2>" + team2 + "</h2>" + "<select id='formation2'><option team='none'></option><option team='442'>4-4-2</option><option team='433'>4-3-3</option><option team='532'>5-3-2</option><option team='352'>3-5-2</option><option team='451'>4-5-1</option><option team='343'>3-4-3</option></select>";
			document.getElementById("instructions").innerHTML = "Select the players to make up your team";
			team1html += "<option player='' selected disabled hidden> </option>";
			team2html += "<option player=''> </option>";
			for (j = 0; j < result.team1.length; j++) {
				team1html += "<option player='" + result.team1[j].name + "'>" + "(" + result.team1[j].position + ") " + result.team1[j].name + " [" + result.team1[j].rating + "]</option>";
			}
			for (k = 0; k < result.team2.length; k++) {
				team2html += "<option player='" + result.team2[k].name + "'>" + "(" + result.team2[k].position + ") " + result.team2[k].name + " [" + result.team2[k].rating + "]</option>";
			}
			team1html += "</select>";
			team2html += "</select>";
			printOptions(team1html, "team1");
			printOptions(team2html, "team2");
			if (selectTeamButtonClicked == false) {
				document.getElementById("homeButton").innerHTML += "<button onclick='selectRandom1()'>Random Select</button>";
				document.getElementById("awayButton").innerHTML += "<button onclick='selectRandom2()'>Random Select</button>";
				selectTeamButtonClicked = true;
			}
		}
	};
	http.open("POST", "/getTeamPlayers", false);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("team1=" + team1 + "&team2=" + team2);
}

function printOptions(thishtml, team) {
	document.getElementById(team + "player1").innerHTML = "<select id='" + team + "option1'>" + thishtml;
	document.getElementById(team + "player2").innerHTML = "<select id='" + team + "option2'>" + thishtml;
	document.getElementById(team + "player3").innerHTML = "<select id='" + team + "option3'>" + thishtml;
	document.getElementById(team + "player4").innerHTML = "<select id='" + team + "option4'>" + thishtml;
	document.getElementById(team + "player5").innerHTML = "<select id='" + team + "option5'>" + thishtml;
	document.getElementById(team + "player6").innerHTML = "<select id='" + team + "option6'>" + thishtml;
	document.getElementById(team + "player7").innerHTML = "<select id='" + team + "option7'>" + thishtml;
	document.getElementById(team + "player8").innerHTML = "<select id='" + team + "option8'>" + thishtml;
	document.getElementById(team + "player9").innerHTML = "<select id='" + team + "option9'>" + thishtml;
	document.getElementById(team + "player10").innerHTML = "<select id='" + team + "option10'>" + thishtml;
	document.getElementById(team + "player11").innerHTML = "<select id='" + team + "option11'>" + thishtml;
}

function selectRandom1() {
	var allGK = [];
	var allDEF = [];
	var allMID = [];
	var allFWD = [];
	var thisFormation;
	var formations = [];
	formations[0] = [
		"GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "FWD", "FWD"
	];
	formations[1] = [
		"GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD", "FWD"
	];
	formations[2] = [
		"GK", "DEF", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD"
	];
	formations[3] = [
		"GK", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "MID", "FWD", "FWD"
	];
	formations[4] = [
		"GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "MID", "FWD"
	];
	formations[5] = [
		"GK", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "FWD", "FWD", "FWD"
	];
	document.getElementById("formation1").selectedIndex = getRandomNumber(1, 6);
	var formationCode = document.getElementById("formation1").value;
	if (formationCode === "4-4-2") {
		thisFormation = formations[0];
	} else if (formationCode === "4-3-3") {
		thisFormation = formations[1];
	} else if (formationCode === "5-3-2") {
		thisFormation = formations[2];
	} else if (formationCode === "3-5-2") {
		thisFormation = formations[3];
	} else if (formationCode === "4-5-1") {
		thisFormation = formations[4];
	} else if (formationCode === "3-4-3") {
		thisFormation = formations[5];
	}
	var array = [];
	var num;
	for (i = 0; i < team1players.length; i++) {
		if (team1players[i].position === "GK") {
			allGK.push(i);
		} else if (team1players[i].position === "CB" || team1players[i].position === "LB" || team1players[i].position === "RB" || team1players[i].position === "RWB" || team1players[i].position === "LWB") {
			allDEF.push(i);
		} else if (team1players[i].position === "CM" || team1players[i].position === "CDM" || team1players[i].position === "CAM" || team1players[i].position === "RM" || team1players[i].position === "LM") {
			allMID.push(i);
		} else if (team1players[i].position === "ST" || team1players[i].position === "RW" || team1players[i].position === "LW" || team1players[i].position === "CF") {
			allFWD.push(i);
		} else {
			console.log("uncaught position");
			console.log(team1players[i].position);
		}
	}
	for (j = 0; j < thisFormation.length; j++) {
		var thisElementID = "team1option" + (j + 1);
		thisFormation[j];
		if (thisFormation[j] === "GK") {
			num = getRandomNumber(0, allGK.length - 1);
			document.getElementById(thisElementID).selectedIndex = allGK[num] + 1;
			allGK.splice(num, 1);
		} else if (thisFormation[j] === "DEF") {
			num = getRandomNumber(0, allDEF.length - 1);
			document.getElementById(thisElementID).selectedIndex = allDEF[num] + 1;
			allDEF.splice(num, 1);
		} else if (thisFormation[j] === "MID") {
			num = getRandomNumber(0, allMID.length - 1);
			document.getElementById(thisElementID).selectedIndex = allMID[num] + 1;
			allMID.splice(num, 1);
		} else if (thisFormation[j] === "FWD") {
			num = getRandomNumber(0, allFWD.length - 1);
			document.getElementById(thisElementID).selectedIndex = allFWD[num] + 1;
			allFWD.splice(num, 1);
		} else {
			console.log("uncaught formation")
		}
	}
}

function selectRandom2() {
	var allGK = [];
	var allDEF = [];
	var allMID = [];
	var allFWD = [];
	var thisFormation;
	var formations = [];
	formations[0] = [
		"GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "FWD", "FWD"
	];
	formations[1] = [
		"GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD", "FWD"
	];
	formations[2] = [
		"GK", "DEF", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "FWD", "FWD"
	];
	formations[3] = [
		"GK", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "MID", "FWD", "FWD"
	];
	formations[4] = [
		"GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "MID", "FWD"
	];
	formations[5] = [
		"GK", "DEF", "DEF", "DEF", "MID", "MID", "MID", "MID", "FWD", "FWD", "FWD"
	];
	document.getElementById("formation2").selectedIndex = getRandomNumber(1, 6);
	var formationCode = document.getElementById("formation2").value;
	if (formationCode === "4-4-2") {
		thisFormation = formations[0];
	} else if (formationCode === "4-3-3") {
		thisFormation = formations[1];
	} else if (formationCode === "5-3-2") {
		thisFormation = formations[2];
	} else if (formationCode === "3-5-2") {
		thisFormation = formations[3];
	} else if (formationCode === "4-5-1") {
		thisFormation = formations[4];
	} else if (formationCode === "3-4-3") {
		thisFormation = formations[5];
	}
	var array = [];
	var num;
	for (i = 0; i < team2players.length; i++) {
		if (team2players[i].position === "GK") {
			allGK.push(i);
		} else if (team2players[i].position === "CB" || team2players[i].position === "LB" || team2players[i].position === "RB" || team2players[i].position === "RWB" || team2players[i].position === "LWB") {
			allDEF.push(i);
		} else if (team2players[i].position === "CM" || team2players[i].position === "CDM" || team2players[i].position === "CAM" || team2players[i].position === "RM" || team2players[i].position === "LM") {
			allMID.push(i);
		} else if (team2players[i].position === "ST" || team2players[i].position === "RW" || team2players[i].position === "LW" || team2players[i].position === "CF") {
			allFWD.push(i);
		} else {
			console.log("uncaught position");
			console.log(team2players[i].position);
		}
	}
	for (j = 0; j < thisFormation.length; j++) {
		var thisElementID = "team2option" + (j + 1);
		thisFormation[j];
		if (thisFormation[j] === "GK") {
			num = getRandomNumber(0, allGK.length - 1);
			document.getElementById(thisElementID).selectedIndex = allGK[num] + 1;
			allGK.splice(num, 1);
		} else if (thisFormation[j] === "DEF") {
			num = getRandomNumber(0, allDEF.length - 1);
			document.getElementById(thisElementID).selectedIndex = allDEF[num] + 1;
			allDEF.splice(num, 1);
		} else if (thisFormation[j] === "MID") {
			num = getRandomNumber(0, allMID.length - 1);
			document.getElementById(thisElementID).selectedIndex = allMID[num] + 1;
			allMID.splice(num, 1);
		} else if (thisFormation[j] === "FWD") {
			num = getRandomNumber(0, allFWD.length - 1);
			document.getElementById(thisElementID).selectedIndex = allFWD[num] + 1;
			allFWD.splice(num, 1);
		} else {
			console.log("uncaught formation")
		}
	}
}

function getRandomNumber(min, max) {
	var random = Math.floor(Math.random() * (max - min + 1)) + min;
	return random;
}

function simMatch() {
	generateTeamJSON("1");
	generateTeamJSON("2");
	window.location.href = "match.html?team1json=" + JSON.stringify(team1json) + "team2json=" + JSON.stringify(team2json);
}

function generateTeamJSON(team) {
	var e = document.getElementById("team" + team + "option1");
	var temp = e.options[e.selectedIndex].value;
	var player1 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option2");
	temp = e.options[e.selectedIndex].value;
	var player2 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option3");
	temp = e.options[e.selectedIndex].value;
	var player3 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option4");
	temp = e.options[e.selectedIndex].value;
	var player4 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option5");
	temp = e.options[e.selectedIndex].value;
	var player5 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option6");
	temp = e.options[e.selectedIndex].value;
	var player6 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option7");
	temp = e.options[e.selectedIndex].value;
	var player7 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option8");
	temp = e.options[e.selectedIndex].value;
	var player8 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option9");
	temp = e.options[e.selectedIndex].value;
	var player9 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option10");
	temp = e.options[e.selectedIndex].value;
	var player10 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("team" + team + "option11");
	temp = e.options[e.selectedIndex].value;
	var player11 = temp.substring(temp.lastIndexOf(") ") + 2, temp.lastIndexOf(" ["));
	e = document.getElementById("formation" + team);
	var formation = e.options[e.selectedIndex].value;
	getTeamJSON(formation, player1, player2, player3, player4, player5, player6, player7, player8, player9, player10, player11, team);
}

function getTeamJSON(f, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, team) {
	var e = document.getElementById("team" + team);
	var thisSquad = e.options[e.selectedIndex].value;
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			if (result.name === team1json.name) {
				team1json = result;
			} else if (result.name === team2json.name) {
				team2json = result;
			}
		}
	};
	http.open("POST", "/generateTeam", false);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.send("formation=" + f + "&p1=" + p1 + "&p2=" + p2 + "&p3=" + p3 + "&p4=" + p4 + "&p5=" + p5 + "&p6=" + p6 + "&p7=" + p7 + "&p8=" + p8 + "&p9=" + p9 + "&p10=" + p10 + "&p11=" + p11 + "&team=" + thisSquad);
}


angular.module('ionicApp', ['ionic'])

	.controller('MyCtrl', function ($scope) {


	});
