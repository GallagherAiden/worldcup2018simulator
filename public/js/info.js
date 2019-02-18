function loadStats() {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var result = JSON.parse(this.responseText);
			for (i = 0; i < result.length - 1; i++) {
				var anchor = document.createElement("a");
				var node = document.createElement("LI");
				var bold = document.createElement("b");
				var textnode = document.createTextNode(result[i].name + " -- Rating: " + result[i].rating);
				anchor.appendChild(textnode);
				anchor.setAttribute("href", "#");
				node.appendChild(anchor);
				bold.appendChild(node);
				document.getElementById("myUL").appendChild(bold);
				var thisSquad = result[i].players;
				for (j = 0; j < thisSquad.length - 1; j++) {
					anchor = document.createElement("a");
					node = document.createElement("LI");
					var thisPlayer = thisSquad[j];
					var thisPlayerText = "(" + thisPlayer.position + ") " + thisPlayer.name + " -- Rating: " + thisPlayer.rating + " -- ";
					thisPlayerText += "[agility: " + thisPlayer.skill.agility + "] -- [jumping: " + thisPlayer.skill.jumping + "] -- [passing: " + thisPlayer.skill.passing + "] -- ";
					thisPlayerText += "[penalties: " + thisPlayer.skill.penalty_taking + "] -- [saving: " + thisPlayer.skill.saving + "] -- [shooting: " + thisPlayer.skill.shooting + "] -- ";
					thisPlayerText += "[strength: " + thisPlayer.skill.strength + "] -- [tackling: " + thisPlayer.skill.tackling + "]";
					textnode = document.createTextNode(thisPlayerText);
					anchor.appendChild(textnode);
					anchor.setAttribute("href", "#");
					node.appendChild(anchor);
					document.getElementById("myUL").appendChild(node);
				}
			}
		}
	};
	http.open("GET", "/getAllStats", true);
	http.send();
}

function myPlayers() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	ul = document.getElementById("myUL");
	li = ul.getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";

		}
	}
}

angular.module('ionicApp', ['ionic'])

	.controller('MyCtrl', function ($scope) {


	});
