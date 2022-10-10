/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { WrangleData } from './components/WrangleData.js'
import { WrangleErrorBoundary } from './components/WrangleErrorBoundary.js'

export const WranglePage: React.FC = memo(function WranglePage() {
	return (
		<WrangleErrorBoundary>
			<WrangleData />
		</WrangleErrorBoundary>
	)
})
export default WranglePage
