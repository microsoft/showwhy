/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, FontIcon, Stack } from '@fluentui/react'
import type { Maybe, Handler, Estimator } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'
import { ActionButtons } from '~components/ActionButtons'
import { LinkCallout } from '~components/LinkCallout'
import { CardComponent } from '~components/CardComponent'

interface ExtendedEstimator extends Estimator {
	description: string
	isChecked: boolean
	isDefault?: boolean
	onChange?: (ev: unknown, checked: Maybe<boolean>) => void
	onDefaultChange?: Handler
}

export const EstimatorCard: React.FC<{
	list: ExtendedEstimator[]
	title: string
	description?: string
	isCardChecked: boolean
	onCardClick: Handler
}> = memo(function EstimatorCard({
	list,
	title,
	description,
	isCardChecked,
	onCardClick,
}) {
	return (
		<CardComponent>
			<Container>
				<SelectorContainer
					isChecked={!!isCardChecked}
					onClick={onCardClick}
					data-pw="estimator-group-selector"
				>
					<FontIcon iconName="CheckMark" />
				</SelectorContainer>
				<Div>
					<Title>{title}</Title>
					<Description>{description}</Description>
				</Div>
				<CheckBoxContainer>
					<Stack>
						{list.map((item, i) => {
							return (
								<CheckBoxWrapper
									key={item.type}
									isChecked={item.isChecked}
									data-pw={item.isChecked ? 'selected-estimator' : 'estimator'}
								>
									<Checkbox checked={item.isChecked} onChange={item.onChange} />
									<LinkCallout title={item.type} id={`estimator-card-${i}`}>
										{item.description}
									</LinkCallout>
									{item.hasOwnProperty('onDefaultChange') ? (
										<ActionButtons
											onFavorite={item.onDefaultChange}
											favoriteProps={{
												title: 'Set estimator as primary',
												isFavorite: !!item.isDefault,
											}}
										/>
									) : null}
								</CheckBoxWrapper>
							)
						})}
					</Stack>
				</CheckBoxContainer>
			</Container>
		</CardComponent>
	)
})

const Container = styled.section`
	display: grid;
	grid-template-columns: 3rem 50% auto;
	align-items: start;
	gap: 10px;
`

const Title = styled.h3`
	font-size: 1.1rem;
	font-weight: 500;
	margin: 0;
`

const Div = styled.div``

const CheckBoxContainer = styled.div`
	padding-bottom: 10px;
`

const CheckBoxWrapper = styled.div<{ isChecked: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	padding: ${({ isChecked }) => (!isChecked ? '0.4rem 0' : '0')};
`

const Description = styled.div`
	margin-top: 5px;
`

const SelectorContainer = styled.div<{ isChecked: boolean }>`
	background-color: ${({ theme, isChecked }) =>
		isChecked ? theme.application().accent : theme.application().faint};
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	font-weight: bold;
	color: white;
	cursor: pointer;
	padding: 0 10px;
`
