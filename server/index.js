// 🛡 BRIDGE FILE: Redirects Render to the compiled code in /dist
// This fixes the the "MODULE_NOT_FOUND" error if the Start Command is still set to "node index.js"
require('./dist/index.js');
