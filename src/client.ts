import * as DelightRPC from 'delight-rpc'
import Piscina from 'piscina'
import { IRequest, IBatchRequest } from '@delight-rpc/protocol'

export function createClient<IAPI extends object>(
  piscina: Piscina
, { parameterValidators, expectedVersion, channel }: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    expectedVersion?: string
    channel?: string
  } = {}
): DelightRPC.ClientProxy<IAPI> {
  const client = DelightRPC.createClient<IAPI>(
    createSend(piscina)
  , {
      parameterValidators
    , expectedVersion
    , channel
    }
  )

  return client
}

export function createBatchClient(
  piscina: Piscina
, { expectedVersion, channel }: {
    expectedVersion?: string
    channel?: string
  } = {}
): DelightRPC.BatchClient {
  const client = new DelightRPC.BatchClient<unknown>(
    createSend(piscina)
  , {
      expectedVersion
    , channel
    }
  )

  return client
}

function createSend<T>(
  piscina: Piscina
): (request: IRequest<unknown> | IBatchRequest<unknown>) => Promise<T> {
  return async request => await piscina.run(request)
}
