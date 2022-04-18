/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IColumn } from '@fluentui/react'
import { CausalFactorType } from '@showwhy/types'

export const getColumns: () => IColumn[] = () => {
  const headers = [
    { fieldName: 'variable', name: 'Label', width: 300 },
    { fieldName: CausalFactorType.CauseExposure, name: 'Causes Exposure', width: 150 },
    { fieldName: CausalFactorType.CauseOutcome, name: 'Causes Outcome', width: 150 },
    { fieldName: 'reasoning', name: 'Reasoning', width: 500 },
  ]
  const cols = headers.map(h => ({
    key: h.fieldName,
    fieldName: h.fieldName,
    name: h.name,
    ariaLabel: h.name,
    minWidth: h.width,
    maxWidth: h.width,
    styles: {
      cellTooltip: {
        display: 'flex', 
        justifyContent: 'center',
        border: '1px solid #fff',
        background: 'var(--faint)',
      },
      cellName: {
        fontSize: '15px',
        fontWeight: 'bold',
      }
    },
  }))
  return cols
}
