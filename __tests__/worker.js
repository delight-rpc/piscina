import { assert } from '@blackglory/prelude'
import { delay } from 'extra-promise'
import { createServer } from '../lib/server.js'

const api = {
  echo(message) {
    return message
  }
, error(message) {
    throw new Error(message)
  }
, async loop(signal) {
    assert(signal)

    while (!signal.aborted) {
      await delay(100)
    }

    throw signal.reason
  }
}

const [handler] = createServer(api)

export default handler
