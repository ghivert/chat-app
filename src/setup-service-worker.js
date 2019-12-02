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

const messageChannel = new MessageChannel()

const subscribe = callback => {
  messageChannel.port1.onmessage = event => callback(event.data)
}

const selectBackend = () => {
  if (process.env.ELM_APP_PROD) {
    return 'https://cfa-chat-app.herokuapp.com'
  } else {
    return 'http://localhost:4000'
  }
}

const run = async username => {
  console.log('Registering service worker')
  const swURL = `${process.env.PUBLIC_URL}/pubsub.js`
  const scope = '/'
  const registration = await navigator.serviceWorker.register(swURL, { scope })
  console.log('Registered service worker')

  console.log('Registering push')
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.ELM_APP_VAPID_PUBLIC_KEY
    ),
  })
  console.log('Registered push')

  console.log('Registering communication')
  await navigator.serviceWorker.ready
  const controller = navigator.serviceWorker.controller
  controller.postMessage('channel', [messageChannel.port2])
  console.log('Registered communication')

  console.log('Sending push')
  await fetch([selectBackend(), 'subscribe'].join('/'), {
    method: 'POST',
    body: JSON.stringify({ subscription, username }),
    headers: { 'Content-Type': 'application/json' },
  })
  console.log('Sent push')
}

const register = async username => {
  if ('serviceWorker' in navigator) {
    try {
      return run(username)
    } catch (error) {
      console.error(error)
    }
  }
}

export { register, subscribe }
