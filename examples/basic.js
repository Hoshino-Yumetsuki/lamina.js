/**
 * Basic example of using Lamina.js in Node.js
 */

import { lamina } from '../lib/index.mjs'

async function main() {
  console.log('=== Lamina.js Examples ===\n')

  // Example 1: Quick expression evaluation
  console.log('1. Quick Expression Evaluation:')
  try {
    const result1 = lamina.calc('2 + 3')
    console.log('   2 + 3 =', result1)

    const result2 = lamina.calc('16 / 9')
    console.log('   16 / 9 =', result2, '(exact rational)')
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n2. Using Context Instance:')
  try {
    const ctx = await lamina.Context.create()

    // Set variables
    ctx.set('x', 10)
    ctx.set('y', 20)

    // Get variables
    const x = ctx.get('x')
    const y = ctx.get('y')
    console.log('   x =', x)
    console.log('   y =', y)

    // Execute code
    const _result = ctx.exec('var sum = x + y;')
    console.log('   Execution completed')

    const sum = ctx.get('sum')
    console.log('   sum =', sum)

    // Clean up
    ctx.destroy()
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n3. Exact Rational Math:')
  try {
    const result1 = lamina.calc('1/3 + 1/6')
    console.log('   1/3 + 1/6 =', result1, '(should be 1/2)')
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n4. Vector Operations:')
  try {
    const ctx = await lamina.Context.create()
    ctx.exec('var v1 = [1, 2, 3];')
    ctx.exec('var v2 = [4, 5, 6];')
    ctx.exec('var v3 = v1 + v2;')

    const v3 = ctx.get('v3')
    console.log('   [1,2,3] + [4,5,6] =', v3)

    ctx.destroy()
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n5. Functions:')
  try {
    const ctx = await lamina.Context.create()

    // Define a function
    ctx.define(`
      func fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
    `)

    // Call the function
    const fib10 = ctx.call('fibonacci', 10)
    console.log('   fibonacci(10) =', fib10)

    ctx.destroy()
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n=== Examples Complete ===')
}

// Run the examples
main().catch(console.error)
