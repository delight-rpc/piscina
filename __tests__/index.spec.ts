import { createBatchClient, createClient } from '@src/client.js'
import { IAPI } from './contract.js'
import path from 'path'
import { getErrorPromise } from 'return-style'
import Piscina from 'piscina'
import { fileURLToPath } from 'url'
import { createBatchProxy } from 'delight-rpc'

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

  test('echo (batch)', async () => {
    const client = createBatchClient(pool)
    const proxy = createBatchProxy<IAPI>()

    const result = await client.parallel(proxy.echo('hello'))

    expect(result.length).toBe(1)
    expect(result[0].unwrap()).toBe('hello')
  })

  test('error', async () => {
    const client = createClient<IAPI>(pool)

    const err = await getErrorPromise(client.error('hello'))

    expect(err).toBeInstanceOf(Error)
    expect(err!.message).toMatch('hello')
  })

  test('error (batch)', async () => {
    const client = createBatchClient(pool)
    const proxy = createBatchProxy<IAPI>()

    const result = await client.parallel(proxy.error('hello'))

    expect(result.length).toBe(1)
    const err = result[0].unwrapErr()
    expect(err).toBeInstanceOf(Error)
    expect(err!.message).toMatch('hello')
  })
})
