import * as DelightRPC from 'delight-rpc'

export function createServer<IAPI extends object>(
  api: IAPI
, parameterValidators?: DelightRPC.ParameterValidators<IAPI>
): (req: any) => Promise<any> {
  return async function handler(req: any): Promise<any> {
    if (DelightRPC.isRequest(req)) {
      const result = await DelightRPC.createResponse(api, req, parameterValidators)
      return result
    }
  }
}
