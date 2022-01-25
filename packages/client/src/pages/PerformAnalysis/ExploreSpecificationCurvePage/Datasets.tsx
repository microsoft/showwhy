/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

interface DatasetsProps {
	datasets: string[]
	dataset: string
	onChange: (dataset: string) => void
}

export const Datasets: React.FC<DatasetsProps> = memo(function Datasets({
	datasets,
	dataset,
	onChange,
}) {
	const options = useMemo(
		() =>
			datasets.map(d => ({
				key: d,
				text: d,
			})),
		[datasets],
	)

	const handleChange = useCallback(
		(_, item) => onChange && onChange(item.key),
		[onChange],
	)

	return (
		<Container>
			<Dropdown
				label={'Dataset'}
				options={options}
				selectedKey={dataset}
				onChange={handleChange}
			/>
		</Container>
	)
})

// TODO: this should be dictated by outer component, but styled components isn't applying it correctly
// I suspect there is a DOM structure error elsewhere that I missed
const Container = styled.div`
	width: 140px;
`
