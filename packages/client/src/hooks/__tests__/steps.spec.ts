/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { renderHook } from '@testing-library/react-hooks'
import { useLocation } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { stepsList } from '../../data/stepsList'
import { useSelectedProject } from '../../state'
import * as steps from '../steps'
import { Pages } from '~enums'

jest.mock('../../state')
jest.mock('react-router-dom', () => {
	const originalModule = jest.requireActual('react-router-dom')
	return {
		__esModule: true,
		...originalModule,
		useLocation: jest.fn(),
	}
})

describe('stepsHooks', () => {
	it('useCurrentStep', () => {
		const expected = stepsList
			.flatMap(x => x.steps.filter(s => s.showStatus))
			.find(x => x.url === Pages.EstimateCausalEffects)
		useSelectedProject.mockReturnValue({ steps: stepsList })
		useLocation.mockReturnValue({ pathname: Pages.EstimateCausalEffects })
		const { result } = renderHook(() => steps.useCurrentStep(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		expect(response).toEqual(expected)
	})

	it('useStepsShowStatus', () => {
		const expected = stepsList.flatMap(x => x.steps.filter(s => s.showStatus))
		useSelectedProject.mockReturnValue({ steps: stepsList })
		const { result } = renderHook(() => steps.useStepsShowStatus(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		expect(response).toEqual(expected)
	})
})
