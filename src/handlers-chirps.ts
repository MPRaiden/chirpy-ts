import { NextFunction, Request, Response} from "express"
import { BadRequestError, NotFoundError } from "./errors"
import { createChirp, deleteChirp, getChirpById, getChirps, getChirpsByUserId } from "./lib/queries/chirps"
import { NewChirp } from "./lib/db/schema"
import { getBearerToken, validateJWT } from "./auth"
import { config } from "./config"


export async function handlersCreateChirp(req: Request, res: Response, next: NextFunction) {
  type params = {
        body: string
        userId: string
      }

  try {
    const reqBody: params = req.body

    const bearerToken = getBearerToken(req)
    const userId = validateJWT(bearerToken, config.jwtSecret)
          
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
    // Check if request has chirp author id to filter by
    let authorId = ""
    const authorIdQuery = req.query.authorId
    if (typeof authorIdQuery === "string") {
      authorId = authorIdQuery
    }

    let sort = 'asc'
    const sortParam = req.query.sort
    if (sortParam && sortParam === 'desc') {
      sort = sortParam
    }

    if (!authorId) {
      const chirps = await getChirps(sort)
      if (chirps) {
        res.status(200).json(chirps)
      } else {
        throw new NotFoundError("no chirps found")
      }
    } else {
      const chirps = await getChirpsByUserId(authorId, sort)
      if (chirps) {
        res.status(200).json(chirps)
      }
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

export async function handlersDeleteChirp(req: Request, res: Response, next: NextFunction) {
  try {
    const params = req.params

    const chirpID = params.chirpID
    const chirp = await getChirpById(chirpID)
    if (!chirp) {
      res.status(404).send()
      return
    }

    const bearerToken = getBearerToken(req)
    const userId = validateJWT(bearerToken, config.jwtSecret)

    if (chirp.userId !== userId) {
      res.status(403).send()
      return
    }
    
    await deleteChirp(chirpID)
    res.status(204).send()

  } catch (error) {
    next(error)
  }
}

