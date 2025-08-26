import { NextFunction, Request, Response } from "express"
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
export async function handlerReadiness(req: Request, res: Response, next: NextFunction) {
  try {
  res.set({
    'Content-Type': 'text/plain; charset=utf-8',
  })
  res.send("OK")
  } catch (error) {
    next(error)
  }
}

export async function handlerNumRequests(req: Request, res: Response, next: NextFunction) {
  try {
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
  } catch (error) {
    next(error)
  }
}

export async function handlerResetNumRequests(req: Request, res: Response, next: NextFunction) {
  try {
  config.fileserverhits = 0
  res.send("")
    } catch (error) {
      next(error)
    }
}

export async function handlerValidateChirp(req: Request, res: Response, next: NextFunction) {
    type params = {
      body: string
    }

    try {
      const reqBody: params = req.body
        
      if (reqBody.body.length > 140) {
        throw new Error()
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
    next(error)
  }
}

export function handlersError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);
  res.status(500).json({
    error: "Something went wrong on our end",
  });
}

