/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { isStatus } from '@showwhy/api-client'
import { ErrorMessage } from '@showwhy/components'
import type { Handler, Maybe, RunHistory,SignificanceTest  } from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

export const PageButtons: React.FC<{
	defaultRun: Maybe<RunHistory>
	significanceTestResult: Maybe<SignificanceTest>
	significanceFailed: boolean
	runSignificance: Handler
}> = memo(function PageButtons({
	defaultRun,
	significanceTestResult,
	significanceFailed,
	runSignificance,
}) {
	const showButton = useMemo((): any => {
		return (
			!significanceTestResult ||
			(significanceTestResult.status &&
				isStatus(significanceTestResult?.status, NodeResponseStatus.Failed))
		)
	}, [significanceTestResult])

	return (
		<Container>
			{showButton && (
				<ButtonWithMargin
					disabled={!defaultRun}
					onClick={runSignificance}
					data-pw="run-significance-test-button"
				>
					Run significance test
				</ButtonWithMargin>
			)}

			{significanceFailed && <ErrorMessage />}
		</Container>
	)
})

const ButtonWithMargin = styled(DefaultButton)`
	margin-bottom: 4px;
`

const Container = styled.div`
	column-gap: 10px;
	display: flex;
	margin-top: 1em;
`
