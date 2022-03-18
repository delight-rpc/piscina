import * as DelightRPC from 'delight-rpc'
import Piscina from 'piscina'

export function createClient<IAPI extends object>(
  piscina: Piscina
, parameterValidators?: DelightRPC.ParameterValidators<IAPI>
, expectedVersion?: `${number}.${number}.${number}`
): DelightRPC.ClientProxy<IAPI> {
  const client = DelightRPC.createClient<IAPI>(
    createSend(piscina)
  , parameterValidators
  , expectedVersion
  )

  return client
}

export function createBatchClient(
  piscina: Piscina
, expectedVersion?: `${number}.${number}.${number}`
): DelightRPC.BatchClient {
  const client = new DelightRPC.BatchClient(
    createSend(piscina)
  , expectedVersion
  )

  return client
}

function createSend<T>(piscina: Piscina) {
  return async function (
    request: DelightRPC.IRequest<unknown> | DelightRPC.IBatchRequest<unknown>
  ) {
    return await piscina.run(request) as T
  }
}
