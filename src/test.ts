import { print, visitUrl } from "kolmafia";

import { getHoboRunners } from "./lib";
/*
const testMap = new Map();
testMap.set($item`Angry Farmer candy`, 1);
testMap.set($item`bottle of gin`, 2);

Kmail.send("Manendra", "hi, dude", testMap);
*/
/*
let kmails = Kmail.inbox();

for (const l of kmails) {
  if (l.senderName.toLowerCase() === "phillanthropist") {
    const j = l.items();
    for (const r of j.values()) {
      j.get();
    }
  }
}
*/
const playerTable = getHoboRunners(visitUrl("clan_raidlogs.php"));

for (const key of playerTable.keys()) {
  print(`${key}`);
  const foo = playerTable.get(key);
  print(`${foo}`);
}
