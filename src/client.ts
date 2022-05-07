import * as DelightRPC from 'delight-rpc'
import Piscina from 'piscina'
import { IRequest, IBatchRequest } from '@delight-rpc/protocol'

export function createClient<IAPI extends object>(
  piscina: Piscina
, { parameterValidators, expectedVersion, channel }: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    expectedVersion?: `${number}.${number}.${number}`
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
    expectedVersion?: `${number}.${number}.${number}`
    channel?: string
  } = {}
): DelightRPC.BatchClient {
  const client = new DelightRPC.BatchClient(
    createSend(piscina)
  , {
      expectedVersion
    , channel
    }
  )

  return client
}

function createSend<T>(piscina: Piscina) {
  return async function (
    request: IRequest<unknown> | IBatchRequest<unknown>
  ) {
    return await piscina.run(request) as T
  }
}
