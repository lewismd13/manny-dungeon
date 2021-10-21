import { itemAmount, myName, print } from "kolmafia";
import { $item, Kmail } from "libram";
import {
  bosskillers,
  cagebaitPlayers,
  consumables,
  dungeonCost,
  getTotalUsefulTurns,
  raidlog,
} from "./lib";
import { getHoboRunners, getNonSewerTurns, getSewerLog, getSewerTurns } from "./parsers";

let playerTable = getHoboRunners(raidlog);

const sewerLog = getSewerLog(raidlog);

playerTable = getSewerTurns(sewerLog, playerTable);

playerTable = getNonSewerTurns(raidlog, playerTable);

for (const key of playerTable.keys()) {
  print(`${key}`);
  const foo = playerTable.get(key);
  print(`${foo}`);
}

const totalUseful = getTotalUsefulTurns(playerTable);

print(`this run had ${totalUseful} total useful turns.`);

// TODO: add a check to make sure you have all the loot in your inventory

for (const loot of consumables.keys()) {
  let howmuch = consumables.get(loot);
  if (howmuch === undefined) howmuch = 0;
  if (itemAmount(loot) < howmuch) {
    throw `You don't have enough ${loot} in your inventory`;
  }
}

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
      if (player !== myName().toLowerCase()) {
        // Kmail.send(`${player}`, `you owe ${meatOwed}`, loot);
        print("just testing things, carry on");
      }
    }
  }
}
