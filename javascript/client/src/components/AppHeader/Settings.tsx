/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IContextualMenuProps } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import { OptionsButton } from '../OptionsButton'
import { Container } from '~styles'
import { StepStatus } from '~types'

type GetStepUrlsHandler = (urls?: string[], exclude?: any) => string[]
type SetAllStepStatusHandler = (urls: string[], status: StepStatus) => void

export const Settings: React.FC<{
	onGetStepUrls: GetStepUrlsHandler
	onSetAllStepStatus: SetAllStepStatusHandler
}> = memo(function Settings({ onGetStepUrls, onSetAllStepStatus }) {
	const menuProps = useMenuProps(onGetStepUrls, onSetAllStepStatus)

	return (
		<Container>
			<OptionsButton text="Settings" menuProps={menuProps} />
		</Container>
	)
})

function useMenuProps(
	onGetStepUrls: GetStepUrlsHandler,
	onSetAllStepStatus: SetAllStepStatusHandler,
): IContextualMenuProps {
	const setStatus = useCallback(
		(statusType: StepStatus) => {
			const ids = onGetStepUrls()
			onSetAllStepStatus(ids, statusType)
		},
		[onGetStepUrls, onSetAllStepStatus],
	)
	return useMemo<IContextualMenuProps>(
		() => ({
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
		}),
		[setStatus],
	)
}
