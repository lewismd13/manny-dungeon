import { print } from "kolmafia";
// heap
const thing = new Map([
  ["banquets", "freezer"],
  ["littleYodels", "yodeled a little"],
  ["mediumYodels", "yodeled quite a bit"],
  ["bigYodels", "yodeled like crazy"],
  ["fridges", "fridge"],
  ["purpleLightDiverts", "cold water out"],
  ["burnbarrelDiverts", "cold water to"],
  ["pipes", "broke"],
  ["kills", "defeated  Cold"],
  ["defeats", "defeated by  Cold"],
  ["frostyDefeats", "defeated by Frosty"],
  ["frostyKill", "defeated Frosty"],
]);

for (const name of thing.keys()) {
  const zone = "esplanade";
  print(`/**`);
  print(`* Return number of ${name} in Exposure Esplanade`);
  print(`*`);
  print(
    `* @param {boolean} [cache=True] Use cached log or refresh log each time function is called`
  );
  print(` * @param {string} [name] Playername to search for`);
  print(` * @returns {number} Number of ${name}`);
  print(`*/`);
  print(`static ${name}({ cache = true, name }: { cache?: boolean; name?: string }): number {`);
  print(`if (!cache) {`);
  print(`const page = visitUrl("clan_raidlogs.php");`);
  print(`const ${zone} = page.match(/<b>Exposure Esplanade:(.*?)<\\/blockquote>/);`);
  print(`const ${zone}Log = ${zone} ? ${zone}[1].toString() : "";`);
  print(`return flexibleTurns(${zone}Log, "${thing.get(name)}", name);`);
  print(`} else {       return flexibleTurns(this.log, "${thing.get(name)}", name);     } }`);
}
