/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ContextualMenu,
	DefaultButton,
	IContextualMenuProps,
} from '@fluentui/react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'
import { ColumnRelation, ColumnRelevance } from '~enums'

interface DefinitionRelationSelectorProps {
	relation: ColumnRelation[]
	relevance: ColumnRelevance | undefined
	relevanceOption: { name: string; value: ColumnRelevance }
	onDefinitionChange: (changedRelation: ColumnRelation[]) => void
}

export const DefinitionRelationSelector: React.FC<DefinitionRelationSelectorProps> =
	memo(function DefinitionRelationSelector({
		relation,
		relevance,
		relevanceOption,
		onDefinitionChange,
	}) {
		const buttonTitle = useButton(relation, relevanceOption)

		const onToggleSelect = useToggleSelect(relation, onDefinitionChange)

		const DefinitionTypes = useDefinitionTypes(relation, onToggleSelect)

		const menuProps: IContextualMenuProps = {
			items: DefinitionTypes,
			shouldFocusOnMount: true,
		}

		return (
			<DefinitionButton
				text={buttonTitle()}
				checked={relevance === relevanceOption.value}
				menuProps={menuProps}
				menuAs={_getMenu}
				allowDisabledFocus
			/>
		)
	})

const useToggleSelect = (relation, onDefinitionChange) => {
	return useCallback(
		(evt, value) => {
			evt.preventDefault()
			const newValue = [
				...relation.filter(relevanceOption => relevanceOption !== value.key),
			] as ColumnRelation[]

			if (!relation.includes(value.key)) {
				newValue.push(value.key)
			}
			onDefinitionChange(newValue)
		},
		[relation, onDefinitionChange],
	)
}

const useButton = (relation, relevanceOption) => {
	return useCallback(() => {
		return relation.length
			? `Causally relevant to: ${Options.filter(o => relation.includes(o.key))
					.map(o => o.keyword)
					.join(', ')}`
			: relevanceOption.name
	}, [relation, relevanceOption.name])
}

const useDefinitionTypes = (relation, onToggleSelect) => {
	return Options.map(opt => {
		return {
			key: opt.key.toString(),
			text: opt.text,
			isChecked: relation.filter(x => x === opt.key).length,
			onClick: onToggleSelect,
			canCheck: true,
		}
	})
}

const Options = [
	{
		text: 'Related to population definition',
		key: ColumnRelation.PopulationDefinition,
		keyword: 'population',
	},
	{
		text: 'Related to exposure definition',
		key: ColumnRelation.ExposureDefinition,
		keyword: 'exposure',
	},
	{
		text: 'Related to outcome definition',
		key: ColumnRelation.OutcomeDefinition,
		keyword: 'outcome',
	},
	{
		text: 'Related to control definition',
		key: ColumnRelation.ControlDefinition,
		keyword: 'control',
	},
]

const DefinitionButton = styled(DefaultButton)`
	width: 100%;
	margin-bottom: 8px;
`

function _getMenu(props: IContextualMenuProps): JSX.Element {
	return <ContextualMenu {...props} />
}
