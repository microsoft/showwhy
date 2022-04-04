/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import type { Maybe, SignificanceTest } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { ErrorMessage } from '~components/ErrorMessage'
import { ContainerFlexColumn, ContainerFlexRow } from '~styles'
import type { RunHistory } from '~types'

export const PageButtons: React.FC<{
	activeTaskIds: string[]
	defaultRun: Maybe<RunHistory>
	significanceTestResult: Maybe<SignificanceTest>
	significanceFailed: boolean
	runSignificance: (taskIds: string[]) => void
}> = memo(function PageButtons({
	activeTaskIds,
	defaultRun,
	significanceTestResult,
	significanceFailed,
	runSignificance,
}) {
	return (
		<ContainerFlexRow marginBottom justifyContent="space-between">
			<ContainerFlexColumn>
				<ButtonWithMargin
					disabled={
						(!!significanceTestResult &&
							significanceTestResult &&
							!significanceFailed) ||
						!defaultRun
					}
					onClick={() => runSignificance(activeTaskIds)}
					data-pw="run-significance-test-button"
				>
					Run significance test
				</ButtonWithMargin>
				{significanceFailed && <ErrorMessage></ErrorMessage>}
			</ContainerFlexColumn>
		</ContainerFlexRow>
	)
})

const ButtonWithMargin = styled(DefaultButton)`
	margin-bottom: 4px;
`
