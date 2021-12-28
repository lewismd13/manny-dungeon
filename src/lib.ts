import { print, visitUrl } from "kolmafia";
import { $item, Hobopolis } from "libram";
import { globalOptions } from "./globalvars";

export const raidlog = visitUrl("clan_raidlogs.php");

export function printHelpMenu(): void {
  print("Use the following arguments to run manny-dungeon");
  print("consumables: distribute the consumable drops that you hopefully got from a bosskiller");
  print("bossloot: distribute the boss drops (outfits and the like)");
  print(
    "sim: simulate only (use in conjuction with bossloot or consumables to simulate distribution without actually doing distro)"
  );
  print("random: roll a random number and compare to turns spent and display the result");
}

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

export function bossLootDistro(playerTable: Map<string, number>): void {
  const allLoot = Hobopolis.findLoot();
  const bosslootclean = new Array<Item>();

  for (const check of allLoot.keys()) {
    const loot = allLoot.get(check);
    if (loot !== undefined) {
      if (loot > 0) {
        bosslootclean.push(check);
      }
    }
  }
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
        for (let i = 0; i < lootShare; i++) {
          print(`${lootShare}`);
          print(`${i}`);
          if (globalOptions.sim === false) {
            // Hobopolis.distribute(player, bosslootclean[bossLootCounter]);
          }
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
        if (globalOptions.sim === false) {
          // Hobopolis.distribute(player, bosslootclean[bossLootCounter]);
        }
      }
    }
    bossLootCounter++;
  }
  print(`all done! (hopefully)`);
}

// export function bossLoot(playerTable: Map<string, number>, drops: number) {}
/*
export function getConsumables(bk: string, date: string) {
  const kmails = Kmail.inbox();
  for (const kmail of kmails) {
    if (kmail.senderName.toLowerCase() === bk.toLowerCase() && kmail.date === date.toDate())
  }
}
*/
