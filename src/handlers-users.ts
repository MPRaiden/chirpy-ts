import { NextFunction, Request, Response} from "express"

import { BadRequestError, ForbiddenRequestError, UnauthorizedRequestError } from "./errors"
import { createUser, deleteUsers, getUserByEmail } from "./lib/queries/users"
import { NewUser } from "./lib/db/schema"
import { config } from "./config"
import { checkPasswordHash, hashPassword, makeJWT } from "./auth"
import { isPositiveInteger } from "./helpers"

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
    let expiresInSeconds = reqBody?.expiresInSeconds

    if (typeof(email) !== "string" || email.length === 0) {
      throw new BadRequestError("email missing from request body")
    }
    if(typeof(password) !== "string" || password.length === 0) {
      throw new BadRequestError("password missing from requst body")
    }
    if(!expiresInSeconds || expiresInSeconds > 3600 || !isPositiveInteger(expiresInSeconds)) {
      expiresInSeconds = 3600
    } 

    const user = await getUserByEmail(email)
    if (!user) {
      throw new UnauthorizedRequestError("Incorrect email or password")
    }

    const match = await checkPasswordHash(password, user.hashed_password)
    if (!match) {
      throw new UnauthorizedRequestError("Incorrect email or password")
    }

    const signedJWT = makeJWT(user.id, expiresInSeconds, config.jwtSecret)

    res.status(200).json({
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      token: signedJWT,
    })
  } catch(error) {
    next(error)
  }
}

