cmake_minimum_required(VERSION 3.16.3)
project(lamina_wasm VERSION 1.1.1 LANGUAGES CXX)# lamina version is here

# Set C++ standard
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Emscripten specific settings
if(EMSCRIPTEN)
    message(STATUS "Building for WebAssembly with Emscripten")

    # Generate version header automatically
    configure_file(
        ${CMAKE_CURRENT_SOURCE_DIR}/Lamina/interpreter/version.hpp.in
        ${CMAKE_BINARY_DIR}/version.hpp
        @ONLY
    )

    # Read help file and parse it to C++ string
    file(READ ${CMAKE_CURRENT_SOURCE_DIR}/Lamina/interpreter/resources/help.txt HELP_TEXT)

    configure_file(
        ${CMAKE_CURRENT_SOURCE_DIR}/Lamina/interpreter/help_text.hpp.in
        ${CMAKE_BINARY_DIR}/help_text.hpp
        @ONLY
    )

    # Set include directories
    include_directories(
        ${CMAKE_CURRENT_SOURCE_DIR}/Lamina/interpreter
        ${CMAKE_CURRENT_SOURCE_DIR}/bindings
        ${CMAKE_BINARY_DIR} # version.hpp and help_text.hpp
    )

    # Source files from Lamina interpreter
    set(LAMINA_SOURCES
        Lamina/interpreter/interpreter.cpp
        Lamina/interpreter/lexer.cpp
        Lamina/interpreter/parser.cpp
        Lamina/interpreter/eval.cpp
        Lamina/interpreter/symbolic.cpp
        Lamina/interpreter/module_loader.cpp
        Lamina/extensions/standard/math.cpp
        Lamina/extensions/standard/stdio.cpp
        Lamina/extensions/standard/random.cpp
        Lamina/extensions/standard/times.cpp
        Lamina/extensions/standard/array.cpp
        Lamina/extensions/standard/string.cpp
        Lamina/extensions/standard/cas.cpp
        Lamina/extensions/standard/lstruct.cpp
    )

    # WASM bindings
    set(WASM_BINDINGS
        bindings/wasm_bindings.cpp
    )

    # Create the WASM module
    add_executable(lamina ${LAMINA_SOURCES} ${WASM_BINDINGS})

    # Add version header
    target_sources(lamina PRIVATE ${CMAKE_BINARY_DIR}/version.hpp)

    # Emscripten link flags
    set(EMSCRIPTEN_LINK_FLAGS
        --bind
        -s WASM=1
        -s ALLOW_MEMORY_GROWTH=1
        "-s EXPORTED_RUNTIME_METHODS=['ccall','cwrap']"
        -s MODULARIZE=1
        "-s EXPORT_NAME='createLaminaModule'"
        -s EXPORT_ES6=1
        -s ENVIRONMENT=web,node
        -s FILESYSTEM=0
        -s ASSERTIONS=1
        -s NO_EXIT_RUNTIME=1
        "-s EXPORTED_FUNCTIONS=['_malloc','_free']"
    )

    # Add optimization flags for release builds
    if(CMAKE_BUILD_TYPE STREQUAL "Release")
        list(APPEND EMSCRIPTEN_LINK_FLAGS
            -O3
            -s ASSERTIONS=0
        )
    else()
        list(APPEND EMSCRIPTEN_LINK_FLAGS
            -O0
            -g
            -s SAFE_HEAP=1
        )
    endif()

    # Convert list to string
    string(REPLACE ";" " " EMSCRIPTEN_LINK_FLAGS_STR "${EMSCRIPTEN_LINK_FLAGS}")

    # Set linker flags
    set_target_properties(lamina PROPERTIES
        LINK_FLAGS "${EMSCRIPTEN_LINK_FLAGS_STR}"
        OUTPUT_NAME "lamina"
    )

    # Set compiler flags
    target_compile_options(lamina PRIVATE
        -Wall
        -Wextra
        -Wpedantic
        -Wno-unused-parameter
        -Wno-unused-variable
    )

    # Set output directory to lib
    set_target_properties(lamina PROPERTIES
        RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/lib"
    )

else()
    message(WARNING "This CMakeLists.txt is designed for Emscripten. Use emcmake cmake to build.")
endif()

#[[
  This project is the WebAssembly version of Lamina interpreter.

  Build instructions:
  - Use Emscripten toolchain to build: emcmake cmake -B build -DCMAKE_BUILD_TYPE=Release
  - Build the project: cmake --build build
  - Output will be in lib/ directory

  Features:
  - Automatically generates version.hpp from version.hpp.in
  - Includes all standard extensions (math, stdio, random, times, array, string, cas, lstruct)
  - Exports ES6 module for use in web and Node.js environments
  - Memory growth enabled for dynamic allocation
]]
