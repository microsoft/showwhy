/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot as FUIPivot, PivotItem } from '@fluentui/react'
import { Container, Title } from '@showwhy/components'
import { memo } from 'react'
import styled from 'styled-components'

import { useHandleOnLinkClick } from '~hooks'

import { useDefinitions } from '../../../state'
import { PivotType } from './components/PivotType'
import { usePivotData } from './ConsiderAlternativeDefinitionsPage.hooks'

export const ConsiderAlternativeDefinitionsPage: React.FC = memo(
	function ConsiderAlternativeDefinitionsPage() {
		const definitions = useDefinitions()
		const { pivotData } = usePivotData(definitions)
		const handleOnLinkClick = useHandleOnLinkClick()

		return (
			<Container>
				<Title data-pw="title">Alternative definitions</Title>
				<Pivot
					onLinkClick={handleOnLinkClick}
					aria-label="Alternative Definitions Interest labels and description"
				>
					{pivotData.map(item => (
						<PivotItem key={item.key} headerText={item.title}>
							<PivotType definitions={definitions} item={item} />
						</PivotItem>
					))}
				</Pivot>
			</Container>
		)
	},
)

const Pivot = styled(FUIPivot)`
	margin: 0 0 1.5rem;
`
