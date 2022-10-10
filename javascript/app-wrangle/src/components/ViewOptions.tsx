/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ButtonChoiceGroup } from '@essex/components'
import { memo } from 'react'

import { ViewOptionsContainer } from './ViewOptions.styles.js'
import type { ViewOptionsProps, ViewType } from './ViewOptions.types.js'
import { viewOptions } from './ViewOptions.types.js'

export const ViewOptions: React.FC<ViewOptionsProps> = memo(
	function ViewOptions({ selected, onChange }) {
		return (
			<ViewOptionsContainer>
				<ButtonChoiceGroup
					options={viewOptions}
					selectedKey={selected}
					onChange={(_, option) => onChange(option?.key as ViewType)}
				/>
			</ViewOptionsContainer>
		)
	},
)
