import { bossLootDistro, raidlog } from "./lib";
import { getHoboRunners, getNonSewerTurns, getSewerLog, getSewerTurns } from "./parsers";

// TODO: have sim and live modes

let playerTable = getHoboRunners(raidlog);

const sewerLog = getSewerLog(raidlog);

playerTable = getSewerTurns(sewerLog, playerTable);

playerTable = getNonSewerTurns(raidlog, playerTable);

bossLootDistro(playerTable);
