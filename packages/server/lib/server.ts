import { ReadStream } from 'node:fs'
import { IncomingMessage, createServer as createHttpServer } from 'node:http'
import { ReadableStream } from 'node:stream/web'

export function createServer(
  getStream: (req: IncomingMessage) => ReadStream | ReadableStream
) {
  const server = createHttpServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(404)
      res.end()
      return
    }

    try {
      const stream = getStream(req)

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
