import { Response, Router } from 'express'
import { addNewSpend, addNewSpendToUser, getSpendsById } from '../services/database'
import Validator from '../services/validator'
import { Request } from '../types'

const router = Router()

router.get('/', (req: Request, res: Response) => {
	const valRes = Validator.getSpendsValidator(req.body.spends)
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
	const valRes = Validator.addSpendValidator(req.body)
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
	const valRes = Validator.addSpendToUserValidator({
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
