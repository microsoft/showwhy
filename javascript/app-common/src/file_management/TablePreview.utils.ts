/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDetailsListStyles, ITheme } from '@fluentui/react'

export function getRawTableStyles(theme: ITheme): Partial<IDetailsListStyles> {
	return {
		root: {
			//border: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
		},
	}
}
