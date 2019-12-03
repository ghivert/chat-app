require('dotenv').config()

const webpush = require('web-push')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

webpush.setVapidDetails(
  'mailto:example@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (request, response) => {
  response.send('Hello World!')
})

const subscriptions = new Set()

const sendMessage = message => {
  subscriptions.forEach(async subscription => {
    try {
      webpush.sendNotification(subscription, message)
    } catch (error) {
      console.error(error)
      subscriptions.delete(subscription)
    }
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
    subscriptions.add(subscription)
    sendMessage(JSON.stringify({ title: `${username} connected` }))
  } catch (error) {
    console.error(error.stack)
    response.end()
  }
})

app.listen(process.env.PORT, () => {
  console.log('Server started listening on port 4000.')
})
