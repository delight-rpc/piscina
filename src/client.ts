import * as DelightRPC from 'delight-rpc'
import Piscina from 'piscina'

export function createClient<IAPI extends object>(
  piscina: Piscina
, parameterValidators?: DelightRPC.ParameterValidators<IAPI>
): DelightRPC.ClientProxy<IAPI> {
  const client = DelightRPC.createClient<IAPI>(
    async function send(request) {
      return await piscina.run(request)
    }
  , parameterValidators
  )

  return client
}
