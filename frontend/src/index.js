import './main.css'
import { Elm } from './Main.elm'
import * as serviceWorker from './setup-service-worker'

const app = Elm.Main.init({
  node: document.getElementById('root'),
})

const main = async username => {
  await serviceWorker.register(username)
  serviceWorker.subscribe(username, message => {
    app.ports.receivedMessage.send(message)
  })
}

try {
  app.ports.sendUsername.subscribe(username => {
    main(username)
  })
} catch (error) {
  console.error(error)
  main()
}
