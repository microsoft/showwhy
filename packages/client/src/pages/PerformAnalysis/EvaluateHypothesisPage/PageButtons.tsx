/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { ErrorMessage } from '~components/ErrorMessage'
import { RunHistory, SignificanceTest } from '~interfaces'
import { ContainerFlexColumn, ContainerFlexRow } from '~styles'

interface PageButtonsProps {
	activeTaskIds: string[]
	defaultRun: RunHistory | undefined
	significanceTestsResult: SignificanceTest | undefined
	significanceFailed: boolean
	runSignificance: (taskIds: string[]) => void
}

export const PageButtons: React.FC<PageButtonsProps> = memo(
	function PageButtons({
		activeTaskIds,
		defaultRun,
		significanceTestsResult,
		significanceFailed,
		runSignificance,
	}) {
		return (
			<ContainerFlexRow marginBottom justifyContent="space-between">
				<ContainerFlexColumn>
					<ButtonWithMargin
						disabled={
							(!!significanceTestsResult &&
								significanceTestsResult &&
								!significanceFailed) ||
							!defaultRun
						}
						onClick={() => runSignificance(activeTaskIds)}
					>
						Run significance test
					</ButtonWithMargin>
					{significanceFailed && <ErrorMessage></ErrorMessage>}
				</ContainerFlexColumn>
			</ContainerFlexRow>
		)
	},
)

const ButtonWithMargin = styled(DefaultButton)`
	margin-bottom: 4px;
`
