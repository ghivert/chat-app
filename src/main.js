require('dotenv').config()

const webpush = require('web-push')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

webpush.setVapidDetails(
  'mailto:example@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev', { immediate: true }))
app.use((request, response, next) => {
  console.log(request.body)
  next()
})
app.use(morgan('dev'))

app.get('/', (request, response) => {
  response.send('Hello World!')
})

const subscriptions = []

const findSubscriptionIndex = subscription => {
  return subscriptions.findIndex(
    element =>
      element.endpoint === subscription.endpoint &&
      element.keys.p256dh === subscription.keys.p256dh &&
      element.keys.auth === subscription.keys.auth
  )
}

const sendMessage = message => {
  subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, message)
  })
}

app.post('/message', async (request, response) => {
  try {
    const { title, message, username } = request.body
    response.status(201).json({})
    sendMessage(JSON.stringify({ title, message, username }))
  } catch (error) {
    console.error(error)
    response.end()
  }
})

app.post('/subscribe', async (request, response) => {
  try {
    const { subscription, username } = request.body
    response.status(201).json({})
    const index = findSubscriptionIndex(subscription)
    if (index < 0) {
      subscriptions.push(subscription)
    }
    sendMessage(JSON.stringify({ title: `${username} connected` }))
  } catch (error) {
    console.error(error.stack)
    response.end()
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server started listening on port ${process.env.PORT}.`)
})
