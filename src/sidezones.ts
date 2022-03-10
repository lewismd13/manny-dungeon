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
export class Esplanade {
  static log = esplanadeLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  /**
   * Returns Exposure Esplanade progress based on location image, ie image7 returns 70
   */
  static progress(): number {
    const page = visitUrl("clan_hobopolis.php?place=5");
    const matcher = page.match(/hobopolis\/exposureesplanade(\d\d?).gif/);
    const progress = matcher ? parseInt(matcher[1]) : 0;
    return progress * 10;
  }

  static pipesMethod(name?: string): number {
    if (!name) return getActionTurns(this.log, "pipe");
    else return getPlayerTurns(this.log, name, "pipe");
  }

  /**
   * Return number of banquets in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of banquets
   */
  static banquets({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "freezer", name);
    } else {
      return flexibleTurns(this.log, "freezer", name);
    }
  }
  /**
   * Return number of littleYodels in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of littleYodels
   */
  static littleYodels({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "yodeled a little", name);
    } else {
      return flexibleTurns(this.log, "yodeled a little", name);
    }
  }
  /**
   * Return number of mediumYodels in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of mediumYodels
   */
  static mediumYodels({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "yodeled quite a bit", name);
    } else {
      return flexibleTurns(this.log, "yodeled quite a bit", name);
    }
  }
  /**
   * Return number of bigYodels in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of bigYodels
   */
  static bigYodels({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "yodeled like crazy", name);
    } else {
      return flexibleTurns(this.log, "yodeled like crazy", name);
    }
  }
  /**
   * Return number of fridges in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of fridges
   */
  static fridges({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "fridge", name);
    } else {
      return flexibleTurns(this.log, "fridge", name);
    }
  }
  /**
   * Return number of purpleLightDiverts in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of purpleLightDiverts
   */
  static purpleLightDiverts({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "cold water out", name);
    } else {
      return flexibleTurns(this.log, "cold water out", name);
    }
  }
  /**
   * Return number of burnbarrelDiverts in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of burnbarrelDiverts
   */
  static burnbarrelDiverts({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "cold water to", name);
    } else {
      return flexibleTurns(this.log, "cold water to", name);
    }
  }
  /**
   * Return number of pipes in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of pipes
   */
  static pipes({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "broke", name);
    } else {
      return flexibleTurns(this.log, "broke", name);
    }
  }
  /**
   * Return number of kills in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of kills
   */
  static kills({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "defeated Cold", name);
    } else {
      return flexibleTurns(this.log, "defeated Cold", name);
    }
  }
  /**
   * Return number of defeats in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of defeats
   */
  static defeats({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "defeated by Cold", name);
    } else {
      return flexibleTurns(this.log, "defeated by Cold", name);
    }
  }
  /**
   * Return number of frostyDefeats in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of frostyDefeats
   */
  static frostyDefeats({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "defeated by Frosty", name);
    } else {
      return flexibleTurns(this.log, "defeated by Frosty", name);
    }
  }
  /**
   * Return number of frostyKill in Exposure Esplanade
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of frostyKill
   */
  static frostyKill({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const esplanade = page.match(/<b>Exposure Esplanade:(.*?)<\/blockquote>/);
      const esplanadeLog = esplanade ? esplanade[1].toString() : "";
      return flexibleTurns(esplanadeLog, "defeated Frosty", name);
    } else {
      return flexibleTurns(this.log, "defeated Frosty", name);
    }
  }
}

