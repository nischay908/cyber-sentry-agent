import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Globe, ChevronDown } from "lucide-react";

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "PHP", "Ruby", "Swift", "Kotlin", "SQL", "Shell/Bash", "HTML/CSS",
];

const DEFAULT_CODE: Record<string, string> = {
  JavaScript: `// Example: SQL Injection vulnerability
const express = require('express');
const app = express();

app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.execute(query, (err, results) => {
    res.json(results);
  });
});`,
  TypeScript: `// Example: Insecure API endpoint
import express, { Request, Response } from 'express';

const app = express();

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  db.query(query).then(user => {
    const token = jwt.sign({ id: user.id }, 'hardcoded-secret-key');
    res.json({ token });
  });
});`,
  Python: `# Example: Command Injection vulnerability
import os
from flask import Flask, request

app = Flask(__name__)

@app.route('/ping')
def ping():
    host = request.args.get('host')
    result = os.system("ping -c 1 " + host)
    return f"Ping result: {result}"

@app.route('/read')
def read_file():
    filename = request.args.get('file')
    with open(filename, 'r') as f:
        return f.read()`,
  Java: `// Example: SQL Injection & Insecure Deserialization
import java.sql.*;
import javax.servlet.http.*;

public class UserServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        String userId = req.getParameter("id");
        String query = "SELECT * FROM users WHERE id = '" + userId + "'";
        Statement stmt = connection.createStatement();
        ResultSet rs = stmt.executeQuery(query);
    }
}`,
  "C++": `// Example: Buffer Overflow vulnerability
#include <iostream>
#include <cstring>
using namespace std;

void processInput(char* input) {
    char buffer[64];
    strcpy(buffer, input);  // No bounds checking
    cout << "Processed: " << buffer << endl;
}

int main() {
    char userInput[256];
    cin >> userInput;
    processInput(userInput);
    return 0;
}`,
  "C#": `// Example: SQL Injection in C#
using System.Data.SqlClient;

public class UserController : Controller {
    public ActionResult GetUser(string id) {
        string query = "SELECT * FROM Users WHERE Id = '" + id + "'";
        SqlCommand cmd = new SqlCommand(query, connection);
        SqlDataReader reader = cmd.ExecuteReader();
        return Json(reader);
    }
}`,
  Go: `// Example: Path Traversal vulnerability
package main

import (
    "io/ioutil"
    "net/http"
    "path/filepath"
)

func fileHandler(w http.ResponseWriter, r *http.Request) {
    filename := r.URL.Query().Get("file")
    path := filepath.Join("/data/", filename)
    data, _ := ioutil.ReadFile(path)
    w.Write(data)
}`,
  Rust: `// Example: Unsafe block with potential UB
use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    
    unsafe {
        let ptr = input.as_ptr() as *mut u8;
        *ptr = 0;  // Modifying through raw pointer
        let val = std::ptr::read_volatile(ptr);
        println!("Value: {}", val);
    }
}`,
  PHP: `<?php
// Example: SQL Injection & XSS vulnerability
$username = $_GET['username'];
$password = $_GET['password'];

$query = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($conn, $query);

echo "<h1>Welcome " . $_GET['name'] . "</h1>";
?>`,
  Ruby: `# Example: Command Injection in Ruby
require 'sinatra'

get '/lookup' do
  domain = params[:domain]
  result = \`nslookup #{domain}\`
  "DNS Result: #{result}"
end

get '/eval' do
  code = params[:code]
  eval(code)
end`,
  Swift: `// Example: Insecure data storage
import Foundation

class UserManager {
    func saveCredentials(username: String, password: String) {
        UserDefaults.standard.set(username, forKey: "username")
        UserDefaults.standard.set(password, forKey: "password")
    }
    
    func makeRequest(url: String) {
        let url = URL(string: "http://" + url)!  // Using HTTP instead of HTTPS
        URLSession.shared.dataTask(with: url).resume()
    }
}`,
  Kotlin: `// Example: SQL Injection in Kotlin
import java.sql.DriverManager

fun getUser(userId: String): String {
    val conn = DriverManager.getConnection("jdbc:mysql://localhost/db")
    val query = "SELECT * FROM users WHERE id = '$userId'"
    val stmt = conn.createStatement()
    val rs = stmt.executeQuery(query)
    return rs.getString("name")
}`,
  SQL: `-- Example: Dangerous SQL patterns
CREATE TABLE users (
    id INT PRIMARY KEY,
    password VARCHAR(255)  -- Storing plaintext passwords
);

-- Dynamic SQL vulnerable to injection
EXEC('SELECT * FROM users WHERE name = ''' + @username + '''');

GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';`,
  "Shell/Bash": `#!/bin/bash
# Example: Command injection in shell script
USER_INPUT=$1
eval "echo $USER_INPUT"

# Insecure temp file
TEMP_FILE="/tmp/data_$$"
echo "sensitive data" > $TEMP_FILE
chmod 777 $TEMP_FILE

# Curl without cert verification
curl -k https://api.example.com/data`,
  "HTML/CSS": `<!DOCTYPE html>
<html>
<head><title>Login</title></head>
<body>
  <!-- XSS vulnerable form -->
  <form action="/login" method="GET">
    <input name="username" type="text">
    <input name="password" type="text"> <!-- password as text -->
    <button type="submit">Login</button>
  </form>
  <script>
    document.write(location.search);  // Reflected XSS
  </script>
</body>
</html>`,
};

export type ScanMode = "code" | "url";

interface ScanFormProps {
  onStartScan: (data: { mode: ScanMode; content: string; language: string }) => void;
  isScanning: boolean;
}

const ScanForm = ({ onStartScan, isScanning }: ScanFormProps) => {
  const [mode, setMode] = useState<ScanMode>("code");
  const [code, setCode] = useState(DEFAULT_CODE["JavaScript"]);
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  useEffect(() => {
    setCode(DEFAULT_CODE[language] || "");
  }, [language]);

  const handleSubmit = () => {
    const content = mode === "code" ? code : url;
    if (!content.trim()) return;
    onStartScan({ mode, content, language });
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Mode Toggle */}
      <div className="flex border-b border-border/30">
        <button
          onClick={() => setMode("code")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-display font-medium transition-all ${
            mode === "code"
              ? "text-primary-foreground bg-gradient-to-r from-primary to-neon-pink"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code className="w-4 h-4" />
          Paste Code
        </button>
        <button
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-display font-medium transition-all ${
            mode === "url"
              ? "text-primary-foreground bg-gradient-to-r from-accent to-neon-blue"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="w-4 h-4" />
          Website URL
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Language Selector (for code mode) */}
        {mode === "code" && (
          <div className="relative">
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium font-body">Programming Language</label>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm font-body text-foreground hover:border-primary/30 transition-all"
            >
              {language}
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showLangDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute z-20 mt-1 w-full bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLangDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-body hover:bg-muted/50 transition-colors ${
                        language === lang ? "text-primary bg-primary/5" : "text-foreground"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Input Area */}
        {mode === "code" ? (
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium font-body">Paste your code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your ${language} code here for vulnerability scanning...`}
              className="w-full h-48 px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium font-body">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-2 font-body">
              We'll scan the website for common vulnerabilities like XSS, CSRF, SQL injection, and more.
            </p>
          </div>
        )}

        {/* Scan Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={isScanning || (mode === "code" ? !code.trim() : !url.trim())}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-primary-foreground font-display text-sm font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: mode === "code"
              ? "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))"
              : "linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--accent)))",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {isScanning ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              Scanning...
            </>
          ) : (
            <>🔍 Start Security Scan</>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ScanForm;
