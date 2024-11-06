// run-test.js
require('dotenv').config();
const { execSync } = require('child_process');
const path = require("path");

function getBinFile(cmd) {
    return path.join('node_modules', '.bin', cmd);
}

// Replace with your actual command, using environment variable
const command = `start-server-and-test "npm --prefix ../server start" http://localhost:${process.env.SERVER_PORT} "jest"`;

// Execute the command...
execSync(command, { stdio: [0, 1, 2] });