export class Burnbarrel {
  static log = burnbarrelLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);
  static status = "";
  /**
   * Return number of kills in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of kills
   */
  static kills({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "defeated  Hot hobo", name);
    } else {
      return flexibleTurns(this.log, "defeated  Hot hobo", name);
    }
  }
  /**
   * Return number of defeats in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of defeats
   */
  static defeats({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "defeated by Hot", name);
    } else {
      return flexibleTurns(this.log, "defeated by Hot", name);
    }
  }
  /**
   * Return number of scratchlose in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of scratchlose
   */
  static scratchlose({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "defeated by Ol", name);
    } else {
      return flexibleTurns(this.log, "defeated by Ol", name);
    }
  }
  /**
   * Return number of scratchwin in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of scratchwin
   */
  static scratchwin({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "defeated Ol", name);
    } else {
      return flexibleTurns(this.log, "defeated Ol", name);
    }
  }
  /**
   * Return number of tires in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of tires
   */
  static tires({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "on the fire", name);
    } else {
      return flexibleTurns(this.log, "on the fire", name);
    }
  }
  /**
   * Return number of tirevalanches in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of tirevalanches
   */
  static tirevalanches({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "tirevalanche", name);
    } else {
      return flexibleTurns(this.log, "tirevalanche", name);
    }
  }
  /**
   * Return number of diverts in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of diverts
   */
  static diverts({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "diverted some steam", name);
    } else {
      return flexibleTurns(this.log, "diverted some steam", name);
    }
  }
  /**
   * Return number of coffers in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of coffers
   */
  static coffers({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "clan coffer", name);
    } else {
      return flexibleTurns(this.log, "clan coffer", name);
    }
  }
  /**
   * Return number of doors in Burnbarrel Blvd
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of doors
   */
  static doors({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const burnbarrel = page.match(/<b>Burnbarrel Blvd.:(.*?)<\/blockquote>/);
      const burnbarrelLog = burnbarrel ? burnbarrel[1].toString() : "";
      return flexibleTurns(burnbarrelLog, "hot door", name);
    } else {
      return flexibleTurns(this.log, "hot door", name);
    }
  }

  /**
   * Returns the BB progress based on location image, ie image7 returns 70
   */
  static progress(): number {
    const page = visitUrl("clan_hobopolis.php?place=4");
    const matcher = page.match(/hobopolis\/burnbarrelblvd(\d\d?).gif/);
    const progress = matcher ? parseInt(matcher[1]) : 0;
    return progress * 10;
  }
}

export class Heap {
  static log = heapLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  /**
   * Returns the Heap progress based on location image, ie image7 returns 70
   */
  static progress(): number {
    const page = visitUrl("clan_hobopolis.php?place=6");
    const matcher = page.match(/hobopolis\/theheap(\d\d?).gif/);
    const progress = matcher ? parseInt(matcher[1]) : 0;
    return progress * 10;
  }

  /**
   * Return number of kills in The Heap
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of kills
   */
  static kills({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const heap = page.match(/<b>The Heap:(.*?)<\/blockquote>/);
      const heapLog = heap ? heap[1].toString() : "";
      return flexibleTurns(heapLog, "defeated Stench hobo", name);
    } else {
      return flexibleTurns(this.log, "defeated Stench hobo", name);
    }
  }
  /**
   * Return number of trashcanoes in The Heap
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of trashcanoes
   */
  static trashcanoes({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const heap = page.match(/<b>The Heap:(.*?)<\/blockquote>/);
      const heapLog = heap ? heap[1].toString() : "";
      return flexibleTurns(heapLog, "trashcano", name);
    } else {
      return flexibleTurns(this.log, "trashcano", name);
    }
  }
  /**
   * Return number of compost in The Heap
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of compost
   */
  static compost({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const heap = page.match(/<b>The Heap:(.*?)<\/blockquote>/);
      const heapLog = heap ? heap[1].toString() : "";
      return flexibleTurns(heapLog, "compost", name);
    } else {
      return flexibleTurns(this.log, "compost", name);
    }
  }
  /**
   * Return number of dives in The Heap
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of dives
   */
  static dives({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const heap = page.match(/<b>The Heap:(.*?)<\/blockquote>/);
      const heapLog = heap ? heap[1].toString() : "";
      return flexibleTurns(heapLog, "treasure", name);
    } else {
      return flexibleTurns(this.log, "treasure", name);
    }
  }
  /**
   * Return number of defeats in The Heap
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of defeats
   */
  static defeats({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const heap = page.match(/<b>The Heap:(.*?)<\/blockquote>/);
      const heapLog = heap ? heap[1].toString() : "";
      return flexibleTurns(heapLog, "defeated by Stench", name);
    } else {
      return flexibleTurns(this.log, "defeated by Stench", name);
    }
  }
}

