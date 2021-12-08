/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { useEffect } from 'react'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import {EXPOSURE_ESTIMATORS} from '../../hooks/estimators'
import {estimatorState, useEstimators, useAddEstimator } from '../estimators'
const [estimator] = EXPOSURE_ESTIMATORS

describe('estimatorState', () => {

    describe('useEstimators', () => {
        it('should return the default value', () => {
            const expected = []
            const { result } = renderHook(() => useEstimators(), {
                wrapper: RecoilRoot,
            })
            expect(result.current).toEqual(expected)
        })
    })

    describe('useSetEstimators', () => {
        it('should change the estimators state', () => {
            const expected = EXPOSURE_ESTIMATORS
            const snapshot = snapshot_UNSTABLE(({set}) => set(estimatorState, expected)).getLoadable(estimatorState).valueOrThrow() 
            expect(snapshot).toBe(expected)
        })
    })

    describe('useAddEstimator', () => {
        it('should change the estimators state', () => {
            const expected = [estimator]
            const { result } = renderHook(
                () => {
                    const addEstimator = useAddEstimator()
                    const estimators = useEstimators()
                    useEffect(() => {
                        addEstimator(estimator)
                    }, [addEstimator])
    
                    return estimators
                },
                {
                    wrapper: RecoilRoot,
                },
            )
            expect(result.current).toEqual(expected)
        })
    })

    describe('useSetOrUpdateEstimator', () => {
        it('should change the estimators state', () => {
            const expected = [estimator]
            const { result } = renderHook(
                () => {
                    const addEstimator = useAddEstimator()
                    const estimators = useEstimators()
                    useEffect(() => {
                        addEstimator(estimator)
                    }, [addEstimator])
    
                    return estimators
                },
                {
                    wrapper: RecoilRoot,
                },
            )
            expect(result.current).toEqual(expected)
        })
    })

})