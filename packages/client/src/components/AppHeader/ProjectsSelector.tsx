/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuProps } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import { OptionsButton } from './OptionsButton'
import { FileDefinition } from '~interfaces'
import { Container } from '~styles'

interface ProjectsSelectorProps {
	onClickProject: (example: FileDefinition) => void
	exampleProjects: FileDefinition[]
}

export const ProjectsSelector: React.FC<ProjectsSelectorProps> = memo(
	function ProjectsSelector({ onClickProject, exampleProjects }) {
		const menuProps: IContextualMenuProps = useMemo(
			() => ({
				items: exampleProjects.map(example => ({
					key: example.url,
					text: example.name,
					onClick: () => onClickProject(example),
				})),
			}),
			[onClickProject, exampleProjects],
		)

		return (
			<Container>
				<OptionsButton text="Load" menuProps={menuProps} />
			</Container>
		)
	},
)
