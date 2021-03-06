import { createClient } from '@src/client'
import '@blackglory/jest-matchers'
import { IAPI } from './api'
import * as path from 'path'
import { getErrorPromise } from 'return-style'
import Piscina from 'piscina'

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

  test('echo', async () => {
    const client = createClient<IAPI>(pool)

    const result = client.echo('hello')
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBe('hello')
  })

  test('error', async () => {
    const client = createClient<IAPI>(pool)

    const err = await getErrorPromise(client.error('hello'))

    expect(err).toBeInstanceOf(Error)
    expect(err!.message).toMatch('hello')
  })
})
