import { db } from './database/db';
import express, { Application, NextFunction, Request, Response } from 'express'

const app: Application = express()

app.use(express.json())


app.get('/health', (_req, res) => {
    res.status(200).json({
        message: 'OK'
    })
})


app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name , email and password are required"
            })
        }

        const existingUser = db.chain.get('users').find({ email }).value()

        if (existingUser) {
            return res.status(400).json({
                message: "User already exist"
            })
        }

        const hashedPassword = `hashed_${password}`

        const newUser = {
            id: Date.now().toString(),
            name, email, password: hashedPassword
        }

        db.data.users.push(newUser)
        await db.write()

        const { password: _, ...userWithoutPassowrd } = newUser

        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassowrd
        })

    } catch (error) {
        res.status(500).json({
            message: "Error  something went wrong"
        })
    }
})

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await Promise.resolve(
            db.chain.get('users').find({ email }).value()
        )

        if (!user) {
            res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const hashedPassowrd = `hashed_${password}`

        if (user.password !== hashedPassowrd) {
            res.status(401).json({
                message: 'Invalid credentials'
            })
        }
        const dummyToken = 'dummy_token_give_me'
        res.status(200).json({
            dummyToken
        })
    } catch (error) {

    }
})


app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ error: error.message })
})
export default app