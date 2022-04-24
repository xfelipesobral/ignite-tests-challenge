import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"

import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
        name: "Usuario teste",
        email: "usuario@teste.com",
        password: "123"
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    })

    expect(result).toHaveProperty("token")
  })

  it("should not be able to authenticate an nonexistent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "usuariofail@teste.com",
        password: "123",
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Usuario teste",
        email: "usuario@teste.com",
        password: "123"
    }

      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "123",
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})