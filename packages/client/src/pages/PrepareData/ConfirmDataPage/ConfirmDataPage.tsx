/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
} from '@data-wrangling-components/react'
import { FC, memo, useMemo } from 'react'
import styled from 'styled-components'
import {
	useAllVariables,
	useOutputTableModelVariables,
	useSubjectIdentifier,
} from '~state'

export const ConfirmDataPage: FC = memo(function ConfirmDataPage() {
	const output = useOutputTableModelVariables()
	const allVariables = useAllVariables()
	const subjectIdentifier = useSubjectIdentifier()

	const columns = useMemo(() => {
		return [subjectIdentifier ?? '', ...allVariables.flatMap(x => x.columns)]
	}, [allVariables, subjectIdentifier])

	if (!output) return <span>Empty result</span>
	return (
		<Container>
			<ArqueroTableHeader table={output.select(columns)} />
			<ArqueroDetailsList table={output.select(columns)} />
		</Container>
	)
})

const Container = styled.div`
	margin-top: 8px;
	height: 75vh;
`
