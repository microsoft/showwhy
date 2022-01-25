/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuProps } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { OptionsButton } from './OptionsButton'
import { StepStatus } from '~interfaces'
import { Container } from '~styles'

interface SettingsProps {
	onGetStepUrls: (urls?: string[], exclude?: any) => string[]
	onSetAllStepStatus: (urls: string[], status: StepStatus) => void
}

export const Settings: React.FC<SettingsProps> = memo(function Settings({
	onGetStepUrls,
	onSetAllStepStatus,
}) {
	const setStatus = useCallback(
		(statusType: StepStatus) => {
			const ids = onGetStepUrls()
			onSetAllStepStatus(ids, statusType)
		},
		[onGetStepUrls, onSetAllStepStatus],
	)

	const menuProps: IContextualMenuProps = {
		items: [
			{
				key: 'setTodo',
				text: 'Set all steps as To do',
				onClick: () => setStatus(StepStatus.ToDo),
			},
			{
				key: 'setDone',
				text: 'Set all steps as Done',
				onClick: () => setStatus(StepStatus.Done),
			},
		],
	}

	return (
		<Container>
			<OptionsButton text="Settings" menuProps={menuProps} />
		</Container>
	)
})
