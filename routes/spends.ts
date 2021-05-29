import { Response, Router } from 'express'
import { addNewSpend, addNewSpendToUser, getSpendsById } from '../services/database'
import { Request } from '../types'
import { addSpendToUserValidator } from '../validators/addSpendToUserValidator'
import { addSpendValidator } from '../validators/addSpendValidator'
import { getSpendsValidator } from '../validators/getSpendsValidator'

const router = Router()

router.get('/', (req: Request, res: Response) => {
	const valRes = getSpendsValidator(req.body.spends)
	if (valRes) return res.json({ message: 'wrong spendArr submitted' })
	getSpendsById(req.body.spends)
		.then((resp) =>
			res.json({
				message: 'Spends found: ',
				spends: resp,
			})
		)
		.catch((err) => res.json(err))
})

router.post('/add', (req: Request, res: Response) => {
	const valRes = addSpendValidator(req.body)
	if (valRes) return res.json({ message: 'wrong spend submitted' })
	addNewSpend(req.body)
		.then((resp) =>
			res.json({
				message: 'Spend added',
				spend: resp,
			})
		)
		.catch((err) => res.json(err))
})

router.post('/addtouser', (req: Request, res: Response) => {
	if (!req.user) return res.json({ message: 'you have to be authenticated' })
	const valRes = addSpendToUserValidator({
		userId: req.user._id,
		newSpendId: req.body.newSpendId,
	})
	if (valRes) {
		return res.json({ message: 'something got wrong' })
	}
	addNewSpendToUser(req.user._id, req.body.newSpendId)
		.then((resp) => res.json({ message: 'user updated', user: resp }))
		.catch((err) => res.json(err))
})

export default router
