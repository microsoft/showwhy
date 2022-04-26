/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IComboBoxOption } from '@fluentui/react'
import { TextField } from '@fluentui/react'
import { DegreeComboBox } from '@showwhy/components'
import type { FlatCausalFactor } from '@showwhy/types'
import { CausalFactorType } from '@showwhy/types'
import { useMemo } from 'react'

export function useItems(
	flatFactorsList: FlatCausalFactor[],
	onChangeCauses: (
		selected: IComboBoxOption,
		type: CausalFactorType,
		id?: string,
	) => void,
	onChangeReasoning: (id: string, newText: string) => void,
): Record<string, any>[] {
	return useMemo((): Record<string, any>[] => {
		return flatFactorsList.map((factor: FlatCausalFactor, index: number) => {
			return {
				variable: factor.variable,
				[CausalFactorType.CauseExposure]: (
					<DegreeComboBox
						onChangeDegree={onChangeCauses}
						degree={factor[CausalFactorType.CauseExposure]}
						type={CausalFactorType.CauseExposure}
						id={factor.id}
					/>
				),
				[CausalFactorType.CauseOutcome]: (
					<DegreeComboBox
						onChangeDegree={onChangeCauses}
						degree={factor[CausalFactorType.CauseOutcome]}
						type={CausalFactorType.CauseOutcome}
						id={factor.id}
					/>
				),
				reasoning: (
					<TextField
						value={factor.reasoning}
						onChange={(_, val) => onChangeReasoning(factor.id, val || '')}
						multiline={factor.reasoning.length > 30}
						resizable={false}
					/>
				),
				dataPw: `factor-${index}`,
			}
		})
	}, [flatFactorsList, onChangeCauses, onChangeReasoning])
}
