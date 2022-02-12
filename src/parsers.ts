import { print, visitUrl } from "kolmafia";
import { Kmail } from "libram";
import {
  BurialGround,
  Burnbarrel,
  Esplanade,
  Heap,
  PLDistrict,
  Sewers,
  TownSquare,
} from "./sidezones";

export const getTurns = /\((\d+) turns?\)/m;
export const getName = /([\w\s_]+) \(#(\d+)\)/m;

export function getNonSewerTurns(
  raidlog: string,
  playerTable: Map<string, number>
): Map<string, number> {
  const hoboStart = raidlog.indexOf("<div id='Hobopolis'>");
  const hoboLog = raidlog.slice(
    hoboStart + 52,
    raidlog.indexOf("<p><b>Loot Distribution:</b>", hoboStart)
  );
  const l = raidlog.indexOf("<b>Sewers:</b><blockquote>");
  const sewerLog = raidlog.slice(l, raidlog.indexOf("</blockquote>", l));
  const nonSewerLog = hoboLog.replace(sewerLog, "");

  const lines2 = nonSewerLog.split("<br>");

  for (const n of lines2) {
    if (n) {
      if (!n.includes("defeated by") && !n.includes("went shopping") && n.includes("turn")) {
        // first we extract the player name from the line
        const name = getName.exec(n);

        // now make sure we have just the name and that it's a string
        let justName = name ? name[1] : "";
        justName = justName.toLowerCase();

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
  return playerTable;
}

export function getSewerTurns(
  sewerLog: string,
  playerTable: Map<string, number>
): Map<string, number> {
  const lines = sewerLog.split("<br>");
  // const getTurns = /\((\d+) turns?\)/m;
  // const getName = /([\w\s_]+) \(#(\d+)\)/m;
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
        let justName = name ? name[1] : "";
        justName = justName.toLowerCase();

        // pull out just the number of turns and make it a number
        const justTurns = parseInt(turns ? turns[1] : "");
        // print(`${justName} spent ${justTurns} useful turns in the sewers`);

        // grab the current number of turns assigned to the player

        // let addturns = 0;
        let addturns = playerTable.get(justName) as number;
        if (addturns === undefined) throw `Something went wrong getting sewer turns for ${name}`;
        // add the useful sewer turns to player's total turns and put that number in the map
        addturns += justTurns;
        // print(`${addturns}`);
        playerTable.set(justName, addturns);
      }
    }
  }
  // logging and sanity check
  for (const key of playerTable.keys()) {
    const foo = playerTable.get(key);
    print(`${key} spent ${foo} useful turns in the sewers.`);
  }
  return playerTable;
}

export function getHoboRunners(raidlog: string): Map<string, number> {
  // figure out where the hobopolis section starts
  const getName2 = /([\w\s_]+) \(#(\d+)\)/gm;
  const hoboStart = raidlog.indexOf("<div id='Hobopolis'>");
  // chop out the hobopolis section
  const hoboLog = raidlog.slice(
    hoboStart + 52,
    raidlog.indexOf("<p><b>Loot Distribution:</b>", hoboStart)
  );
  // pull everything that looks like a name out of the log
  const playerNames = hoboLog.match(getName2);
  // eliminate duplicates
  const uniq = [...new Set(playerNames)];
  // create the map that we want to end up with for names and turns and drop in the names, with turns set to 0
  const playerTable = new Map();
  // TODO: use for...of here
  uniq.forEach((element) => {
    if (element) {
      const newElement = element.toString();
      const name = String(newElement.slice(0, newElement.indexOf(` (#`)));
      playerTable.set(name.toLowerCase(), 0);
    }
  });
  // logging and sanity check
  /*
  print(`Today's runners are:`);
  for (const key of playerTable.keys()) {
    print(`${key}`);
  }
*/
  return playerTable;
}

// this just finds the section of the raidlog that is for sewers only and pull it into a separate string
export function getSewerLog(raidlog: string): string {
  const l = raidlog.indexOf("<b>Sewers:</b><blockquote>");
  const sewerLog = raidlog.slice(l, raidlog.indexOf("</blockquote>", l));
  return sewerLog;
}

export function gethoboLog(raidlog: string): string {
  const hoboStart = raidlog.indexOf("<div id='Hobopolis'>");
  const hoboLog = raidlog.slice(
    hoboStart + 52,
    raidlog.indexOf("<p><b>Loot Distribution:</b>", hoboStart)
  );
  return hoboLog;
}

function formatDay(n: number) {
  return n > 9 ? `${n}` : `0${n}`;
}

function formatDateString(kmail: Kmail): string {
  const day = kmail.date.getDate();
  const formattedDay = formatDay(day);
  const month = kmail.date.getMonth() + 1; // zero indexed because what
  const formattedMonth = formatDay(month);
  const year = kmail.date.getFullYear();
  const datestring = year.toString() + formattedMonth + formattedDay;
  return datestring;
}
// finds the kmail from bosskiller, given playername and date in YYYYMMDD format
// TODO: handle consumables and skill/other drops separately
// TODO: map to file a JSON representation of values

export function bkDropsUpdate(bk: string, date: string): void {
  const inbox = Kmail.inbox();
  inbox.forEach((kmail) => {
    const name = kmail.senderName;
    const bkDate = formatDateString(kmail);
    if (name.toLowerCase() === bk.toLowerCase() && date === bkDate) {
      print("hooray! You found the kmail! Here are the drops:");
      const lootlist = kmail.items();
      for (const items of lootlist.keys()) {
        print(`${name} gets ${lootlist.get(items)} of ${items}`);
      }
    }
  });
}

export function esplanade(): void {
  const raidlog = visitUrl("clan_raidlogs.php");
  const pipeRegExp = /broke \d* water pipes \(\d* turns\)/g;

  function pipesBroken() {
    const pipematch = raidlog.match(pipeRegExp);
    let pipes;
    if (pipematch === null) {
      pipes = 0;
      return pipes;
    } else {
      pipes = pipematch.toString();
      pipes = parseInt(pipes.slice(6, pipes.indexOf(" pipes")));
      return pipes;
    }
  }

  print(`${pipesBroken()}`);
}

export function totalHoboTurns(): number {
  let turns = 0;
  turns += Sewers.turns;
  turns += Burnbarrel.turns;
  turns += Esplanade.turns;
  turns += Heap.turns;
  turns += PLDistrict.turns;
  turns += BurialGround.turns;
  turns += TownSquare.turns;
  return turns;
}
