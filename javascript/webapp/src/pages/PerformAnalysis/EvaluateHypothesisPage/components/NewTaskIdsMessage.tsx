/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageContainer } from '@showwhy/components'
import type { FC } from 'react'
import { memo } from 'react'
export const NewTaskIdsMessage: FC = memo(function NewTaskIdsMessage() {
	return (
		<MessageContainer styles={{ marginBottom: '1rem' }}>
			<span>
				Looks like the active specifications list changed and this result is not
				accurate anymore. Run a new significance test to get an updated result.
			</span>
		</MessageContainer>
	)
})
