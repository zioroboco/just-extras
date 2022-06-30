import assert from "node:assert"
import test from "node:test"

import { blep } from "../dist/index.js"

test(`blep has the expected value`, t => {
  assert.equal(blep, "blep")
})
