import { NextFunction, Request, Response} from "express"

import { BadRequestError, ForbiddenRequestError } from "./errors"
import { createUser, deleteUsers } from "./lib/queries/users"
import { NewUser } from "./lib/db/schema"
import { config } from "./config"

export async function handlersCreateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const reqBody = req.body
    const email = reqBody.email

    if (typeof(email) !== "string" || email.length === 0) {
      throw new BadRequestError("email missing from request body")
    }

    const newUser: NewUser= { email }
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

