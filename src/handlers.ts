import { Request, Response } from "express"

/**
 * Handler for the /healthz endpoint
 *
 * @param req {Request} - the incoming request
 * @param res {Response} - the outgoing response
 */
export async function handlerReadiness(req: Request, res: Response) {
  res.set({
    'Content-Type': 'text/plain; charset=utf-8',
  })
  res.send("OK")
}

