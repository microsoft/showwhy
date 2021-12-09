/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { useSupportedFileTypes } from '../../../hooks/supportedFileTypes'
import styled from 'styled-components'
import { InfoCallout } from '~components/Callout'

export const SupportedFileTypes: React.FC = memo(function SupportedFileTypes() {
	const fileTypesAllowed = useSupportedFileTypes()

	return (
		<InfoCallout alignSelf="center" title="Supported file types">
			<FileTypes>
				Only {fileTypesAllowed.join(' and ')} file types are allowed.
			</FileTypes>
		</InfoCallout>
	)
})

const FileTypes = styled.span``
