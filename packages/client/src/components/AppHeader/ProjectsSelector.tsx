/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuProps, IContextualMenuItem } from '@fluentui/react'
import { memo, useMemo } from 'react'
import { OptionsButton } from './OptionsButton'
import { Container } from '~styles'
import { FileDefinition } from '~types'

export const ProjectsSelector: React.FC<{
	exampleProjects: FileDefinition[]
	loadProjectOption?: IContextualMenuItem
	onClickProject: (example: FileDefinition) => void
}> = memo(function ProjectsSelector({
	onClickProject,
	exampleProjects,
	loadProjectOption,
}) {
	const menuProps = useMenuProps(
		exampleProjects,
		loadProjectOption,
		onClickProject,
	)
	return (
		<Container>
			<OptionsButton text="Load" menuProps={menuProps} />
		</Container>
	)
})

function useMenuProps(
	exampleProjects: FileDefinition[],
	loadProjectOption: IContextualMenuItem | undefined,
	onClickProject: (example: FileDefinition) => void,
): IContextualMenuProps {
	return useMemo<IContextualMenuProps>(() => {
		const items: IContextualMenuItem[] = exampleProjects.map(example => ({
			key: example.url,
			text: example.name,
			onClick: () => onClickProject(example),
		}))
		if (loadProjectOption) {
			items.push(loadProjectOption)
		}
		return { items }
	}, [onClickProject, exampleProjects, loadProjectOption])
}
