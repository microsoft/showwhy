/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ITooltipHostProps} from '@fluentui/react';
import { TooltipHost } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import { memo } from 'react'

export const Tooltip: React.FC<React.PropsWithChildren<ITooltipHostProps>> =
	memo(function Tooltip({ children, ...props }) {
		const tooltipId = useId('tooltip')
		return (
			<TooltipHost id={tooltipId} {...props}>
				{children}
			</TooltipHost>
		)
	})
