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

export default createServer(api)

// main.ts
import { createClient } from '@delight-rpc/piscina'

const piscina = new Piscina({
  filename: new URL('./worker.js', import.meta.url).href
})
const client = createClient<IAPI>(piscina)

await client.echo('hello world')
```

## API
### createClient
```ts
function createClient<IAPI extends object>(
  piscina: Piscina
, options?: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    expectedVersion?: `${number}.${number}.${number}`
    channel?: string
  }
): DelightRPC.ClientProxy<IAPI>
```

### createBatchClient
```ts
function createBatchClient(
  piscina: Piscina
, options?: {
    expectedVersion?: `${number}.${number}.${number}`
    channel?: string
  }
): DelightRPC.BatchClient
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
): (req: unknown) => Promise<unknown>
```
