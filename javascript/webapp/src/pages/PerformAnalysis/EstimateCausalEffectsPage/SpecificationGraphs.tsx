/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import type { IDropdownOption } from '@fluentui/react';
import { Dropdown } from '@fluentui/react'
import type {
	Handler1,
	Maybe,
	Specification,
	SpecificationCurveConfig,
} from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { VegaSpecificationCurve } from './vega/VegaSpecificationCurve'

export const SpecificationGraphs: FC<{
	data: Specification[]
	config: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onSpecificationsChange: (config: SpecificationCurveConfig) => void
	setSelectedSpecification: (item: Maybe<Specification>) => void
	onMouseOver: (item: Maybe<Specification>) => void
	hovered: Maybe<number>
	failedRefutationIds: string[]
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
	failedRefutationIds,
	specCount,
	outcomeOptions,
	selectedOutcome,
	setSelectedOutcome,
}) {
	return (
		<>
			<DropdownContainer>
				<Dropdown
					defaultSelectedKey={selectedOutcome}
					label="Outcome"
					disabled={outcomeOptions.length <= 2}
					options={outcomeOptions}
					onChange={(_, val) => setSelectedOutcome(val?.key as string)}
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
				failedRefutationIds={failedRefutationIds}
				totalSpecs={specCount}
			/>
		</>
	)
})

const DropdownContainer = styled.div`
	width: 300px;
`

function returnOutcomeSpecifications(outcome: string, data: Specification[]) {
	return data
		.filter(s => s.outcome === outcome)
		.map((x, i) => ({ ...x, index: i + 1 }))
}
