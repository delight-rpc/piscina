import * as DelightRPC from 'delight-rpc'
import { isntNull } from '@blackglory/prelude'

export function createServer<IAPI extends object>(
  api: DelightRPC.ImplementationOf<IAPI>
, { parameterValidators, version, channel }: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    version?: `${number}.${number}.${number}`
    channel?: string
  } = {}
): (req: unknown) => Promise<unknown> {
  return async function handler(req: unknown): Promise<unknown> {
    if (DelightRPC.isRequest(req) || DelightRPC.isBatchRequest(req)) {
      const response = await DelightRPC.createResponse(
        api
      , req
      , {
          parameterValidators
        , version
        , channel
        }
      )

      if (isntNull(response)) {
        return response
      }
    }
  }
}
