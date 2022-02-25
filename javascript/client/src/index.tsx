/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { render } from 'react-dom'
import { App } from './components'

function mount(): void {
	try {
		const root = document.getElementById('root')
		render(<App />, root)
	} catch (err) {
		console.error('error rendering application', err)
	}
}
mount()
