export interface LaminaWasmInterpreter {
  execute(code: string): string
  eval(expression: string): string
  setVariable(name: string, value: number): void
  setStringVariable(name: string, value: string): void
  getVariable(name: string): string
  reset(): void
  delete(): void
}

export interface LaminaWasmModule {
  LaminaInterpreter: new () => LaminaWasmInterpreter
  evaluateExpression(expression: string): string
  executeCode(code: string): string
}
