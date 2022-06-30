import { Command } from "clipanion"

export class DingCommand extends Command {
  static paths = [["ding"]]
  static usage = Command.Usage({
    description: `Goes "ding!"`,
  })
  async execute() {
    this.context.stdout.write("ding!\n")
  }
}
