const fs = require('fs').promises

const run = async () => {
  // Requiring vapid-keys.js automatically append things to .env
  require('./vapid-keys')
  await fs.appendFile('.env', 'PORT=4000\n', 'utf8')
}

run()
