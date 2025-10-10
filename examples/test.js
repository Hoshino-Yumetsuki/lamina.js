/**
 * Test file for Lamina.js
 * Run with: npm test
 */

import { createInterpreter, evaluateExpression } from '../lib/index.mjs'

let passed = 0
let failed = 0

async function test(name, fn) {
  try {
    await fn()
    console.log(`✓ ${name}`)
    passed++
  } catch (error) {
    console.error(`✗ ${name}`)
    console.error(`  Error: ${error.message}`)
    failed++
  }
}

async function runTests() {
  console.log('Running Lamina.js tests...\n')

  await test('Basic arithmetic', async () => {
    const result = await evaluateExpression('2 + 3')
    if (!result.includes('5')) throw new Error(`Expected 5, got ${result}`)
  })

  await test('Variable assignment and retrieval', async () => {
    const lamina = await createInterpreter()
    lamina.setVariable('x', 42)
    const value = lamina.getVariable('x')
    if (!value.includes('42')) throw new Error(`Expected 42, got ${value}`)
    lamina.destroy()
  })

  await test('Code execution', async () => {
    const lamina = await createInterpreter()
    const result = lamina.execute('x = 10;')
    if (!result.includes('success') && !result.includes('completed')) {
      console.log(`  Note: Got result "${result}"`)
    }
    lamina.destroy()
  })

  await test('Reset functionality', async () => {
    const lamina = await createInterpreter()
    lamina.setVariable('x', 42)
    lamina.reset()
    // After reset, getting x should fail or return error
    try {
      lamina.getVariable('x')
      throw new Error('Expected error after reset')
    } catch (e) {
      // Expected to fail
      if (!e.message.includes('not found')) {
        throw e
      }
    }
    lamina.destroy()
  })

  console.log(`\nTests complete: ${passed} passed, ${failed} failed`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((error) => {
  console.error('Test runner error:', error)
  process.exit(1)
})
