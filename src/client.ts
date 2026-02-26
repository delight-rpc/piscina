import * as DelightRPC from 'delight-rpc'
import { Piscina } from 'piscina'
import { SyncDestructor } from 'extra-defer'
import { AbortController, raceAbortSignals, timeoutSignal } from 'extra-abort'
import { isntUndefined, pass } from '@blackglory/prelude'

export function createClient<IAPI extends object>(
  piscina: Piscina
, { parameterValidators, expectedVersion, channel, timeout }: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    expectedVersion?: string
    channel?: string
    timeout?: number
  } = {}
): [client: DelightRPC.ClientProxy<IAPI>, close: () => void] {
  const destructor = new SyncDestructor()

  const controller = new AbortController()
  destructor.defer(abortAllPendings)

  const client = DelightRPC.createClient<IAPI>(
    async function send(request, signal) {
      const destructor = new SyncDestructor()

      try {
        const mergedSignal = raceAbortSignals([
          isntUndefined(timeout) && timeoutSignal(timeout)
        , signal
        , controller.signal
        ])
        mergedSignal.addEventListener('abort', sendAbort)
        destructor.defer(() => mergedSignal.removeEventListener('abort', sendAbort))

        return await piscina.run(request, { signal: mergedSignal })
      } finally {
        destructor.execute()
      }

      async function sendAbort(): Promise<void> {
        const abort = DelightRPC.createAbort(request.id, channel)
        await piscina.run(abort).catch(pass)
      }
    }
  , {
      parameterValidators
    , expectedVersion
    , channel
    }
  )

  return [client, close]

  function close(): void {
    destructor.execute()
  }

  function abortAllPendings(): void {
    controller.abort()
  }
}

export function createBatchClient<DataType>(
  piscina: Piscina
, { expectedVersion, channel, timeout }: {
    expectedVersion?: string
    channel?: string
    timeout?: number
  } = {}
): [client: DelightRPC.BatchClient<DataType>, close: () => void] {
  const destructor = new SyncDestructor()

  const controller = new AbortController()
  destructor.defer(abortAllPendings)

  const client = new DelightRPC.BatchClient<DataType>(
    async function send(request) {
      const destructor = new SyncDestructor()

      try {
        const mergedSignal = raceAbortSignals([
          isntUndefined(timeout) && timeoutSignal(timeout)
        , controller.signal
        ])
        mergedSignal.addEventListener('abort', sendAbort)
        destructor.defer(() => mergedSignal.removeEventListener('abort', sendAbort))

        return await piscina.run(request, { signal: mergedSignal })
      } finally {
        destructor.execute()
      }

      async function sendAbort(): Promise<void> {
        const abort = DelightRPC.createAbort(request.id, channel)
        await piscina.run(abort).catch(pass)
      }
    }
  , {
      expectedVersion
    , channel
    }
  )

  return [client, close]

  function close(): void {
    destructor.execute()
  }

  function abortAllPendings(): void {
    controller.abort()
  }
}
