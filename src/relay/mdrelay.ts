import { formFields, print } from "kolmafia";

// const consumableValues = new Map<string, number>();

const stuff = formFields();
const stuff2 = new Map(Object.entries(stuff));

print("hi");

for (const thing of stuff2.keys()) {
  print(`${thing} and ${stuff2.get(thing)}`);
}
