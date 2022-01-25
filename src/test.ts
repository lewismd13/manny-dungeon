import { Richard, Sewers } from "./sidezones";
import { print, useServant, useSkill } from "kolmafia";
import { $location, $skill, adventureMacroAuto, Macro } from "libram";

print(`Richard has ${Richard.stench()} guts`);
useSkill($skill`Spirit of Garlic`);
adventureMacroAuto(
  $location`Hobopolis Town Square`,
  Macro.trySkill($skill`Stuffed Mortar Shell`).trySkill($skill`Extract`)
);
print(`Richard now has ${Richard.stench()} guts`);
