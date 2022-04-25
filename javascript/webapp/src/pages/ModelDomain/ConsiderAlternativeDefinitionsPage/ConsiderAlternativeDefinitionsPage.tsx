/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Pivot as FUIPivot, PivotItem } from '@fluentui/react'
import { Container, Title } from '@showwhy/components'
import { memo } from 'react'
import styled from 'styled-components'

import { useBusinessLogic } from './ConsiderAlternativeDefinitionsPage.hooks'
import { PivotType } from './PivotType'

export const ConsiderAlternativeDefinitionsPage: React.FC = memo(
	function ConsiderAlternativeDefinitionsPage() {
		const {
			shouldHavePrimary,
			pivotData,
			definitionType,
			definitions,
			definitionToEdit,
			editDefinition,
			addDefinition,
			handleOnLinkClick,
			removeDefinition,
			setDefinitionToEdit,
		} = useBusinessLogic()

		return (
			<Container>
				<Title data-pw="title">Alternative definitions</Title>
				<Pivot
					onLinkClick={handleOnLinkClick}
					aria-label="Alternative Definitions Interest labels and description"
				>
					{pivotData.map(item => (
						<PivotItem key={item.key} headerText={item.title}>
							<PivotType
								setDefinitionToEdit={setDefinitionToEdit}
								definitionToEdit={definitionToEdit}
								removeDefinition={removeDefinition}
								definitions={definitions}
								editDefinition={editDefinition}
								item={item}
								addDefinition={addDefinition}
								definitionType={definitionType}
								shouldHavePrimary={shouldHavePrimary}
							/>
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
