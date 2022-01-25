/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useState } from 'react'
import { FileDefinition } from '~types'

export function useExampleProjects(): FileDefinition[] {
	const [examples, setExamples] = useState<FileDefinition[]>([])
	useEffect(() => {
		const f = async () => {
			const json = await fetch('data/examples/examples.json').then(res =>
				res.json(),
			)
			setExamples(json as FileDefinition[])
		}
		f()
	}, [setExamples])
	return examples
}
