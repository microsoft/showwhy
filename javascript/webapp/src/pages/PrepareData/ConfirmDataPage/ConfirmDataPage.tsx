/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList, ArqueroTableHeader } from '@essex/arquero-react'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { useOutput } from './ConfirmDataPage.hooks'

export const ConfirmDataPage: FC = memo(function ConfirmDataPage() {
	const { output } = useOutput()

	if (!output) return <span>Empty result</span>
	return (
		<Container>
			<ArqueroTableHeader table={output} />
			<ArqueroDetailsList table={output} />
		</Container>
	)
})

const Container = styled.div`
	margin-top: 8px;
	height: 75vh;
`
