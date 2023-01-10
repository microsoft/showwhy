from collections import defaultdict

import numpy as np
import pandas as pd
from causallib.evaluation.weight_evaluator import calculate_covariate_balance


def stratification_covariate_balance(df, common_causes, treatments):
    df_long = df.melt(
        id_vars=treatments + ["strata", "propensity_score"],
        value_vars=common_causes,
        value_name="common_cause_value",
        var_name="covariate",
    )
    mean_diff = df_long.groupby(treatments + ["covariate", "strata"]).agg(mean_w=("common_cause_value", np.mean))
    mean_diff = mean_diff.groupby(["covariate", "strata"]).transform(lambda x: x.max() - x.min()).reset_index()
    mean_diff = mean_diff.query(f"{treatments[0]}==True")
    size_by_w_strata = df_long.groupby(["covariate", "strata"]).agg(size=("propensity_score", np.size)).reset_index()
    size_by_strata = df_long.groupby(["covariate"]).agg(size=("propensity_score", np.size)).reset_index()
    size_by_strata = pd.merge(size_by_w_strata, size_by_strata, on="covariate")
    mean_diff_strata = pd.merge(mean_diff, size_by_strata, on=("covariate", "strata"))

    stddev_by_w_strata = (
        df_long.groupby(["covariate", "strata"]).agg(stddev=("common_cause_value", np.std)).reset_index()
    )
    mean_diff_strata = pd.merge(mean_diff_strata, stddev_by_w_strata, on=["covariate", "strata"])
    mean_diff_strata["scaled_mean"] = (mean_diff_strata["mean_w"] / mean_diff_strata["stddev"]) * (
        mean_diff_strata["size_x"] / mean_diff_strata["size_y"]
    )
    mean_diff_strata = mean_diff_strata.groupby("covariate").agg(std_mean_diff=("scaled_mean", np.sum)).reset_index()
    mean_diff_overall = df_long.groupby(treatments + ["covariate"]).agg(mean_w=("common_cause_value", np.mean))
    mean_diff_overall = mean_diff_overall.groupby("covariate").transform(lambda x: x.max() - x.min()).reset_index()
    mean_diff_overall = mean_diff_overall[mean_diff_overall[treatments[0]] == True]  # noqa: E712
    stddev_overall = df_long.groupby(["covariate"]).agg(stddev=("common_cause_value", np.std)).reset_index()
    mean_diff_overall = pd.merge(mean_diff_overall, stddev_overall, on=["covariate"])
    mean_diff_overall["std_mean_diff"] = mean_diff_overall["mean_w"] / mean_diff_overall["stddev"]
    mean_diff_overall = mean_diff_overall[["covariate", "std_mean_diff"]]
    mean_diff_strata["abs_smd"] = "adjusted"
    mean_diff_overall["abs_smd"] = "unadjusted"
    return (
        pd.concat([mean_diff_overall, mean_diff_strata])
        .pivot_table(values="std_mean_diff", index=["covariate"], columns=["abs_smd"])
        .to_dict()
    )


def weighting_covariate_balance(df, common_causes, treatments):
    return (
        calculate_covariate_balance(df[common_causes], df[treatments[0]], df["ips_weight"])
        .rename(columns={"weighted": "adjusted", "unweighted": "unadjusted"})
        .to_dict()
    )


COVARIATE_BALANCE_FUNC_MAPPING = defaultdict(lambda **kwargs: None)
# TODO: Covariate balance for score_matching
# COVARIATE_BALANCE_FUNC_MAPPING[
#     "backdoor.propensity_score_matching"
# ] = ...
COVARIATE_BALANCE_FUNC_MAPPING["backdoor.propensity_score_stratification"] = stratification_covariate_balance
COVARIATE_BALANCE_FUNC_MAPPING["backdoor.propensity_score_weighting"] = weighting_covariate_balance
