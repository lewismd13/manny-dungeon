import { bossLootDistro, raidlog } from "./lib";
import { getHoboRunners, getNonSewerTurns, getSewerLog, getSewerTurns } from "./parsers";

// TODO: have sim and live modes

let playerTable = getHoboRunners(raidlog);

const sewerLog = getSewerLog(raidlog);

playerTable = getSewerTurns(sewerLog, playerTable);

playerTable = getNonSewerTurns(raidlog, playerTable);

bossLootDistro(playerTable);

/*
Military Dave:
I obviously have no skin in the game, but I don't think rounding would be the way to go at all.
There's loads of (theoretical?) situations where you could end up rounding such that you need to
allocate more pieces than you have available.  As an extreme, if you have 9 pieces of loot, 5 people
who each are owed 1.6 and 1 who is owed 1, rounding is going to want to allocate 11 pieces.

A (potentially?) better way may be to allocate all of the whole pieces people are owed and the
loop through the remainders, giving them to whoever has the most left over.  So, philosophically,
this is very similar to what you've suggested with giving them to whoever has lost the most.  However,
I think this is guaranteed to give out the correct number of pieces every time, but it's late and there
may have been a beer or two in my evening.
*/

/*
Let me know if you need any help with it.  From the looks of bossLootDistro.ts, you have pretty much have it.
I'd just floor lootshare rather than rounding it, store the remainders, and then loop through the players again
checking the highest remainder until you hit the number of pieces allocated.
*/
