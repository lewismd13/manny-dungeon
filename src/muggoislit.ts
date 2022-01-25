import {
  adv1,
  equip,
  familiarWeight,
  maximize,
  myAdventures,
  print,
  setAutoAttack,
  setProperty,
  useFamiliar,
  userPrompt,
  useSkill,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $location,
  $skill,
  $slot,
  AsdonMartin,
  ensureEffect,
  get,
  Macro,
  SongBoom,
} from "libram";
import { Burnbarrel, Richard, Sewers } from "./sidezones";

function setChoice(adv: number, choice: number) {
  setProperty(`choiceAdventure${adv}`, `${choice}`);
}

if (Sewers.cleared()) {
  print("excellent, youre through");
} else {
  print("Gotta get through them sewers, buddy boy");
  print(`but FYI Richard already has ${Richard.cold} eyeballs`);
}
// do we try to use cagepole?

if (!Sewers.cleared()) {
  // get prepped
  useSkill($skill`The Ode to Booze`, 3);
  useFamiliar($familiar`Frumious Bandersnatch`);
  equip($item`none`, $slot`weapon`);
  equip($item`hobo code binder`);
  maximize("familiar weight -offhand", false);
  equip($item`camouflage T-shirt`);
  equip($item`protonic accelerator pack`);

  ensureEffect($effect`The Sonata of Sneakiness`, 30);
  ensureEffect($effect`Smooth Movements`, 30);
  ensureEffect($effect`Leash of Linguini`, 30);
  ensureEffect($effect`Empathy`, 30);
  ensureEffect($effect`Blood Bond`, 30);
  ensureEffect($effect`Become Superficially interested`);
  ensureEffect($effect`Gummed Shoes`);
  AsdonMartin.drive($effect`Driving Stealthily`, 30);

  // set up macro, make sure we don't run from wanderers
  Macro.if_(
    'monstername "witchess bishop" || monstername "sausage goblin" || monstername "witchess knight" || monsterid 1965 || monstername "knob goblin embezzler"',
    Macro.trySkill($skill`Curse of Weaksauce`)
      .skill($skill`Saucestorm`)
      .repeat()
  )
    .runaway()
    .setAutoAttack();

  // set all the sewer choices here, just blast through everything, we should be done in time to not need a second sewer dive
  // if this is wrong, we need some if statements in the while loop
  // I think it's wrong.

  // caged, chew
  setChoice(211, 1);
  setChoice(212, 1);

  // grate choice
  setChoice(198, 1);
  // valve
  setChoice(197, 1);

  // adventure
  while (!Sewers.cleared()) {
    // look into libram freerun stuff here
    if (get("_banderRunaways") < Math.floor(familiarWeight($familiar`Frumious Bandersnatch`) / 5))
      adv1($location`A Maze of Sewer Tunnels`);
  }
}

function townSquare(scobos: number) {
  // marketplace choice, juse leave
  // TODO: add market food/booze handling
  setChoice(272, 2);
  setChoice(225, 3);

  // TODO: outfits
  // TODO: Wanderer handling

  /*
  Crown of Thrones
	balsam barrel
	camouflage T-shirt
	Staff of Simmering Hatred
	can of mixed everything
	Ultra Bandage-wrapped Hilarious Exploding Literally Smoking Rayon Pantaloons
	mafia thumb ring
	Mr. Cheeng's spectacles
	lucky gold ring
  */

  Macro.trySkill($skill`Stuffed Mortar Shell`)
    .trySkill($skill`Extract`)
    .trySkillRepeat($skill`Saucestorm`)
    .setAutoAttack();

  ensureEffect($effect`Carol of the Hells`, scobos - Richard.hot());
  useSkill($skill`Spirit of Cayenne`);
  while (Richard.hot() < scobos && myAdventures() > 1) {
    adv1($location`Hobopolis Town Square`);
    print(`That's ${Richard.hot()} boots and we need ${scobos}`);
  }

  ensureEffect($effect`Carol of the Hells`, scobos - Richard.cold());
  useSkill($skill`Spirit of Peppermint`);
  while (Richard.cold() < scobos && myAdventures() > 1) {
    adv1($location`Hobopolis Town Square`);
    print(`That's ${Richard.cold()} eyes and we need ${scobos}`);
  }

  ensureEffect($effect`Carol of the Hells`, scobos - Richard.stench());
  useSkill($skill`Spirit of Garlic`);
  while (Richard.stench() < scobos && myAdventures() > 1) {
    adv1($location`Hobopolis Town Square`);
    print(`That's ${Richard.stench()} guts and we need ${scobos}`);
  }

  ensureEffect($effect`Carol of the Hells`, scobos - Richard.spooky());
  useSkill($skill`Spirit of Wormwood`);
  while (Richard.spooky() < scobos && myAdventures() > 1) {
    adv1($location`Hobopolis Town Square`);
    print(`That's ${Richard.spooky()} skulls and we need ${scobos}`);
  }

  ensureEffect($effect`Carol of the Hells`, scobos - Richard.sleaze());
  useSkill($skill`Spirit of Bacon Grease`);
  while (Richard.sleaze() < scobos && myAdventures() > 1) {
    adv1($location`Hobopolis Town Square`);
    print(`That's ${Richard.sleaze()} crotches and we need ${scobos}`);
  }

  // switch it up for physical
  useSkill($skill`Spirit of Nothing`);
  equip($slot`weapon`, $item`Fourth of May Cosplay Saber`);
  equip($slot`acc2`, $item`wormwood wedding ring`);
  Macro.attack().repeat().setAutoAttack();

  ensureEffect($effect`Carol of the Bulls`, scobos - Richard.physical());
  while (Richard.physical() < scobos && myAdventures() > 1) {
    ensureEffect($effect`Carol of the Bulls`);
    adv1($location`Hobopolis Town Square`);
    print(`That's ${Richard.physical()} skins and we need ${scobos}`);
  }
  setAutoAttack(0);
}

setProperty(
  "afterAdventureScript",
  "jsq if (itemAmount(Item.get('hobo nickel')) > 0) putCloset(Item.get('hobo nickel'), itemAmount(Item.get('hobo nickel')));"
);

if (SongBoom.song() !== "Food Vibrations") SongBoom.setSong("Food Vibrations");
/*
useFamiliar($familiar`Red-Nosed Snapper`);
if (Snapper.getTrackedPhylum() !== $phylum`hobo`) Snapper.trackPhylum($phylum`hobo`);
*/
townSquare(35);

print(`Skins: ${Richard.physical()}`);
print(`Boots: ${Richard.hot()}`);
print(`Eyeballs: ${Richard.cold()}`);
print(`Guts: ${Richard.stench()}`);
print(`Skulls: ${Richard.spooky()}`);
print(`Crotches: ${Richard.sleaze()}`);

print();
print(`I hope those numbers are all greater than or equal to 35`);

setProperty("afterAdventureScript", "");

function burnbarrel() {
  let tires;
  if (Burnbarrel.tires({}) > 0 && Burnbarrel.tirevalanches({}) > 0) {
    tires = userPrompt("How many tires on the stack?");
  } else tires = Burnbarrel.tires({});
}
