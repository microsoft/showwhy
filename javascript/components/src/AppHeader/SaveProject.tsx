/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps } from '@fluentui/react'
import { memo } from 'react'

import { Container } from '../styles'
import { OptionsButton } from './OptionsButton'

export const SaveProject: React.FC<{
	saveProps: IContextualMenuProps
}> = memo(function SaveProject({ saveProps }) {
	return (
		<Container data-pw="save">
			<OptionsButton text="Save" menuProps={saveProps} />
		</Container>
	)
})
