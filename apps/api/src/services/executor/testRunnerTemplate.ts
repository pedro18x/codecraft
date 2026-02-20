/**
 * Generates a JS/TS test runner script that:
 * 1. Includes the user's solution code
 * 2. Runs each test case by calling the solution function
 * 3. Outputs JSON results to stdout
 *
 * SECURITY: This code runs ONLY inside an isolated Docker container or VM sandbox.
 * It never executes on the main server process.
 */
export function generateTestRunner(
  userCode: string,
  testCases: { input: string; expectedOutput: string }[],
  functionName: string
): string {
  const testCasesJSON = JSON.stringify(testCases)

  return `
// === User Solution (runs in isolated sandbox) ===
${userCode}

// === Test Runner ===
const __testCases = ${testCasesJSON};

function __parseArgs(input) {
  const args = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '[' || ch === '{' || ch === '(') depth++;
    if (ch === ']' || ch === '}' || ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) args.push(current.trim());
  return args.map(a => {
    try { return JSON.parse(a); } catch { return a; }
  });
}

// Check that the user-defined function exists
if (typeof ${functionName} !== 'function') {
  const results = __testCases.map(tc => ({
    passed: false,
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    error: 'Function "${functionName}" not found. Make sure you define it.',
  }));
  console.log(JSON.stringify(results));
} else {
  // Only run tests if the function exists
  const results = __testCases.map(tc => {
    try {
      const args = __parseArgs(tc.input);
      const result = ${functionName}(...args);
      const actualOutput = JSON.stringify(result);

      let passed = false;
      try {
        passed = JSON.stringify(JSON.parse(actualOutput)) === JSON.stringify(JSON.parse(tc.expectedOutput));
      } catch {
        passed = actualOutput === tc.expectedOutput;
      }

      return {
        passed,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput,
      };
    } catch (err) {
      return {
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        error: err.message || String(err),
      };
    }
  });

  console.log(JSON.stringify(results));
}
`
}

/** Valid JavaScript identifier pattern (defense-in-depth for template interpolation) */
const VALID_JS_IDENTIFIER = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/

/**
 * Extracts the function name from user code.
 * Looks for `function name(` pattern and validates it's a safe JS identifier.
 */
export function extractFunctionName(code: string): string | null {
  const match = code.match(/function\s+(\w+)\s*\(/)
  if (!match) return null
  const name = match[1]
  // Defense-in-depth: ensure extracted name is a valid JS identifier
  if (!VALID_JS_IDENTIFIER.test(name)) return null
  return name
}
