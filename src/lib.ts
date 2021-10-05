import { print } from "kolmafia";

export function getHoboRunners(raidlog: string): Map<string, number> {
  // const raidlog = visitUrl("clan_raidlogs.php");
  const getName = /([\w\s_]+) \(#(\d+)\)/gm;
  const hoboStart = raidlog.indexOf("<div id='Hobopolis'>");
  const hoboLog = raidlog.slice(
    hoboStart + 52,
    raidlog.indexOf("<p><b>Loot Distribution:</b>", hoboStart)
  );
  const playerNames = hoboLog.match(getName);
  const uniq = [...new Set(playerNames)];
  const playerTable = new Map();
  uniq.forEach((element) => {
    if (element) {
      const newElement = element.toString();
      const n = String(newElement.slice(0, newElement.indexOf(` (#`)));
      playerTable.set(n, 0);
    }
  });
  return playerTable;
}

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

export function getSewerTurns(
  sewerLog: string,
  playerTable: Map<string, number>
): Map<string, number> {
  const lines = sewerLog.split("<br>");
  const getTurns = /\((\d+) turns?\)/m;
  const getName = /([\w\s_]+) \(#(\d+)\)/m;
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
  return playerTable;
}

// export function bossLoot(playerTable: Map<string, number>, drops: number) {}
