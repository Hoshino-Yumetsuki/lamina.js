/**
 * Basic example of using Lamina.js in Node.js
 */

import { LaminaInterpreter, evaluateExpression } from '../dist/index.js'

async function main() {
  console.log('=== Lamina.js Examples ===\n')

  // Example 1: Quick expression evaluation
  console.log('1. Quick Expression Evaluation:')
  try {
    const result1 = await evaluateExpression('2 + 3')
    console.log('   2 + 3 =', result1)

    const result2 = await evaluateExpression('16 / 9')
    console.log('   16 / 9 =', result2, '(exact rational)')
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n2. Using Interpreter Instance:')
  try {
    const lamina = new LaminaInterpreter()

    // Set variables
    await lamina.setVariable('x', 10)
    await lamina.setVariable('y', 20)

    // Get variables
    const x = await lamina.getVariable('x')
    const y = await lamina.getVariable('y')
    console.log('   x =', x)
    console.log('   y =', y)

    // Execute code
    const result = await lamina.execute('var sum = x + y;')
    console.log('   Execution result:', result)

    const sum = await lamina.getVariable('sum')
    console.log('   sum =', sum)

    // Clean up
    lamina.destroy()
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n3. Exact Rational Math:')
  try {
    const result1 = await evaluateExpression('1/3 + 1/6')
    console.log('   1/3 + 1/6 =', result1, '(should be 1/2)')
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n4. Vector Operations:')
  try {
    const lamina = new LaminaInterpreter()
    await lamina.execute('var v1 = [1, 2, 3];')
    await lamina.execute('var v2 = [4, 5, 6];')
    await lamina.execute('var v3 = v1 + v2;')

    const v3 = await lamina.getVariable('v3')
    console.log('   [1,2,3] + [4,5,6] =', v3)

    lamina.destroy()
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n5. Functions:')
  try {
    const lamina = new LaminaInterpreter()

    // Define a function
    await lamina.execute(`
      func fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
      }
    `)

    // Call the function
    await lamina.execute('var fib10 = fibonacci(10);')
    const fib10 = await lamina.getVariable('fib10')
    console.log('   fibonacci(10) =', fib10)

    lamina.destroy()
  } catch (error) {
    console.error('   Error:', error.message)
  }

  console.log('\n=== Examples Complete ===')
}

// Run the examples
main().catch(console.error)
