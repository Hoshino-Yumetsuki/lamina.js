/**
 * Type declarations for Emscripten-generated WASM module
 * This file provides types for the dynamically loaded WASM module
 */

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

type CreateLaminaModule = () => Promise<LaminaWasmModule>

// Declare the module without relative path
declare module 'lamina-wasm' {
  const createLaminaModule: CreateLaminaModule
  export default createLaminaModule
}
