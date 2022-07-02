import { execSync } from "child_process"
import { Cli, Command, Option } from "clipanion"
import { createRequire } from "module"

const packageJson = createRequire(import.meta.url)("../package.json")

const cli = new Cli({
  binaryLabel: packageJson.name,
  binaryName: packageJson.name,
  binaryVersion: packageJson.version,
})

cli.register(
  class extends Command {
    static paths = [["check"]]
    static usage = Command.Usage({
      description: `Check for required updates to npm package script aliases.`,
    })

    omit = Option.Array("--omit", {
      description: "Omit recipes from check (comma-separated)",
    })

    async execute() {
      const fs = await import("fs/promises")

      let just = "just"
      try {
        const npmjust = "node_modules/.bin/just"
        await fs.stat(npmjust)
        just = npmjust
      } catch (_) {}

      const omit = (this.omit ?? []).flatMap(o => o.split(","))

      const recipes = execSync(`${just} --summary`)
        .toString()
        .slice(0, -1)
        .split(" ")
        .filter(r => !omit.includes(r))

      const { check } = await import("./sync.js")

      const { missing, unknown } = await check(fs, recipes)

      if (missing.length == 0 && unknown.length == 0) {
        process.exit(0)
      }

      const SEP = "\n    "

      if (missing.length > 0) {
        this.context.stderr.write(
          "Missing package script aliases for justfile recipes:"
            + SEP
            + missing.join(SEP)
            + "\n"
        )
      }

      if (unknown.length > 0) {
        this.context.stderr.write(
          "Package script aliases for unknown justfile recipes:"
            + SEP
            + unknown.join(SEP)
            + "\n"
        )
      }

      this.context.stderr.write(
        `\nUse "just-extras sync" to update justfile recipe aliases.\n`
      )

      process.exit(1)
    }
  }
)

cli.register(
  class extends Command {
    static paths = [["sync"]]
    static usage = Command.Usage({
      description: `Sync justfile recipes with npm package script aliases.`,
    })

    omit = Option.Array("--omit", {
      description: "Omit recipes from sync (comma-separated)",
    })

    async execute() {
      const fs = await import("fs/promises")

      let just = "just"
      try {
        const npmjust = "node_modules/.bin/just"
        await fs.stat(npmjust)
        just = npmjust
      } catch (_) {}

      const omit = (this.omit ?? []).flatMap(o => o.split(","))

      const recipes = execSync(`${just} --summary`)
        .toString()
        .slice(0, -1)
        .split(" ")
        .filter(r => !omit.includes(r))

      const { sync } = await import("./sync.js")

      await sync(fs, recipes)
    }
  }
)

cli.runExit(process.argv.slice(2))
