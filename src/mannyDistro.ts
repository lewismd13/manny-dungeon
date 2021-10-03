import { myName, print, visitUrl } from "kolmafia";
import { $item, Kmail } from "libram";
import { getHoboRunners } from "./lib";
// import { uniq } from "lodash";

const getTurns = /\((\d+) turns?\)/m;
const getName = /([\w\s_]+) \(#(\d+)\)/m;
// const getName2 = /([\w\s_]+) \(#(\d+)\)/gm;
const page = visitUrl("clan_raidlogs.php");
const hoboStart = page.indexOf("<div id='Hobopolis'>");
const hoboLog = page.slice(hoboStart + 52, page.indexOf("<p><b>Loot Distribution:</b>", hoboStart));
const l = page.indexOf("<b>Sewers:</b><blockquote>");
const sewerLog = page.slice(l, page.indexOf("</blockquote>", l));
const nonSewerLog = hoboLog.replace(sewerLog, "");
// const playerNames = hoboLog.match(getName2);
// const uniq = [...new Set(playerNames)];
const playerTable = getHoboRunners(page);
// TODO: make this part less stupid. somehow need to tie variable to $item. maybe another map
const forks = 124;
const mugs = 127;
const juice = 132;
const snuff = 124;
const sliders = 130;
const stews = 0;
const blankets = 0;
const banquets = 5;

const dungeonCost = 2350000;

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

const cagebaitPlayers = "cagepole sitta,bombastus,stupidsexyflanders,ricardos3";
const bosskillers = "phillanthropist";

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

      /*
      const n = element.match(getName);
      // there's probably a way to get just the name in regexp
      // but I haven't figured it out, so we're isolating it here
      let n1;
      if (n) {
        n1 = n.toString();
      }
      n1 = n1?.slice(0, n1.indexOf(` (#`));
*/
      /*
      // now grab turns from string
      const t = element.match(getTurns);
      // again, there's probably a better way, but now isolating just the number
      let t1;
      if (t) {
        t1 = t.toString();
      } */

      // t1 = t1?.slice(1, t1.indexOf(` turn`));
      // t1 = t1?.toString();
      // find the player for this line, add the turns to their record in the playerTable map

      // TODO: this part needs to to actually use tt[1] and nn[1]

      // const tt1 = tt[1].toString();
      // const nn1 = nn[1].toString();
      // print(`adding ${tt1} turns to ${nn1}`);

      // grab the current number of turns assigned to the player
      let addturns = playerTable.get(nn1);
      // print(`${addturns}`);
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
        // justTurns = justTurns.slice(1, justTurns.indexOf(` turn`));
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

/*
for (const n of lines2) {
  if (n) {
    if (!n.includes("defeated by") && !n.includes("went shopping") && n.includes("turn")) {
      // first we extract the player name from the line
      // print(`${n}`);

      const name = n.match(getName);
      // print(`${name}`);
      let justName;
      if (name) {
        justName = name.toString();
      }
      if (justName) {
        justName = justName.slice(0, justName?.indexOf(` (#`));
      }
      // now we extract the number of turns spent
      const turns = n.match(getTurns);
      let justTurns;
      if (turns) {
        justTurns = turns.toString();
      }
      if (justTurns) {
        justTurns = justTurns.slice(1, justTurns.indexOf(` turn`));
        let addturns = playerTable.get(justName);
        addturns += parseInt(justTurns);
        playerTable.set(justName, addturns);
      }
    }
  }
}
*/
/*
const totalTurns = sewerLog.match(getTurns);
let sewerTurns = 0;

totalTurns?.forEach((element) => {
  print(element);
  const n = element.slice(1, element.indexOf(` `));
  print(n);
  sewerTurns += parseInt(n);
  print(`${sewerTurns}`);
});

const nonSewerTurns = nonSewerLog.match(getTurns);
let otherTurns = 0;

if (nonSewerTurns) {
  nonSewerTurns.forEach((turn) => {
    print(turn);
    const n = turn.slice(1, turn.indexOf(` `));
    otherTurns += parseInt(n);
    print(`${otherTurns}`);
  });
}

// print(`${sewerTurns} total turns spent in sewer`);
print(`${otherTurns} total turns spent in non-sewer hobopolis`);
*/
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

    // const s = Math.round(sliders * p);

    // loot.set($item`extra-greasy slider`, `${s}`);

    // print(`${player} gets ${s} sliders`);
    // if (player.toLowerCase() !== myName().toLowerCase()) {
    // Kmail.send(`${player}`, `you owe ${meatOwed}`, loot);
    // }
  }
}
