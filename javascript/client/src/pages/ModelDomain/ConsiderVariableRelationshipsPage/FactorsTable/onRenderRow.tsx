/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DetailsRow, IDetailsListProps, IDetailsRowStyles } from '@fluentui/react'

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