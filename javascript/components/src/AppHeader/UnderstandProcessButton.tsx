/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import type { FC } from 'react'
import { memo } from 'react'

import { Container } from '../styles.js'
import type { WorkflowHelp } from '../UnderstandProcessModal/index.js'
import { UnderstandProcessModal } from '../UnderstandProcessModal/index.js'
import { OptionsButton } from './OptionsButton.js'

export const UnderstandProcessButton: FC<{ items: WorkflowHelp[] }> = memo(
	function UnderstandProcessButton({ items }) {
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
					items={items}
				/>
			</Container>
		)
	},
)

const questionIcon = { iconName: 'Help' }
