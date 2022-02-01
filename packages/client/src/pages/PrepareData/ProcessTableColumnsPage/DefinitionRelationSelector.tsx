/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ContextualMenu,
	DefaultButton,
	IContextualMenuProps,
	IContextualMenuItem,
} from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'
import { ColumnRelation, ColumnRelevance, Maybe } from '~types'

type DefinitionChangeHandler = (changedRelation: ColumnRelation[]) => void
type ToggleSelectHandler = (
	evt?: { preventDefault: () => void } | undefined,
	value?: undefined | IContextualMenuItem,
) => void

interface RelevanceOption {
	name: string
	value: ColumnRelevance
}

export const DefinitionRelationSelector: React.FC<{
	relation: ColumnRelation[]
	relevance: Maybe<ColumnRelevance>
	relevanceOption: RelevanceOption
	onDefinitionChange: DefinitionChangeHandler
}> = memo(function DefinitionRelationSelector({
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

function useToggleSelect(
	relation: ColumnRelation[],
	onDefinitionChange: DefinitionChangeHandler,
): ToggleSelectHandler {
	return useCallback(
		(
			evt?: { preventDefault: () => void } | undefined,
			value?: undefined | IContextualMenuItem,
		) => {
			evt?.preventDefault()
			if (value) {
				const newValue = [
					...relation.filter(relevanceOption => relevanceOption !== value.key),
				] as ColumnRelation[]

				if (!relation.includes(value.key as ColumnRelation)) {
					newValue.push(value.key as ColumnRelation)
				}
				onDefinitionChange(newValue)
			}
		},
		[relation, onDefinitionChange],
	)
}

function useButton(
	relation: ColumnRelation[],
	relevanceOption: RelevanceOption,
) {
	return useCallback(() => {
		return relation.length
			? `Causally relevant to: ${Options.filter(o => relation.includes(o.key))
					.map(o => o.keyword)
					.join(', ')}`
			: relevanceOption.name
	}, [relation, relevanceOption.name])
}

function useDefinitionTypes(
	relation: ColumnRelation[],
	onToggleSelect: ToggleSelectHandler,
) {
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
