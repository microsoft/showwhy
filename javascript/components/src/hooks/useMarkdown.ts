/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { GetMarkdownFn, Maybe } from '@showwhy/types'
import { useEffect, useState } from 'react'

export function useMarkdown(getMarkdown: Maybe<GetMarkdownFn>): string {
	const [markdown, setMarkdown] = useState('')

	useEffect(() => {
		if (getMarkdown) {
			const getValue = getMarkdownValue(getMarkdown)
			getValue
				.then(md => {
					setMarkdown(md)
				})
				.catch(error => {
					console.error('Error importing guidance:', error)
					setMarkdown('')
				})
		} else {
			setMarkdown('')
		}
	}, [getMarkdown])

	return markdown
}

async function getMarkdownValue(
	fn: () => Promise<{
		default: string
	}>,
) {
	return fn()
		.then(({ default: md }: { default: string }) => {
			return md
		})
		.catch(error => {
			console.error('Error importing guidance:', error)
			return ''
		})
}
