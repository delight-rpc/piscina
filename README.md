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
, parameterValidators?: DelightRPC.ParameterValidators<IAPI>
): DelightRPC.ClientProxy<IAPI>
```

### createServer
```ts
function createServer<IAPI extends object>(
  api: DelightRPC.ImplementationOf<IAPI>
, parameterValidators?: DelightRPC.ParameterValidators<IAPI>
): (req: any) => Promise<any>
```
