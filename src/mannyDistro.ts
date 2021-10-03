import { myName, print, visitUrl } from "kolmafia";
import { $item, Kmail } from "libram";
import { getHoboRunners } from "./lib";

const getTurns = /\((\d+) turns?\)/m;
const getName = /([\w\s_]+) \(#(\d+)\)/m;
const page = visitUrl("clan_raidlogs.php");
const hoboStart = page.indexOf("<div id='Hobopolis'>");
const hoboLog = page.slice(hoboStart + 52, page.indexOf("<p><b>Loot Distribution:</b>", hoboStart));
const l = page.indexOf("<b>Sewers:</b><blockquote>");
const sewerLog = page.slice(l, page.indexOf("</blockquote>", l));
const nonSewerLog = hoboLog.replace(sewerLog, "");
const playerTable = getHoboRunners(page);
// TODO: make this part less stupid. probably needs to be configurable. or parse the BKer kmail, which seems hard.
const forks = 124;
const mugs = 127;
const juice = 132;
const snuff = 124;
const sliders = 130;
const stews = 0;
const blankets = 0;
const banquets = 5;
const dungeonCost = 2350000;
const cagebaitPlayers = "cagepole sitta,bombastus,stupidsexyflanders,ricardos3";
const bosskillers = "phillanthropist";

const consumables = new Map([
  [$item`Ol' Scratch's salad fork`, forks],
  [$item`Frosty's frosty mug`, mugs],
  [$item`jar of fermented pickle juice`, juice],
  [$item`voodoo snuff`, snuff],
  [$item`extra-greasy slider`, sliders],
  [$item`frozen banquet`, banquets],
  [$item`tin cup of mulligan stew`, stews],
  [$item`Hodgman's blanket`, blankets],
]);

// TODO: do this the right way
// TODO: make names lowercase everywhere
// TODO: put each part of this in its own function

/*
uniq.forEach((element) => {
  if (element) {
    const newElement = element.toString();
    const n = String(newElement.slice(0, newElement.indexOf(` (#`)));
    playerTable.set(n, 0);
  }
});

for (const key of playerTable.keys()) {
  print(`${key}`);
  const foo = playerTable.get(key);
  print(`${foo}`);
}
*/
// split the sewer section of the log at each line break
const lines = sewerLog.split("<br>");
// lines = lines.filter(String);

// parse the sewer log line by line
for (const element of lines) {
  // check to make sure there's something there first
  if (element) {
    // only care about the grates and valves here, so skip all other lines
    if (element.includes("sewer grate") || element.includes("lowered the water level")) {
      // isolate name from string
      const n = getName.exec(element);

      // isolate turns from string
      const t = getTurns.exec(element);

      // pull out just the playername, no player id
      const nn1 = n ? n[1] : "";

      // pull out just the number of turns and make it a number
      const tt1 = parseInt(t ? t[1] : "");
      print(`${nn1} spent ${tt1} useful turns in the sewers`);

      // grab the current number of turns assigned to the player
      let addturns = playerTable.get(nn1);

      // add the useful sewer turns to player's total turns and put that number in the map
      addturns += tt1;
      print(`${addturns}`);
      playerTable.set(nn1, addturns);
    }
  }
}

for (const key of playerTable.keys()) {
  print(`${key}`);
  const foo = playerTable.get(key);
  print(`${foo}`);
}

// chop the log into single line chunks
const lines2 = nonSewerLog.split("<br>");

for (const n of lines2) {
  if (n) {
    if (!n.includes("defeated by") && !n.includes("went shopping") && n.includes("turn")) {
      // first we extract the player name from the line
      const name = getName.exec(n);

      // now make sure we have just the name and that it's a string
      const justName = name ? name[1] : "";

      // now we extract the number of turns spent
      const turns = getTurns.exec(n);

      // again get just the number and make sure it's a number
      const justTurns = turns ? turns[1] : "";

      // now we use add the turns to that player's entry in the player table
      if (justTurns) {
        let addturns = playerTable.get(justName);
        addturns += parseInt(justTurns);
        playerTable.set(justName, addturns);
      }
    }
  }
}

print("done parsing, now doing distro");

for (const key of playerTable.keys()) {
  print(`${key}`);
  const foo = playerTable.get(key);
  print(`${foo}`);
}

let totalUseful = 0;
playerTable.forEach((value, key) => {
  const n = playerTable.get(key);
  if (!cagebaitPlayers.includes(key.toLowerCase()) && !bosskillers.includes(key.toLowerCase())) {
    print(`${key} was responsible for ${n} useful turns`);
    if (n) totalUseful += n;
  }
});

print(`the total useful turns were ${totalUseful}`);

for (const player of playerTable.keys()) {
  if (
    !cagebaitPlayers.includes(player.toLowerCase()) &&
    !bosskillers.includes(player.toLowerCase())
  ) {
    const t = playerTable.get(player);
    if (t) {
      const p = t / totalUseful;
      // TODO: iterate through consumables table, pull numbers and item values
      const meatOwed = Math.round(dungeonCost * p);
      const loot = new Map();

      // iterate through consumables table and figure out how much of each consumable goes to each player
      for (const stuff of consumables) {
        if (stuff[1] > 0) {
          const s = Math.round(stuff[1] * p);
          // const i = stuff[0];
          loot.set(stuff[0], s);
          print(`${player} gets ${s} ${stuff[0]}`);
        }
      }
      /*
      if (player.toLowerCase() !== myName().toLowerCase()) {
        Kmail.send(`${player}`, `you owe ${meatOwed}`, loot);
      }
*/
    }
  }
}
