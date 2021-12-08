/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import {guidanceState, useGuidance } from '../guidance'

describe('guidanceState', () => {

    describe('useGuidance', () => {
        it('should return true as default value', () => {
            const expected = true
            const { result } = renderHook(() => useGuidance(), {
                wrapper: RecoilRoot,
            })
            expect(result.current).toEqual(expected)
        })
    })

    describe('useSetGuidance', () => {
        it('should set the guidance to false', () => {
            const expected = false
            const snapshot = snapshot_UNSTABLE(({set}) => set(guidanceState, expected)).getLoadable(guidanceState).valueOrThrow() 
            expect(snapshot).toBe(expected)
        })
    })

})