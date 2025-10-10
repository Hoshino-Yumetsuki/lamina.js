import createLaminaModule from '../lib/lamina.js'

interface LaminaWasmInterpreter {
  execute(code: string): string
  eval(expression: string): string
  setVariable(name: string, value: number): void
  setStringVariable(name: string, value: string): void
  getVariable(name: string): string
  reset(): void
  delete(): void
}

interface LaminaWasmModule {
  LaminaInterpreter: new () => LaminaWasmInterpreter
  evaluateExpression(expression: string): string
  executeCode(code: string): string
}

let wasmModule: LaminaWasmModule | null = null
let modulePromise: Promise<LaminaWasmModule> | null = null

export async function initModule(): Promise<LaminaWasmModule> {
  if (wasmModule) {
    return wasmModule
  }

  if (modulePromise) {
    return modulePromise
  }

  modulePromise = (async () => {
    try {
      const module = (await createLaminaModule()) as LaminaWasmModule
      wasmModule = module
      return module
    } catch (error) {
      modulePromise = null
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to initialize Lamina WASM module: ${message}`)
    }
  })()

  return modulePromise
}

/**
 * LaminaInterpreter wrapper class
 */
export class LaminaInterpreter {
  private _instance: LaminaWasmInterpreter | null = null
  private _initialized = false

  async _init(): Promise<void> {
    if (this._initialized) {
      return
    }

    const module = await initModule()
    this._instance = new module.LaminaInterpreter()
    this._initialized = true
  }

  /**
   * Execute Lamina code
   * @param {string} code - The Lamina source code to execute
   * @returns {string} Execution result
   */
  execute(code: string): string {
    if (!this._initialized || !this._instance) {
      throw new Error(
        'LaminaInterpreter not initialized. Call await createInterpreter() or _init() first.'
      )
    }
    try {
      return this._instance.execute(code)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Lamina execution error: ${message}`)
    }
  }

  /**
   * Evaluate a Lamina expression
   * @param {string} expression - The expression to evaluate
   * @returns {string} The result as a string
   */
  eval(expression: string): string {
    if (!this._initialized || !this._instance) {
      throw new Error(
        'LaminaInterpreter not initialized. Call await createInterpreter() or _init() first.'
      )
    }
    try {
      return this._instance.eval(expression)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Lamina evaluation error: ${message}`)
    }
  }

  /**
   * Set a numeric variable
   * @param {string} name - Variable name
   * @param {number} value - Numeric value
   */
  setVariable(name: string, value: number): void {
    if (!this._initialized || !this._instance) {
      throw new Error(
        'LaminaInterpreter not initialized. Call await createInterpreter() or _init() first.'
      )
    }
    this._instance.setVariable(name, value)
  }

  /**
   * Set a string variable
   * @param {string} name - Variable name
   * @param {string} value - String value
   */
  setStringVariable(name: string, value: string): void {
    if (!this._initialized || !this._instance) {
      throw new Error(
        'LaminaInterpreter not initialized. Call await createInterpreter() or _init() first.'
      )
    }
    this._instance.setStringVariable(name, value)
  }

  /**
   * Get a variable value
   * @param {string} name - Variable name
   * @returns {string} Variable value as string
   */
  getVariable(name: string): string {
    if (!this._initialized || !this._instance) {
      throw new Error(
        'LaminaInterpreter not initialized. Call await createInterpreter() or _init() first.'
      )
    }
    try {
      return this._instance.getVariable(name)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Variable '${name}' not found: ${message}`)
    }
  }

  reset(): void {
    if (!this._initialized || !this._instance) {
      throw new Error(
        'LaminaInterpreter not initialized. Call await createInterpreter() or _init() first.'
      )
    }
    this._instance.reset()
  }

  /**
   * Clean up and free resources
   */
  destroy(): void {
    if (this._instance && 'delete' in this._instance) {
      this._instance.delete()
    }
    this._instance = null
    this._initialized = false
  }

  /**
   * Get Lamina.js version
   * @returns {Promise<string>} Version string
   */
  static async getVersion(): Promise<string> {
    const _module = await initModule()
    return '1.0.0' // Version can be extracted from WASM if available
  }
}

/**
 * Quick evaluate function
 * @param {string} expression - Expression to evaluate
 * @returns {Promise<string>} Result as string
 */
export async function evaluateExpression(expression: string): Promise<string> {
  const module = await initModule()
  return module.evaluateExpression(expression)
}

/**
 * Quick execute function
 * @param {string} code - Code to execute
 * @returns {Promise<string>} Execution result
 */
export async function executeCode(code: string): Promise<string> {
  const module = await initModule()
  return module.executeCode(code)
}

/**
 * Create a new Lamina interpreter instance
 * @returns {Promise<LaminaInterpreter>} Initialized interpreter
 */
export async function createInterpreter(): Promise<LaminaInterpreter> {
  const interpreter = new LaminaInterpreter()
  await interpreter._init()
  return interpreter
}
