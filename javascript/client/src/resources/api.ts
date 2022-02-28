import { FetchApiInteractor } from '@showwhy/api-client'
import { getEnv } from './getEnv'
import { getStorageItem, SESSION_ID_KEY } from '../utils'

const env = getEnv()

export const api = new FetchApiInteractor(
	env.BASE_URL,
	env.CHECK_STATUS_API_KEY,
	env.VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY,
	env.DOWNLOAD_FILES_API_KEY,
	env.ORCHESTRATORS_API_KEY,
	env.UPLOAD_FILES_API_KEY,
	env.EXECUTIONS_NUMBER_API_KEY,
	() => getStorageItem(SESSION_ID_KEY) || '',
)
