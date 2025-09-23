import { NextFunction, Request, Response} from "express"

import { BadRequestError, ForbiddenRequestError, UnauthorizedRequestError } from "./errors"
import { createUser, deleteUsers, getUserByEmail, updateUserMailPass } from "./lib/queries/users"
import { NewUser } from "./lib/db/schema"
import { config } from "./config"
import { checkPasswordHash, getBearerToken, getRefreshTokenString, hashPassword, makeJWT, makeRefreshToken, validateJWT } from "./auth"
import { getRefreshTokenByValue, getUserByRefreshToken, insertRefreshToken, revokeToken } from "./lib/queries/tokens"

export async function handlersCreateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const reqBody = req.body
    const email = reqBody.email
    const password = reqBody.password

    if (typeof(email) !== "string" || email.length === 0) {
      throw new BadRequestError("email missing from request body")
    }
    if(typeof(email) !== "string" || password.length === 0) {
      throw new BadRequestError("password missing from requst body")
    }

    const hashedPassword = await hashPassword(password)
    const newUser: NewUser= { email: email, hashed_password: hashedPassword }
    const created = await createUser(newUser)

    if (!created) {
      throw new BadRequestError("user already exists")
    }

    res.status(201).json({
      id: created.id,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      email: created.email,
    })

  } catch (error) {
    next(error)
  }
}

export async function handlersDeleteUsers(req: Request, res: Response, next: NextFunction) {
  try {
    if (config.platform !== "dev") {
      throw new ForbiddenRequestError("this endpoint is only allowed in DEV environment")
    }

    await deleteUsers()
  } catch(error) {
    next(error)
  }

  res.status(200).json({
    "status": "ok"
  })
}

export async function handlersLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const reqBody = req.body
    const email = reqBody.email
    const password = reqBody.password

    if (typeof(email) !== "string" || email.length === 0) {
      throw new BadRequestError("email missing from request body")
    }
    if(typeof(password) !== "string" || password.length === 0) {
      throw new BadRequestError("password missing from requst body")
    }

    const user = await getUserByEmail(email)
    if (!user) {
      throw new UnauthorizedRequestError("Incorrect email or password")
    }

    const match = await checkPasswordHash(password, user.hashed_password)
    if (!match) {
      throw new UnauthorizedRequestError("Incorrect email or password")
    }

    const signedJWT = makeJWT(user.id, 3600, config.jwtSecret)
    const refreshToken = makeRefreshToken()
    const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)    
    await insertRefreshToken({token: refreshToken, userId:user.id, expiresAt: expiresAt,revokedAt: null})

    res.status(200).json({
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      token: signedJWT,
      refreshToken: refreshToken,
    })
  } catch(error) {
    next(error)
  }
}

export async function handlerRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshTokenStr = getRefreshTokenString(req)
    const token = await getRefreshTokenByValue(refreshTokenStr)
    const now = new Date()

    if (!token || token.revokedAt || token.expiresAt < now ) {
      res.status(401).send()
      return
    } else {
      const user = await getUserByRefreshToken(token)
      if (!user) {
        res.status(401).send()
        return
      }

      const newJWTToken = makeJWT(user.id, 3600,  config.jwtSecret)
      res.status(200).json({
        "token": newJWTToken
      })
    }
  } catch (error) {
    next(error)
  }
}

export async function handlerRevokeRefreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshTokenStr = getRefreshTokenString(req)
    const token = await getRefreshTokenByValue(refreshTokenStr)
    if (!token || token.revokedAt) {
      res.status(401).send()
      return
    }

    await revokeToken(token)

    res.status(204).send()
  } catch(error) {
    next(error)
  }
}

export async function handlerUsersUpdate(req: Request, res: Response, next: NextFunction) {
  try {
    const reqBody = req.body
    const email = reqBody.email
    const password = reqBody.password

    if (typeof(email) !== "string" || email.length === 0) {
      throw new BadRequestError("email missing from request body")
    }
    if(typeof(email) !== "string" || password.length === 0) {
      throw new BadRequestError("password missing from requst body")
    }

    const hashedPassword = await hashPassword(password)

    const bearerToken = getBearerToken(req)
    const userId = validateJWT(bearerToken, config.jwtSecret)

    const newUser: NewUser= { email: email, hashed_password: hashedPassword }

    await updateUserMailPass(newUser, userId)
    const updatedUser = await getUserByEmail(email)

    res.status(200).json({
      id: updatedUser.id,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      email: updatedUser.email,
    })
  } catch (error) {
    next(error)
  }
}

