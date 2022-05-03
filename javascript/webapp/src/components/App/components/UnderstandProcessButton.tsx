/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { Container } from '@showwhy/components'
import type { WorkflowHelp } from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'

import { OptionsButton } from './OptionsButton'
import { UnderstandProcessModal } from './UnderstandProcessModal'

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
