/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LinkCallout } from '@showwhy/components'
import type { Maybe, RefutationOption } from '@showwhy/types'
import { memo } from 'react'

import { Text } from '~styles'

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
