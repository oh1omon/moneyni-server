// import bcrypt from 'bcrypt'

// const perkele = async (uncheckedData: Record<string, unknown>) => {
// 	const acc: Record<string, unknown> = {}
// 	for (const k in uncheckedData) {
// 		//this part is working with spends property
// 		if (uncheckedData['spends'] && k === 'spends') {
// 			acc.$push = { spends: uncheckedData[k] }
// 			continue
// 		}

// 		//This function crypting password
// 		if (uncheckedData['password'] && k === 'password') {
// 			const password = await bcrypt.hash(uncheckedData[k], 10)
// 			acc[k] = password
// 			continue
// 		}

// 		//All other properties will be added, excluding id
// 		if (uncheckedData[k] && k !== 'id') {
// 			acc[k] = uncheckedData[k]
// 		}
// 	}

// 	return acc
// }

// perkele({ id1: 'sd', password: 'zhopa' }).then((r) => console.log(r))

// class Zhopa {
// 	state: {
// 		i: unknown
// 		p: unknown
// 	}
// 	constructor({ i, p }: any) {
// 		this.state = { i, p }
// 	}

// 	show() {
// 		console.log(this.state)
// 	}
// }

// const zhopa = new Zhopa({ i: 'string', p: 'loh' })

// zhopa.show()
