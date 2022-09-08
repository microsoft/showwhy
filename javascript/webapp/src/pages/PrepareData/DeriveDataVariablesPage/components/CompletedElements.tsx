/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ActionButton,
	Callout,
	DefaultButton,
	DirectionalHint,
	Icon,
	TooltipDelay,
	TooltipHost,
} from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import type {
	CausalFactor,
	Definition,
	FactorsOrDefinitions,
	Handler1,
	Maybe,
} from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import type { FC } from 'react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { useOutputTable } from '~hooks'
import { isFullDatasetPopulation } from '~utils'

interface Props {
	completedElements: number
	allElements: FactorsOrDefinitions
	onResetVariable: (columnName: string) => void
	subjectIdentifier: Maybe<string>
	onSetSubjectIdentifier: Handler1<Maybe<string>>
	onAssignAllSubjects: (definitionId: string) => void
}

interface ListElement {
	key: string
	variable: string
	isComplete: boolean
	notInOutput?: boolean
	icon: string
	button?: JSX.Element
	onClick: Maybe<() => void>
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
	const elements = useMemo((): any => {
		return allElements.length + 1
	}, [allElements])

	const list = useList(
		subjectIdentifier,
		allElements,
		onResetVariable,
		onSetSubjectIdentifier,
		onAssignAllSubjects,
		outputTableColumns,
	)

	const showWarning = useMemo(() => list.some(i => i.notInOutput), [list])

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
					target={`#${buttonId}`}
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
					isComplete = false,
					notInOutput = false,
					button,
				} = item
				const tooltipId = notInOutput ? key : undefined
				return (
					<TooltipHost
						key={key}
						content={getTooltipContent(notInOutput, !isComplete)}
						delay={TooltipDelay.zero}
						id={tooltipId}
					>
						<Li
							isComplete={isComplete}
							notInOutput={notInOutput}
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
	allElements: FactorsOrDefinitions,
	onResetVariable: (columnName: string) => void,
	onSetSubjectIdentifier: Handler1<Maybe<string>>,
	onAssignAllSubjects: (definitionId: string) => void,
	outputTableColumns: string[] = [],
): ListElement[] {
	return useMemo((): any => {
		const isInOutput = !!subjectIdentifier
			? outputTableColumns.includes(subjectIdentifier)
			: true

		const isComplete = !!subjectIdentifier

		const notInOutput = isComplete && !isInOutput

		const all: ListElement[] = [
			{
				variable: `Subject identifier${
					subjectIdentifier ? `: ${subjectIdentifier}` : ''
				}`,
				key: 'Subject identifier',
				isComplete: isComplete,
				notInOutput,
				icon: !isInOutput
					? 'Warning'
					: isComplete
					? 'SkypeCircleCheck'
					: 'SkypeCircleMinus',
				onClick: () => onSetSubjectIdentifier(subjectIdentifier),
			},
		]

		allElements.forEach(element => {
			const isComplete = isElementComplete(element, allElements)
			const isInOutput = isElementInOutputTable(element, outputTableColumns)
			const notInOutput = isComplete && !isInOutput
			const _element = {
				variable: element.variable,
				key: element.id,
				isComplete,
				notInOutput,
				icon: notInOutput
					? 'Warning'
					: isComplete
					? 'SkypeCircleCheck'
					: 'SkypeCircleMinus',
				button:
					element.type === DefinitionType.Population && !isComplete ? (
						<AssignAllSubjectsButton
							iconProps={{ iconName: 'Add' }}
							allowDisabledFocus
							onClick={() => onAssignAllSubjects(element.id)}
						>
							Assign all subjects
						</AssignAllSubjectsButton>
					) : undefined,
				onClick: isComplete
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
	allElements: FactorsOrDefinitions,
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

function getTooltipContent(notInOutput: boolean, notAssigned: boolean): string {
	if (notInOutput) {
		return 'This variable is selected but is not in the output table. Please, click on it to unselect it or add the table.'
	} else if (notAssigned) {
		return 'This variable has not been assigned to a column. Assign it to a column of the output table or delete it.'
	}
	return ''
}

const CalloutStyles = {
	calloutMain: {
		display: 'grid',
		gridTemplateColumns: '1fr auto',
		gap: '1rem',
		padding: '0.5rem',
		maxWidth: '40vw',
		minWidth: '20vw',
	},
}

const Container = styled.section`
	padding: 0 8px;
	margin: 12px 8px 0;
	position: absolute;
	right: 0;
	z-index: 1;
`

const AssignAllSubjectsButton = styled(ActionButton)``

const Ul = styled.ul`
	list-style: none;
	padding: 0.5rem;
	border-radius: 3px;
	margin: 0;
`

const Li = styled.li<{ isComplete: boolean; notInOutput: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0 0 0.5rem 0;
	color: ${({ theme, isComplete, notInOutput }) =>
		notInOutput
			? theme.application().warning
			: isComplete
			? theme.application().accent()
			: theme.application().foreground()};
	cursor: ${({ isComplete }) => (isComplete ? 'pointer' : 'default')};
`
