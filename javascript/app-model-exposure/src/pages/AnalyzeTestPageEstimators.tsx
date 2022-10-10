/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback } from 'react'

import { EstimatorCard } from '../components/EstimatorCard.js'
import { Title } from '../components/styles.js'
import { useOnConfounderThresholdChange } from '../hooks/useOnConfounderThresholdChange.js'
import { useConfounderThreshold } from '../state/confounderThreshold.js'
import { useEstimators, useSetEstimators } from '../state/estimators.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import { useEstimatorOptions } from './AnalyzeTestPage.hooks.js'
import { Box, PageSection } from './AnalyzeTestPage.styles.js'

export const AnalyzeTestPageEstimators: React.FC = memo(
	function AnalyzeTestPageEstimators() {
		const estimators = useEstimators()
		const setEstimators = useSetEstimators()
		const confounderThreshold = useConfounderThreshold()
		const estimatorOptions = useEstimatorOptions(estimators)
		const onConfounderThresholdChange = useOnConfounderThresholdChange()

		const onUpdateEstimatorParams = useCallback(
			(estimators: Estimator[]) => {
				setEstimators(prev => {
					return prev.map(e => {
						const changed = estimators.find(a => e.type === a.type)
						return changed
							? {
									...e,
									...changed,
							  }
							: e
					})
				})
			},
			[setEstimators],
		)

		return (
			<PageSection>
				<Box>
					<Title style={{ fontSize: '18px' }}>Estimator definitions</Title>
					{estimatorOptions.map(card => (
						<EstimatorCard
							key={card.key}
							title={card.title}
							description={card.description}
							list={card.list}
							confounderThreshold={confounderThreshold}
							onConfounderThresholdChange={onConfounderThresholdChange}
							onUpdateEstimatorParams={onUpdateEstimatorParams}
						/>
					))}
				</Box>
			</PageSection>
		)
	},
)
