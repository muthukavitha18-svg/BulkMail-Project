function formatMeta(meta) {
  if (!meta || Object.keys(meta).length === 0) return ""
  return ` ${JSON.stringify(meta)}`
}

function log(level, message, meta) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] [${level}] ${message}${formatMeta(meta)}`)
}

module.exports = {
  info: (message, meta) => log("INFO", message, meta),
  warn: (message, meta) => log("WARN", message, meta),
  error: (message, meta) => log("ERROR", message, meta),
}
