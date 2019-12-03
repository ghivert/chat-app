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

const subscriptions = []

const sendMessage = message => {
  subscriptions.forEach(subscription => {
    webpush.sendNotification(JSON.parse(subscription), message)
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
    console.log(subscription)
    response.status(201).json({})
    const temp = JSON.stringify(subscription)
    if (!subscriptions.includes(temp)) {
      subscriptions.push(temp)
    }
    console.log(subscriptions)
    sendMessage(JSON.stringify({ title: `${username} connected` }))
  } catch (error) {
    console.error(error.stack)
    response.end()
  }
})

app.listen(process.env.PORT, () => {
  console.log('Server started listening on port 4000.')
})
