/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuProps } from '@fluentui/react'
import React, { memo, useCallback, useMemo } from 'react'
import { OptionsButton } from './OptionsButton'
import { useExampleProjects, useLoadProject, useResetProject } from '~hooks'
import { Container } from '~styles'

export const ProjectsSelector: React.FC = memo(function ProjectsSelector() {
	const examples = useExampleProjects()
	const loadExample = useLoadProject()
	const resetProject = useResetProject()

	const onClick = useCallback(
		example => {
			resetProject()
			loadExample(example)
		},
		[loadExample, resetProject],
	)

	const menuProps: IContextualMenuProps = useMemo(
		() => ({
			items: examples.map(example => ({
				key: example.url,
				text: example.name,
				onClick: () => onClick(example),
			})),
		}),
		[onClick, examples],
	)

	return (
		<Container>
			<OptionsButton text="Load" menuProps={menuProps} />
		</Container>
	)
})
