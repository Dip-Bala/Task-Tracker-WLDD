import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../src/models/userSchema";
import { afterEach, describe, expect, it, jest, test } from "@jest/globals";
import {
  SignUpController,
  LoginController,
} from "../../src/controllers/authController";

function mockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
}

describe("Auth Controller Unit Tests", () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("SignUp should return 400 if name missing", async () => {
    const req = {
      body: { email: "test@email.com", password: "123456" },
    } as Request;

    const res = mockResponse();

    await SignUpController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("Login should return 401 if user not found", async () => {
    const req = {
      body: { email: "wrong@email.com", password: "123456" },
    } as Request;

    const res = mockResponse();

    jest.spyOn(User, "findOne").mockResolvedValue(null as any);

    await LoginController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("Login should return 200 on valid credentials", async () => {
    const req = {
      body: { email: "john@email.com", password: "123456" },
    } as Request;

    const res = mockResponse();

    const fakeUser = {
      _id: { toString: () => "123" },
      email: "john@email.com",
      password: "hashed",
    };

    jest.spyOn(User, "findOne").mockResolvedValue(fakeUser as any);
    jest.spyOn(bcrypt, "compare").mockImplementation(async () => true);

    await LoginController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalled();
  });

});