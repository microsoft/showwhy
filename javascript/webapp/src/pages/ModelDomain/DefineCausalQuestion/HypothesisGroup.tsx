/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RadioButtonChoice } from '@showwhy/components';
import { RadioButtonCard } from '@showwhy/components'
import { Hypothesis } from '@showwhy/types'
import type { FC} from 'react';
import { memo } from 'react'
import styled from 'styled-components'

import { useSetHypothesis } from './DefineCausalQuestion.hooks'

export const HypothesisGroup: FC<{hypothesis: Hypothesis}> = memo(
  function HypothesisGroup({hypothesis}) {
    const setHypothesis = useSetHypothesis()

    const hypothesisOptions: RadioButtonChoice[] = [
			{ key: Hypothesis.Change, title: Hypothesis.Change, isSelected: hypothesis === Hypothesis.Change, onChange: setHypothesis },
			{ key: Hypothesis.Increase, title: Hypothesis.Increase, isSelected: hypothesis === Hypothesis.Increase, onChange: setHypothesis },
			{ key: Hypothesis.Decrease, title: Hypothesis.Decrease, isSelected: hypothesis === Hypothesis.Decrease, onChange: setHypothesis },
		].map(i => ({ ...i, 'data-pw': 'hypothesis-choice' }))

    return (
      <Container>
        {hypothesisOptions.map(option => (
          <RadioButtonCard key={option.key} option={option} />
        ))}
      </Container>
    )
  },
)

const Container = styled.div`
  display: flex;
	align-items: center;
  gap: 3rem;
  justify-content: flex-start;
  margin: 1rem 0;
  
  .radio-option {
    display: flex;
  }
`
