function timestamp() {
  return new Date().toISOString();
}

function info(message, data = "") {
  console.log(`[${timestamp()}] INFO: ${message}`, data);
}

function warn(message, data = "") {
  console.warn(`[${timestamp()}] WARN: ${message}`, data);
}

function error(message, err = "") {
  console.error(`[${timestamp()}] ERROR: ${message}`, err);
}

module.exports = {
  info,
  warn,
  error
};