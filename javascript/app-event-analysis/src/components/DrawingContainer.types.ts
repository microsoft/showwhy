/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface DrawingContainerProps {
	width: number
	height: number
	margin: { top: number; bottom: number; left: number; right: number }
	className: string
	refLine?: boolean
	handleClickOutside: () => void
	handleContainerClick: (event: React.MouseEvent<SVGElement>) => void
}
