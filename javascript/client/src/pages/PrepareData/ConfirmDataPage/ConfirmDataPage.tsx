/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
} from '@data-wrangling-components/react'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'
import { useBusinessLogic } from './hooks'

export const ConfirmDataPage: FC = memo(function ConfirmDataPage() {
	const { output } = useBusinessLogic()

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