export class PLDistrict {
  static log = pldLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  /**
   * Returns Purple Light District progress based on location image, ie image7 returns 70
   */
  static progress(): number {
    const page = visitUrl("clan_hobopolis.php?place=8");
    const matcher = page.match(/hobopolis\/purplelightdistrict(\d\d?).gif/);
    const progress = matcher ? parseInt(matcher[1]) : 0;
    return progress * 10;
  }

  /**
   * Return number of kills in The Purple Light District
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of kills
   */
  static kills({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const pld = page.match(/<b>The Purple Light District:(.*?)<\/blockquote>/);
      const pldLog = pld ? pld[1].toString() : "";
      return flexibleTurns(pldLog, "defeated Sleaze hobo", name);
    } else {
      return flexibleTurns(this.log, "defeated Sleaze hobo", name);
    }
  }
  /**
   * Return number of flimflams in The Purple Light District
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of flimflams
   */
  static flimflams({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const pld = page.match(/<b>The Purple Light District:(.*?)<\/blockquote>/);
      const pldLog = pld ? pld[1].toString() : "";
      return flexibleTurns(pldLog, "flimflammed", name);
    } else {
      return flexibleTurns(this.log, "flimflammed", name);
    }
  }
  /**
   * Return number of barfights in The Purple Light District
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of barfights
   */
  static barfights({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const pld = page.match(/<b>The Purple Light District:(.*?)<\/blockquote>/);
      const pldLog = pld ? pld[1].toString() : "";
      return flexibleTurns(pldLog, "barfight", name);
    } else {
      return flexibleTurns(this.log, "barfight", name);
    }
  }
  /**
   * Return number of bamboozles in The Purple Light District
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of bamboozles
   */
  static bamboozles({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const pld = page.match(/<b>The Purple Light District:(.*?)<\/blockquote>/);
      const pldLog = pld ? pld[1].toString() : "";
      return flexibleTurns(pldLog, "bamboozled", name);
    } else {
      return flexibleTurns(this.log, "bamboozled", name);
    }
  }
  /**
   * Return number of fights won against Chester in The Purple Light District
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of chesterwin
   */
  static chesterwin({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const pld = page.match(/<b>The Purple Light District:(.*?)<\/blockquote>/);
      const pldLog = pld ? pld[1].toString() : "";
      return flexibleTurns(pldLog, "defeated Chester", name);
    } else {
      return flexibleTurns(this.log, "defeated Chester", name);
    }
  }
  /**
   * Return number of losses to Chester in The Purple Light District
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of chesterlose
   */
  static chesterlose({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const pld = page.match(/<b>The Purple Light District:(.*?)<\/blockquote>/);
      const pldLog = pld ? pld[1].toString() : "";
      return flexibleTurns(pldLog, "defeated by Chester", name);
    } else {
      return flexibleTurns(this.log, "defeated by Chester", name);
    }
  }
  /**
   * Return number of dances in The Purple Light District
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of dances
   */
  static dances({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const pld = page.match(/<b>The Purple Light District:(.*?)<\/blockquote>/);
      const pldLog = pld ? pld[1].toString() : "";
      return flexibleTurns(pldLog, "danced", name);
    } else {
      return flexibleTurns(this.log, "danced", name);
    }
  }
}

export class Richard {
  static log = visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3");

  static hot(): number {
    return partsMatching(
      visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3"),
      "boot"
    );
  }

  static cold(): number {
    return partsMatching(
      visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3"),
      "eye"
    );
  }

  static sleaze(): number {
    return partsMatching(
      visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3"),
      "crotch"
    );
  }

  static stench(): number {
    return partsMatching(
      visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3"),
      "guts"
    );
  }

  static spooky(): number {
    return partsMatching(
      visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3"),
      "skull"
    );
  }

  static physical(): number {
    return partsMatching(
      visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3"),
      "skin"
    );
  }
}
export class BurialGround {
  static log = ahbgLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  /**
   * Returns Burial Ground progress based on location image, ie image7 returns 70
   */
  static progress(): number {
    const page = visitUrl("clan_hobopolis.php?place=7");
    const matcher = page.match(/hobopolis\/burialground(\d\d?).gif/);
    const progress = matcher ? parseInt(matcher[1]) : 0;
    return progress * 10;
  }

