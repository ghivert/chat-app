const webPush = require('web-push')
const fs = require('fs').promises

const run = async () => {
  const { publicKey, privateKey } = webPush.generateVAPIDKeys()
  const data = [
    ['VAPID_PUBLIC_KEY', publicKey],
    ['VAPID_PRIVATE_KEY', privateKey],
  ]
    .map(strings => strings.join('='))
    .join('\n')
  await fs.appendFile('.env', `${data}\n`, 'utf8')
}

run()
