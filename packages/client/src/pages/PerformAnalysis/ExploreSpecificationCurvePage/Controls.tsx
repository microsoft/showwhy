/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, Label } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useUniqueFeatures } from './hooks'
import { Specification, SpecificationCurveConfig } from '~interfaces'
import { addOrRemoveArrayElement } from '~utils'

export interface ControlsProps {
	data: Specification[]
	config: SpecificationCurveConfig
	onChange: (config: SpecificationCurveConfig) => void
}

export const Controls: React.FC<ControlsProps> = memo(function Controls({
	data,
	config,
	onChange,
}) {
	const handleOptionChange = useCallback(
		(ev, checked) => {
			const key = ev.target.name
			const { inactiveFeatures = [] } = config
			onChange({
				...config,
				inactiveFeatures: addOrRemoveArrayElement(
					inactiveFeatures,
					key,
					!checked,
				),
			})
		},
		[config, onChange],
	)
	const options = useFeatureOptions(data, config)

	const checkboxes = useMemo(
		() =>
			options.map(opt => (
				<StyledCheckbox
					key={`feature-check-${opt.key}`}
					name={opt.key}
					checked={opt.checked}
					label={opt.key}
					onChange={handleOptionChange}
				/>
			)),
		[options, handleOptionChange],
	)

	return (
		<Container>
			<Label>Active decision features</Label>
			{checkboxes}
		</Container>
	)
})

function useFeatureOptions(
	data: Specification[],
	config: SpecificationCurveConfig,
) {
	const features = useUniqueFeatures(data)
	return useMemo(() => {
		const inactiveSet = new Set(config.inactiveFeatures)
		return (
			features.map(key => ({
				key,
				checked: !inactiveSet.has(key),
			})) || []
		)
	}, [config, features])
}

const Container = styled.div``

const StyledCheckbox = styled(Checkbox)`
	margin-bottom: 4px;
`