  /**
   * Return number of kills in Ancient Hobo Burial Ground
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of kills
   */
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

  /**
   * Return number of defeats in Ancient Hobo Burial Ground
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of defeats
   */
  static defeats({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const ahbg = page.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
      const ahbgLog = ahbg ? ahbg[1].toString() : "";
      return flexibleTurns(ahbgLog, "defeated by  Spooky", name);
    } else {
      return flexibleTurns(this.log, "defeated by  Spooky", name);
    }
  }

  /**
   * Return number of boss kills in Ancient Hobo Burial Ground
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of kills
   */
  static bossKills({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const ahbg = page.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
      const ahbgLog = ahbg ? ahbg[1].toString() : "";
      return flexibleTurns(ahbgLog, "defeated Zombo", name);
    } else {
      return flexibleTurns(this.log, "defeated Zombo", name);
    }
  }

  /**
   * Return number of boss defeats in Ancient Hobo Burial Ground
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of defeats
   */
  static bossDefeats({ cache = true, name }: { cache?: boolean; name?: string }): number {
    if (!cache) {
      const page = visitUrl("clan_raidlogs.php");
      const ahbg = page.match(/<b>The Ancient Hobo Burial Ground:(.*?)<\/blockquote>/);
      const ahbgLog = ahbg ? ahbg[1].toString() : "";
      return flexibleTurns(ahbgLog, "defeated by Zombo", name);
    } else {
      return flexibleTurns(this.log, "defeated by Zombo", name);
    }
  }

  /**
   * Return number of moves busted in Ancient Hobo Burial Ground
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of busted moves
   */
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

  /**
   * Return number of flowers sent in Ancient Hobo Burial Ground
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of flowers sent
   */
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

  /**
   * Return number of dancers watched in Ancient Hobo Burial Ground
   *
   * @param {boolean} [cache=True] Use cached log or refresh log each time function is called
   * @param {string} [name] Playername to search for
   * @returns {number} Number of dancers watched
   */
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
}

export class TownSquare {
  static log = tsLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  /**
   * Returns Town Square progress based on location image, ie image7 returns 70
   */
  static progress(): number {
    const page = visitUrl("clan_hobopolis.php?place=2");
    const matcher = page.match(/hobopolis\/townsquare(\d\d?)o?.gif/);
    const progress = matcher ? parseInt(matcher[1]) : 0;
    return progress * 10; // this is wrong. hilariously so.
  }

  /**
   * Returns whether or not the tent is open in town square as a boolean, true for open, false for closed
   */
  static tentOpen(): boolean {
    const page = visitUrl("clan_hobopolis.php?place=2");
    const matcher = page.match(/hobopolis\/townsquare\d\d?(o?).gif/);
    const tentStatus = matcher;
    if (tentStatus) return true;
    else return false;
  }
}

// need tent open function, need to go fuck around and see what the page says

/*
export class Richard {
  static log = visitUrl("clan_hobopolis.php?place=3&action=talkrichard&whichtalk=3");
  static hot = partsMatching(this.log, "boot");
  static cold = partsMatching(this.log, "eye");
  static sleaze = partsMatching(this.log, "crotch");
  static stench = partsMatching(this.log, "guts");
  static spooky = partsMatching(this.log, "skull");
  static physical = partsMatching(this.log, "skin");
}
*/

export class Sewers {
  static log = sewerLog;
  static turns = getTotalTurns(this.log);
  static playerTable = getHoboRunners(this.log);

  /**
   *
   * @returns returns true if your character has cleared the sewers
   */
  static cleared(): boolean {
    if (visitUrl("clan_hobopolis.php").includes("deeper.gif")) return true;
    else return false;
  }

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
/*
abstract class RaidLog {
  private Dungeon dungeon;
  private string image;
  private Player[] players;
  constructor(dungeon: Dungeon) {
    this.dungeon = dungeon;
    this.image = visitUrl("clan_raidlog.php");
    this.players = [];
  }
}

export class HobopolisLog extends RaidLog {} */
