import { createClient } from '@src/client.js'
import { IAPI } from './contract.js'
import path from 'path'
import { getErrorPromise } from 'return-style'
import Piscina from 'piscina'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('Main as Client, Worker as Server', () => {
  let pool: Piscina
  beforeEach(() => {
    pool = new Piscina({
      filename: path.join(__dirname, './worker.ts')
    })
  })
  afterEach(async () => {
    await pool.destroy()
  })

  test('echo', async () => {
    const client = createClient<IAPI>(pool)

    const result = await client.echo('hello')

    expect(result).toBe('hello')
  })

  test('error', async () => {
    const client = createClient<IAPI>(pool)

    const err = await getErrorPromise(client.error('hello'))

    expect(err).toBeInstanceOf(Error)
    expect(err!.message).toMatch('hello')
  })
})
