require('dotenv').config()

const webpush = require('web-push')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const hbs = require('express-handlebars')

webpush.setVapidDetails(
  'mailto:example@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

const app = express()

app.engine('handlebars', hbs())
app.set('view engine', 'handlebars')
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev', { immediate: true }))
app.use((request, response, next) => {
  console.log(request.body)
  next()
})
app.use(morgan('dev'))

app.get('/', (request, response) => {
  response.render('home')
})

const subscriptions = []
const usernames = {}

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

const sendMessageTo = (to, message) => {
  const subscription = usernames[to]
  if (subscription) {
    return webpush.sendNotification(subscription, message)
  } else {
    return Promise.reject()
  }
}

const addTimeout = username => {
  return setTimeout(async () => {
    await sendMessage(JSON.stringify({ title: `${username} timeout`}))
    const { subscription } = usernames[username]
    delete usernames[username]
    const index = findSubscriptionIndex(subscription)
    subscriptions.splice(index, 1)
  }, 300000)
}

const replaceTimeout = username => {
  const user = usernames[username]
  if (user) {
    const { timeout, subscription } = user
    clearTimeout(timeout)
    const newTimeout = addTimeout(username)
    usernames[username] = { timeout: newTimeout, subscription }
  }
}

app.post('/usernames', async (request, response) => {
  try {
    response.status(201).json(Object.keys(usernames))
  } catch (error) {
    console.error(error)
    response.end()
  }
})

app.post('/message', async (request, response) => {
  try {
    const { title, message, username } = request.body
    replaceTimeout(username)
    response.status(201).json({})
    sendMessage(JSON.stringify({ direct: false, title, message, username }))
  } catch (error) {
    console.error(error)
    response.end()
  }
})

app.post('/direct-message', async (request, response) => {
  try {
    const { title, message, username, to } = request.body
    replaceTimeout(username)
    await sendMessageTo(
      to,
      JSON.stringify({ direct: true, title, message, username })
    )
    response.status(201).json({})
  } catch (error) {
    console.error(error)
    response.end()
  }
})

app.post('/subscribe', async (request, response) => {
  try {
    const { subscription, username } = request.body
    const index = findSubscriptionIndex(subscription)
    if (index < 0) subscriptions.push(subscription)
    if (username) {
      const timeout = addTimeout(username)
      usernames[username] = { timeout, subscription }
      await sendMessage(JSON.stringify({ title: `${username} connected` }))
    }
    response.status(201).json({})
  } catch (error) {
    console.error(error.stack)
    response.end()
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Server started listening on port ${process.env.PORT}.`)
})
