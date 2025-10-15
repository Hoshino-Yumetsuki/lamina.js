/**
 * Test buffer execution functionality
 */

import { lamina } from '../lib/index.mjs'
import fs from 'fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testBuffer() {
  console.log('=== Testing Buffer Execution ===\n')

  // Wait for initialization
  await lamina.init()

  const lmFilePath = path.join(__dirname, 'test.lm')
  console.log(`Reading file: ${lmFilePath}`)

  // Read file as buffer
  const fileBuffer = fs.readFileSync(lmFilePath)
  console.log(`File size: ${fileBuffer.length} bytes`)

  // Create new context for clean test
  const ctx2 = await lamina.createContext()

  ctx2.execBuffer(fileBuffer, 'utf-8')
  ctx2.destroy()
  lamina.cleanup()
}

// Run tests
testBuffer().catch((error) => {
  console.error('Test failed:', error)
  process.exit(1)
})
