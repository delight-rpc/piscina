# @delight-rpc/piscina
## Install
```sh
npm install --save @delight-rpc/piscina
# or
yarn add @delight-rpc/piscina
```

## Usage
```ts
// api.d.ts
interface IAPI {
  echo(message: string): string
}

// worker.ts
import { createServer } from '@delight-rpc/piscina'

const api: IAPI = {
  echo(message: string): string {
    return message
  }
}

const [handler] = createServer(api)

export default handler

// main.ts
import { createClient } from '@delight-rpc/piscina'

const piscina = new Piscina({
  filename: new URL('./worker.js', import.meta.url).href
})
const [client] = createClient<IAPI>(piscina)

await client.echo('hello world')
```

## API
### createClient
```ts
function createClient<IAPI extends object>(
  piscina: Piscina
, options?: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    expectedVersion?: string
    channel?: string
    timeout?: number
  }
): [client: DelightRPC.ClientProxy<IAPI>, close: () => void]
```

### createBatchClient
```ts
function createBatchClient<DataType>(
  piscina: Piscina
, options?: {
    expectedVersion?: string
    channel?: string
    timeout?: number
  }
): [client: DelightRPC.BatchClient<DataType>, close: () => void]
```

### createServer
```ts
function createServer<IAPI extends object>(
  api: DelightRPC.ImplementationOf<IAPI>
, options?: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    version?: `${number}.${number}.${number}`
    channel?: string
    ownPropsOnly?: boolean
    channel?: string | RegExp | AnyChannel
  }
): [handler: (message: unknown) => Promise<unknown>, close: () => void]
```
