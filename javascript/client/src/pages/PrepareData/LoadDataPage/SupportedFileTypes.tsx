/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'

import { InfoCallout } from '~components/Callout'

export const SupportedFileTypes: React.FC<{
	fileTypesAllowed: string[]
}> = memo(function SupportedFileTypes({ fileTypesAllowed }) {
	return (
		<InfoCallout alignSelf="center" title="Supported file types">
			<FileTypes>
				Only {fileTypesAllowed.join(', ')} file types are allowed.
			</FileTypes>
		</InfoCallout>
	)
})

const FileTypes = styled.span``
