/**
 * Lamina.js - Built-in Functions Wrapper
 *
 * Provides convenient access to all Lamina built-in functions
 */

import { LaminaContext } from './api'

/**
 * Extended Lamina context with built-in function wrappers
 */
export class LaminaMath extends LaminaContext {
  // ========================================
  // Mathematical Functions
  // ========================================

  /**
   * Square root (exact irrational)
   * @param {number|string} x
   * @returns {string}
   */
  sqrt(x: number | string): string {
    return this.calc(`sqrt(${x})`)
  }

  /**
   * Get π constant
   * @returns {string}
   */
  pi(): string {
    return this.calc('pi()')
  }

  /**
   * Get e constant (Euler's number)
   * @returns {string}
   */
  e(): string {
    return this.calc('e()')
  }

  /**
   * Absolute value
   * @param {number|string} x
   * @returns {string}
   */
  abs(x: number | string): string {
    return this.calc(`abs(${x})`)
  }

  /**
   * Sine
   * @param {number|string} x
   * @returns {string}
   */
  sin(x: number | string): string {
    return this.calc(`sin(${x})`)
  }

  /**
   * Cosine
   * @param {number|string} x
   * @returns {string}
   */
  cos(x: number | string): string {
    return this.calc(`cos(${x})`)
  }

  /**
   * Natural logarithm
   * @param {number|string} x
   * @returns {string}
   */
  log(x: number | string): string {
    return this.calc(`log(${x})`)
  }

  // ========================================
  // Vector/Matrix Functions
  // ========================================

  /**
   * Dot product of two vectors
   * @param {string} v1 - Variable name or array literal
   * @param {string} v2 - Variable name or array literal
   * @returns {string}
   */
  dot(v1: string, v2: string): string {
    return this.calc(`dot(${v1}, ${v2})`)
  }

  /**
   * Cross product of two 3D vectors
   * @param {string} v1
   * @param {string} v2
   * @returns {string}
   */
  cross(v1: string, v2: string): string {
    return this.calc(`cross(${v1}, ${v2})`)
  }

  /**
   * Vector norm (magnitude)
   * @param {string} v
   * @returns {string}
   */
  norm(v: string): string {
    return this.calc(`norm(${v})`)
  }

  /**
   * Matrix determinant
   * @param {string} m
   * @returns {string}
   */
  det(m: string): string {
    return this.calc(`det(${m})`)
  }

  // ========================================
  // Utility Functions
  // ========================================

  /**
   * Get size of array/string
   * @param {string} x
   * @returns {string}
   */
  size(x: string): string {
    return this.calc(`size(${x})`)
  }

  /**
   * Convert decimal to fraction
   * @param {number} x
   * @returns {string}
   */
  fraction(x: number): string {
    return this.calc(`fraction(${x})`)
  }

  /**
   * Convert fraction to decimal
   * @param {string} x
   * @returns {string}
   */
  decimal(x: string): string {
    return this.calc(`decimal(${x})`)
  }

  /**
   * Generate range array
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @returns {string}
   */
  range(start: number, end?: number, step?: number): string {
    if (end === undefined) {
      return this.calc(`range(${start})`)
    }
    if (step === undefined) {
      return this.calc(`range(${start}, ${end})`)
    }
    return this.calc(`range(${start}, ${end}, ${step})`)
  }

  // ========================================
  // Random Functions
  // ========================================

  /**
   * Get random float between 0 and 1
   * @returns {string}
   */
  rand(): string {
    return this.calc('rand()')
  }

  /**
   * Get random integer in range
   * @param {number} start
   * @param {number} end
   * @returns {string}
   */
  randint(start: number, end: number): string {
    return this.calc(`randint(${start}, ${end})`)
  }

  /**
   * Get random character from string
   * @param {string} str
   * @returns {string}
   */
  randstr(str: string): string {
    return this.calc(`randstr("${str}")`)
  }

  // ========================================
  // String Functions
  // ========================================

  /**
   * Concatenate strings
   * @param {...string} strs
   * @returns {string}
   */
  stringConcat(...strs: string[]): string {
    const args = strs.map((s) => `"${s}"`).join(', ')
    return this.calc(`string_concat(${args})`)
  }

  /**
   * Get character at index
   * @param {string} str
   * @param {number} index
   * @returns {string}
   */
  stringCharAt(str: string, index: number): string {
    return this.calc(`string_char_at("${str}", ${index})`)
  }

  /**
   * Get string length
   * @param {string} str
   * @returns {string}
   */
  stringLength(str: string): string {
    return this.calc(`string_length("${str}")`)
  }

  /**
   * Find substring
   * @param {string} str
   * @param {number} startIndex
   * @param {string} subStr
   * @returns {string}
   */
  stringFind(str: string, startIndex: number, subStr: string): string {
    return this.calc(`string_find("${str}", ${startIndex}, "${subStr}")`)
  }

  /**
   * Get substring
   * @param {string} str
   * @param {number} startIndex
   * @param {number} len
   * @returns {string}
   */
  stringSubString(str: string, startIndex: number, len: number): string {
    return this.calc(`string_sub_string("${str}", ${startIndex}, ${len})`)
  }

  /**
   * Replace substring
   * @param {string} str
   * @param {number} startIndex
   * @param {string} subStr
   * @returns {string}
   */
  stringReplaceByIndex(
    str: string,
    startIndex: number,
    subStr: string
  ): string {
    return this.calc(
      `string_replace_by_index("${str}", ${startIndex}, "${subStr}")`
    )
  }
}

/**
 * Create math context with all built-in functions
 * @returns {Promise<LaminaMath>}
 */
export async function createMathContext(): Promise<LaminaMath> {
  const ctx = (await LaminaMath.create()) as LaminaMath
  return ctx
}

export default LaminaMath
