/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'allotment/dist/style.css'

import type { AllotmentHandle } from 'allotment'
import { Allotment } from 'allotment'
import { memo, useEffect, useRef } from 'react'

import { RAIL_MAX_SIZE, RAIL_PREFERRED_SIZE } from './CommonLayout.constants.js'
import {
	Container,
	Content,
	LeftRail,
	MainArea,
	RightRail,
} from './CommonLayout.styles.js'
import type { CommonLayoutProps } from './CommonLayout.types.js'

export const CommonLayout: React.FC<CommonLayoutProps> = memo(
	function CommonLayout({
		children,
		configRail,
		detailRail,
		menu,
		panelsVisibility = true,
	}) {
		const ref = useRef<AllotmentHandle>(null)
		useEffect(() => {
			if (panelsVisibility) {
				ref.current?.reset()
			}
		}, [panelsVisibility])

		return (
			<Container>
				{menu}
				<MainArea>
					<Allotment ref={ref}>
						{configRail != null ? (
							<Allotment.Pane
								preferredSize={RAIL_PREFERRED_SIZE}
								maxSize={RAIL_MAX_SIZE}
								visible={panelsVisibility}
							>
								<LeftRail>{configRail}</LeftRail>
							</Allotment.Pane>
						) : null}
						<Content>{children}</Content>
						<Allotment.Pane
							preferredSize={RAIL_PREFERRED_SIZE}
							maxSize={RAIL_MAX_SIZE}
							visible={panelsVisibility}
						>
							<RightRail>{detailRail}</RightRail>
						</Allotment.Pane>
					</Allotment>
				</MainArea>
			</Container>
		)
	},
)
