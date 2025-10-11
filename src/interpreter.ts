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
let isPreloading = false

/**
 * Start preloading the WASM module in the background
 * This is called automatically when the module is imported
 */
function startPreload(): void {
  if (isPreloading || wasmModule || modulePromise) {
    return
  }
  isPreloading = true
  initModule().catch(() => {
    // Silently fail, will retry on actual use
    isPreloading = false
  })
}

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
      isPreloading = false
      return module
    } catch (error) {
      modulePromise = null
      isPreloading = false
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to initialize Lamina WASM module: ${message}`)
    }
  })()

  return modulePromise
}

/**
 * Check if WASM module is ready (synchronously)
 */
export function isModuleReady(): boolean {
  return wasmModule !== null
}

// Start preloading immediately when this module is imported
startPreload()

/**
 * LaminaInterpreter wrapper class
 */
export class LaminaInterpreter {
  private _instance: LaminaWasmInterpreter | null = null
  private _initialized = false

  /**
   * Auto-initialize on first use if WASM is ready
   */
  private _ensureInitialized(): void {
    if (this._initialized && this._instance) {
      return
    }

    // Try auto-initialization if module is already loaded
    if (wasmModule && !this._initialized) {
      this._instance = new wasmModule.LaminaInterpreter()
      this._initialized = true
      return
    }

    throw new Error(
      'LaminaInterpreter not initialized. WASM module is still loading. Please wait a moment or call await lamina.init() first.'
    )
  }

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
    this._ensureInitialized()
    if (!this._instance) {
      throw new Error('Interpreter instance is not available')
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
    this._ensureInitialized()
    if (!this._instance) {
      throw new Error('Interpreter instance is not available')
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
    this._ensureInitialized()
    if (!this._instance) {
      throw new Error('Interpreter instance is not available')
    }
    this._instance.setVariable(name, value)
  }

  /**
   * Set a string variable
   * @param {string} name - Variable name
   * @param {string} value - String value
   */
  setStringVariable(name: string, value: string): void {
    this._ensureInitialized()
    if (!this._instance) {
      throw new Error('Interpreter instance is not available')
    }
    this._instance.setStringVariable(name, value)
  }

  /**
   * Get a variable value
   * @param {string} name - Variable name
   * @returns {string} Variable value as string
   */
  getVariable(name: string): string {
    this._ensureInitialized()
    if (!this._instance) {
      throw new Error('Interpreter instance is not available')
    }
    try {
      return this._instance.getVariable(name)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Variable '${name}' not found: ${message}`)
    }
  }

  reset(): void {
    this._ensureInitialized()
    if (!this._instance) {
      throw new Error('Interpreter instance is not available')
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

/**
 * Wait for WASM module to be ready
 * @returns {Promise<void>}
 */
export async function waitForReady(): Promise<void> {
  await initModule()
}
