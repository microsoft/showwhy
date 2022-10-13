/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps } from '@fluentui/react'
import { CommandButton } from '@fluentui/react'
import { memo } from 'react'

import { useSaveMenu } from '../hooks/appHeader/useSaveMenu.js'
import type { Maybe } from '../types/primitives.js'
import { Container, ContainerFlexRow } from './styles.js'

export const AppMenu: React.FC<{ setError: (error: Maybe<string>) => void }> =
	memo(function AppMenu() {
		const saveProps = useSaveMenu()

		return (
			<ContainerFlexRow>
				<AppHeaderMenu menuProps={saveProps} text="Export Results" />
			</ContainerFlexRow>
		)
	})

const AppHeaderMenu: React.FC<{
	menuProps: IContextualMenuProps
	text: string
}> = memo(function AppHeaderMenu({ menuProps, text }) {
	return (
		<Container>
			<CommandButton text={text} menuProps={menuProps} />
		</Container>
	)
})
