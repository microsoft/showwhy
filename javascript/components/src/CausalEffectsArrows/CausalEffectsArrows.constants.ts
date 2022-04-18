/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const box1 = { id: 'confounders' }

export const box2 = { id: 'outcome-determinants' }

export const box3 = { id: 'exposure' }

export const box4 = { id: 'outcome' }

export const arrows = [
	{
		start: box1.id,
		end: box3.id,
	},
	{
		start: box1.id,
		end: box4.id,
	},
	{
		start: box2.id,
		end: box4.id,
	},
	{
		start: box3.id,
		end: box4.id,
		color: 'cornflowerblue',
	},
]

export enum CausalEffectSize {
	Small = 'Small',
	Medium = 'Medium',
}
