/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */


import type { IColumn, IDetailsListProps, IDetailsRowStyles } from '@fluentui/react';
import { DetailsRow } from '@fluentui/react'

import type { Header } from '~types'

export const onRenderRow: IDetailsListProps['onRenderRow'] = props => {
  const customStyles: Partial<IDetailsRowStyles> = {
    cell: {
      border: '1px solid #fff',
      fontSize: '14px',
    }
  }

  if (props) {
    const { dataPw = 'details-list-row' } = props.item
    if (props.itemIndex % 2 === 0) {
      customStyles.root = { 
        backgroundColor: 'var(--faint)',
        
      }
    }

    return <DetailsRow data-pw={dataPw} {...props} styles={customStyles} />
  }
  return null
}

export function getColumns(headers: Header[]): IColumn[] {
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