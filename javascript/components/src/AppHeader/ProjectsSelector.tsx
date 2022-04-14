/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps } from '@fluentui/react'
import { memo } from 'react'

import { Container } from '../styles.js'
import { OptionsButton } from './OptionsButton.js'

export const ProjectsSelector: React.FC<{
	loadMenu: IContextualMenuProps
}> = memo(function ProjectsSelector({ loadMenu }) {
	return (
		<Container data-pw="load">
			<OptionsButton text="Load" menuProps={loadMenu} />
		</Container>
	)
})
