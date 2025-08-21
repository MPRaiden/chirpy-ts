import { Request, Response } from "express"
// @ts-ignore
import { config } from './config.js'
import path from "path"
import fs from "fs"


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

export async function handlerNumRequests(req: Request, res: Response) {
  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    })

  const hits = config.fileserverhits
  const filePath = path.join(process.cwd(), 'src', 'app', 'admin-metrics.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(`function handlerNumRequests: Error reading file ${filePath}. Error - ${err}`)
      res.send("Error reading file")
      return
    }

    res.send(data.replace("NUM", hits.toString()));
  })
}

export async function handlerResetNumRequests(req: Request, res: Response) {
  config.fileserverhits = 0
  res.send("")
}

