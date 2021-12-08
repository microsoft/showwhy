/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { round } from './util'
import { RefutationOptionsCallout } from '~components/RefutationOptionsCallout'
import { RefutationTestMethodString } from '~enums'
import {
	RefutationOption,
	Specification,
	SpecificationCurveConfig,
} from '~interfaces'
import { addS } from '~utils'

export interface SpecificationDescriptionProps {
	specification?: Specification
	emptyText?: string
	onConfigChange: any
	config: SpecificationCurveConfig
	refutationOptions: RefutationOption[]
}

export const SpecificationDescription: React.FC<SpecificationDescriptionProps> =
	memo(function SpecificationDescription({
		specification,
		emptyText = '',
		onConfigChange,
		config,
		refutationOptions,
	}) {
		const refutationFailedNumber = useMemo((): any => {
			if (specification) {
				const keys = Object.keys(specification).filter(x =>
					x.startsWith('refuter'),
				)

				return keys.reduce(function (failed, actualKey) {
					return specification[actualKey] === 0 ? failed + 1 : failed
				}, 0)
			}
			return 0
		}, [specification])

		const refutationNumbers = useMemo((): string => {
			if (specification) {
				const keys = Object.keys(specification).filter(x =>
					x.startsWith('refuter'),
				)
				const success = keys.reduce(function (success, actualKey) {
					return specification[actualKey] === 1 ? success + 1 : success
				}, 0)

				return success + '/' + (success + refutationFailedNumber)
			}
			return ''
		}, [specification, refutationFailedNumber])

		const refutationFailed = useMemo((): (JSX.Element | undefined)[] | null => {
			if (specification) {
				const keys = Object.keys(specification).filter(x =>
					x.startsWith('refuter'),
				)
				let hasAlready = 0
				return keys.map((actualKey, index) => {
					if (specification[actualKey] === 0) {
						const fact = (
							<RefutationOptionsCallout
								key={index}
								calloutKey={index}
								title={RefutationTestMethodString[actualKey]}
								refutationOptions={refutationOptions}
								separate={hasAlready > 0}
							/>
						)
						hasAlready = 1
						return fact
					}
				})
			}
			return null
		}, [specification, refutationOptions, refutationFailedNumber])

		const isSpecificationOn = useMemo(() => {
			if (!specification || !config.inactiveSpecifications) {
				return
			}
			return !config.inactiveSpecifications.find(x => x === specification?.id)
		}, [config, specification])

		const refutationValue = useMemo((): any => {
			return (
				<span>
					This estimate passed <Value>{refutationNumbers}</Value> refutations
					{refutationFailedNumber > 0
						? `, failing on the following test${addS(refutationFailedNumber)}: `
						: ''}
					{refutationFailed}.
				</span>
			)
		}, [refutationNumbers, refutationFailed, refutationFailedNumber])

		const refutationNull = useMemo(
			() => (
				<span>
					This estimate has not been validated against refutation tests.
				</span>
			),
			[],
		)

		const boundValues = useMemo((): string => {
			if (!specification?.c95Lower && !specification?.c95Upper) {
				return ''
			}

			return `
			(95% Confidence Interval  = [${round(specification?.c95Lower as number, 3)}, 
				${round(specification?.c95Upper as number, 3)}])`
		}, [specification])

		const toggleRejectEstimate = useCallback(() => {
			const { inactiveSpecifications = [] } = config
			if (specification) {
				const newInactive = inactiveSpecifications.filter(
					s => s !== specification?.id,
				)

				if (isSpecificationOn) {
					newInactive.push(specification.id)
				}
				onConfigChange({
					...config,
					inactiveSpecifications: newInactive,
				})
			}
		}, [specification, config, onConfigChange, isSpecificationOn])

		return (
			<Container>
				{specification ? (
					<div>
						<p>
							Specification
							<Value>{specification.id}</Value>uses a
							<Value>{specification.causalModel}</Value>
							causal model and a<Value>{specification.estimator}</Value>
							estimator. The estimated effect of exposure{' '}
							<Value>{specification.treatment}</Value> for population
							<Value>{specification.population}</Value>
							is
							<Effect>{round(specification.estimatedEffect, 3)}</Effect>
							{boundValues}.{' '}
							{refutationNumbers === '0/0' ? refutationNull : refutationValue}
						</p>

						<ToggleButton onClick={toggleRejectEstimate}>
							{isSpecificationOn ? 'Reject estimate' : 'Accept estimate'}
						</ToggleButton>
					</div>
				) : (
					<p>{emptyText}</p>
				)}
			</Container>
		)
	})

const Container = styled.div``

const ToggleButton = styled(DefaultButton)`
	min-width: 144px;
`

const Value = styled.span`
	font-weight: bold;
	&:before {
		content: ' ';
	}
	&:after {
		content: ' ';
	}
	color: ${({ theme }) => theme.application().midContrast().hex()};
`

const Effect = styled(Value)`
	&:after {
		content: '';
	}
	color: ${({ theme }) => theme.application().accent().hex()};
`
