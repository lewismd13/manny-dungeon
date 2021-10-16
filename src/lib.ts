import { getPlayerId, print, pullsRemaining, visitUrl } from "kolmafia";
import { $item, Dreadsylvania, Hobopolis } from "libram";

export const raidlog = visitUrl("clan_raidlogs.php");

export const forks = 143;
export const mugs = 147;
export const juice = 151;
export const snuff = 143;
export const sliders = 150;
export const stews = 0;
export const blankets = 0;
export const banquets = 5;
export const dungeonCost = 2300000;
export const cagebaitPlayers = "cagepole sitta,bombastus,stupidsexyflanders,ricardos3";
export const bosskillers = "phillanthropist";

export const consumables = new Map([
  [$item`Ol' Scratch's salad fork`, forks],
  [$item`Frosty's frosty mug`, mugs],
  [$item`jar of fermented pickle juice`, juice],
  [$item`voodoo snuff`, snuff],
  [$item`extra-greasy slider`, sliders],
  [$item`frozen banquet`, banquets],
  [$item`tin cup of mulligan stew`, stews],
  [$item`Hodgman's blanket`, blankets],
]);

export function bossLootDistro(playerTable: Map<string, number>): void {
  const page = visitUrl("clan_basement.php");
  const lootListRegexp = /(?:descitem\(\d*?\).*?<b>)(.*?)(?:<\/b>)/gm;

  const bossloot2 = page.match(lootListRegexp);
  const bosslootclean = new Array<Item>();

  if (bossloot2) {
    for (const i of bossloot2) {
      const k = i.slice(i.indexOf("<b>") + 3, i.indexOf("</b>"));
      print(`${k}`);
      if (Hobopolis.loot.includes(Item.get(k))) bosslootclean.push(Item.get(k));
      // if (Dreadsylvania.loot.includes(Item.get(k))) bosslootclean.push(Item.get(k));
    }
  }

  if (bossloot2 !== null) print(bossloot2?.toString());
  print(bosslootclean.toString());

  const lootTotal = bosslootclean.length;

  print(`total of ${lootTotal} pieces of loot`);

  let totalTurns = 0;

  for (const p of playerTable.keys()) {
    const turns = playerTable.get(p);
    if (turns !== undefined && !cagebaitPlayers.includes(p) && !bosskillers.includes(p))
      totalTurns += turns;
  }

  print(`total useful turns of ${totalTurns}`);
  let bossLootCounter = 0;

  for (const player of playerTable.keys()) {
    if (
      !cagebaitPlayers.includes(player.toLowerCase()) &&
      !bosskillers.includes(player.toLowerCase())
    ) {
      const turns = playerTable.get(player);
      if (turns !== undefined) {
        const percentage = turns / totalTurns;
        const lootShare = Math.round(percentage * lootTotal);
        const lootShareRaw = percentage * lootTotal;
        print(
          `${player} spent ${turns} useful turns of ${totalTurns} total turns for ${lootShareRaw} raw or ${lootShare} rounded pieces of the total ${lootTotal} pieces of boss loot. I hope this math works out.`
        );
        // TODO: figure out a way to do rounding tiebreakers
        // tally up lootShareRaw - lootShare for each player and the extra piece goes to whoever has the highest number
        for (let i = 0; i < lootShare; i++) {
          print(`${lootShare}`);
          print(`${i}`);

          // Hobopolis.distribute(parseInt(getPlayerId(player)), bosslootclean[bossLootCounter]);
          print(
            `distributing zero-indexed item number ${bossLootCounter}, which is ${bosslootclean[bossLootCounter]}`
          );
          bossLootCounter++;
        }
      }
    }
  }
}

export function getTotalUsefulTurns(playerTable: Map<string, number>): number {
  let totalUseful = 0;
  playerTable.forEach((value, key) => {
    const n = playerTable.get(key);
    if (!cagebaitPlayers.includes(key.toLowerCase()) && !bosskillers.includes(key.toLowerCase())) {
      print(`${key} was responsible for ${n} useful turns`);
      if (n) totalUseful += n;
    }
  });
  return totalUseful;
}

export function bossLootDistroRevised(playerTable: Map<string, number>): void {
  const page = visitUrl("clan_basement.php");
  const lootListRegexp = /(?:descitem\(\d*?\).*?<b>)(.*?)(?:<\/b>)/gm;

  const bossloot2 = page.match(lootListRegexp);
  const bosslootclean = new Array<Item>();

  if (bossloot2) {
    for (const i of bossloot2) {
      const k = i.slice(i.indexOf("<b>") + 3, i.indexOf("</b>"));
      print(`${k}`);
      // if (Hobopolis.loot.includes(Item.get(k))) bosslootclean.push(Item.get(k));
      if (Dreadsylvania.loot.includes(Item.get(k))) bosslootclean.push(Item.get(k));
    }
  }

  if (bossloot2 !== null) print(bossloot2?.toString());
  print(bosslootclean.toString());

  const lootTotal = bosslootclean.length;

  print(`total of ${lootTotal} pieces of loot`);

  let totalTurns = 0;

  for (const p of playerTable.keys()) {
    const turns = playerTable.get(p);
    if (turns !== undefined && !cagebaitPlayers.includes(p) && !bosskillers.includes(p))
      totalTurns += turns;
  }

  print(`total useful turns of ${totalTurns}`);
  let bossLootCounter = 0;
  const lootRemainders = new Map<string, number>();

  for (const player of playerTable.keys()) {
    if (
      !cagebaitPlayers.includes(player.toLowerCase()) &&
      !bosskillers.includes(player.toLowerCase())
    ) {
      const turns = playerTable.get(player);
      if (turns !== undefined) {
        const percentage = turns / totalTurns;
        const lootShare = Math.floor(percentage * lootTotal);
        const lootShareRaw = percentage * lootTotal;
        const remainder = lootShareRaw - lootShare;
        lootRemainders.set(player, remainder);
        print(
          `${player} spent ${turns} useful turns of ${totalTurns} total turns for ${lootShare} pieces of the total ${lootTotal} pieces of boss loot, with a remainder of ${remainder}. I hope this math works out.`
        );
        // TODO: figure out a way to do rounding tiebreakers
        for (let i = 0; i < lootShare; i++) {
          print(`${lootShare}`);
          print(`${i}`);

          // Hobopolis.distribute(parseInt(getPlayerId(player)), bosslootclean[bossLootCounter]);
          print(
            `distributing zero-indexed item number ${bossLootCounter}, which is ${bosslootclean[bossLootCounter]}`
          );
          bossLootCounter++;
        }
      }
    }
  }
  while (bossLootCounter < lootTotal) {
    const highest = Math.max(...lootRemainders.values());
    print(`${highest}`);
    for (const player of lootRemainders.keys()) {
      if (lootRemainders.get(player) === highest) {
        print(
          `${player} has the highest remainder and gets zero-indexed item ${bossLootCounter}, which is ${bosslootclean[bossLootCounter]}`
        );
        lootRemainders.set(player, 0);
        // Hobopolis.distribute(parseInt(getPlayerId(player)), bosslootclean[bossLootCounter]);
      }
    }
    bossLootCounter++;
  }
  print(`all done! (hopefully)`);
}

// export function bossLoot(playerTable: Map<string, number>, drops: number) {}
