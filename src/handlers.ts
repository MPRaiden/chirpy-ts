import { NextFunction, Request, Response } from "express"
// @ts-ignore
import { config } from './config'
import path from "path"
import fs from "fs"
import { BadRequestError, ForbiddenRequestError, NotFoundError, UnauthorizedRequestError } from "./errors"


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
    const filePath = path.join(process.cwd(), 'src', 'app', 'admin-metrics.html')

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(`function handlerNumRequests: Error reading file ${filePath}. Error - ${err}`)
        res.send("Error reading file")
        return
      }

      res.send(data.replace("NUM", hits.toString()))
    })
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
  if (err instanceof BadRequestError) {
    res.status(400).json({
      error: err.message
    })
  } else if (err instanceof NotFoundError) {
    res.status(404).json({
      error: err.message
    })
  } else if (err instanceof UnauthorizedRequestError) {
    res.status(401).json({
      error: err.message
    })
  } else if (err instanceof ForbiddenRequestError) {
    res.status(403).json({
      error: err.message
    })
  } else {
    res.status(500).json({
      error: "Something went wrong on our end",
    })
  }
}

