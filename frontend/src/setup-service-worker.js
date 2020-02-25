const messageChannel = new MessageChannel()

let registered = false
let subscription = null

const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const subscribe = async (username, callback) => {
  console.log('Sending push')
  await fetch([selectBackend(), 'subscribe'].join('/'), {
    method: 'POST',
    body: JSON.stringify({ subscription, username }),
    headers: { 'Content-Type': 'application/json' },
  })
  console.log('Sent push')
  messageChannel.port1.onmessage = event => callback(event.data)
}

const selectBackend = () => {
  if (process.env.ELM_APP_PROD) {
    return 'https://cfa-chat-app.herokuapp.com'
  } else {
    return 'http://localhost:4000'
  }
}

const prodAPIKey =
  'BCGVfnh3sQqAB6tep5s1PNzSI1pKYnv4jRw37obTLn9ot0BNANFVf-q6TdKyJ_SIy7T__5uHXKxGQMekImLOUCs'

const run = async username => {
  console.log('Registering service worker')
  const swURL = `${process.env.PUBLIC_URL}/pubsub.js`
  const scope = '/'
  const registration = await navigator.serviceWorker.register(swURL, { scope })
  console.log('Registered service worker')

  console.log('Registering push')
  subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.ELM_APP_PROD
        ? prodAPIKey
        : process.env.ELM_APP_VAPID_PUBLIC_KEY
    ),
  })
  console.log('Registered push')

  console.log('Registering communication')
  const { active } = await navigator.serviceWorker.ready
  active.postMessage('channel', [messageChannel.port2])
  console.log('Registered communication')
}

const register = async username => {
  if ('serviceWorker' in navigator && !registered) {
    try {
      await run(username)
      registered = true
      return Promise.resolve()
    } catch (error) {
      console.error(error)
    }
  } else {
    return Promise.resolve()
  }
}

export { register, subscribe }
