#include <string>
#include <vector>

// WebAssembly stub implementation for dynamic library loading
// These functions are not used in WebAssembly environment but are required for linking

std::vector<std::string> get_dylib_symbols(const std::string& lib_path) {
    // Return empty vector - dynamic library loading is not supported in WebAssembly
    return std::vector<std::string>();
}
