/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps, IContextualMenuItem } from '@fluentui/react'
import type { Maybe } from '@showwhy/types'
import { memo, useMemo } from 'react'
import { OptionsButton } from './OptionsButton'
import { Container } from '~styles'
import type { FileDefinition } from '~types'

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
		<Container data-pw="load">
			<OptionsButton text="Load" menuProps={menuProps} />
		</Container>
	)
})

function useMenuProps(
	exampleProjects: FileDefinition[],
	loadProjectOption: Maybe<IContextualMenuItem>,
	onClickProject: (example: FileDefinition) => void,
): IContextualMenuProps {
	return useMemo<IContextualMenuProps>(() => {
		const items: IContextualMenuItem[] = exampleProjects.map(example => ({
			key: example.url,
			text: example.name,
			'data-pw': example.name.replace(/\s/g, ''),
			onClick: () => onClickProject(example),
		}))
		if (loadProjectOption) {
			items.push(loadProjectOption)
		}
		return { items }
	}, [onClickProject, exampleProjects, loadProjectOption])
}
