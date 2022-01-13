import { Burnbarrel, Sewers } from "./sidezones";
import { print } from "kolmafia";

print(
  `donutine currently has ${Burnbarrel.tires({
    name: "donutine",
  })} tires at BB and ${Burnbarrel.kills({ name: "donutine" })} kills`
);

print(`in the sewers, newfi cheese wasted ${Sewers.kills("newfi cheese")} turns killing mobs`);
