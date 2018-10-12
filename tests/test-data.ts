import {IUser, IStreak } from "../lib/Interfaces";



const userData1: IUser = {
    firstName: "user1",
    lastName: "data1",
    userName: "userData1",
    email: "user1@gmail.com",
    password: "password",
    comparePassword: "password"
  };
  
  const userData2: IUser = {
    firstName: "user2",
    lastName: "data2",
    userName: "userData2",
    email: "user2@gmail.com",
    password: "password",
    comparePassword: "password"
  };

  const userData3: IUser = {
    firstName: "user3",
    lastName: "data3",
    userName: "userData3",
    email: "user3@gmail.com",
    password: "password",
    comparePassword: "password"
  };

  const userData4: IUser = {
    firstName: "user4",
    lastName: "data4",
    userName: "userData4",
    email: "user4@gmail.com",
    password: "password",
    comparePassword: "password"
  };

  const postUser: IUser = {
    firstName: "Test",
    lastName: "User",
    userName: "TestUser",
    email: "test1@gmail.com",
    password: "password",
    comparePassword: "password"
  };

  const loginUser: IUser = {
    firstName: "Test",
    lastName: "User",
    userName: "LoginUser",
    email: "loginUser@gmail.com",
    password: "password",
    comparePassword: "password"
  };

  const NUMBER_OF_USERS = [ userData1, userData2, userData3, userData4].length;
  
  export {postUser, userData1, userData2, userData3, userData4, loginUser, NUMBER_OF_USERS}