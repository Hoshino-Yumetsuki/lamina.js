// Type declarations for WASM and other non-TS imports

declare module '*.wasm' {
  const content: Buffer
  export default content
}
