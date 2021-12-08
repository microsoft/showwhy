/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import { stepsList } from '../../data/stepsList'
import {selectedProject, useSelectedProject } from '../project'

describe('projectState', () => {

    describe('useSelectedProject', () => {
        it('should return the default value', () => {
            const expected = 'Project name goes here'
            const { result } = renderHook(() => useSelectedProject(), {
                wrapper: RecoilRoot,
            })
            expect(result.current.name).toEqual(expected)
        })
    })

    describe('useSetSelectedProject', () => {
        it('should change the project state', () => {
            const expected = { name: 'New Project name', key: 'project-jest', steps: stepsList }
            const snapshot = snapshot_UNSTABLE(({set}) => set(selectedProject, expected)).getLoadable(selectedProject).valueOrThrow() 
            expect(snapshot).toBe(expected)
        })
    })

})