/**
 * @param {typeof import("fs/promises")} fs
 * @param {string[]} recipes
 */
export async function sync(fs, recipes) {
  const packageJson = await (
    fs.readFile("./package.json", "utf8")
      .then(JSON.parse)
  )

  /** Any existing scripts unrelated to justfile... */
  const otherScripts = Object.entries(packageJson.scripts)
    .filter(([key, value]) => value !== `just ${key}`)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

  /** Newly updated scripts corresponding to justfile... */
  const justScripts = recipes
    .reduce((acc, recipe) => ({ ...acc, [recipe]: `just ${recipe}` }), {})

  const nextPackageJson = {
    ...packageJson,
    scripts: {
      ...otherScripts,
      ...justScripts,
    },
  }

  await fs.writeFile(
    "./package.json",
    JSON.stringify(nextPackageJson, null, 2) + "\n"
  )
}

/**
 * @param {typeof import("fs/promises")} fs
 * @param {string[]} recipes
 */
export async function check(fs, recipes) {
  const packageJson = await (
    fs.readFile("./package.json", "utf8")
      .then(JSON.parse)
  )

  const aliases = Object.entries(packageJson.scripts)
    .filter(([key, value]) => value === `just ${key}`)
    .map(([key, _]) => key)

  return {
    missing: recipes.filter(recipe => !aliases.includes(recipe)),
    unknown: aliases.filter(alias => !recipes.includes(alias)),
  }
}
