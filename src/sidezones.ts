import { visitUrl } from "kolmafia";
import { raidlog } from "./lib";
import { getHoboRunners } from "./parsers";

const hoboLog = raidlog.match(/(<div id='Hobopolis'>).*(<\/div>)/);
const stringLog = hoboLog !== null ? hoboLog.toString() : "";
const eelog = stringLog.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
const esplanadeLog = eelog ? eelog[1].toString() : "";
const bblog = stringLog.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
const burnbarrelLog = bblog ? bblog[1].toString() : "";
const heap = stringLog.match(/<b>The Heap:(.*?)<\/blockquote>/);
const heapLog = heap ? heap[1].toString() : "";
const pld = stringLog.match(/<b>The Purple Light District:(.*?)<\/blockquote>/);
const pldLog = pld ? pld[1].toString() : "";
const ahbg = stringLog.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
const ahbgLog = ahbg ? ahbg[1].toString() : "";
const ts = stringLog.match(/<b>Town Square:(.*?)<\/blockquote>/);
const tsLog = ts ? ts[1].toString() : "";
const sewer = stringLog.match(/<b>Sewers:(.*?)<\/blockquote>/);
const sewerLog = sewer ? sewer[1].toString() : "";

export function partsMatching(log: string, part: string): number {
  const richard = log;
  const matchRegExp = RegExp(
    `(?:Richard has <b>(\\d+)</b>)(?:\\s|\\w)+(?:${part}?e?s\\.\\<)`,
    `gm`
  );
  const match = matchRegExp.exec(richard);
  const parts = match ? match[1] : "0";
  return parseInt(parts);
}

export function getPlayerTurns(clanLog: string, name: string, action: string): number {
  const getTurns = RegExp(
    `${name} \\(#\\d+\\)(?:\\s|\\w)+(?:${action}).+?(?:\\((\\d+) turns?\\))`,
    `gmi`
  );
  let turns;
  let totalTurns = 0;
  while ((turns = getTurns.exec(clanLog)) !== null) {
    // print(`${turns[1]} turns`);
    totalTurns += parseInt(turns[1]);
  }
  return totalTurns;
}

// generic regexp that gets total turns of an action in the dungeon
function getActionTurns(clanLog: string, action: string) {
  const getTurns = RegExp(`(?:${action}.*?)\\((\\d+) turns?\\)`, `gm`);
  let turns;
  let totalTurns = 0;
  while ((turns = getTurns.exec(clanLog)) !== null) {
    // print(`${turns[1]} turns`);
    totalTurns += parseInt(turns[1]);
  }
  return totalTurns;
}

export function flexibleTurns(clanLog: string, action: string, name?: string): number {
  let getTurns;
  if (name) {
    getTurns = RegExp(
      `${name} \\(#\\d+\\)(?:\\s|\\w)+(?:${action}).+?(?:\\((\\d+) turns?\\))`,
      `gmi`
    );
  } else {
    getTurns = RegExp(`(?:${action}.*?)\\((\\d+) turns?\\)`, `gm`);
  }
  let turns;
  let totalTurns = 0;
  while ((turns = getTurns.exec(clanLog)) !== null) {
    // print(`${turns[1]} turns`);
    totalTurns += parseInt(turns[1]);
  }
  return totalTurns;
}

export function getTotalTurns(clanLog: string): number {
  const getTurns = RegExp(`\\((\\d+) turns?\\)`, `gm`);
  let turns;
  let totalTurns = 0;
  while ((turns = getTurns.exec(clanLog)) !== null) {
    // print(`${turns[1]} turns`);
    totalTurns += parseInt(turns[1]);
  }
  return totalTurns;
}
/*
export class Sidezone {
  logs: Map<string, string>;
  turns: number;
  playerTable: Map<string, number>;
  constructor(log: string, turns: number, playerTable: Map<string, number>) {
    this.logs = log;
    this.turns = turns;
    this.playerTable = playerTable;
  }
  static totalTurns(log): number {
    return getTotalTurns()
  }
}
*/
export class Esplanade {
  static log = esplanadeLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  static totalPipes = getActionTurns(esplanadeLog, "pipe");
  static totalDiverts = getActionTurns(esplanadeLog, "divert");
  static bigYodels = getActionTurns(esplanadeLog, "yodeled like crazy");
  static totalDefeats = getActionTurns(esplanadeLog, "defeated by");
  static totalKills = getActionTurns(esplanadeLog, "defeated  Cold hobo");
  static totalBanquets = getActionTurns(esplanadeLog, "raided");

  static pipesMethod(name?: string): number {
    if (!name) return getActionTurns(this.log, "pipe");
    else return getPlayerTurns(this.log, name, "pipe");
  }
}

/*
theMatcher["BB","&nbsp;Hot Hobo"] = "defeated  Hot hobo";
theMatcher["BB","Defeats"] = "defeated by  Hot";
theMatcher["BB","!Ol' Scratch"] = "defeated  Ol";
theMatcher["BB","!bossloss"] = "defeated by  Ol";
theMatcher["BB","Threw Tire"] = "on the fire";
theMatcher["BB","Tirevalanche"] = "tirevalanche";
theMatcher["BB","Diverted<br>Steam"] = "diverted some steam away";
theMatcher["BB","Opened<br>Door"] = "clan coffer";
theMatcher["BB","Burned<br>by Door"] = "hot door";
*/

