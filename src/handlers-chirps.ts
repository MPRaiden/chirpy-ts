import { NextFunction, Request, Response} from "express"
import { BadRequestError, NotFoundError } from "./errors"
import { createChirp, getChirpById, getChirps } from "./lib/queries/chirps"
import { NewChirp } from "./lib/db/schema"


export async function handlersCreateChirp(req: Request, res: Response, next: NextFunction) {
  type params = {
        body: string
        userId: string
      }

  try {
    const reqBody: params = req.body
    const userId = reqBody.userId
          
    if (reqBody.body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140")
    } else {
      const profanities = ["kerfuffle", "sharbert", "fornax"]
      const words = reqBody.body.split(" ")

      for (let i = 0; i < words.length; i++) {
        const word = words[i]
        const loweredWord = word.toLowerCase()
        if (profanities.includes(loweredWord)) {
          words[i] = "****"
        }
      }

      const cleanedChirp = words.join(" ")
          
      const newChirp : NewChirp= { userId: userId, body: cleanedChirp }
      const created = await createChirp(newChirp)

      if (!created) {
        throw new BadRequestError("chirp already exists")
      }

      res.status(201).json({
        id: created.id,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
        body: created.body,
        userId: created.userId
      })
    }
  } catch (error) {
    next(error)
  }
}

export async function handlersGetChirps(req: Request, res: Response, next: NextFunction) {
  try {
    const chirps = await getChirps()
    if (chirps) {
      res.status(200).json(chirps)
    } else {
      throw new NotFoundError("no chirps found")
    }
  } catch(error) {
    next(error)
  }
}

export async function handlersGetChirp(req: Request, res: Response, next: NextFunction) {
  try {
    const params = req.params
    const chirpID = params.chirpID

    const chirp = await getChirpById(chirpID)
    if (chirp) {
      res.status(200).json(chirp)
    } else {
      throw new NotFoundError(`chirp with ID "${chirpID}" not found`)
    }
  } catch(error) {
    next(error)
  }
}

