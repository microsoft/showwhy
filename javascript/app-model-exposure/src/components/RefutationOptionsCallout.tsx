/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import type { Maybe } from '../types/primitives.js'
import type { RefutationOption } from '../types/refutation/RefutationOption.js'
import { LinkCallout } from './CalloutLink.js'
import { Text } from './styles.js'

export const RefutationOptionsCallout: React.FC<{
	title: string
	calloutKey: number
	refutationOptions?: RefutationOption[]
	text?: string
	separate?: Maybe<boolean>
}> = memo(function RefutationOptionsCallout({
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
				{text || refutationOptions?.find((x) => x.label === title)?.helpText}
			</LinkCallout>
		</>
	)
})
