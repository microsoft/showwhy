export type OptionalId<T extends { id: string }> = Omit<T, 'id'> & {
	id?: string
}
