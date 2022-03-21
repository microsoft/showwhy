/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import { useEffect, useState } from 'react'

import type { ProcessHelp, Step } from '~types'

export function useMarkdown(item: Maybe<Step | ProcessHelp>): string {
	const [markdown, setMarkdown] = useState('')

	useEffect(() => {
		if (item?.getMarkdown) {
			const getValue = getMarkdownValue(item?.getMarkdown)
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
	}, [item])

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
