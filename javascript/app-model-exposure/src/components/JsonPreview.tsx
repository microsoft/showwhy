/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'
import styled from 'styled-components'

export const JsonPreview: React.FC<{ json: string }> = memo(
	function JsonPreview({ json }) {
		const obj = JSON.parse(json)
		const isArray = Array.isArray(obj)

		return isArray ? (
			<Container>
				[
				{obj.map((item, key) => (
					<CollapsibleJson key={key} json={JSON.stringify(item, null, 4)} />
				))}
				]
			</Container>
		) : (
			<CollapsibleJson json={json} />
		)
	},
)

export const CollapsibleJson: React.FC<{ json: string }> = memo(
	function CollapsibleJson({ json }) {
		const [isCollapsed, { toggle }] = useBoolean(false)
		const iconProps = {
			iconName: isCollapsed ? 'CaretRightSolid8' : 'CaretDownSolid8',
		}
		return (
			<CollapsibleContainer isCollapsed={isCollapsed}>
				<IconButton onClick={toggle} iconProps={iconProps} />
				{isCollapsed ? (
					<code>{`${json.slice(0, 50)}...`}</code>
				) : (
					<pre>
						<code>{json}</code>
					</pre>
				)}
			</CollapsibleContainer>
		)
	},
)

const Container = styled.div`
	overflow: auto;
	height: 70vh;
	padding: 1rem 0;
`

const CollapsibleContainer = styled.div<{ isCollapsed: boolean }>`
	display: flex;
	gap: 0.5rem;
	align-items: ${({ isCollapsed }) => (isCollapsed ? 'center' : 'flex-start')};

	pre {
		margin: 0.5rem 0;
	}

	code {
		font-size: 0.8rem;
	}
`
