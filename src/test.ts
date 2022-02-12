/*
function hobosleft() {
  const progress = Burnbarrel.progress() / 100;
  const hobos = progress * 500;
  return hobos;
}

function optimalStack() {
  const stack = Burnbarrel.tires({}) + 1;
  const stackValue = Math.pow(stack, 2) / 10 + stack * 0.7;
}

while (Burnbarrel.tires({}) < 72) {
  setChoice(206, 2);
  adv1($location`Burnbarrel Blvd.`);
  if (have($effect`Beaten Up`)) throw "you got beat up, maybe look into that";
}
while (Burnbarrel.tires({}) >= 72 && Burnbarrel.tirevalanches({}) < 2) {
  setChoice(206, 1);
  adv1($location`Burnbarrel Blvd.`);
}
*/

import { print } from "kolmafia";
import { Burnbarrel, Esplanade, Heap, TownSquare } from "./sidezones";

print(`Town Square is at ${TownSquare.progress()}% complete!`);
if (TownSquare.tentOpen()) print("And the tent is open!");
else print("Unfortunately, the tent is closed.");
print(`Exposure Esplanade is at ${Esplanade.progress()}% complete!`, "blue");
print(`Heap is at ${Heap.progress()}% complete!`, `green`);
print(
  `Burnbarrel is at ${Burnbarrel.progress()}% complete and it only took ${Burnbarrel.tirevalanches(
    {}
  )} tirevalanches`,
  `red`
);
