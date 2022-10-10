/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import type { FC } from 'react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

import type { Handler1, Maybe } from '../types/primitives.js'
import type { Specification } from '../types/visualization/Specification.js'
import type { SpecificationCurveConfig } from '../types/visualization/SpecificationCurveConfig.js'
import { VegaSpecificationCurve } from './VegaSpecificationCurve.js'

export const SpecificationGraphs: FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onSpecificationsChange: (config: SpecificationCurveConfig) => void
	setSelectedSpecification: (item: Maybe<Specification>) => void
	onMouseOver: (item: Maybe<Specification>) => void
	hovered: Maybe<string>
	failedRefutationTaskIds: string[]
	specCount: Maybe<number>
	outcomeOptions: IDropdownOption[]
	selectedOutcome: string
	setSelectedOutcome: Handler1<string>
}> = memo(function SpecificationGraphs({
	data,
	config,
	vegaWindowDimensions,
	onSpecificationsChange,
	setSelectedSpecification,
	onMouseOver,
	hovered,
	failedRefutationTaskIds,
	specCount,
	outcomeOptions,
	selectedOutcome,
	setSelectedOutcome,
}) {
	const changeOutcome = useCallback(
		//eslint-disable-next-line
		(_: any, val?: IDropdownOption<any>) => {
			setSelectedOutcome(val?.key as string)
			setSelectedSpecification(undefined)
		},
		[setSelectedOutcome, setSelectedSpecification],
	)
	return (
		<>
			<DropdownContainer>
				<Dropdown
					defaultSelectedKey={selectedOutcome}
					label="Outcome"
					disabled={outcomeOptions.length <= 2}
					options={outcomeOptions}
					onChange={changeOutcome}
				/>
			</DropdownContainer>
			<VegaSpecificationCurve
				data={returnOutcomeSpecifications(selectedOutcome, data)}
				config={config}
				width={vegaWindowDimensions.width}
				height={vegaWindowDimensions.height}
				onConfigChange={onSpecificationsChange}
				onSpecificationSelect={setSelectedSpecification}
				onMouseOver={onMouseOver}
				hovered={hovered}
				outcome={selectedOutcome}
				failedRefutationTaskIds={failedRefutationTaskIds}
				totalSpecs={specCount}
			/>
		</>
	)
})

const DropdownContainer = styled.div`
	width: 300px;
`

function returnOutcomeSpecifications(outcome: string, data: Specification[]) {
	return data.filter(s => s.outcome === outcome)
}
