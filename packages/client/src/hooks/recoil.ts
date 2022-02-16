import { useCallback } from 'react'
import { RecoilState, useRecoilState } from 'recoil'

export type ToggleCallback = () => void

export function useRecoilBasedToggle(
	state: RecoilState<boolean>,
): [boolean, ToggleCallback] {
	const [value, setValue] = useRecoilState(state)
	const toggle = useCallback(
		() => setValue((current: boolean) => !current),
		[setValue],
	)

	return [value, toggle]
}
