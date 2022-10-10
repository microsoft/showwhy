/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface TooltipProps {
	xPos: number
	yPos: number
	visible?: boolean
	onTooltipRemoved: () => void
}
