/**
 * Lamina.js - Built-in Functions Demo
 *
 * This demonstrates all Lamina built-in functions
 */

import { lamina } from '../lib/index.mjs'

async function builtinFunctionsDemo() {
  console.log('=== Lamina.js Built-in Functions Demo ===\n')

  // ========================================
  // Mathematical Functions
  // ========================================
  console.log('1. Mathematical Functions:')
  console.log('   sqrt(2) =', lamina.calc('sqrt(2)'))
  console.log('   sqrt(8) =', lamina.calc('sqrt(8)'), '(simplified to 2√2)')
  console.log('   pi() =', lamina.calc('pi()'))
  console.log('   e() =', lamina.calc('e()'))
  console.log('   abs(-5) =', lamina.calc('abs(-5)'))
  console.log('   sin(0) =', lamina.calc('sin(0)'))
  console.log('   cos(0) =', lamina.calc('cos(0)'))
  // ========================================
  // Vector/Matrix Operations
  // ========================================
  console.log('\n2. Vector/Matrix Operations:')
  lamina.exec('var v1 = [1, 2, 3];')
  lamina.exec('var v2 = [4, 5, 6];')
  lamina.exec('var v3 = [1, 0, 0];')
  lamina.exec('var v4 = [0, 1, 0];')

  console.log('   dot([1,2,3], [4,5,6]) =', lamina.calc('dot(v1, v2)'))
  console.log('   cross([1,0,0], [0,1,0]) =', lamina.calc('cross(v3, v4)'))
  console.log('   norm([3, 4]) =', lamina.calc('norm([3, 4])'))

  lamina.exec('var matrix = [[1, 2], [3, 4]];')
  console.log('   det([[1,2],[3,4]]) =', lamina.calc('det(matrix)'))

  // ========================================
  // Utility Functions
  // ========================================
  console.log('\n3. Utility Functions:')
  lamina.exec('var arr = [1, 2, 3, 4, 5];')
  console.log('   size([1,2,3,4,5]) =', lamina.calc('size(arr)'))
  console.log('   fraction(0.75) =', lamina.calc('fraction(0.75)'))
  console.log('   decimal(3/4) =', lamina.calc('decimal(3/4)'))
  console.log('   range(1, 10, 2) =', lamina.calc('range(1, 10, 2)'))

  // ========================================
  // Random Functions
  // ========================================
  console.log('\n4. Random Functions:')
  console.log('   rand() =', lamina.calc('rand()'))
  console.log('   randint(1, 10) =', lamina.calc('randint(1, 10)'))
  console.log('   randstr("abcdefg") =', lamina.calc('randstr("abcdefg")'))

  // ========================================
  // String Functions
  // ========================================
  console.log('\n5. String Functions:')
  console.log(
    '   string_concat("Hello", " ", "World") =',
    lamina.calc('string_concat("Hello", " ", "World")')
  )
  console.log(
    '   string_length("Hello") =',
    lamina.calc('string_length("Hello")')
  )
  console.log(
    '   string_char_at("Hello", 0) =',
    lamina.calc('string_char_at("Hello", 0)')
  )
  console.log(
    '   string_find("Hello World", 0, "World") =',
    lamina.calc('string_find("Hello World", 0, "World")')
  )
  console.log(
    '   string_sub_string("Hello World", 0, 5) =',
    lamina.calc('string_sub_string("Hello World", 0, 5)')
  )

  // ========================================
  // Exact Arithmetic
  // ========================================
  console.log('\n6. Exact Arithmetic:')
  console.log('   1/3 + 1/6 =', lamina.calc('1/3 + 1/6'), '(exact!)')
  console.log('   16 / 9 =', lamina.calc('16 / 9'), '(exact rational)')
  console.log('   sqrt(16) =', lamina.calc('sqrt(16)'), '(exact!)')
  console.log('   pi() * 2 =', lamina.calc('pi() * 2'), '(symbolic)')

  // ========================================
  // BigInt Support
  // ========================================
  console.log('\n7. BigInt Support:')
  lamina.exec('bigint big_result = 25!;')
  console.log('   25! =', lamina.get('big_result'))

  // ========================================
  // Complex Expressions
  // ========================================
  console.log('\n8. Complex Expressions:')
  lamina.set('radius', 5)
  console.log('   Circle area (r=5) =', lamina.calc('pi() * radius^2'))

  lamina.set('a', 3)
  lamina.set('b', 4)
  console.log('   Hypotenuse (3,4) =', lamina.calc('sqrt(a^2 + b^2)'))

  // ========================================
  // Functions
  // ========================================
  console.log('\n9. User-defined Functions:')
  lamina.exec(`
    func quadratic(a, b, c) {
      var discriminant = b^2 - 4*a*c;
      if (discriminant < 0) return null;
      return (-b + sqrt(discriminant))/(2*a);
    }
  `)
  console.log('   quadratic(1, -5, 6) =', lamina.calc('quadratic(1, -5, 6)'))

  // Clean up
  lamina.cleanup()

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
