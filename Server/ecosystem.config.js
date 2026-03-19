// ecosystem.config.js
module.exports = {
  apps: [{
    name: "ristrict-backend",
    script: "./index.js",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    interpreter: "node",
    interpreter_args: "--experimental-vm-modules"  // ESM support
  }]
}