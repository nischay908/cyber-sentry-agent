export interface Vulnerability {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  type: string;
  description: string;
  location: string;
  line?: number;
  codeSnippet?: string;
  fix?: string;
  cweId?: string;
}

export interface ScanResult {
  id: string;
  mode: "code" | "url";
  target: string;
  language?: string;
  vulnerabilities: Vulnerability[];
  scanDuration: number;
  timestamp: Date;
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

// Simulated scan results based on input
export function generateScanResults(mode: "code" | "url", content: string, language: string): Promise<ScanResult> {
  return new Promise((resolve) => {
    const duration = 2000 + Math.random() * 3000;
    setTimeout(() => {
      const vulnerabilities: Vulnerability[] = [];

      if (mode === "code") {
        // Detect common patterns
        const lowerContent = content.toLowerCase();

        if (lowerContent.includes("select") && (lowerContent.includes("+") || lowerContent.includes("${") || lowerContent.includes("format"))) {
          vulnerabilities.push({
            id: "vuln-1",
            title: "SQL Injection Vulnerability",
            severity: "critical",
            type: "SQL Injection (CWE-89)",
            description: "User input is directly concatenated into SQL query string without parameterization. An attacker could inject malicious SQL to read, modify, or delete database contents.",
            location: "Line with SQL query construction",
            codeSnippet: content.split("\n").find(l => l.toLowerCase().includes("select")) || "",
            fix: `// Use parameterized queries instead:\nconst result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);`,
            cweId: "CWE-89",
          });
        }

        if (lowerContent.includes("innerhtml") || lowerContent.includes("dangerouslysetinnerhtml") || lowerContent.includes("document.write")) {
          vulnerabilities.push({
            id: "vuln-2",
            title: "Cross-Site Scripting (XSS)",
            severity: "high",
            type: "Reflected XSS (CWE-79)",
            description: "Unsanitized user input is being rendered as HTML. An attacker could inject malicious scripts that execute in users' browsers.",
            location: "DOM manipulation statement",
            codeSnippet: content.split("\n").find(l => l.toLowerCase().includes("innerhtml") || l.toLowerCase().includes("document.write")) || "",
            fix: `// Use textContent instead of innerHTML:\nelement.textContent = userInput;\n// Or sanitize with DOMPurify:\nelement.innerHTML = DOMPurify.sanitize(userInput);`,
            cweId: "CWE-79",
          });
        }

        if (lowerContent.includes("eval(") || lowerContent.includes("exec(") || lowerContent.includes("system(")) {
          vulnerabilities.push({
            id: "vuln-3",
            title: "Remote Code Execution",
            severity: "critical",
            type: "Code Injection (CWE-94)",
            description: "Dynamic code execution with potentially untrusted input. An attacker could execute arbitrary code on the server.",
            location: "eval/exec/system call",
            codeSnippet: content.split("\n").find(l => l.toLowerCase().includes("eval(") || l.toLowerCase().includes("exec(")) || "",
            fix: `// Avoid eval/exec with user input. Use safe alternatives:\n// Instead of eval(), use JSON.parse() for JSON data\n// Instead of exec(), use a whitelist of allowed commands`,
            cweId: "CWE-94",
          });
        }

        if (lowerContent.includes("password") && (lowerContent.includes("=") || lowerContent.includes("const") || lowerContent.includes("var"))) {
          vulnerabilities.push({
            id: "vuln-4",
            title: "Hardcoded Credentials",
            severity: "high",
            type: "Use of Hard-coded Credentials (CWE-798)",
            description: "Credentials appear to be hardcoded in the source code. This is a severe security risk as credentials can be extracted from the codebase.",
            location: "Password/credential assignment",
            fix: `// Use environment variables:\nconst password = process.env.DB_PASSWORD;\n// Or use a secrets manager:\nconst secret = await secretsManager.getSecret("db-password");`,
            cweId: "CWE-798",
          });
        }

        if (lowerContent.includes("http://") && !lowerContent.includes("localhost")) {
          vulnerabilities.push({
            id: "vuln-5",
            title: "Insecure HTTP Connection",
            severity: "medium",
            type: "Cleartext Transmission (CWE-319)",
            description: "HTTP URLs detected instead of HTTPS. Data transmitted over HTTP can be intercepted by attackers.",
            location: "HTTP URL reference",
            fix: `// Always use HTTPS:\nconst apiUrl = "https://api.example.com/data";`,
            cweId: "CWE-319",
          });
        }

        // Always add at least one finding
        if (vulnerabilities.length === 0) {
          vulnerabilities.push({
            id: "vuln-info-1",
            title: "Missing Input Validation",
            severity: "medium",
            type: "Improper Input Validation (CWE-20)",
            description: "No explicit input validation detected. All external inputs should be validated before processing.",
            location: "General",
            fix: `// Add input validation:\nfunction validateInput(input) {\n  if (typeof input !== 'string' || input.length > 1000) {\n    throw new Error('Invalid input');\n  }\n  return input.trim();\n}`,
            cweId: "CWE-20",
          });
          vulnerabilities.push({
            id: "vuln-info-2",
            title: "No Error Handling Detected",
            severity: "low",
            type: "Improper Error Handling (CWE-755)",
            description: "Code lacks try-catch blocks or error handling mechanisms. Unhandled errors can leak sensitive information.",
            location: "General",
            fix: `// Wrap operations in try-catch:\ntry {\n  await riskyOperation();\n} catch (error) {\n  logger.error('Operation failed', { error: error.message });\n  throw new AppError('Something went wrong', 500);\n}`,
            cweId: "CWE-755",
          });
        }
      } else {
        // URL scan results
        vulnerabilities.push(
          {
            id: "vuln-url-1",
            title: "Missing Content Security Policy",
            severity: "medium",
            type: "Security Misconfiguration (CWE-16)",
            description: "No Content-Security-Policy header detected. CSP helps prevent XSS attacks by controlling which resources can be loaded.",
            location: "HTTP Response Headers",
            fix: `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';`,
            cweId: "CWE-16",
          },
          {
            id: "vuln-url-2",
            title: "Missing X-Frame-Options Header",
            severity: "medium",
            type: "Clickjacking (CWE-1021)",
            description: "The X-Frame-Options header is not set. This makes the site vulnerable to clickjacking attacks where it can be embedded in malicious iframes.",
            location: "HTTP Response Headers",
            fix: `X-Frame-Options: DENY\n// Or in your web server config:\n// nginx: add_header X-Frame-Options "DENY" always;`,
            cweId: "CWE-1021",
          },
          {
            id: "vuln-url-3",
            title: "Server Information Disclosure",
            severity: "low",
            type: "Information Exposure (CWE-200)",
            description: "Server version information may be exposed in response headers. This helps attackers identify specific vulnerabilities for your server version.",
            location: "Server Response Header",
            fix: `# Hide server version:\n# nginx: server_tokens off;\n# Apache: ServerTokens Prod\n# Express: app.disable('x-powered-by');`,
            cweId: "CWE-200",
          },
          {
            id: "vuln-url-4",
            title: "Missing HSTS Header",
            severity: "high",
            type: "Insecure Transport (CWE-523)",
            description: "Strict-Transport-Security header not found. Without HSTS, browsers may connect via HTTP, exposing traffic to interception.",
            location: "HTTP Response Headers",
            fix: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
            cweId: "CWE-523",
          }
        );
      }

      const summary = {
        critical: vulnerabilities.filter(v => v.severity === "critical").length,
        high: vulnerabilities.filter(v => v.severity === "high").length,
        medium: vulnerabilities.filter(v => v.severity === "medium").length,
        low: vulnerabilities.filter(v => v.severity === "low").length,
        info: vulnerabilities.filter(v => v.severity === "info").length,
      };

      resolve({
        id: `scan-${Date.now()}`,
        mode,
        target: content,
        language: mode === "code" ? language : undefined,
        vulnerabilities,
        scanDuration: duration / 1000,
        timestamp: new Date(),
        summary,
      });
    }, duration);
  });
}
