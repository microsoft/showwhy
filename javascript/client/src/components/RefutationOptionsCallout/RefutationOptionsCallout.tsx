/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@showwhy/types'
import { memo } from 'react'
import { LinkCallout } from '~components/Callout'
import { Text } from '~styles'
import type { RefutationOption } from '~types'

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
				{text || refutationOptions?.find(x => x.label === title)?.helpText}
			</LinkCallout>
		</>
	)
})
