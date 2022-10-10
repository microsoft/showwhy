/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Callout,
	DefaultButton,
	DirectionalHint,
	Icon,
	TooltipDelay,
	TooltipHost,
} from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import type { FC } from 'react'
import { memo, useMemo } from 'react'

import { useOutputTable } from '../hooks/useOutputTable.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Definition } from '../types/experiments/Definition.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { Handler1, Maybe } from '../types/primitives.js'
import { isFullDatasetPopulation } from '../utils/definition.js'
import {
	AssignAllSubjectsButton,
	CalloutStyles,
	Li,
	Ul,
} from './CompletedElements.style.js'
import { Container } from './styles.js'

interface Props {
	completedElements: number
	allElements: CausalFactor[] | Definition[]
	onResetVariable: (columnName: string) => void
	subjectIdentifier: Maybe<string>
	onSetSubjectIdentifier: Handler1<Maybe<string>>

	onAssignAllSubjects: (definitionId: string) => void
}

interface ListElement {
	key: string
	variable: string
	complete: boolean
	missing?: boolean
	icon: string
	onClick: Maybe<() => void>
	button?: JSX.Element
}

export const CompletedElements: FC<Props> = memo(function CompletedElements({
	completedElements,
	allElements,
	onResetVariable,
	subjectIdentifier,
	onSetSubjectIdentifier,
	onAssignAllSubjects,
}) {
	const outputTable = useOutputTable()
	const outputTableColumns = useMemo(
		() => outputTable?.columnNames(),
		[outputTable],
	)
	const [isVisible, { toggle }] = useBoolean(false)
	const buttonId = useId('callout-button')
	const elements = useMemo((): number => allElements.length + 1, [allElements])

	const list = useList(
		subjectIdentifier,
		allElements,
		onResetVariable,
		onSetSubjectIdentifier,
		outputTableColumns,
		onAssignAllSubjects,
	)

	const showWarning = useMemo(() => list.some(i => i.missing), [list])

	return (
		<Container>
			<DefaultButton id={buttonId} onClick={toggle}>
				{showWarning ? <Icon iconName="Warning" /> : null}
				{isVisible ? 'Hide' : 'Show'} Assigned Variables {completedElements}/
				{elements}
			</DefaultButton>
			{isVisible ? (
				<Callout
					gapSpace={2}
					target={`#${buttonId as string}`}
					isBeakVisible={false}
					onDismiss={toggle}
					directionalHint={DirectionalHint.bottomAutoEdge}
					setInitialFocus
					styles={CalloutStyles}
				>
					<List list={list} />
				</Callout>
			) : null}
		</Container>
	)
})

const List: FC<{ list: ListElement[] }> = memo(function ListItem({ list }) {
	return list.length ? (
		<Ul>
			{list.map(item => {
				const {
					icon,
					variable,
					onClick,
					key,
					complete = false,
					missing = false,
					button,
				} = item
				const tooltipId = missing ? key : undefined
				return (
					<TooltipHost
						key={key}
						content={getTooltipContent(missing, !complete)}
						delay={TooltipDelay.zero}
						id={tooltipId}
					>
						<Li
							complete={complete}
							missing={missing}
							onClick={onClick}
							aria-describedby={tooltipId}
						>
							{icon ? <Icon iconName={icon} /> : null}
							{variable}
							{button && button}
						</Li>
					</TooltipHost>
				)
			})}
		</Ul>
	) : null
})

function useList(
	subjectIdentifier: Maybe<string>,
	allElements: CausalFactor[] | Definition[],
	onResetVariable: (columnName: string) => void,
	onSetSubjectIdentifier: Handler1<Maybe<string>>,
	outputTableColumns: string[] = [],
	onAssignAllSubjects: (definitionId: string) => void,
): ListElement[] {
	return useMemo((): ListElement[] => {
		const all: ListElement[] = [
			{
				variable: `Subject identifier${
					subjectIdentifier ? `: ${subjectIdentifier}` : ''
				}`,
				key: 'Subject identifier',
				complete: !!subjectIdentifier,
				icon: subjectIdentifier ? 'SkypeCircleCheck' : 'SkypeCircleMinus',
				onClick: () => onSetSubjectIdentifier(subjectIdentifier),
			},
		]

		allElements.forEach(element => {
			const complete = isElementComplete(element, allElements)
			const isInOutput = isElementInOutputTable(element, outputTableColumns)
			const missing = complete && !isInOutput
			const showAllSubjectsButton = isElementAllSubjectsCandidate(
				element,
				complete,
			)

			const _element = {
				variable: element.variable,
				key: element.variable + element.variable,
				complete,
				missing,
				icon: missing
					? 'Warning'
					: complete
					? 'SkypeCircleCheck'
					: 'SkypeCircleMinus',
				button: showAllSubjectsButton ? (
					<AssignAllSubjectsButton
						iconProps={{ iconName: complete ? undefined : 'Add' }}
						allowDisabledFocus
						disabled={complete}
						onClick={() => onAssignAllSubjects(element.id)}
					>
						{complete ? 'All subjects assigned' : 'Assign all subjects'}
					</AssignAllSubjectsButton>
				) : undefined,
				onClick: complete
					? () => onResetVariable(element.column || '')
					: undefined,
			}
			all.push(_element)
		})
		return all
	}, [
		subjectIdentifier,
		allElements,
		onResetVariable,
		onSetSubjectIdentifier,
		outputTableColumns,
		onAssignAllSubjects,
	])
}

function isElementComplete(
	element: CausalFactor | Definition,
	allElements: CausalFactor[] | Definition[],
) {
	const found = allElements?.find(
		(x: CausalFactor | Definition) => x.id === element.id,
	)
	return !!found?.column
}

function isElementInOutputTable(
	element: CausalFactor | Definition,
	outputTableColumns: string[],
) {
	return !!(
		element.column &&
		(isFullDatasetPopulation(element) ||
			outputTableColumns.includes(element.column))
	)
}

function isElementAllSubjectsCandidate(
	element: CausalFactor | Definition,
	complete: boolean,
) {
	return (
		element.type === DefinitionType.Population &&
		(!complete || isFullDatasetPopulation(element))
	)
}

function getTooltipContent(missing: boolean, notAssigned: boolean): string {
	if (missing) {
		return 'This variable is selected but is not in the output table. Please, click on it to unselect it or add the table.'
	} else if (notAssigned) {
		return 'This variable has not been assigned to a column. Assign it to a column of the output table or delete it.'
	}
	return ''
}
