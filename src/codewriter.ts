import { print } from "kolmafia";
// heap
const thing = new Map([
  ["zombokills", "defeated  Zombo"],
  ["zombodefeats", "defeated by  Zombo"],
  ["raided tombs", "raided"],
  ["failed dances", "failed to impress"],
]);

for (const name of thing.keys()) {
  const zone = "burnbarrel";
  print(`/**`);
  print(`* Return number of ${name} in Burnbarrel Blvd`);
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
  print(`const ${zone} = page.match(/<b>Burnbarrel Blvd.:(.*?)<\\/blockquote>/);`);
  print(`const ${zone}Log = ${zone} ? ${zone}[1].toString() : "";`);
  print(`return flexibleTurns(${zone}Log, "${thing.get(name)}", name);`);
  print(`} else {       return flexibleTurns(this.log, "${thing.get(name)}", name);     } }`);
}
