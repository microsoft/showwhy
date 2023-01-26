/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-restricted-globals */
import { agg, fromArrow, op } from 'arquero'

addEventListener('message', (e) => {
	const [arrowTable, variablePairs] = e.data

	const table = fromArrow(arrowTable)
	const correlations = variablePairs.map(
		({ source: variableAColumn, target: variableBColumn }) => {
			const correlationColumns = table
				.filter(`d => d['${variableAColumn}'] !== null`)
				.filter(`d => d['${variableBColumn}'] !== null`)
			const corr = agg(
				correlationColumns,
				op.corr(variableAColumn, variableBColumn),
			)
			const sampleSize = correlationColumns.numRows()
			return {
				source: { columnName: variableAColumn },
				target: { columnName: variableBColumn },
				weight: corr,
				name: `Correlation of ${corr} between ${variableAColumn} and ${variableBColumn}`,
				confidence: 1,
				sampleSize,
				directed: false,
				key: `${variableAColumn}-${variableBColumn}`,
			}
		},
	)
	const sortedCorrelations = correlations.sort(
		(a, b) => Math.abs(b.weight) - Math.abs(a.weight),
	)

	postMessage(sortedCorrelations)
})
