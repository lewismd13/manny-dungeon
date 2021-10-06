import { myName, print, visitUrl } from "kolmafia";
import { $item, Kmail } from "libram";
import {} from "./lib";
import { getHoboRunners, getName, getTurns } from "./parsers";

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
const dungeonCost = 2300000;
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
      const name = getName.exec(element);

      // isolate turns from string
      const turns = getTurns.exec(element);

      // pull out just the playername, no player id
      const justName = name ? name[1] : "";

      // pull out just the number of turns and make it a number
      const justTurns = parseInt(turns ? turns[1] : "");
      print(`${justTurns} spent ${justTurns} useful turns in the sewers`);

      // grab the current number of turns assigned to the player

      // let addturns = 0;
      let addturns = playerTable.get(justName) as number;
      if (addturns === undefined) throw `Something went wrong getting sewer turns for ${name}`;
      // add the useful sewer turns to player's total turns and put that number in the map
      addturns += justTurns;
      print(`${addturns}`);
      playerTable.set(justName, addturns);
    }
  }
}

for (const key of playerTable.keys()) {
  print(`${key}`);
  const foo = playerTable.get(key);
  print(`${foo}`);
}

// chop the rest of the log into single line chunks
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
        let addturns = playerTable.get(justName) as number;
        if (addturns === undefined)
          throw `Something went wrong getting non-sewer turns for ${justName}`;
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
          print(`${player} gets ${s} ${stuff[0]} and owes ${meatOwed}`);
        }
      }
      if (player.toLowerCase() !== myName().toLowerCase()) {
        // Kmail.send(`${player}`, `you owe ${meatOwed}`, loot);
        print("just testing things, carry on");
      }
    }
  }
}
