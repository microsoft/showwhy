/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TooltipHost } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import type { FC } from 'react'
import { memo } from 'react'

import { UnderstandProcessModal } from '~components/UnderstandProcessModal'

import { OptionsButton } from './OptionsButton'

export const UnderstandProcessButton: FC = memo(
	function UnderstandProcessButton() {
		const tooltipId = useId('tooltip')
		const [isModalOpen, { toggle: toggleModal }] = useBoolean(false)

		return (
			<>
				<TooltipHost
					data-pw="understand-question-button"
					content="Understand showwhy process"
					id={tooltipId}
					setAriaDescribedBy={false}
				>
					<OptionsButton onClick={toggleModal} iconProps={questionIcon} />
				</TooltipHost>
				<UnderstandProcessModal
					isModalOpen={isModalOpen}
					toggleModal={toggleModal}
				/>
			</>
		)
	},
)

const questionIcon = { iconName: 'Help' }
