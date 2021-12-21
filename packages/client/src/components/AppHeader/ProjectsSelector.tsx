/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuProps, IContextualMenuItem } from '@fluentui/react'
import React, { memo, useMemo, createRef } from 'react'
import { OptionsButton } from './OptionsButton'
import { UploadZip } from '~components/UploadZip'
import { FileDefinition } from '~interfaces'
import { Container } from '~styles'
import { GenericFn } from '~types'

interface ProjectsSelectorProps {
	onClickProject: (example: FileDefinition) => void
	exampleProjects: FileDefinition[]
	loadProjectOption?: IContextualMenuItem
	onUploadZip: GenericFn
}

export const ProjectsSelector: React.FC<ProjectsSelectorProps> = memo(
	function ProjectsSelector({
		onClickProject,
		exampleProjects,
		loadProjectOption,
		onUploadZip,
	}) {
		const buttonRef = createRef()
		const handleClick = () => {
			buttonRef.current?.click()
		}

		const menuProps: IContextualMenuProps = useMemo(() => {
			const items = exampleProjects.map(example => ({
				key: example.url,
				text: example.name,
				onClick: () => onClickProject(example),
			}))
			if (loadProjectOption) {
				return {
					items: [...items, { ...loadProjectOption, onClick: handleClick }],
				}
			}
			return { items }
		}, [onClickProject, exampleProjects, loadProjectOption])

		return (
			<Container>
				<UploadZip onUpload={onUploadZip} inputRef={buttonRef} />
				<OptionsButton text="Load" menuProps={menuProps} />
			</Container>
		)
	},
)
