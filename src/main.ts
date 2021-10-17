import { print } from "kolmafia";
import { globalOptions } from "./globalvars";
import { printHelpMenu } from "./lib";

// TODO: have this take arguments like doctor dread. md consumables md sim md random md bossloot md help etc md old
export function main(argString = "") {
  const args = argString.split(" ");
  for (const arg in args) {
    if (arg.match(/sim/i)) {
      globalOptions.sim = true;
    } else if (arg.match(/bossloot/i)) {
      globalOptions.bossloot = true;
    } else if (arg.match(/consumables/i)) {
      globalOptions.consumables = true;
    } else if (arg.match(/random/i)) {
      globalOptions.random = true;
    } else if (arg.match(/help/i)) {
      printHelpMenu();
      return;
    } else if (arg) {
      print(
        `I didn't understand that, please say "help", "sim", "bossloot", "random" or "consumables".`
      );
      return;
    }
  }
}
