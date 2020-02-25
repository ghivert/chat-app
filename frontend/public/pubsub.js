console.log('Loaded service worker!')

let app

self.addEventListener('push', ev => {
  const data = ev.data.json()
  const { title, body } = data
  self.registration.showNotification(title, { body })
  app.postMessage(data)
})

self.addEventListener('message', event => {
  app = event.ports[0]
})
