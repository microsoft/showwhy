/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, Suspense } from 'react'
import { useRecoilValue } from 'recoil'

import { FilteredCorrelationsState } from '../../state/index.js'
import { correlationsForVariable } from '../../utils/Correlation.js'
import { PaddedSpinner } from '../CauseDis.styles.js'
import { NetworkGraphExplorer } from '../graph/NetworkGraphExplorer.js'
import type {
	CorrelationListProps,
	VariableCorrelationsListProps,
} from './CorrelationList.types.js'
import { RelationshipList } from './RelationshipList.js'

export const CorrelationList: React.FC<CorrelationListProps> = memo(
	function CorrelationList({ correlations, toColumnName, showGraph }) {
		return (
			<>
				{showGraph && <NetworkGraphExplorer correlations={correlations} />}
				<RelationshipList
					relationships={correlations}
					toColumnName={toColumnName}
				/>
			</>
		)
	},
)

const VariableCorrelationsListInternal: React.FC<VariableCorrelationsListProps> =
	memo(function VariableCorrelationsListInternal({ variable }) {
		const allCorrelations = useRecoilValue(FilteredCorrelationsState)
		const correlations = correlationsForVariable(allCorrelations, variable)
		return (
			<CorrelationList
				correlations={correlations}
				toColumnName={variable.columnName}
				showGraph={false}
			/>
		)
	})

export const VariableCorrelationsList: React.FC<VariableCorrelationsListProps> =
	memo(function VariableCorrelationsList(props: VariableCorrelationsListProps) {
		return (
			<Suspense
				fallback={<PaddedSpinner label="Calculating Correlations..." />}
			>
				<VariableCorrelationsListInternal {...props} />
			</Suspense>
		)
	})

const AllCorrelationsListInternal = memo(
	function AllCorrelationsListInternal() {
		const correlations = useRecoilValue(FilteredCorrelationsState)
		return <CorrelationList correlations={correlations} showGraph={false} />
	},
)

export const AllCorrelationsList: React.FC = memo(
	function AllCorrelationsList() {
		return (
			<Suspense
				fallback={<PaddedSpinner label="Calculating Correlations..." />}
			>
				<AllCorrelationsListInternal />
			</Suspense>
		)
	},
)
