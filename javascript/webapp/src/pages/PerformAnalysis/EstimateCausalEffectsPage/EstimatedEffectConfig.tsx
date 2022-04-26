/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle } from '@fluentui/react'
import { ContainerFlexColumn } from '@showwhy/components'
import type { Handler1, SpecificationCurveConfig } from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

export const EstimatedEffectConfig: FC<{
	isConfidenceIntervalDisabled: boolean
	isShapDisabled: boolean
	config: SpecificationCurveConfig
	handleConfidenceIntervalTicksChange: Handler1<boolean>
	handleShapTicksChange: Handler1<boolean>
}> = memo(function EstimatedEffectConfig({
	isConfidenceIntervalDisabled,
	isShapDisabled,
	config,
	handleConfidenceIntervalTicksChange,
	handleShapTicksChange,
}) {
	return (
		<ContainerFlexColumn marginTop>
			<ToggleComponent
				inlineLabel
				label="Confidence interval"
				title={
					isConfidenceIntervalDisabled
						? 'Confidence interval ticks are not enabled for this run'
						: 'Enable confidence interval ticks'
				}
				checked={config.confidenceIntervalTicks}
				disabled={isConfidenceIntervalDisabled}
				onChange={(_, checked) =>
					handleConfidenceIntervalTicksChange(!!checked)
				}
			/>
			<ToggleComponent
				disabled={isShapDisabled}
				label="Element contribution"
				title={
					isShapDisabled
						? 'Shap ticks are not available while active run is processing'
						: 'Enable shap ticks'
				}
				checked={config.shapTicks}
				onChange={(_, checked) => handleShapTicksChange(!!checked)}
			/>
		</ContainerFlexColumn>
	)
})

const ToggleComponent = styled(Toggle)`
	margin-right: 24px;
	margin-bottom: unset;
	label {
		font-size: 13px;
	}
`