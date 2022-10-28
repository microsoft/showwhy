/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITheme } from '@fluentui/react'
import { Stack, Text } from '@fluentui/react'
import { ForwardIcon, RemoteIcon } from '@fluentui/react-icons-mdl2'
import { memo } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'

import { variableForColumnName } from '../../domain/Dataset.js'
import { DatasetState } from '../../state/index.js'
import { CausalNode } from '../graph/CausalNode.js'
import type { RelationshipItemProps } from './RelationshipItem.types.js'

export const RelationshipItem: React.FC<RelationshipItemProps> = memo(
	function RelationshipItem({ relationship, toColumnName }) {
		const dataset = useRecoilValue(DatasetState)
		const sourceVarRef =
			!relationship.directed && toColumnName === relationship.source.columnName
				? relationship.target
				: relationship.source
		const targetVarRef =
			!relationship.directed && toColumnName === relationship.source.columnName
				? relationship.source
				: relationship.target
		const sourceVar = variableForColumnName(dataset, sourceVarRef.columnName)
		const targetVar = variableForColumnName(dataset, targetVarRef.columnName)

		const sourceAndTargetExist =
			sourceVar !== undefined && targetVar !== undefined
		return sourceAndTargetExist ? (
			<RelationshipContainer>
				<Stack
					horizontal
					horizontalAlign="space-between"
					tokens={{ childrenGap: 5 }}
				>
					<Stack.Item style={{ width: '40%' }} align="center">
						<CausalNode variable={sourceVar} isAddable />
					</Stack.Item>
					<Stack.Item align="center">
						<Stack>
							<Stack.Item align="center">
								{relationship.directed ? <ForwardIcon /> : <RemoteIcon />}
							</Stack.Item>
							{relationship.weight !== undefined && (
								<Stack.Item align="center">
									<Text variant={'tiny'}>{relationship.weight.toFixed(2)}</Text>
								</Stack.Item>
							)}
						</Stack>
					</Stack.Item>
					<Stack.Item style={{ width: '40%' }} align="center">
						<CausalNode variable={targetVar} isAddable />
					</Stack.Item>
				</Stack>
			</RelationshipContainer>
		) : (
			<></>
		)
	},
)

const RelationshipContainer = styled.div`
	border-bottom: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralLighter};
`
