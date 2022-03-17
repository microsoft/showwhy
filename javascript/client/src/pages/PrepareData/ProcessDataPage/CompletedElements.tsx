/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import type { CausalFactor, ElementDefinition, FactorsOrDefinitions } from '@showwhy/types'
import type { FC} from 'react';
import { memo } from 'react'
import styled from 'styled-components'

import { CardComponent } from '../../../components/CardComponent'

interface Props {
    completedElements: number
    elements: number
    allElements: FactorsOrDefinitions
	isElementComplete: (element: CausalFactor | ElementDefinition) => boolean
}

export const CompletedElements: FC<Props> = memo(
    function CompletedElements({completedElements, elements, allElements, isElementComplete}) {
        const [isVisible, {toggle}] = useBoolean(true)
        return (
            <CardComponent styles={CardStyles as React.CSSProperties}>
                <Title onClick={toggle}>Selected Variables {completedElements}/{elements} <Small>(see {isVisible ? 'less' : 'more'})</Small></Title>
                <Ul isVisible={isVisible}>
                    {allElements.map((element, index) => {
                        const isComplete = isElementComplete(element)
                        return (
                            <Li 
                                key={index}
                                isComplete={isComplete}
                            >
                                {isComplete ? <Icon iconName="SkypeCircleCheck" /> : null}
                                {element.variable}
                            </Li>
                        )
                    })}
                </Ul>
            </CardComponent>
        )
    },
)

const CardStyles = {
	padding: '0 8px',
    margin: '0 8px',
    maxWidth: '25%',
    position: 'absolute',
    right: '0',
    zIndex: '1',
	backgroundColor: 'white',
}

const Title = styled.h4`
	cursor: pointer;
	text-align: center;
`

const Ul = styled.ul<{isVisible: boolean}>`
	list-style: none;
    padding: ${({isVisible}) => isVisible ? '0.5rem' : '0'};
    border-radius: 3px;
    margin: 0;
	height: ${({isVisible}) => isVisible ? 'auto' : '0'};
	overflow: ${({isVisible}) => isVisible ? 'auto' : 'hidden'};
`

const Li = styled.li<{isComplete: boolean}>`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: ${({isComplete}) => (isComplete ? '0 0 0.5rem 0' : '0 0 0.5rem 1.5rem')};
	color: ${({theme, isComplete}) => isComplete ? theme.application().accent() : theme.application().foreground()};
`

const Small = styled.small`
	font-weight: 300;
`
