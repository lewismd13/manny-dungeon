import { raidlog } from "./lib";
import { getHoboRunners } from "./parsers";

const hoboLog = raidlog.match(/(<div id='Hobopolis'>).*(<\/div>)/);
const stringLog = hoboLog !== null ? hoboLog.toString() : "";
const eelog = stringLog.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
const esplanadeLog = eelog ? eelog[1].toString() : "";
const bblog = stringLog.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
const burnbarrelLog = bblog ? bblog[1].toString() : "";

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
}

export class Burnbarrel {
  static log = burnbarrelLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  static totalStacked(): number {
    return getActionTurns(this.log, "on the fire");
  }
  static totalvalanches(): number {
    return getActionTurns(this.log, "tirevalanche");
  }
  static totalDefeats(): number {
    return getActionTurns(this.log, "defeated by");
  }
}
