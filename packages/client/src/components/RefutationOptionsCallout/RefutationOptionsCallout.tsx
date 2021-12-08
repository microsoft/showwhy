/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import { LinkCallout } from '~components/Callout'
import { RefutationOption } from '~interfaces'
import { Text } from '~styles'

interface RefutationOptionsCalloutProps {
	title: string
	calloutKey: number
	refutationOptions?: RefutationOption[]
	text?: string
	separate?: boolean
}
export const RefutationOptionsCallout: React.FC<RefutationOptionsCalloutProps> =
	memo(function RefutationOptionsCallout({
		title,
		refutationOptions,
		text,
		calloutKey,
		separate,
	}) {
		return (
			<>
				{separate && <Text>, </Text>}
				<LinkCallout title={title} id={`estimator-card-${calloutKey}`}>
					{text || refutationOptions?.find(x => x.label == title)?.helpText}
				</LinkCallout>
			</>
		)
	})
