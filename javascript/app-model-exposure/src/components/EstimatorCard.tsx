/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'
import { Checkbox, ChoiceGroup, SpinButton, Stack } from '@fluentui/react'
import { CardComponent } from '@showwhy/app-common'
import { useDebounceFn } from 'ahooks'
import uniqueId from 'lodash/uniqueId.js'
import type { FormEvent } from 'react'
import { memo, useState } from 'react'

import {
	CONFIDENCE_INTERVAL_HELP_TEXT,
	COVARIATE_HELP_TEXT,
	ESTIMATORS_HAVE_COVARIATE,
	REFUTATION_HELP_TEXT,
} from '../pages/AnalyzeTestPage.constants.js'
import type { EstimatorOption } from '../pages/AnalyzeTestPage.types.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import { ActionButtons } from './ActionButtons.js'
import { InfoCallout } from './CalloutInfo.js'
import { LinkCallout } from './CalloutLink.js'
import {
	CheckBoxWrapper,
	ConfigContainer,
	Container,
	Description,
	Div,
	SpinnerContainer,
} from './EstimatorCard.styles.js'
import { ContainerFlexRow, Text, Title } from './styles.js'
/* eslint-disable */

export const EstimatorCard: React.FC<{
	list: EstimatorOption[]
	title: string
	description?: string
	confounderThreshold?: number
	onConfounderThresholdChange: (
		ev?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
		option?: IChoiceGroupOption | undefined,
	) => void
	onUpdateEstimatorParams: (estimators: Estimator[]) => void
}> = memo(function EstimatorCard({
	list,
	title,
	description,
	confounderThreshold,
	onConfounderThresholdChange,
	onUpdateEstimatorParams,
}) {
	const [refutations, setRefutations] = useState(
		list.find(v => v.checked)?.refutations?.toString() || '10',
	)

	const debouncedChange = useDebounceFn(
		(val: string) => {
			onUpdateEstimatorParams(
				list
					.filter(v => v.checked)
					.map(a => {
						return {
							type: a.type,
							group: a.group,
							refutations: +val,
						} as Estimator
					}),
			)
		},
		{
			wait: 500,
		},
	)

	return (
		<CardComponent styles={{ marginLeft: 'unset' }} noShaddow>
			<Container>
				<Div>
					<Title noMarginTop>{title}</Title>
					<Description>{description}</Description>
					<Stack style={{ paddingTop: '10px' }}>
						{list.map(item => {
							return (
								<CheckBoxWrapper
									key={item.type}
									data-pw={item.checked ? 'selected-estimator' : 'estimator'}
								>
									<Checkbox
										checked={item.checked}
										onChange={() => item.onChange(refutations)}
									/>
									<LinkCallout
										title={item.type}
										id={`estimator-card-${uniqueId()}`}
									>
										{item.description}
									</LinkCallout>
									{item.hasOwnProperty('onDefaultChange') ? (
										<ActionButtons
											onFavorite={item.onDefaultChange}
											favoriteProps={{
												title: 'Set estimator as primary',
												isFavorite: !!item.default,
											}}
										/>
									) : null}
								</CheckBoxWrapper>
							)
						})}
					</Stack>
				</Div>
				<Div>
					<ContainerFlexRow style={{ alignItems: 'end' }}>
						<Title noMarginTop>Refutation simulations</Title>
						<InfoCallout id={'refutation' + uniqueId().toString()}>
							<Text>{REFUTATION_HELP_TEXT}</Text>
						</InfoCallout>
					</ContainerFlexRow>
					<ConfigContainer>
						<SpinnerContainer>
							<SpinButton
								value={refutations}
								disabled={!list.some(e => e.checked)}
								min={1}
								step={1}
								onChange={(_, val) => {
									setRefutations(val as string)
									debouncedChange.run(val as string)
								}}
								incrementButtonAriaLabel="Increase value by 1"
								decrementButtonAriaLabel="Decrease value by 1"
							/>
						</SpinnerContainer>
					</ConfigContainer>
					<ContainerFlexRow style={{ alignItems: 'end' }}>
						<Title>Confidence intervals</Title>
						<InfoCallout id={'confidence' + uniqueId().toString()}>
							<Text>{CONFIDENCE_INTERVAL_HELP_TEXT}</Text>
						</InfoCallout>
					</ContainerFlexRow>

					<ConfigContainer>
						<Checkbox
							disabled={!list.some(e => e.checked)}
							label="Compute confidence intervals"
							checked={list.some(e => e.confidenceInterval)}
							onChange={(e, val) => {
								onUpdateEstimatorParams(
									list
										.filter(v => v.checked)
										.map(a => {
											return {
												type: a.type,
												confidenceInterval: val,
											} as Estimator
										}),
								)
							}}
						/>
					</ConfigContainer>
				</Div>
				{ESTIMATORS_HAVE_COVARIATE.includes(list[0].type) && (
					<Div>
						<ContainerFlexRow style={{ alignItems: 'end' }}>
							<Title noMarginTop>Covariate imbalance threshold</Title>
							<InfoCallout id={'confidence' + uniqueId().toString()}>
								<Text>{COVARIATE_HELP_TEXT}</Text>
							</InfoCallout>
						</ContainerFlexRow>
						<ChoiceGroup
							disabled={!list.some(e => e.checked)}
							selectedKey={confounderThreshold?.toString()}
							onChange={onConfounderThresholdChange}
							options={[
								{ key: '15', text: 'Sensitive (15%)' },
								{ key: '10', text: 'Medium (10%)' },
								{ key: '5', text: 'Highly Sensitive (5%)' },
							]}
						></ChoiceGroup>
					</Div>
				)}
			</Container>
		</CardComponent>
	)
})
