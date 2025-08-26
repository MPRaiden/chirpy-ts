export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
  constructor(message:string) {
    super(message)
  }
}

export class UnauthorizedRequestError extends Error {
  constructor(message:string) {
    super(message)
  }
}

export class ForbiddenRequestError extends Error {
  constructor(message:string) {
    super(message)
  }
}

