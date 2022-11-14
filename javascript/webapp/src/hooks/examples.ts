/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useState } from 'react'

export interface FileDefinition {
	name: string
	url: string
}

const EXAMPLES_PATH = 'data/examples/index.json'

export function useExampleProjects(): FileDefinition[] {
	const [examples, setExamples] = useState<FileDefinition[]>([])
	useEffect(() => {
		void fetch(EXAMPLES_PATH)
			.then(r => r.json())
			.then((e: { examples: FileDefinition[] }) => setExamples(e.examples))
			.catch(err => {
				console.error('error loading examples', err)
				throw err
			})
	}, [setExamples])
	return examples
}
