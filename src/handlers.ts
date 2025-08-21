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

export async function handlerValidateChirp(req: Request, res: Response) {
  let body = ""

  req.on("data", (chunk) => {
    body += chunk
  })

  req.on("end", () => {
    try {
      const parsedBody = JSON.parse(body)
      
      if (parsedBody.body.length > 140) {
        res.status(400).send({"error": "Chirp is too long"})
      } else {
        // If all good send back 200 status and valid is true block
        res.status(200).send({"valid": true})
      }
    } catch (error) {
      res.status(400).send({"error": "Something went wrong"})
    }
  })
}

