import { execSync } from "child_process"
import { Cli, Command } from "clipanion"
import { createRequire } from "module"

const packageJson = createRequire(import.meta.url)("../package.json")

const cli = new Cli({
  binaryLabel: packageJson.name,
  binaryName: packageJson.name,
  binaryVersion: packageJson.version,
})

cli.register(
  class extends Command {
    static paths = [["sync"]]
    static usage = Command.Usage({
      description: `Sync justfile recipes with npm package script aliases.`,
    })
    async execute() {
      const fs = await import("fs/promises")

      let just = "just"
      try {
        const npmjust = "node_modules/.bin/just"
        await fs.stat(npmjust)
        just = npmjust
      } catch (_) {}

      const recipes = execSync(`${just} --summary`)
        .toString()
        .slice(0, -1)
        .split(" ")

      const { sync } = await import("./sync.js")

      await sync(fs, recipes)
    }
  }
)

cli.runExit(process.argv.slice(2))
