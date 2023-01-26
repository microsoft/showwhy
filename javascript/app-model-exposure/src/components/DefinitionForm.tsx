/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo, useState } from 'react'
import styled from 'styled-components'

import { useDimensions } from '../hooks/useDimensions.js'
import { useSetDefinitions } from '../state/definitions.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { Maybe } from '../types/primitives.js'
import { getDefinitionsByType } from '../utils/definition.js'
import { AlternativeDefinitionsForm } from './AlternativeDefinitionsForm.js'
import {
	useAddDefinition,
	useDefinitionItems,
	useEditDefinition,
	useHeaders,
	useRemoveDefinition,
} from './DefinitionForm.hooks.js'
import { DetailsList } from './DetailsList.js'

export const DefinitionForm: FC<{
	definitions: Definition[]
	definitionType: DefinitionType
}> = memo(function DefinitionForm({ definitions, definitionType }) {
	const [definitionToEdit, setDefinitionToEdit] = useState<Maybe<Definition>>()
	const shouldHavePrimary = !getDefinitionsByType(definitionType, definitions)
		.length
	const setDefinitions = useSetDefinitions()
	const addDefinition = useAddDefinition(definitions, setDefinitions)
	const removeDefinition = useRemoveDefinition(definitions, setDefinitions)
	const editDefinition = useEditDefinition(definitions, setDefinitions)

	const { items } = useDefinitionItems(
		definitions.filter((d) => d.type === definitionType),
		definitionToEdit,
		definitionType,
		removeDefinition,
		editDefinition,
		setDefinitionToEdit,
		() => setDefinitionToEdit(undefined),
	)
	const { ref, width } = useDimensions()
	const headers = useHeaders(width)

	return (
		<Container ref={ref}>
			<DetailsList headers={headers} items={items} />
			<Container>
				<TableContainer>
					<AlternativeDefinitionsForm
						shouldHavePrimary={shouldHavePrimary}
						definitionType={definitionType}
						onAdd={addDefinition}
					/>
				</TableContainer>
			</Container>
		</Container>
	)
})

const Container = styled.div``

const TableContainer = styled.div``
