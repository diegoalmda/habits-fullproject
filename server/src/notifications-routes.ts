import WebPush from 'web-push'
import { FastifyInstance } from "fastify"
import { z } from 'zod'

const publicKey = 'BJceAEF6xuC7dFXmIXtRMXld_z2taVTvkiB20pFTJGOSp37Hz6P6LrcgunvI_bjvzmmbKc6AVXMwYMknPcqA8rc'
const privateKey = 'u8M0Hhi0mte9hGlKgtqO1ftPyQYzKEMTCFu6ChoDrLQ'

WebPush.setVapidDetails(
  'http://localhost:3333',
  publicKey,
  privateKey,
)

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey,
    }
  })

  app.post('/push/register', (request, response) => {
    console.log(request.body)

    return response.status(201).send();
  })

  app.post('/push/send', async (request, response) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)

    WebPush.sendNotification(subscription, 'HELLO DO BACKEND')

    return response.status(201).send();
  })
}
