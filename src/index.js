import './main.css'
import { Elm } from './Main.elm'
import * as serviceWorker from './setup-service-worker'

const app = Elm.Main.init({
  node: document.getElementById('root'),
})

const main = async () => {
  await serviceWorker.register()
  serviceWorker.subscribe(message => {
    app.ports.receivedMessage.send(message)
  })
}

main()
