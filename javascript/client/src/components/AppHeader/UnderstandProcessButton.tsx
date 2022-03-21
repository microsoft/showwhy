/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import type { FC } from 'react'
import { memo } from 'react'

import { UnderstandProcessModal } from '~components/UnderstandProcessModal'
import { Container } from '~styles'

import { OptionsButton } from './OptionsButton'

export const UnderstandProcessButton: FC = memo(
	function UnderstandProcessButton() {
		const [isModalOpen, { toggle: toggleModal }] = useBoolean(false)

		return (
			<Container data-pw="understand-question">
				<OptionsButton
					title="Understand showwhy process"
					onClick={toggleModal}
					iconProps={questionIcon}
				/>
				<UnderstandProcessModal
					isModalOpen={isModalOpen}
					toggleModal={toggleModal}
				/>
			</Container>
		)
	},
)

const questionIcon = { iconName: 'Help' }
