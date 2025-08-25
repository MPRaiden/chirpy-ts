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
    try {
      type params = {
      body: string
    }
      const reqBody: params = req.body
      
      if (reqBody.body.length > 140) {
        res.status(400).send({"error": "Chirp is too long"})
      } else {
        const profanities = ["kerfuffle", "sharbert", "fornax"]
        const words = reqBody.body.split(" ")

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (profanities.includes(loweredWord)) {
          words[i] = "****";
        }
      }

      const cleaned = words.join(" ");
        
        // If all good send back 200 status and valid is true block
        res.status(200).send({"cleanedBody": cleaned})
      }
    } catch (error) {
      res.status(400).send({"error": "Something went wrong"})
    }
}

