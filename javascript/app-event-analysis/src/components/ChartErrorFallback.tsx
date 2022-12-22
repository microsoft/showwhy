/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

export const ChartErrorFallback: React.FC<{ error: Error }> = memo(
	function ChartErrorFallback({ error }) {
		return (
			<div role="alert">
				<p>Something went wrong rendering the chart:</p>
				<pre>{error.message}</pre>
			</div>
		)
	},
)
