import { ReadStream } from 'node:fs'
import {
  IncomingMessage,
  ServerResponse,
  createServer as createHttpServer,
} from 'node:http'
import { ReadableStream } from 'node:stream/web'

export function createServer(
  getStream: (
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ) => Promise<ReadStream | ReadableStream>
) {
  const server = createHttpServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(404)
      return res.end()
    }

    try {
      const stream = await getStream(req, res)

      if (!stream) {
        res.writeHead(404)
        return res.end()
      }

      res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Private-Network': 'true',
      })

      for await (const chunk of stream) {
        res.write(chunk)
      }

      res.end()
    } catch (error) {
      res.writeHead(500)
      res.end()
      return
    }
  })
  return server
}
