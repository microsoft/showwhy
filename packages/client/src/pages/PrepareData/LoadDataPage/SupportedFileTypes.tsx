/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { InfoCallout } from '~components/Callout'

interface SupportedFileTypesProps {
	fileTypesAllowed: string[]
}

export const SupportedFileTypes: React.FC<SupportedFileTypesProps> = memo(
	function SupportedFileTypes({ fileTypesAllowed }) {
		return (
			<InfoCallout alignSelf="center" title="Supported file types">
				<FileTypes>
					Only {fileTypesAllowed.join(', ')} file types are allowed.
				</FileTypes>
			</InfoCallout>
		)
	},
)

const FileTypes = styled.span``
