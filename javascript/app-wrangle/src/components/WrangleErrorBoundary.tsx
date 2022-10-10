/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBar, MessageBarType, Stack } from '@fluentui/react'
import { memo } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'

import { ALERT_MESSAGE } from './WrangleErrorBoundary.constants.js'

const ErrorFallback: React.FC<FallbackProps> = memo(function ErrorFallback({
	error,
}) {
	return (
		<Stack gap="gap.smaller">
			<MessageBar messageBarType={MessageBarType.severeWarning}>
				{ALERT_MESSAGE}
			</MessageBar>
			{error.message}
			<br />
			<textarea value={error.stack} rows={20} cols={150} readOnly />
		</Stack>
	)
})

export const WrangleErrorBoundary: React.FC<
	React.PropsWithChildren<{
		// no props
	}>
> = memo(function WrangleErrorBoundary({ children }) {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
	)
})
