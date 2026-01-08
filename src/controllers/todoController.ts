import asyncHandler from "express-async-handler"
import Todo from "../models/todoModel.js"
import type { ProtectedRequest } from "../types/app-request.js"
import type { RequestHandler, Response } from "express"

const createTodo: RequestHandler = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { title, description } = req.body
  // console.log(req.user)
  
  if (!title || !description) {
    res.status(400)
    throw new Error("Title and Description are required")
  }

  const todo = await Todo.create({ user: req.user._id, title, description })

  res.status(201).json({
    status: 'success',
    data: {
      todo
    }
  })
})

const getTodos: RequestHandler = asyncHandler(async (req: ProtectedRequest, res) => {
  const user = req.user
  const todos = await Todo.find({
    user: user._id,
  })
  res.json({
    status: 'success',
    data: {
      todos
    }
  })
})

const editTodo: RequestHandler = asyncHandler(async (req: ProtectedRequest, res) => {
  const { title, description, status } = req.body

  const user = req.user

  if (!title || !description || !status) {
    res.status(400)
    throw new Error("Title, Description, and Status are required")
  }

  const todo = await Todo.findById(req.params.id)

  if (!todo) {
    res.status(404)
    throw new Error("Todo not found")
  }

  console.log(todo.user.toString() !== user._id.toString())

  // you should make an a middle ware for it
  if (todo.user.toString() !== user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized to update this todo")
  }


  todo.title = title
  todo.description = description
  todo.status = status

  const updatedTodo = await todo.save()

  res.json(updatedTodo)
})

const deleteTodo: RequestHandler = asyncHandler(async (req: ProtectedRequest, res) => {

  const todo = await Todo.findById(req.params.id)

  if(!todo) {
    res.status(404)
    throw new Error("Todo not found")
  }

  // you should check using middle ware not like that cause you are using it many times
  if(todo.user._id.toString() !== req.user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized to update this todo")
  }

  if (todo) {
    await todo.deleteOne()
    res.json({ message: "Todo removed" })
  } else {
    res.status(404)
    throw new Error("Todo not found")
  }
})

export { createTodo, getTodos, editTodo, deleteTodo }
