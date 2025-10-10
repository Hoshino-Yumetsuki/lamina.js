#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "../Lamina/interpreter/interpreter.hpp"
#include "../Lamina/interpreter/parser.hpp"
#include "../Lamina/interpreter/lexer.hpp"
#include "../Lamina/interpreter/value.hpp"
#include <sstream>
#include <string>
#include <memory>

using namespace emscripten;

/**
 * LaminaInterpreter wrapper for JavaScript
 * Provides a simple interface to execute Lamina code from JavaScript/Node.js
 */
class LaminaInterpreter {
private:
    std::unique_ptr<Interpreter> interpreter;

public:
    LaminaInterpreter() {
        // Initialize interpreter with default settings
        interpreter = std::make_unique<Interpreter>();
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

            // Parse - static method
            auto ast = Parser::parse(tokens);

            // Cast ASTNode to Statement (Parser::parse returns a BlockStmt which is a Statement)
            auto stmt = std::unique_ptr<Statement>(static_cast<Statement*>(ast.release()));

            // Execute
            interpreter->execute(stmt);

            return "Execution completed successfully";
        } catch (const RuntimeError& e) {
            return std::string("RuntimeError: ") + e.what();
        } catch (const std::exception& e) {
            return std::string("Error: ") + e.what();
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

            // Parse - static method
            auto ast = Parser::parse(tokens);

            // Cast ASTNode to Statement
            auto stmt = std::unique_ptr<Statement>(static_cast<Statement*>(ast.release()));

            // Execute the wrapped code
            if (stmt) {
                interpreter->execute(stmt);

                // Get the result variable
                try {
                    Value result = interpreter->get_variable("__lamina_result__");
                    return result.to_string();
                } catch (...) {
                    return "Error: Could not retrieve result";
                }
            }

            return "null";
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
            interpreter->set_variable(name, Value(value));
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
            interpreter->set_variable(name, Value(value));
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
            Value val = interpreter->get_variable(name);
            return val.to_string();
        } catch (const std::exception& e) {
            return std::string("Error: ") + e.what();
        }
    }

    /**
     * Reset the interpreter state
     */
    void reset() {
        // Create a new interpreter instance
        interpreter = std::make_unique<Interpreter>();
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
