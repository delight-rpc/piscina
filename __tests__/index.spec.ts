import { describe, beforeEach, afterEach, test, expect } from 'vitest'
import { createBatchClient, createClient } from '@src/client.js'
import { IAPI } from './contract.js'
import path from 'path'
import { getErrorPromise } from 'return-style'
import { Piscina } from 'piscina'
import { fileURLToPath } from 'url'
import { createBatchProxy } from 'delight-rpc'
import { AbortController, AbortError } from 'extra-abort'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('Main as Client, Worker as Server', () => {
  let pool: Piscina
  beforeEach(() => {
    pool = new Piscina({
      filename: path.join(__dirname, './worker.js')
    })
  })
  afterEach(async () => {
    await pool.destroy()
  })

  test('result', async () => {
    const [client, close] = createClient<IAPI>(pool)

    const result = await client.echo('foo')
    close()

    expect(result).toBe('foo')
  })

  test('result (batch)', async () => {
    const [client, close] = createBatchClient(pool)
    const proxy = createBatchProxy<IAPI>()

    const result = await client.parallel(proxy.echo('foo'))
    close()

    expect(result.length).toBe(1)
    expect(result[0].unwrap()).toBe('foo')
  })

  test('error', async () => {
    const [client, close] = createClient<IAPI>(pool)

    const err = await getErrorPromise(client.error('foo'))
    close()

    expect(err).toBeInstanceOf(Error)
    expect(err?.message).toMatch('foo')
  })

  test('error (batch)', async () => {
    const [client, close] = createBatchClient(pool)
    const proxy = createBatchProxy<IAPI>()

    const result = await client.parallel(proxy.error('foo'))
    close()

    expect(result.length).toBe(1)
    const err = result[0].unwrapErr()
    expect(err).toBeInstanceOf(Error)
    expect(err?.message).toMatch('foo')
  })

  test('abort', async () => {
    const [client, close] = createClient<IAPI>(pool)
    const controller = new AbortController()

    const promise = getErrorPromise(client.loop(controller.signal))
    controller.abort()
    const err = await promise
    close()

    expect(err).toBeInstanceOf(AbortError)
  })
})