export class Burnbarrel {
  static log = burnbarrelLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);
  static status = "";

  static tiresStacked(name?: string): number {
    if (!name) return getActionTurns(this.log, "on the fire");
    else return getPlayerTurns(this.log, name, "on the fire");
  }
  static tirevalanches(name?: string): number {
    if (!name) return getActionTurns(this.log, "tirevalanche");
    else return getPlayerTurns(this.log, name, "tirevalanche");
  }
  static bbDefeats(name?: string): number {
    if (!name) return getActionTurns(this.log, "defeated by  Hot hobo");
    else return getPlayerTurns(this.log, name, "defeated by  Hot hobo");
  }
  static bbKills(name?: string): number {
    if (!name) return getActionTurns(this.log, "defeated  Hot hobo");
    else return getPlayerTurns(this.log, name, "defeated  Hot hobo");
  }
  static steam(name?: string): number {
    if (!name) return getActionTurns(this.log, "diverted some steam");
    else return getPlayerTurns(this.log, name, "diverted some steam");
  }
  static doors(name?: string): number {
    if (!name) return getActionTurns(this.log, "Meat for the clan");
    else return getPlayerTurns(this.log, name, "Meat for the clan");
  }
  static scratchDefeats(name?: string): number {
    if (!name) return getActionTurns(this.log, "defeated by  Ol' Scratch");
    else return getPlayerTurns(this.log, name, "defeated by  Ol' Scratch");
  }
}

export class Heap {
  static log = heapLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);
}

export class PLDistrict {
  static log = pldLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);
}

export class BurialGround {
  static log = ahbgLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  static kills({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const ahbg = page.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
      const ahbgLog = ahbg ? ahbg[1].toString() : "";
      return flexibleTurns(ahbgLog, "defeated  Spooky", name);
    } else {
      return flexibleTurns(this.log, "defeated  Spooky", name);
    }
  }

  static defeats({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const ahbg = page.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
      const ahbgLog = ahbg ? ahbg[1].toString() : "";
      return flexibleTurns(ahbgLog, "defeated by", name);
    } else {
      return flexibleTurns(this.log, "defeated by", name);
    }
  }

  static dances({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const ahbg = page.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
      const ahbgLog = ahbg ? ahbg[1].toString() : "";
      return flexibleTurns(ahbgLog, "busted", name);
    } else {
      return flexibleTurns(this.log, "busted", name);
    }
  }

  static flowers({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const ahbg = page.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
      const ahbgLog = ahbg ? ahbg[1].toString() : "";
      return flexibleTurns(ahbgLog, "flowers", name);
    } else {
      return flexibleTurns(this.log, "flowers", name);
    }
  }

  static watchedDancers({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const ahbg = page.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
      const ahbgLog = ahbg ? ahbg[1].toString() : "";
      return flexibleTurns(ahbgLog, "watched", name);
    } else {
      return flexibleTurns(this.log, "watched", name);
    }
  }
  // pry open door
  // semirare
  // killed zombo
  // killed by zombo
}

export class TownSquare {
  static log = tsLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);
}

export class Richard {
  static log = visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3");
  static hot = partsMatching(this.log, "boot");
  static cold = partsMatching(this.log, "eye");
  static sleaze = partsMatching(this.log, "crotch");
  static stench = partsMatching(this.log, "guts");
  static spooky = partsMatching(this.log, "skull");
  static physical = partsMatching(this.log, "skin");
}

export class Sewers {
  static log = sewerLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  static kills(name?: string): number {
    if (!name) return getActionTurns(this.log, "defeated a");
    else return getPlayerTurns(this.log, name, "defeated a");
  }

  static grates(name?: string): number {
    if (!name) return getActionTurns(this.log, "sewer grate");
    else return getPlayerTurns(this.log, name, "sewer grate");
  }

  static valves(name?: string): number {
    if (!name) return getActionTurns(this.log, "lowered the water");
    else return getPlayerTurns(this.log, name, "lowered the water");
  }

  static tunnels(name?: string): number {
    if (!name) return getActionTurns(this.log, "explored");
    else return getPlayerTurns(this.log, name, "explored");
  }

  static chews(name?: string): number {
    if (!name) return getActionTurns(this.log, "gnawed through");
    else return getPlayerTurns(this.log, name, "gnawed through");
  }

  static clears(name?: string): number {
    if (!name) return getActionTurns(this.log, "made it through");
    else return getPlayerTurns(this.log, name, "made it through");
  }
  /**
   * Get sewer defeats
   * @param args
   * @param boolean [args.cache=true] should the cached log be used
   * @param string [args.name] user to search for
   * @returns number
   */
  static defeats({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const sewer = page.match(/<b>Sewers:(.*?)<\/blockquote>/);
      const sewerLog = sewer ? sewer[1].toString() : "";
      return flexibleTurns(sewerLog, "was defeated by", name);
    } else {
      return flexibleTurns(this.log, "was defeated by", name);
    }
  }

  /**
   * Get goldfish log info
   * @param args
   * @param boolean [args.cache=true] should the cached log be used
   * @param string [args.name] user to search for
   * @returns number
   */
  static goldfish({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const sewer = page.match(/<b>Sewers:(.*?)<\/blockquote>/);
      const sewerLog = sewer ? sewer[1].toString() : "";
      return flexibleTurns(sewerLog, "goldfish", name);
    } else {
      return flexibleTurns(this.log, "goldfish", name);
    }
  }
}
