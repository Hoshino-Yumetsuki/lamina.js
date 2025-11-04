#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "../Lamina/interpreter/interpreter.hpp"
#include "../Lamina/interpreter/parser.hpp"
#include "../Lamina/interpreter/lexer.hpp"
#include "../Lamina/interpreter/lamina_api/value.hpp"
#include <sstream>
#include <string>
#include <memory>

using namespace emscripten;

// Declare the print function from stdio.cpp
inline Value print_wasm(const std::vector<Value>& args) {
    for (size_t i = 0; i < args.size(); ++i) {
        std::cout << args[i].to_string();
        if (i != args.size() - 1) {
            std::cout << " ";
        }
    }
    std::cout << std::endl;
    return Value();
}

/**
 * LaminaInterpreter wrapper for JavaScript
 * Provides a simple interface to execute Lamina code from JavaScript/Node.js
 */
class LaminaInterpreter {
private:
    // Interpreter now uses static methods, no instance needed
    bool initialized;

public:
    LaminaInterpreter() : initialized(false) {
        // Initialize interpreter with default settings
        // Create a temporary interpreter instance to initialize static members
        if (!initialized) {
            Interpreter temp_interp;
            initialized = true;
            
            // Manually register print function for WebAssembly
            // This bypasses the static initializer issue
            Interpreter::builtins["print"] = Value(std::make_shared<LmCppFunction>([](const std::vector<Value>& args) -> Value {
                return print_wasm(args);
            }));
        }
    }

    /**
     * Execute Lamina code and return the result
     * @param code The Lamina code to execute
     * @return Result as a string
     */
    std::string execute(const std::string& code) {
        try {
            // Tokenize - static method
            auto tokens = Lexer::tokenize(code);

            // Parse - use Parser constructor and parse_program
            Parser parser(tokens);
            auto stmts = parser.parse_program();

            // Execute each statement
            for (auto& stmt : stmts) {
                Interpreter::execute(stmt);
            }

            return "";
        } catch (const RuntimeError& e) {
            std::string error_msg = std::string("RuntimeError: ") + e.what();
            std::cerr << error_msg << std::endl;
            return error_msg;
        } catch (const StdLibException& e) {
            std::string error_msg = std::string("StdLibException: ") + e.what();
            std::cerr << error_msg << std::endl;
            return error_msg;
        } catch (const std::exception& e) {
            std::string error_msg = std::string("std::exception: ") + e.what();
            std::cerr << error_msg << std::endl;
            return error_msg;
        } catch (...) {
            std::string error_msg = "Unknown C++ exception occurred during execution";
            std::cerr << error_msg << std::endl;
            return error_msg;
        }
    }

    /**
     * Evaluate a Lamina expression and return the result
     * @param expression The Lamina expression to evaluate
     * @return Result as a string
     */
    std::string eval(const std::string& expression) {
        try {
            // Wrap the expression in a temporary variable assignment
            // This allows us to get the result value
            std::string code = "var __lamina_result__ = " + expression + ";";

            // Tokenize - static method
            auto tokens = Lexer::tokenize(code);

            // Parse - use Parser constructor and parse_program
            Parser parser(tokens);
            auto stmts = parser.parse_program();

            // Execute the wrapped code
            for (auto& stmt : stmts) {
                Interpreter::execute(stmt);
            }

            // Get the result variable
            try {
                Value result = Interpreter::get_variable("__lamina_result__");
                return result.to_string();
            } catch (...) {
                return "Error: Could not retrieve result";
            }
        } catch (const RuntimeError& e) {
            return std::string("RuntimeError: ") + e.what();
        } catch (const std::exception& e) {
            return std::string("Error: ") + e.what();
        }
    }

    /**
     * Set a variable in the interpreter
     * @param name Variable name
     * @param value Variable value (as string, will be evaluated)
     */
    void setVariable(const std::string& name, double value) {
        try {
            Interpreter::set_variable(name, Value(value));
        } catch (const std::exception& e) {
            // Handle error silently or throw
        }
    }

    /**
     * Set a string variable in the interpreter
     * @param name Variable name
     * @param value Variable value as string
     */
    void setStringVariable(const std::string& name, const std::string& value) {
        try {
            Interpreter::set_variable(name, Value(value));
        } catch (const std::exception& e) {
            // Handle error silently or throw
        }
    }

    /**
     * Get a variable from the interpreter
     * @param name Variable name
     * @return Variable value as string
     */
    std::string getVariable(const std::string& name) {
        try {
            Value val = Interpreter::get_variable(name);
            return val.to_string();
        } catch (const std::exception& e) {
            return std::string("Error: ") + e.what();
        }
    }

    /**
     * Reset the interpreter state
     */
    void reset() {
        // Reset static state by creating and destroying an Interpreter instance
        Interpreter temp_interp;
        // Re-register print function
        Interpreter::builtins["print"] = Value(std::make_shared<LmCppFunction>([](const std::vector<Value>& args) -> Value {
            return print_wasm(args);
        }));
    }

    /**
     * Get version information
     */
    static std::string getVersion() {
        return "Lamina.js 1.0.0";
    }
};

/**
 * Standalone evaluate function for quick expressions
 */
std::string evaluateExpression(const std::string& expression) {
    LaminaInterpreter interp;
    return interp.eval(expression);
}

/**
 * Standalone execute function for quick code execution
 */
std::string executeCode(const std::string& code) {
    LaminaInterpreter interp;
    return interp.execute(code);
}

// Embind bindings
EMSCRIPTEN_BINDINGS(lamina_module) {
    class_<LaminaInterpreter>("LaminaInterpreter")
        .constructor<>()
        .function("execute", &LaminaInterpreter::execute)
        .function("eval", &LaminaInterpreter::eval)
        .function("setVariable", &LaminaInterpreter::setVariable)
        .function("setStringVariable", &LaminaInterpreter::setStringVariable)
        .function("getVariable", &LaminaInterpreter::getVariable)
        .function("reset", &LaminaInterpreter::reset)
        .class_function("getVersion", &LaminaInterpreter::getVersion);

    function("evaluateExpression", &evaluateExpression);
    function("executeCode", &executeCode);
}
