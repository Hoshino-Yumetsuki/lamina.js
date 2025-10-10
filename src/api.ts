/**
 * Lamina.js - Elegant API
 *
 * Provides a more intuitive and elegant way to use Lamina in Node.js
 */

import { LaminaInterpreter } from './interpreter'

export class LaminaContext {
  protected _interpreter: LaminaInterpreter
  protected _initialized = false

  protected constructor(interpreter: LaminaInterpreter) {
    this._interpreter = interpreter
  }

  static async create(): Promise<LaminaContext> {
    const interpreter = new LaminaInterpreter()
    await interpreter._init()
    const context = new LaminaContext(interpreter)
    context._initialized = true
    return context
  }

  /**
   * Calculate an expression and return the result
   * @param {string} expression
   * @returns {string} Result
   */
  calc(expression: string): string {
    if (!this._initialized) {
      throw new Error(
        'Context not initialized. Use LaminaContext.create() instead of new LaminaContext()'
      )
    }
    return this._interpreter.eval(expression)
  }

  /**
   * Set a variable
   * @param {string} name
   * @param {number|string} value
   * @returns {LaminaContext} this for chaining
   */
  set(name: string, value: number | string): this {
    if (typeof value === 'number') {
      this._interpreter.setVariable(name, value)
    } else {
      this._interpreter.setStringVariable(name, value)
    }
    return this
  }

  /**
   * Get a variable
   * @param {string} name
   * @returns {string}
   */
  get(name: string): string {
    return this._interpreter.getVariable(name)
  }

  /**
   * Execute Lamina code
   * @param {string} code
   * @returns {LaminaContext} this for chaining
   */
  exec(code: string): this {
    this._interpreter.execute(code)
    return this
  }

  /**
   * Define a function
   * @param {string} code - Function definition
   * @returns {LaminaContext} this for chaining
   */
  define(code: string): this {
    this._interpreter.execute(code)
    return this
  }

  /**
   * Call a function and return result
   * @param {string} name - Function name
   * @param  {...any} args - Arguments
   * @returns {string} Result
   */
  call(name: string, ...args: (number | string)[]): string {
    const argsStr = args.join(', ')
    return this.calc(`${name}(${argsStr})`)
  }

  /**
   * Reset the context
   * @returns {LaminaContext} this for chaining
   */
  reset(): this {
    this._interpreter.reset()
    return this
  }

  /**
   * Clean up
   */
  destroy(): void {
    this._interpreter.destroy()
    this._initialized = false
  }
}

/**
 * Quick calculation wrapper
 * Must be initialized first with lamina.init()
 */
let _globalContext: LaminaContext | null = null

interface LaminaGlobal {
  init(): Promise<LaminaContext>
  calc(expression: string): string
  set(name: string, value: number | string): LaminaGlobal
  get(name: string): string
  exec(code: string): LaminaGlobal
  createContext(): Promise<LaminaContext>
  cleanup(): void
  readonly context: LaminaContext | null
  tag(strings: TemplateStringsArray, ...values: (number | string)[]): string
}

export const lamina: LaminaGlobal = {
  /**
   * Initialize the global Lamina context
   * Call this once at the start of your program
   */
  async init(): Promise<LaminaContext> {
    if (_globalContext) {
      return _globalContext
    }
    _globalContext = await LaminaContext.create()
    return _globalContext
  },

  /**
   * Quick calculation (requires init() to be called first)
   * @param {string} expression
   * @returns {string} Result
   */
  calc(expression: string): string {
    if (!_globalContext) {
      throw new Error('Lamina not initialized. Call await lamina.init() first.')
    }
    return _globalContext.calc(expression)
  },

  /**
   * Set a variable (requires init() to be called first)
   */
  set(name: string, value: number | string): LaminaGlobal {
    if (!_globalContext) {
      throw new Error('Lamina not initialized. Call await lamina.init() first.')
    }
    _globalContext.set(name, value)
    return lamina
  },

  /**
   * Get a variable (requires init() to be called first)
   */
  get(name: string): string {
    if (!_globalContext) {
      throw new Error('Lamina not initialized. Call await lamina.init() first.')
    }
    return _globalContext.get(name)
  },

  /**
   * Execute code (requires init() to be called first)
   */
  exec(code: string): LaminaGlobal {
    if (!_globalContext) {
      throw new Error('Lamina not initialized. Call await lamina.init() first.')
    }
    _globalContext.exec(code)
    return lamina
  },

  /**
   * Create a new isolated context
   * @returns {Promise<LaminaContext>}
   */
  createContext(): Promise<LaminaContext> {
    return LaminaContext.create()
  },

  /**
   * Clean up global context
   */
  cleanup(): void {
    if (_globalContext) {
      _globalContext.destroy()
      _globalContext = null
    }
  },

  /**
   * Get the global context
   */
  get context(): LaminaContext | null {
    return _globalContext
  },

  /**
   * Template tag for Lamina expressions
   * Usage: lamina.tag`2 + 3` or lamina.tag`sqrt(${x})`
   */
  tag(strings: TemplateStringsArray, ...values: (number | string)[]): string {
    if (!_globalContext) {
      throw new Error('Lamina not initialized. Call await lamina.init() first.')
    }

    let expression = strings[0]
    for (let i = 0; i < values.length; i++) {
      expression += values[i] + strings[i + 1]
    }

    return _globalContext.calc(expression)
  }
}

export default lamina
