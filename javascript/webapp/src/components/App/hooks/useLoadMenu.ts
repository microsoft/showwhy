/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react'
import type { Maybe } from '@showwhy/types'
import { useMemo } from 'react'

import type { FileDefinition } from '~types'

export function useLoadMenu(
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
