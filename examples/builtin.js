/**
 * Lamina.js - Built-in Functions Demo
 *
 * This demonstrates all Lamina built-in functions
 */

import { createMathContext } from '../lib/index.mjs'

async function builtinFunctionsDemo() {
  console.log('=== Lamina.js Built-in Functions Demo ===\n')

  const math = await createMathContext()

  // ========================================
  // Mathematical Functions
  // ========================================
  console.log('1. Mathematical Functions:')
  console.log('   sqrt(2) =', math.sqrt(2))
  console.log('   sqrt(8) =', math.sqrt(8), '(simplified to 2√2)')
  console.log('   pi() =', math.pi())
  console.log('   e() =', math.e())
  console.log('   abs(-5) =', math.abs(-5))
  console.log('   sin(0) =', math.sin(0))
  console.log('   cos(0) =', math.cos(0))
  console.log('   log(e()) =', math.calc('log(e())'))

  // ========================================
  // Vector/Matrix Operations
  // ========================================
  console.log('\n2. Vector/Matrix Operations:')
  math.exec('var v1 = [1, 2, 3];')
  math.exec('var v2 = [4, 5, 6];')
  math.exec('var v3 = [1, 0, 0];')
  math.exec('var v4 = [0, 1, 0];')

  console.log('   dot([1,2,3], [4,5,6]) =', math.dot('v1', 'v2'))
  console.log('   cross([1,0,0], [0,1,0]) =', math.cross('v3', 'v4'))
  console.log('   norm([1,2,3]) =', math.norm('v1'))

  math.exec('var matrix = [[1, 2], [3, 4]];')
  console.log('   det([[1,2],[3,4]]) =', math.det('matrix'))

  // ========================================
  // Utility Functions
  // ========================================
  console.log('\n3. Utility Functions:')
  math.exec('var arr = [1, 2, 3, 4, 5];')
  console.log('   size([1,2,3,4,5]) =', math.size('arr'))
  console.log('   fraction(0.75) =', math.fraction(0.75))
  console.log('   decimal(3/4) =', math.calc('decimal(3/4)'))
  console.log('   range(1, 10, 2) =', math.range(1, 10, 2))

  // ========================================
  // Random Functions
  // ========================================
  console.log('\n4. Random Functions:')
  console.log('   rand() =', math.rand())
  console.log('   randint(1, 10) =', math.randint(1, 10))
  console.log('   randstr("abcdefg") =', math.randstr('abcdefg'))

  // ========================================
  // String Functions
  // ========================================
  console.log('\n5. String Functions:')
  console.log(
    '   string_concat("Hello", " ", "World") =',
    math.stringConcat('Hello', ' ', 'World')
  )
  console.log('   string_length("Hello") =', math.stringLength('Hello'))
  console.log('   string_char_at("Hello", 0) =', math.stringCharAt('Hello', 0))
  console.log(
    '   string_find("Hello World", 0, "World") =',
    math.stringFind('Hello World', 0, 'World')
  )
  console.log(
    '   string_sub_string("Hello World", 0, 5) =',
    math.stringSubString('Hello World', 0, 5)
  )

  // ========================================
  // Exact Arithmetic
  // ========================================
  console.log('\n6. Exact Arithmetic:')
  console.log('   1/3 + 1/6 =', math.calc('1/3 + 1/6'), '(exact!)')
  console.log('   16 / 9 =', math.calc('16 / 9'), '(exact rational)')
  console.log(
    '   sqrt(2) * sqrt(2) =',
    math.calc('sqrt(2) * sqrt(2)'),
    '(exact!)'
  )
  console.log('   pi() * 2 =', math.calc('pi() * 2'), '(symbolic)')

  // ========================================
  // BigInt Support
  // ========================================
  console.log('\n7. BigInt Support:')
  math.exec('bigint big_result = 25!;')
  console.log('   25! =', math.get('big_result'))

  // ========================================
  // Complex Expressions
  // ========================================
  console.log('\n8. Complex Expressions:')
  math.set('radius', 5)
  console.log('   Circle area (r=5) =', math.calc('pi() * radius^2'))

  math.set('a', 3)
  math.set('b', 4)
  console.log('   Hypotenuse (3,4) =', math.calc('sqrt(a^2 + b^2)'))

  // ========================================
  // Functions
  // ========================================
  console.log('\n9. User-defined Functions:')
  math.define(`
    func quadratic(a, b, c) {
      var discriminant = b^2 - 4*a*c;
      if (discriminant < 0) return null;
      return (-b + sqrt(discriminant))/(2*a);
    }
  `)
  console.log('   quadratic(1, -5, 6) =', math.call('quadratic', 1, -5, 6))

  // Clean up
  math.destroy()

  console.log('\n=== All Built-in Functions Demonstrated ===')
  console.log('\nKey Features Covered:')
  console.log('  ✓ Mathematical functions (sqrt, sin, cos, log, etc.)')
  console.log('  ✓ Vector/Matrix operations (dot, cross, norm, det)')
  console.log('  ✓ Utility functions (size, fraction, decimal, range)')
  console.log('  ✓ Random functions (rand, randint, randstr)')
  console.log('  ✓ String functions (concat, length, find, substring)')
  console.log('  ✓ Exact arithmetic (rationals, irrationals)')
  console.log('  ✓ BigInt support (factorial)')
  console.log('  ✓ User-defined functions')
}

builtinFunctionsDemo().catch(console.error)
