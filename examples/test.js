/**
 * Test file for Lamina.js
 * Run with: yarn test
 */

import { lamina } from '../lib/index.mjs'

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

  // Test 1: Auto-initialization
  await test('Auto-initialization', async () => {
    await lamina.init()
    const result = lamina.calc('2 + 3')
    if (!result.includes('5')) throw new Error(`Expected 5, got ${result}`)
  })

  // Test 2: Variable operations
  await test('Variable assignment and retrieval', async () => {
    lamina.set('x', 42)
    const value = lamina.get('x')
    if (!value.includes('42')) throw new Error(`Expected 42, got ${value}`)
  })

  // Test 3: Code execution
  await test('Code execution', async () => {
    lamina.exec('var y = 10;')
    const result = lamina.get('y')
    if (!result.includes('10')) throw new Error(`Expected 10, got ${result}`)
  })

  // Test 4: Template tag
  await test('Template tag syntax', async () => {
    const x = 5
    const result = lamina.tag`${x} * 2`
    if (!result.includes('10')) throw new Error(`Expected 10, got ${result}`)
  })

  // Test 5: Isolated context
  await test('Isolated context', async () => {
    const ctx = await lamina.Context.create()
    ctx.set('a', 100)
    const result = ctx.calc('a * 2')
    if (!result.includes('200')) throw new Error(`Expected 200, got ${result}`)
    ctx.destroy()
  })

  // Test 6: Reset functionality
  await test('Reset functionality', async () => {
    const ctx = await lamina.Context.create()
    ctx.set('z', 99)
    ctx.reset()
    try {
      ctx.get('z')
      throw new Error('Expected error after reset')
    } catch (e) {
      if (!e.message.includes('not found')) {
        throw e
      }
    }
    ctx.destroy()
  })

  // Test 7: Exact arithmetic
  await test('Exact rational arithmetic', async () => {
    const result = lamina.calc('16 / 9')
    if (!result.includes('16') || !result.includes('9')) {
      throw new Error(`Expected fraction, got ${result}`)
    }
  })

  // Test 8: Chain operations
  await test('Chain operations', async () => {
    lamina.set('m', 5).set('n', 3)
    const result = lamina.calc('m + n')
    if (!result.includes('8')) throw new Error(`Expected 8, got ${result}`)
  })

  console.log(`\nTests complete: ${passed} passed, ${failed} failed`)

  // Cleanup
  lamina.cleanup()

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((error) => {
  console.error('Test runner error:', error)
  process.exit(1)
})
