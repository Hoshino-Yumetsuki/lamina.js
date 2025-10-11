/**
 * Lamina.js - Elegant API
 *
 * Provides a more intuitive and elegant way to use Lamina in Node.js
 */

import { LaminaInterpreter, isModuleReady } from './interpreter'

export class LaminaContext {
  protected _interpreter: LaminaInterpreter

  /**
   * Create a context with an interpreter instance
   * @param {LaminaInterpreter} interpreter - Initialized interpreter
   */
  constructor(interpreter: LaminaInterpreter) {
    this._interpreter = interpreter
  }

  /**
   * Create and initialize a new context
   * @returns {Promise<LaminaContext>} Initialized context
   */
  static async create(): Promise<LaminaContext> {
    const interpreter = new LaminaInterpreter()
    await interpreter._init()
    return new LaminaContext(interpreter)
  }

  /**
   * Calculate an expression and return the result
   * @param {string} expression
   * @returns {string} Result
   */
  calc(expression: string): string {
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
  }
}

/**
 * Quick calculation wrapper
 * Auto-initializes when module is imported
 */
let _globalContext: LaminaContext | null = null
const _isInitializing = false

interface LaminaGlobal {
  // Core calculation methods
  init(): Promise<LaminaContext>
  calc(expression: string): string
  set(name: string, value: number | string): LaminaGlobal
  get(name: string): string
  exec(code: string): LaminaGlobal
  tag(strings: TemplateStringsArray, ...values: (number | string)[]): string

  // Context management
  createContext(): Promise<LaminaContext>
  cleanup(): void
  readonly context: LaminaContext | null
  readonly isReady: boolean

  // Type exports
  Context: typeof LaminaContext
}

function _ensureGlobalContext(): LaminaContext {
  if (_globalContext) {
    return _globalContext
  }

  // Try auto-initialization if WASM is ready
  if (isModuleReady()) {
    const interpreter = new LaminaInterpreter()
    const context = new LaminaContext(interpreter)
    _globalContext = context
    return context
  }

  throw new Error(
    'Lamina not ready yet. WASM module is still loading. Please call await lamina.init() first or wait a moment.'
  )
}

export const lamina: LaminaGlobal = Object.assign(
  {
    // Expose Context class
    Context: LaminaContext
  } as const,
  {
    /**
     * Initialize the global Lamina context
     * Optional - will auto-initialize on first use if WASM is ready
     */
    async init(): Promise<LaminaContext> {
      if (_globalContext) {
        return _globalContext
      }
      _globalContext = await LaminaContext.create()
      return _globalContext
    },

    /**
     * Check if WASM module is ready for synchronous use
     */
    get isReady(): boolean {
      return isModuleReady()
    },

    /**
     * Quick calculation (auto-initializes if WASM is ready)
     * @param {string} expression
     * @returns {string} Result
     */
    calc(expression: string): string {
      return _ensureGlobalContext().calc(expression)
    },

    /**
     * Set a variable (auto-initializes if WASM is ready)
     */
    set(name: string, value: number | string): LaminaGlobal {
      _ensureGlobalContext().set(name, value)
      return lamina
    },

    /**
     * Get a variable (auto-initializes if WASM is ready)
     */
    get(name: string): string {
      return _ensureGlobalContext().get(name)
    },

    /**
     * Execute code (auto-initializes if WASM is ready)
     */
    exec(code: string): LaminaGlobal {
      _ensureGlobalContext().exec(code)
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
      let expression = strings[0]
      for (let i = 0; i < values.length; i++) {
        expression += values[i] + strings[i + 1]
      }

      return _ensureGlobalContext().calc(expression)
    }
  } as LaminaGlobal
)

// Auto-initialize global context when module is imported
// This runs in the background and doesn't block module loading
LaminaContext.create()
  .then((ctx) => {
    _globalContext = ctx
  })
  .catch(() => {
    // Silently fail, will retry on first use
  })

// Export types for TypeScript users
export type { LaminaGlobal }
