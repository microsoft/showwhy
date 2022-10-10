/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { initializeIcons } from '@fluentui/react'
import { createRoot } from 'react-dom/client'

export async function bootstrap(
	app: JSX.Element,
	rootNodeId = 'root',
): Promise<void> {
	try {
		/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
		// @ts-ignore
		await import('normalize.css')
		initializeIcons(undefined, { disableWarnings: true })

		const root = createRoot(getRootElement(rootNodeId))
		root.render(app)
	} catch (err) {
		console.error('error rendering application', err)
	}
}

function getRootElement(id: string) {
	const element = document.getElementById(id) as HTMLElement
	if (element == null) {
		throw new Error(`could not find root with id "${id}"`)
	}
	return element
}
