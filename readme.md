# Football Simulation Example
---
## Overview
This project is an example implementation of the [footballsimulationengine](https://www.npmjs.com/package/footballsimulationengine) node module available on npmjs.

---
## Install
1. Download the project onto your system ({dir})
2. cd {dir}
3. run ``npm install``
---
## Run the Game
1. load your team into the {dir}/teams directory (you can use an existing team as an example)
2. in '{dir}/server.js' change either
```
readFile("teams/team1.json").then(function (team1) {
```
to your newly created .json file i.e.
```
readFile("teams/myTeam.json").then(function (team1) {
```
3. Set the pitch size by changing the ``pitchWidth`` and ``pitchHeight`` in '{dir}/server.js'
*Note: Any changes will need changes made to the start positions of the players*
4. run ``npm start``
5. Go To ``http://localhost:1442/match.html``
---
## Playing A Match
1. Press ``start match``
- This starts a new match where the pitch size is displayed on the screen and the players are in their correct positions.
2. Press ``play match``
- This runs '10' iterations, moving the players and give iteration logs for each iteration.
i.e. `Iteration 50: Closest Player to ball: Louise Johnson,Closest Player to ball: Aiden Smith`
3. Press ``play match`` until the iterations reach 5,000
- We can make this quicker by changing the number of iterations per "play" in {dir}/public/js/match.js
```
function getMatch() {
	var iterations = 10;
	for (i = 0; i < iterations; i++) {
		movePlayers("/movePlayers");
	}
}
```
to
```
function getMatch() {
	var iterations = X;
	for (i = 0; i < iterations; i++) {
		movePlayers("/movePlayers");
	}
}
```
where X is the number of iterations to do at a time.
4. Press ``start second half``
- This flips the players to opposite sides
5. Press ``play match`` until the iterations reach 10,000
6. Record the results

---
