/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useEffect } from 'react'
import { RecoilRoot, useRecoilSnapshot } from 'recoil'

export const DataContext = memo(function DataContext({ children }) {
	return (
		<RecoilRoot>
			{import.meta.env.DEV ? <DebugObserver /> : null}
			{children}
		</RecoilRoot>
	)
})

const DebugObserver: React.FC = function DebugObserver() {
	const snapshot = useRecoilSnapshot()
	useEffect(() => {
		console.debug('The following atoms were modified:')
		for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
			console.debug('\t' + node.key, snapshot.getLoadable(node))
		}
	}, [snapshot])

	return null
}
