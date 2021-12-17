/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuProps, IContextualMenuItem } from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import { OptionsButton } from './OptionsButton'
import { FileDefinition } from '~interfaces'
import { Container } from '~styles'

interface ProjectsSelectorProps {
	onClickProject: (example: FileDefinition) => void
	exampleProjects: FileDefinition[]
	loadProjectOption?: IContextualMenuItem
}

export const ProjectsSelector: React.FC<ProjectsSelectorProps> = memo(
	function ProjectsSelector({
		onClickProject,
		exampleProjects,
		loadProjectOption,
	}) {
		const menuProps: IContextualMenuProps = useMemo(() => {
			const items = exampleProjects.map(example => ({
				key: example.url,
				text: example.name,
				onClick: () => onClickProject(example),
			}))
			if (loadProjectOption) {
				return { items: [...items, loadProjectOption] }
			}
			return { items }
		}, [onClickProject, exampleProjects, loadProjectOption])

		return (
			<Container>
				<OptionsButton text="Load" menuProps={menuProps} />
			</Container>
		)
	},
)
