export function getHoboRunners(raidlog: string): Map<string, number> {
  // const raidlog = visitUrl("clan_raidlogs.php");
  const getName = /([\w\s_]+) \(#(\d+)\)/gm;
  const hoboStart = raidlog.indexOf("<div id='Hobopolis'>");
  const hoboLog = raidlog.slice(
    hoboStart + 52,
    raidlog.indexOf("<p><b>Loot Distribution:</b>", hoboStart)
  );
  const playerNames = hoboLog.match(getName);
  const uniq = [...new Set(playerNames)];
  const playerTable = new Map();
  uniq.forEach((element) => {
    if (element) {
      const newElement = element.toString();
      const n = String(newElement.slice(0, newElement.indexOf(` (#`)));
      playerTable.set(n, 0);
    }
  });
  return playerTable;
}
