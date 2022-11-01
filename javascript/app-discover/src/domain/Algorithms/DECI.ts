/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface DECIParams {
	model_options?: DECIModelOptions
	training_options?: DECITrainingOptions
}

export enum VarDistAMode {
	Simple = 'simple',
	Enco = 'enco',
	True = 'true',
	Three = 'three',
}

export enum ModeAdjacency {
	Upper = 'upper',
	Lower = 'lower',
	Learn = 'learn',
}

export enum AnnealEntropy {
	Linear = 'linear',
	Noanneal = 'noanneal',
}

export interface DECIModelOptions {
	imputation?: boolean
	lambda_dag?: number
	lambda_sparse?: number
	tau_gumbel?: number
	var_dist_A_mode?: VarDistAMode
	imputer_layer_sizes?: number[]
	mode_adjacency?: ModeAdjacency
	norm_layers?: boolean
	res_connection?: boolean
	encoder_layer_sizes?: number[]
	decoder_layer_sizes?: number[]
	cate_rff_n_features?: number
	cate_rff_lengthscale?: number | number[]
}

export interface DECITrainingOptions {
	max_steps_auglag: number
	max_auglag_inner_epochs: number
	learning_rate?: number
	standardize_data_mean?: boolean
	standardize_data_std?: boolean
	rho?: number
	safety_rho?: number
	alpha?: number
	safety_alpha?: number
	tol_dag?: number
	progress_rate?: number
	max_p_train_dropout?: number
	reconstruction_loss_factor?: number
	anneal_entropy?: AnnealEntropy
}
