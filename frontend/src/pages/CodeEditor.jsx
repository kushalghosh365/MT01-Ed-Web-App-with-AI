import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { FaRegMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";

const CodeEditor = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [fontSize, setFontSize] = useState("14"); // Default font size
  const [textColor, setTextColor] = useState("#ffffff"); // Default text color (white)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const languages = ["C++", "JAVA", "JAVASCRIPT", "GO", "RUST"];

  // Array for font sizes
  const fontSizes = [14, 16, 18, 20, 22];

  // Boilerplate code for each language
  const boilerplateCode = {
    javascript: `// Write your code here\nconsole.log("Hello, World!");`,
    java: `// Write your code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    "c++": `// Write your code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    go: `// Write your code here\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
    rust: `// Write your code here\nfn main() {\n    println!("Hello, World!");\n}`,
  };

  // Set boilerplate code when language changes
  useEffect(() => {
    setCode(boilerplateCode[language]);
  }, [language]);

  const handleRun = async () => {
    setIsLoading(true);
    setOutput("");
    try {
      const languageMap = {
        javascript: "js",
        "c++": "cpp",
        java: "java",
        go: "go",
        rust: "rust",
      };

      const response = await axios.post("https://emkc.org/api/v1/piston/execute", {
        language: languageMap[language],
        source: code,
        stdin: userInput || "",
      });

      setOutput(response.data.output || "No output returned.");
    } catch (error) {
      setOutput("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorWillMount = (monaco) => {
    // Define light and dark themes
    monaco.editor.defineTheme("lightTheme", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#ffffff", // Light background
        "editor.foreground": "#000000", // Light text
      },
    });

    monaco.editor.defineTheme("darkTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e1e", // Dark background
        "editor.foreground": "#d4d4d4", // Dark text
      },
    });
  };

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Set the theme manually when isDarkMode changes
    if (isDarkMode) {
      monaco.editor.setTheme("darkTheme");
    } else {
      monaco.editor.setTheme("lightTheme");
    }
  }, [isDarkMode]); // This effect runs when the theme toggles

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 text-white px-4 py-2">
        <div className="flex space-x-4 items-center justify-between  w-[45%]">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang.toLowerCase()}>
                {lang}
              </option>
            ))}
          </select>

          {/* Font Size Selection */}

          {/* Text Color Selection */}

          <button
            onClick={handleRun}
            className="bg-yellow-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Run
          </button>
        </div>
        <div className="flex w-[30%] justify-evenly items-center gap-5">
          <select
            onChange={(e) => setFontSize(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
          {isDarkMode ? (
            <FaRegMoon className="cursor-pointer" onClick={toggleTheme} />
          ) : (
            <FaSun className="cursor-pointer" onClick={toggleTheme} />
          )}
          <p>
            <span className="text-yellow-500">MT01 </span> Code Editor
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Code Editor */}
        <div className="w-1/2 border-r border-gray-300">
          <Editor
            height="100%"
            theme={isDarkMode ? "darkTheme" : "lightTheme"} // Ensure theme is applied correctly here
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            beforeMount={handleEditorWillMount}
            options={{
              fontSize: parseInt(fontSize), // Apply the selected font size
              fontFamily: "Monaco, monospace", // Set font family
            }}
            // Add a custom style for text color
            style={{ color: textColor }}
          />
        </div>

        {/* Output Pane */}
        <div className={`w-1/2 p-4 ${!isDarkMode ? "bg-gray-900" : "bg-white"} text-white`}>
          <h2 className={`text-lg font-semibold border-b border-gray-700 pb-2 mb-4 ${isDarkMode ? "text-green-600" : "text-white"}`}>
            Output
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <svg
                className="animate-spin h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4zm2 5.291L5.291 14H10v5H6z"
                ></path>
              </svg>
            </div>
          ) : (
            <div>
              {/* Display output */}
              {output != null ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-black" : "text-white"} mt-4`}>
                    Provide Input (stdin):
                  </label>
                  <textarea
                    className="w-full p-2 mt-2 bg-gray-800 text-white border border-gray-600 rounded"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter input here if needed..."
                    rows={5}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
