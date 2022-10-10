
library(synthdid)
library("rjson")

getEstimate <- function(setup, estimator) {
    if (estimator == "did") {
        return(did_estimate(setup$Y, setup$N0, setup$T0))
    } else if (estimator == "sc") {
        return(sc_estimate(setup$Y, setup$N0, setup$T0))
    } else {
        return(synthdid_estimate(setup$Y, setup$N0, setup$T0))
    }
}

execEstimator <- function(setup, estimator) {

    Y = setup$Y
    T0 = setup$T0
    T1 = ncol(Y) - T0
    N0 = setup$N0
    N1 = nrow(Y) - N0

    estimate = getEstimate(setup, estimator) 

    weights <- attr(estimate, "weights")

    lambda.synth = c(weights$lambda, rep(0, T1))
    lambda.target = c(rep(0, T0), rep(1 / T1, T1))
    omega.synth = c(weights$omega, rep(0, N1))
    omega.target = c(rep(0, N0), rep(1 / N1, N1))
    treated.post = omega.target %*% Y %*% lambda.target
    treated.pre = omega.target %*% Y %*% lambda.synth

    intercept.offset = c((omega.target - omega.synth) %*% Y %*% lambda.synth)
    control.post = omega.synth %*% Y %*% lambda.target
    control.pre = omega.synth %*% Y %*% lambda.synth

    obs.trajectory = as.numeric(omega.target %*% Y)
    # syn.trajectory = as.numeric(omega.synth %*% Y) + intercept.offset
    syn.trajectory = as.numeric(omega.synth %*% Y)

    # counterfactual value
    sdid.post = as.numeric(control.post + treated.pre - control.pre)

    # render
    time = as.numeric(timesteps(Y))
    # time before intervention (i.e., start of trajectory)
    pre.time = lambda.synth %*% time
    # time after intervention (i.e., end of trajectory)
    post.time = lambda.target %*% time

    control.name = 'synthetic control'
    treated.name = 'treated'
    treated = 1
    control = 2
    groups = factor(c(control, treated), labels = c(control.name, treated.name))
    lines = data.frame(x = rep(time, 2),
                    y = c(obs.trajectory, syn.trajectory),
                    color = rep(groups[c(treated, control)], each = length(time)))

    # Outputs a table of important synthetic controls and their corresponding weights
    # NOTE: irrelevant controls (i.e., those with negative weights) are truncated
    weighted_syn_controls_raw = synthdid_controls(estimate)

    # extract dimnames properly as an array of synthetic control units (e.g., state names)
    unit_list <- attr(weighted_syn_controls_raw, "dimnames")
    dim_names <- unlist(unit_list[1])
    
    weighted_synthdid_controls <- list(dimnames=dim_names, weights=weighted_syn_controls_raw)

    estimateDetails <- list(lines=lines,
                    sdid_estimate=estimate,
                    weighted_synthdid_controls=weighted_synthdid_controls,
                    time_before_intervention=pre.time,
                    time_after_intervention=post.time,
                    treated_pre_value=treated.pre,
                    treated_post_value=treated.post,
                    control_pre_value=control.pre,
                    control_post_value=control.post,
                    intercept_offset=intercept.offset,
                    counterfactual_value=sdid.post
                    )

    return(toJSON(estimateDetails)) #return(estimateDetails)
}
