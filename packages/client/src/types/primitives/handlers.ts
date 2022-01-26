/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type Handler0<Result = void> = () => Result

export type Handler1<Arg1, Result = void> = (arg: Arg1) => Result

export type Handler2<Arg1, Arg2, Result = void> = (
	arg: Arg1,
	arg2: Arg2,
) => Result

export type Handler3<Arg1, Arg2, Arg3, Result = void> = (
	arg: Arg1,
	arg2: Arg2,
	arg3: Arg3,
) => Result

export type Handler4<Arg1, Arg2, Arg3, Arg4, Result = void> = (
	arg: Arg1,
	arg2: Arg2,
	arg3: Arg3,
	arg4: Arg4,
) => Result
