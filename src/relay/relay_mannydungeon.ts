import { formFields, print, write } from "kolmafia";
import {
  banquets,
  blankets,
  cagebaitPlayers,
  dungeonCost,
  forks,
  juice,
  mugs,
  sliders,
  snuff,
  stews,
} from "../lib";

const page = `<section class="manny-dungeon">
<h1>Manny Dungeon Settings</h1>
<p><b>Consumables</b></p>

<form submit="post" type="submit" action="/mannydungeon/mdrelay.js">
  <div class="input-group">
    <label for="forks">Forks</label>
    <input id="forks" name="forks" type="number" value="${forks}" />
  </div>

  <div class="input-group">
    <label for="mugs">Mugs</label>
    <input id="mugs" name="mugs" type="number" value="${mugs}" />
  </div>

  <div class="input-group">
    <label for="jars">Pickle Juice</label>
    <input id="jars" name="jars" type="number" value="${juice}" />
  </div>

  <div class="input-group">
    <label for="snuff">Snuff</label>
    <input id="snuff" name="snuff" type="number" value="${snuff}" />
  </div>

  <div class="input-group">
    <label for="sliders">Sliders</label>
    <input id="sliders" name="sliders" type="number" value="${sliders}" />
  </div>

  <div class="input-group">
    <label for="stews">Mulligan Stews</label>
    <input id="stews" name="stews" type="number" value="${stews}" />
  </div>

  <div class="input-group">
    <label for="blankets">Blankets</label>
    <input id="blankets" name="blankets" type="number" value="${blankets}" />
  </div>

  <div class="input-group">
    <label for="banquets">Frozen Banquets</label>
    <input id="banquets" name="banquets" type="number" value="${banquets}" />
  </div>

  <p><b>Other Hobopolis Settings</b></p>

  <div class="input-group">
    <label for="cost">Total cost</label>
    <input id="cost" name="cost" type="number" value="${dungeonCost}" />
  </div>

  <div class="input-group">
    <label for="cagebait">Cagebait Playernames (comma delimited)</label>
    <input id="cagebait" name="cagebait" type="text" value="${cagebaitPlayers}" />
  </div>

  <button type="submit">SUBMIT</button>
</form>
</section>`;

function doStuff() {
  // const consumableValues = new Map<string, number>();

  const stuff = formFields();
  const stuff2 = new Map(Object.entries(stuff));

  print("hi");

  for (const thing of stuff2.keys()) {
    print(`${thing} and ${stuff2.get(thing)}`);
  }
}
write(page);
