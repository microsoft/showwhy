/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { ContainerTextCenter, StyledSpinner } from '~styles'

export const Loading: React.FC = memo(function Loading() {
	return (
		<ContainerTextCenter>
			<StyledSpinner />
		</ContainerTextCenter>
	)
})
