/**
 * Elegant API Examples for Lamina.js
 *
 * This demonstrates the more intuitive and JavaScript-friendly API
 */

import { lamina, LaminaContext } from '../lib/index.mjs'

async function elegantExamples() {
  console.log('=== Lamina.js Elegant API Examples ===\n')

  // ========================================
  // ========================================
  console.log('1. Using Global lamina Object:')

  // Initialize once at the start
  await lamina.init()

  // Now you can do simple calculations like using a calculator
  console.log('   2 + 3 =', lamina.calc('2 + 3'))
  console.log('   16 / 9 =', lamina.calc('16 / 9'), '(exact!)')
  console.log('   sqrt(2) * sqrt(2) =', lamina.calc('sqrt(2) * sqrt(2)'))

  // Set variables easily
  lamina.set('radius', 5)
  console.log('   Circle area (r=5) =', lamina.calc('pi() * radius^2'))

  // Chain operations
  lamina.set('x', 10).set('y', 20).exec('var sum = x + y;')
  console.log('   x + y =', lamina.get('sum'))

  // ========================================
  // Method 2: Template Tag (Most Elegant!)
  // ========================================
  console.log('\n2. Using Template Tag:')

  const a = 5
  const b = 3

  // Use lamina.tag as a template tag
  const result1 = lamina.tag`${a} + ${b}`
  console.log(`   ${a} + ${b} = ${result1}`)

  const radius = 10
  const area = lamina.tag`pi() * ${radius}^2`
  console.log(`   Circle area (r=${radius}) = ${area}`)

  // ========================================
  // Method 3: Context Object (Isolated Environment)
  // ========================================
  console.log('\n3. Using Isolated Context:')

  const ctx = await LaminaContext.create()

  // Fluent API with chaining
  const answer = ctx.set('a', 100).set('b', 50).calc('a - b')
  console.log('   100 - 50 =', answer)

  // Define and call functions
  ctx.define(`
    func fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
  `)
  console.log('   fibonacci(10) =', ctx.call('fibonacci', 10))

  // Clean up when done
  ctx.destroy()

  // ========================================
  // Method 4: Mathematical Expressions
  // ========================================
  console.log('\n4. Complex Mathematical Expressions:')

  // Exact rational arithmetic
  console.log('   1/3 + 1/6 =', lamina.calc('1/3 + 1/6'), '(exact)')

  // Vector operations
  lamina.exec('var v1 = [1, 2, 3];')
  lamina.exec('var v2 = [4, 5, 6];')
  console.log('   [1,2,3] · [4,5,6] =', lamina.calc('dot(v1, v2)'))

  // Matrix determinant
  lamina.exec('var matrix = [[1, 2], [3, 4]];')
  console.log('   det([[1,2],[3,4]]) =', lamina.calc('det(matrix)'))

  // ========================================
  // Method 5: Practical Use Cases
  // ========================================
  console.log('\n5. Practical Use Cases:')

  // Calculate compound interest
  lamina
    .set('principal', 1000)
    .set('rate', 0.05)
    .set('years', 10)
    .exec('var amount = principal * (1 + rate)^years;')
  console.log('   Compound Interest (10 years, 5%) =', lamina.get('amount'))

  // Quadratic equation
  ctx2 = await LaminaContext.create()
  ctx2.define(`
    func quadratic(a, b, c) {
      var discriminant = b^2 - 4*a*c;
      if (discriminant < 0) return null;
      var root1 = (-b + sqrt(discriminant))/(2*a);
      return root1;
    }
  `)
  console.log(
    '   Quadratic root (x²-5x+6=0) =',
    ctx2.call('quadratic', 1, -5, 6)
  )
  ctx2.destroy()

  // ========================================
  // Method 6: Working with Exact Values
  // ========================================
  console.log('\n6. Exact Mathematical Values:')

  // No floating point errors!
  console.log(
    '   0.1 + 0.2 (as fractions) =',
    lamina.calc('fraction(0.1) + fraction(0.2)')
  )

  // Symbolic computation
  console.log('   √8 simplified =', lamina.calc('sqrt(8)'))
  console.log('   π + e =', lamina.calc('pi() + e()'))

  // Factorial with BigInt
  lamina.exec('bigint result = 20!;')
  console.log('   20! =', lamina.get('result'))

  // Clean up
  lamina.cleanup()

  console.log('\n=== Examples Complete ===')
  console.log('\nKey Features:')
  console.log('  ✓ Simple, calculator-like syntax')
  console.log('  ✓ Template tag support')
  console.log('  ✓ Chain operations')
  console.log('  ✓ Exact arithmetic (no rounding errors)')
  console.log('  ✓ Symbolic math support')
  console.log('  ✓ Multiple isolated contexts')
}

// Run examples
elegantExamples().catch(console.error)
