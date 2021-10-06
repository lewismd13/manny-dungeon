import { bossLootDistro, raidlog } from "./lib";
import { getHoboRunners, getNonSewerTurns, getSewerLog, getSewerTurns } from "./parsers";

let playerTable = getHoboRunners(raidlog);

const sewerLog = getSewerLog(raidlog);

playerTable = getSewerTurns(sewerLog, playerTable);

playerTable = getNonSewerTurns(raidlog, playerTable);

bossLootDistro(playerTable);
