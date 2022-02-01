import { RefutationType } from './RefutationType'

export interface RefutationChoice {
	key: RefutationType
	title: string
	description: string
	isSelected: boolean
	onChange: () => void
}
