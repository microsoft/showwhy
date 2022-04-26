/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Callout, DefaultButton, DirectionalHint, Icon } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import type {
	CausalFactor,
	Definition,
	FactorsOrDefinitions,
	Handler1,
	Maybe,
} from '@showwhy/types'
import type { FC } from 'react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

interface Props {
	completedElements: number
	allElements: FactorsOrDefinitions
	onResetVariable: (columnName: string) => void
	subjectIdentifier: Maybe<string>
	onSetSubjectIdentifier: Handler1<Maybe<string>>
}

interface ListElement {
	key: string
	variable: string
	isComplete: boolean
	icon: string
	onClick: Maybe<() => void>
}

export const CompletedElements: FC<Props> = memo(function CompletedElements({
	completedElements,
	allElements,
	onResetVariable,
	subjectIdentifier,
	onSetSubjectIdentifier,
}) {
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
	)

	return (
		<Container>
			<DefaultButton id={buttonId} onClick={toggle}>
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
				const { icon, variable, onClick, key, isComplete = false } = item
				return (
					<Li key={key} isComplete={isComplete} onClick={onClick}>
						{icon ? <Icon iconName={icon} /> : null}
						{variable}
					</Li>
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
) {
	return useMemo((): any => {
		const all: ListElement[] = [
			{
				variable: `Subject identifier${
					subjectIdentifier ? `: ${subjectIdentifier}` : ''
				}`,
				key: 'Subject identifier',
				isComplete: !!subjectIdentifier,
				icon: !!subjectIdentifier ? 'SkypeCircleCheck' : 'SkypeCircleMinus',
				onClick: () => onSetSubjectIdentifier(subjectIdentifier),
			},
		]

		allElements.forEach(element => {
			const isComplete = isElementComplete(element, allElements)
			const _element = {
				variable: element.variable,
				key: element.id,
				isComplete,
				icon: isComplete ? 'SkypeCircleCheck' : 'SkypeCircleMinus',
				onClick: isComplete
					? () => onResetVariable(element.column || '')
					: undefined,
			}
			all.push(_element)
		})
		return all
	}, [subjectIdentifier, allElements, onResetVariable, onSetSubjectIdentifier])
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

const Ul = styled.ul`
	list-style: none;
	padding: 0.5rem;
	border-radius: 3px;
	margin: 0;
`

const Li = styled.li<{ isComplete: boolean }>`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0 0 0.5rem 0;
	color: ${({ theme, isComplete }) =>
		isComplete
			? theme.application().accent()
			: theme.application().foreground()};
	cursor: ${({ isComplete }) => (isComplete ? 'pointer' : 'default')};
`
