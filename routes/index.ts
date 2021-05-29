import { Router } from 'express'
import authHandler from './auth'
import spendsHandler from './spends'

const router = Router()

router.use('/auth', authHandler)
router.use('/spends', spendsHandler)

export default router
