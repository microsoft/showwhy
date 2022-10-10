/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ErrorBoundary as ErrorBoundaryLib } from 'react-error-boundary'
import Redbox from 'redbox-react'

import { useOnReset } from './ErrorBoundary.hooks.js'

export const ErrorBoundary: React.FC<
	React.PropsWithChildren<{
		/* nothing */
	}>
> = ({ children }) => {
	const onReset = useOnReset()
	return (
		<ErrorBoundaryLib FallbackComponent={ErrorFallback} onReset={onReset}>
			{children}
		</ErrorBoundaryLib>
	)
}

function ErrorFallback({
	error,
}: {
	error: Error
	resetErrorBoundary: () => void
}) {
	return <Redbox error={error} />
}
