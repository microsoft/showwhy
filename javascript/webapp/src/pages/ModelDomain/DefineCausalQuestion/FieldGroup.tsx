/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import { Container, ContainerFlexRow, Title } from '@showwhy/components'
import type { Element, Maybe } from '@showwhy/types'
import { upperFirst } from 'lodash'
import { memo } from 'react'
import styled from 'styled-components'

export const FieldGroup: React.FC<{
	type: string
	question?: Element
	onChange: (value: Maybe<string>, type: string, field: string) => void
}> = memo(function FieldGroup({ type, question, onChange }) {
	return (
		<Container data-pw="field-group">
			<Title data-pw="field-group-title">{upperFirst(type)}</Title>
			<ContainerFlexRow justifyContent="space-between">
				<HalfField
					value={question?.label}
					onChange={(_, value) => onChange(value, type, 'label')}
					label="Label"
					placeholder={`Enter short label describing the ${type} of interestâ€‹`}
					data-pw="field-group-label"
					id={`${type.toLowerCase()}-label`}
				/>
				<HalfField
					value={question?.dataset}
					onChange={(_, value) => onChange(value, type, 'dataset')}
					label="Dataset"
					placeholder="Dataset name"
					data-pw="field-group-dataset"
					id={`${type.toLowerCase()}-dataset`}
				/>
			</ContainerFlexRow>

			<TextField
				value={question?.description}
				rows={3}
				onChange={(_, value) => onChange(value, type, 'description')}
				label="Description"
				placeholder={`Enter full description of the ${type} of interestâ€‹`}
				multiline
				data-pw="field-group-description"
				id={`${type.toLowerCase()}-description`}
			/>
		</Container>
	)
})

const HalfField = styled(TextField)`
	width: 49%;
`
