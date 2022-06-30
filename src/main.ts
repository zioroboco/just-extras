import { Cli } from "clipanion"
import { createRequire } from "module"
import * as commands from "./commands.js"

const packageJson = createRequire(import.meta.url)("../package.json")

const cli = new Cli({
  binaryLabel: packageJson.name,
  binaryName: packageJson.name,
  binaryVersion: packageJson.version,
})

for (const c in commands) {
  cli.register(commands[c])
}

const [node, bin, ...args] = process.argv

cli.runExit(args)
