/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps } from '@fluentui/react'
import { Container } from '@showwhy/components'
import { memo } from 'react'

import { OptionsButton } from './OptionsButton.js'

export const AppHeaderMenu: React.FC<{
	menuProps: IContextualMenuProps
	text: string
}> = memo(function AppHeaderMenu({ menuProps, text }) {
	return (
		<Container data-pw={text.toLowerCase()}>
			<OptionsButton text={text} menuProps={menuProps} />
		</Container>
	)
})
