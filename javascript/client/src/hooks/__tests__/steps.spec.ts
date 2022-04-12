/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'

import type { Workflow } from '~types'
import { Pages } from '~types'

import { stepsList } from '../../data/stepsList'
import * as steps from '../steps'

describe('stepsHooks', () => {
	it('useCurrentStep', () => {
		const expected = stepsList
			.flatMap(x => x.steps)
			.find(x => x.url === Pages.AlternativeDefinitions)

		const { result } = renderHook(
			() =>
				steps.useCurrentStepTestable(
					{ steps: stepsList } as any as Workflow,
					Pages.AlternativeDefinitions,
				),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		expect(response).toEqual(expected)
	})
})
