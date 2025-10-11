/**
 * Quick Demo - The Most Elegant Way to Use Lamina.js
 *
 * This shows the simplest, most intuitive API
 */

import { lamina } from '../lib/index.mjs'

async function demo() {
  // Initialize once
  await lamina.init()

  console.log('=== Lamina.js - Elegant Math in Node.js ===\n')

  // Use it like a calculator!
  console.log('Simple calculations:')
  console.log('  2 + 3 =', lamina.calc('2 + 3'))
  console.log('  16 / 9 =', lamina.calc('16 / 9'), '(exact rational!)')
  console.log('  sqrt(16) =', lamina.calc('sqrt(16)'), '(exact!)')

  console.log('\nWith variables:')
  lamina.set('x', 10)
  console.log('  x =', lamina.get('x'))
  console.log('  x * 2 =', lamina.calc('x * 2'))

  console.log('\nTemplate tag style:')
  const radius = 5
  const area = lamina.tag`pi() * ${radius}^2`
  console.log(`  Circle area (r=${radius}) =`, area)

  console.log('\nExact fractions:')
  console.log('  1/3 + 1/6 =', lamina.calc('1/3 + 1/6'), '(exact!)')

  console.log('\nVector operations:')
  lamina.exec('var v1 = [1, 2, 3];')
  lamina.exec('var v2 = [4, 5, 6];')
  console.log('  [1,2,3] + [4,5,6] =', lamina.calc('v1 + v2'))
  console.log('  [1,2,3] · [4,5,6] =', lamina.calc('dot(v1, v2)'))

  console.log("\n✨ That's it! Simple and elegant! ✨")

  // Clean up
  lamina.cleanup()
}

demo().catch(console.error)
