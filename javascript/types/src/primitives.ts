/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// @ts-ignore
import { Dispatch, SetStateAction } from 'react'
/**
 * Declares a type to include undefined
 */
export type Maybe<T> = T | undefined

/**
 * A state-setting function
 */
export type Setter<T> = Dispatch<SetStateAction<T>>

/**
 * An entity type with an optional ID field
 */
export type OptionalId<T extends { id: string }> = Omit<T, 'id'> & {
	id?: string
}

export type Handler<Result = void> = () => Result
export type Handler1<Arg1 = void, Result = void> = (arg: Arg1) => Result
export type AsyncHandler<Result = void> = Handler<Promise<Result>>
export type AsyncHandler1<Arg1, Result = void> = Handler1<Arg1, Promise<Result>>

export type Comparator<T> = (a: T, b: T) => number
