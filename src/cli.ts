#!/usr/bin/env node
/**
 * Lamina.js CLI - Command Line Interface for Lamina
 *
 * Supports these commands:
 * - lamina           - Start REPL
 * - lamina repl      - Start REPL
 * - lamina <file>    - Execute a Lamina file
 * - lamina run <file>- Execute a Lamina file
 * - lamina version   - Show version
 * - lamina help      - Show help
 */

import * as readline from 'node:readline'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { lamina } from './api'
import { version } from '../package.json' with { type: 'json' }

// Version information
const VERSION = version

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function colorize(text: string, color: keyof typeof colors): string {
  if (!process.stdout.isTTY) {
    return text
  }
  return `${colors[color]}${text}${colors.reset}`
}

function printError(message: string): void {
  console.error(colorize('Error: ', 'red') + message)
}

function printWarning(message: string): void {
  console.warn(colorize('Warning: ', 'yellow') + message)
}

function printHelp(): void {
  console.log(`
${colorize('Lamina.js', 'cyan')} v${VERSION}
${colorize('WebAssembly bindings for Lamina - A math-oriented programming language', 'dim')}

${colorize('Usage:', 'bright')}
  lamina              Start REPL (interactive mode)
  lamina repl         Start REPL (interactive mode)
  lamina <file>       Execute a Lamina script file
  lamina run <file>   Execute a Lamina script file
  lamina version      Show version information
  lamina help         Show this help message

${colorize('Examples:', 'bright')}
  lamina              # Start interactive REPL
  lamina script.lam   # Run a script file
  lamina run calc.lam # Run a script file

${colorize('REPL Commands:', 'bright')}
  :exit               Exit the REPL
  :quit               Exit the REPL
  :help               Show help message
  :clear              Clear screen
  :vars               Show all variables
  :reset              Reset the context

${colorize('More Info:', 'bright')}
  GitHub: https://github.com/Hoshino-Yumetsuki/lamina.js
  Docs:   https://github.com/Hoshino-Yumetsuki/lamina.js#readme
`)
}

async function startRepl(): Promise<void> {
  console.log(colorize(`Lamina REPL v${VERSION}`, 'cyan'))
  console.log(colorize('Press Ctrl+C, Ctrl+D, or type :exit to exit', 'dim'))
  console.log(colorize('Type :help for help', 'dim'))
  console.log()

  // Initialize context
  await lamina.init()

  // Set stdin encoding to UTF-8 to support special characters
  if (process.stdin.setEncoding) {
    process.stdin.setEncoding('utf-8')
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: colorize('> ', 'green'),
    historySize: 100,
    terminal: true,
    // Add escapeCodeTimeout to properly handle special characters
    escapeCodeTimeout: 500,
    // Remove duplicate history entries
    removeHistoryDuplicates: true
  })

  // Handle Ctrl+C
  rl.on('SIGINT', () => {
    console.log()
    rl.close()
  })

  // Track multi-line input
  let codeBuffer = ''
  let braceLevel = 0
  let inMultiLine = false

  rl.prompt()

  rl.on('line', (line: string) => {
    try {
      const trimmedLine = line.trim()

      // Handle REPL commands
      if (!inMultiLine && trimmedLine.startsWith(':')) {
        switch (trimmedLine) {
          case ':exit':
          case ':quit':
            rl.close()
            return

          case ':help':
            console.log(`
${colorize('Lamina REPL Commands:', 'bright')}
  :exit, :quit        Exit the REPL
  :help               Show this help message
  :clear              Clear screen
  :vars               Show all variables
  :reset              Reset the context
`)
            rl.prompt()
            return

          case ':clear':
            console.clear()
            rl.prompt()
            return

          case ':vars':
            // Try to display variables by evaluating a custom expression
            // Since we don't have direct access to variable listing,
            // we'll show a message
            console.log(
              colorize('Variable inspection not yet implemented', 'yellow')
            )
            rl.prompt()
            return

          case ':reset':
            if (lamina.context) {
              lamina.context.reset()
              console.log(colorize('Context reset', 'green'))
            }
            rl.prompt()
            return

          default:
            printWarning(`Unknown command: ${trimmedLine}`)
            rl.prompt()
            return
        }
      }

      // Track braces for multi-line input
      if (!inMultiLine) {
        codeBuffer = line
        braceLevel = 0
      } else {
        codeBuffer += `\n${line}`
      }

      // Count braces
      for (const char of line) {
        if (char === '{') braceLevel++
        if (char === '}') braceLevel--
      }

      // Check if we need more input
      if (braceLevel > 0) {
        inMultiLine = true
        rl.setPrompt(colorize('. ', 'green'))
        rl.prompt()
        return
      }

      // Reset for next input
      inMultiLine = false
      rl.setPrompt(colorize('> ', 'green'))

      // Empty line
      if (!codeBuffer.trim()) {
        rl.prompt()
        return
      }

      // Execute the code
      try {
        // Try to evaluate as expression first
        const result = lamina.calc(codeBuffer)
        if (result?.trim() && result.trim() !== 'null') {
          console.log(colorize(result, 'cyan'))
        }
      } catch (_evalError) {
        // If evaluation fails, try to execute as statement
        try {
          lamina.exec(codeBuffer)
        } catch (execError) {
          if (execError instanceof Error) {
            printError(execError.message)
          } else {
            printError(String(execError))
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        printError(error.message)
      } else {
        printError(String(error))
      }
    }

    // Reset buffer
    codeBuffer = ''
    braceLevel = 0
    inMultiLine = false
    rl.setPrompt(colorize('> ', 'green'))
    rl.prompt()
  })

  rl.on('close', () => {
    console.log()
    console.log(colorize('Goodbye!', 'cyan'))
    lamina.cleanup()
    process.exit(0)
  })
}

async function runFile(filePath: string): Promise<void> {
  try {
    // Resolve file path
    const resolvedPath = path.resolve(filePath)

    // Check if file exists
    if (!fs.existsSync(resolvedPath)) {
      printError(`File not found: ${filePath}`)
      process.exit(1)
    }

    // Read file
    const code = fs.readFileSync(resolvedPath, 'utf-8')

    console.log(colorize(`Executing file: ${filePath}`, 'dim'))

    // Initialize context
    await lamina.init()

    // Execute code
    try {
      lamina.exec(code)
      console.log()
      console.log(colorize('Program execution completed.', 'green'))
    } catch (error) {
      if (error instanceof Error) {
        printError(error.message)
      } else {
        printError(String(error))
      }
      process.exit(1)
    }

    lamina.cleanup()
  } catch (error) {
    if (error instanceof Error) {
      printError(error.message)
    } else {
      printError(String(error))
    }
    process.exit(1)
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  // No arguments - start REPL
  if (args.length === 0) {
    await startRepl()
    return
  }

  const command = args[0]

  // Handle commands
  switch (command) {
    case 'repl':
      await startRepl()
      break

    case 'version':
    case '--version':
    case '-v':
      console.log(VERSION)
      break

    case 'help':
    case '--help':
    case '-h':
      printHelp()
      break

    case 'run':
      if (args.length < 2) {
        printError("'run' command requires a file path argument")
        printHelp()
        process.exit(1)
      }
      await runFile(args[1])
      break

    default:
      // Assume it's a file path
      await runFile(command)
      break
  }
}

// Run the CLI
main().catch((error) => {
  printError(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
