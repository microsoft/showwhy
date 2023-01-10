import copy
import os

import numpy as np
import pandas as pd
from fastapi import APIRouter
from fastapi.staticfiles import StaticFiles
from synthdid.model import SynthDID

from backend.events.rpy import exec_estimator_R
from backend.events.types import Data, OutputLines, OutputResult, WeightedSynthdidControls

events_router = APIRouter()


@events_router.get("/")
def main():
    return {"message": "events api is healthy"}


# import cProfile as profile
# import pstats


# flake8: noqa: C901
@events_router.post("/")
async def execute_causal_estimator(data: Data):
    # container for the estimated results (one entry for the output related to each treated unit)
    outputs = []

    # prof = profile.Profile()

    # first ensure that all units are NOT treated
    all_times = []
    all_units = []
    all_times_set = set()
    all_units_set = set()
    for row in data.input_data:
        row["treated"] = 0
        if row["date"] not in all_times_set:
            all_times.append(row["date"])
            all_times_set.add(row["date"])
        if row["unit"] not in all_units_set:
            all_units.append(row["unit"])
            all_units_set.add(row["unit"])

    first_date = min(all_times)
    last_date = max(all_times)

    use_pysynthdid = True if data.lib == "pysynthdid" else False

    time_mapping_applied = False
    # to cache the consistent time window needed
    #  when handling treated units with different treatment periods
    consistent_time_window = None
    # a map that tracks how each time/date is abstracted or mapped to its index
    time_to_index_map = {}

    def compute_estimator(unit, clonedInputData, treatment_date):
        print("----- computing causal impact estimator for", unit, "-------")

        # prof.enable()

        df = pd.DataFrame.from_dict(clonedInputData)
        unit_names = df["unit"].unique()

        if use_pysynthdid:
            # start by defining the default pre/post terms considering the full time range
            PRE_TEREM = [first_date, treatment_date - 1]
            POST_TEREM = [treatment_date, last_date]
            #
            # if units with multiple times are detected,
            #  then the time range may have been limited within a consistent window
            #  and thus we pre/post terms must be updated
            #
            if time_mapping_applied:
                # time values been shifted and aligned
                mapped_treated_date = time_to_index_map[treatment_date]
                shifted_first_date = mapped_treated_date - consistent_time_window[0]
                shifted_last_date = mapped_treated_date + consistent_time_window[1]
                PRE_TEREM = [shifted_first_date, mapped_treated_date - 1]
                POST_TEREM = [mapped_treated_date, shifted_last_date]
            else:
                if consistent_time_window is not None:
                    # a fixed window (reflecting the non-overlapped time steps) has been used
                    PRE_TEREM = [first_date, consistent_time_window[0]]
                    POST_TEREM = [consistent_time_window[1], last_date]

            TREATMENT = [unit]

            # transpose to convert from the long-panel format to the a matrix of NxT
            df = df.pivot(index="date", columns="unit", values="value")[unit_names]

            # initialize and run the estimator
            estimate = SynthDID(df, PRE_TEREM, POST_TEREM, TREATMENT)
            model = data.estimator
            estimate.fit()

            # calculate the estimated effect value
            hat_tau = estimate.hat_tau(model)

            #
            # use the estimate result(s) to generate intermediate values needed for rendering
            # by the front end
            #
            result = pd.DataFrame({"actual_y": estimate.target_y()})
            post_actual_treat = result.loc[estimate.post_term[0] :, "actual_y"].mean()
            post_point = np.mean(estimate.Y_post_c.index)

            #
            # calculate the weights
            #
            units_except_treated = [unt for unt in unit_names if unt not in data.treated_units]
            if model != "did":
                if model == "sdid":
                    weights_df = estimate.estimated_params(model)[0]
                elif model == "sc":
                    weights_df = estimate.estimated_params(model)

                weights_df.rename(
                    columns={
                        "sdid_weight": "unit_weights",
                        "sc_weight": "unit_weights",
                    },
                    inplace=True,
                )
                # weighted control units should always exclude any treated unit(s)
                #  and only include valid control units
                weights_df = weights_df[weights_df["features"].isin(units_except_treated)]
                weights_df.sort_values(by=["unit_weights"], ascending=False, inplace=True)
                negative_weights_filter = weights_df["unit_weights"] > 0
                # sort and discard negative weights, then create WeightedSynthdidControls
                weights_df_filtered = weights_df[negative_weights_filter]
                mass = 0.9
                # include only weights up to a cumulative sum of "mass"
                final_weights = weights_df_filtered.iloc[
                    : (weights_df_filtered["unit_weights"].cumsum() == mass).idxmax() + 1,
                    :,
                ]

            else:
                count = len(units_except_treated)
                equal_weight = 1 / count
                final_weights = pd.DataFrame(
                    {
                        "features": units_except_treated,
                        "unit_weights": [equal_weight] * count,
                    }
                )

            # sdid
            if data.estimator == "sdid":
                pre_point = estimate.Y_pre_c.index @ estimate.hat_lambda
                result[model] = estimate.sdid_trajectory()
                pre_treat = (estimate.Y_pre_t.T @ estimate.hat_lambda).values[0]
                pre_sdid = result[model].head(len(estimate.hat_lambda)) @ estimate.hat_lambda
                post_sdid = result.loc[estimate.post_term[0] :, model].mean()
                counterfactual_post_treat = pre_treat + (post_sdid - pre_sdid)

                control_pre_value = pre_sdid
                control_post_value = post_sdid
                intercept_offset = pre_treat - pre_sdid

            # sc
            if data.estimator == "sc":
                pre_point = estimate.Y_pre_c.index @ estimate.hat_lambda
                result[model] = estimate.sc_potentical_outcome()
                pre_treat = estimate.Y_pre_t.mean()
                pre_sc = result.loc[: estimate.pre_term[1], model].mean()
                post_sc = result.loc[estimate.post_term[0] :, model].mean()
                counterfactual_post_treat = post_sc

                control_pre_value = pre_sc
                control_post_value = post_sc
                intercept_offset = 0  # synthetic control method has no intercept

            # did
            if data.estimator == "did":
                Y_pre_t = estimate.Y_pre_t.copy()
                Y_post_t = estimate.Y_post_t.copy()
                if type(Y_pre_t) != pd.DataFrame:
                    Y_pre_t = pd.DataFrame(Y_pre_t)
                if type(Y_post_t) != pd.DataFrame:
                    Y_post_t = pd.DataFrame(Y_post_t)
                pre_point = np.mean(estimate.Y_pre_c.index)
                result[model] = estimate.df[estimate.control].mean(axis=1)
                pre_treat = Y_pre_t.mean(axis=1).mean()
                pre_did = result.loc[: estimate.pre_term[1], model].mean()
                post_did = result.loc[estimate.post_term[0] :, model].mean()
                counterfactual_post_treat = pre_treat + (post_did - pre_did)

                control_pre_value = pre_did
                control_post_value = post_did
                intercept_offset = pre_treat - pre_did

            # build lines data
            times = all_times
            if consistent_time_window is not None:
                times = []
                if time_mapping_applied:
                    # time values has been shifted and aligned, so the source values for the X axis
                    #  should accordingly reflect the mapped time steps
                    times = sorted(list(set(time_to_index_map.values())))
                else:
                    # time values have been filtered, so consider only the subset of dates/times
                    #  that match the selected consistent window
                    for time in all_times:
                        if time < consistent_time_window[0] or time >= consistent_time_window[1]:
                            times.append(time)
            # we need two lines for each output (hence the join of two lists)
            line_values = result["actual_y"].tolist() + result[model].tolist()
            list_sc_labels = ["synthetic control"] * len(times)
            list_treated_labels = ["treated"] * len(times)
            line_labels = list_treated_labels + list_sc_labels

            #
            # construct the output object from the estimate and its intermediate results
            #
            lines = OutputLines(times + times, line_values, line_labels)
            sdid_estimate = hat_tau

            weighted_synthdid_controls = WeightedSynthdidControls(
                unit_names=final_weights["features"].tolist(),
                weights=final_weights["unit_weights"].tolist(),
            )

            time_before_intervention = int(pre_point)
            time_after_intervention = int(post_point)
            treated_pre_value = pre_treat
            treated_post_value = post_actual_treat

            counterfactual_value = counterfactual_post_treat

            output = OutputResult(
                lines,
                sdid_estimate,
                weighted_synthdid_controls,
                time_before_intervention,
                time_after_intervention,
                treated_pre_value,
                treated_post_value,
                control_pre_value,
                control_post_value,
                intercept_offset,
                counterfactual_value,
            )

            outputs.append({"unit": unit, "output": output})
        else:
            # use the original synthdid R package for estimating the results
            output = exec_estimator_R(df, data.estimator)  # OutputResult
            outputs.append({"unit": unit, "output": output})

        print("----- done computing causal impact estimator for", unit, "-------")

        # prof.disable()

    num_treated_units = len(data.treated_units)  # how many units we have

    # FIXME: need to handle placebo when having multiple treated units

    # placebo is only valid if no treated units are selected (i.e., discovery),
    #  or if a single unit is treated
    if num_treated_units <= 1 and data.compute_placebos:
        # kick off placebo sweep
        units = {row["unit"] for row in data.input_data}
        treatment_date = data.treatment_start_dates[0]  # we should except a single treatment date
        for unit in units:
            # let's pretend the current unit is our treated, update the input data accordingly
            clonedInputData = copy.deepcopy(data.input_data)
            for row in clonedInputData:
                if row["unit"] == unit:
                    row["treated"] = 0 if row["date"] < treatment_date else 1

            #
            # now lets use clonedInputData to compute and cache the output
            #
            compute_estimator(unit, clonedInputData, treatment_date)
    else:
        # handle single vs. multiple treated units
        if num_treated_units == 1:
            treatment_date = data.treatment_start_dates[0]  # we should except a single treatment date
            for row in data.input_data:
                if row["unit"] == data.treated_units[0]:
                    row["treated"] = 0 if row["date"] < treatment_date else 1
            compute_estimator(data.treated_units[0], data.input_data, treatment_date)
        else:
            #
            # we have multiple treated units
            #

            N = len(all_units)
            T = len(all_times)

            treated_units_set = set(data.treated_units)

            # need to examine if treated units experience same or different treatment dates
            unique_treatment_dates = list(set(data.treatment_start_dates))
            if len(unique_treatment_dates) == 1:
                # all unit(s) are treated using the same treatment date
                # so, estimate for each unit and aggregate output")

                # NOTE: the underlying synthdid R package is able to handle such a case
                #  where multiple units are treated at the same time, and thus there is no need to
                #  kick off the treatment multiple times for each unit unless there is a need to
                #  obtain the individual treatment effect from each unit separately
                #
                #  i.e., this step can be simplified especially if the goal is to show
                #        the mean treatment effect for the whole treat group at once

                # kick off the multi-treatment loop
                for unit in data.treated_units:
                    # clone the data,
                    #  remove other treated units (except current one),
                    #  and mark currnet unit as treated
                    clonedInputData = copy.deepcopy(data.input_data)
                    treated_units_except_current = treated_units_set.copy()
                    treated_units_except_current.remove(unit)
                    clonedInputData = [
                        item for item in clonedInputData if item["unit"] not in treated_units_except_current
                    ]
                    for row in clonedInputData:
                        if row["unit"] == unit:
                            row["treated"] = 0 if row["date"] < unique_treatment_dates[0] else 1

                    compute_estimator(unit, clonedInputData, unique_treatment_dates[0])
            else:
                #
                # multiple units experienced treatment at different times
                #

                if data.time_alignment == "staggered_design":
                    # Reference: https://matheusfacure.github.io/python-causality-handbook/25-Synthetic-Diff-in-Diff.html
                    #
                    # STEP 0: Aggregate around treatment periods (optional)
                    #          the result of that is data for each assignment block or groups around treatment periods
                    # STEP 1: Run the estimator for each treated unit/group
                    #          include control units and exclude all other treated units/groups
                    #         This will result in a single estimate at each treatment period
                    #          e.g., assume one treated unit at 1989 and 3 treated units at 1993
                    #                staggered_effects = {1989: -15.60, 1993: -17.24}
                    #         NOTE that no time alignment, e.g., shift or overlapping removal, is applied
                    # STEP 2: Compute the mean treatment effect via weighted average:
                    #          2.a) calculate the number of treated time steps at each treatment period
                    #                based on the number of units in each block that share the same treatment period
                    #                e.g., weights:  {1989: 12, 1993: 24}
                    #                Here, a total of 36 treatment instances:
                    #                 the usual 12 post-treatment periods for California (at 1989) plus
                    #                 8 treatment periods (1993-2000) for each of the other treated unit
                    #          2.b) calculate the weighted avergae
                    #               att = sum([effect * weights[year] / sum(weights.values()) for year, effect in staggered_effects.items()])
                    #               the weight for the first effect (at 1989) is 12/36 and for the second (at 1993) is 24/36
                    #
                    # NOTE the last step would be done at the frontend

                    # kick off the multi-treatment loop
                    for indx, unit in enumerate(data.treated_units):
                        # clone the data,
                        #  remove other treated units (except current one),
                        #  and mark currnet unit as treated
                        clonedInputData = copy.deepcopy(data.input_data)
                        treated_units_except_current = treated_units_set.copy()
                        treated_units_except_current.remove(unit)
                        clonedInputData = [
                            item for item in clonedInputData if item["unit"] not in treated_units_except_current
                        ]
                        for row in clonedInputData:
                            if row["unit"] == unit:
                                row["treated"] = 0 if row["date"] < data.treatment_start_dates[indx] else 1
                        compute_estimator(unit, clonedInputData, data.treatment_start_dates[indx])
                else:
                    #
                    # time alignment is needed (i.e., not staggered design)
                    #

                    # print("identify consistent window then estimate for each unit")

                    # for each treatment date, find its index in the list of data's time range
                    T0 = []  # a list of indices of the treated date for all treated units
                    # e.g., if data range is [1980, 1981, ..., 2000]
                    #       and the treated dates for two units are 1990 and 1995
                    #       then T0 would be [10, 15]
                    for treatment_date in data.treatment_start_dates:
                        T0.append(all_times.index(treatment_date))

                    # initially, all units are non-treated; an array of N
                    unit_treatment_periods = np.full(N, np.nan)

                    # loop through all treated units (or treated dates)
                    #  and update the "unit_treatment_periods"
                    #  (note that we assume each treated unit to have a corresponding treatment date)
                    for index, item in enumerate(T0):
                        unitIndex = all_units.index(data.treated_units[index])
                        unit_treatment_periods[unitIndex] = item

                    # find consistent window (to handle the existence of multiple treated units/periods)
                    finite_t_idx = unit_treatment_periods[np.isfinite(unit_treatment_periods)].astype("int")
                    t_max_before = min(finite_t_idx[finite_t_idx >= 1])
                    t_max_after = T - max(finite_t_idx[finite_t_idx <= (T - 1)])

                    # when estimating for each treated unit, we need to consider data indices as follows:
                    # pre_treatment_period = [0, t_max_before]
                    # post_treatment_period = [T - t_max_after, T - 1]
                    # print("pre_treatment_period", pre_treatment_period)
                    # print("post_treatment_period", post_treatment_period)

                    # align consistent time window
                    # i.e. keep only data that is pre-treatment and post-treatment for all treated units
                    date_at_t_max_before = all_times[t_max_before]
                    date_at_t_max_after = all_times[T - t_max_after]

                    if data.time_alignment == "fixed_no_overlap":
                        #
                        # use a consistent time window with a fixed (start/end) range for all units
                        #

                        # filter input raw data by only including records before/after the specified times
                        filteredInputData = [
                            item
                            for item in data.input_data
                            if item["date"] < date_at_t_max_before or item["date"] >= date_at_t_max_after
                        ]

                        # cache the consistent time window RANGE
                        consistent_time_window = [
                            float(date_at_t_max_before),
                            float(date_at_t_max_after),
                        ]

                        # kick off the multi-treatment loop
                        for unit in data.treated_units:
                            # clone the data,
                            #  remove other treated units (except current one),
                            #  and mark currnet unit as treated
                            clonedInputData = copy.deepcopy(filteredInputData)
                            treated_units_except_current = treated_units_set.copy()
                            treated_units_except_current.remove(unit)
                            clonedInputData = [
                                item for item in clonedInputData if item["unit"] not in treated_units_except_current
                            ]
                            for row in clonedInputData:
                                # treatment start for all units at date_at_t_max_before
                                if row["unit"] == unit:
                                    row["treated"] = 0 if row["date"] < date_at_t_max_before else 1

                            compute_estimator(unit, clonedInputData, date_at_t_max_before)
                    else:
                        #
                        # use a consistent time window with a fixed size
                        #  but a different (start/end) range for each unit
                        #

                        # cache the consistent time window SIZE
                        left_size = t_max_before  # also known as the pivot
                        right_size = t_max_after
                        consistent_time_window = [float(left_size), float(right_size)]

                        # kick off the multi-treatment loop
                        for indx, unit in enumerate(data.treated_units):
                            #
                            # In other words: For the current unit, shift and align the data a follows:
                            #  only consider pre-treatment records
                            #  starting from the current unit's treatment time
                            #  and by going no more than left_size time steps in the past
                            #   similarly,
                            #  only consider post-treatment records
                            #  starting from the current unit's treatment time
                            #  and by going no more than right_size time steps in the future

                            treatment_date_for_unit = data.treatment_start_dates[indx]
                            treatment_index_for_unit = all_times.index(treatment_date_for_unit)

                            min_time_index = treatment_index_for_unit - left_size
                            max_time_index = treatment_index_for_unit + right_size - 1
                            min_time = all_times[min_time_index]
                            max_time = all_times[max_time_index]

                            # clone the data
                            clonedInputData = copy.deepcopy(data.input_data)

                            # filter records outside the consistent window
                            # i.e., only consider data with dates/times within the consistent window
                            clonedInputData = [
                                item
                                for item in clonedInputData
                                if item["date"] >= min_time and item["date"] <= max_time
                            ]

                            #  remove other treated units (except current one)
                            treated_units_except_current = treated_units_set.copy()
                            treated_units_except_current.remove(unit)
                            clonedInputData = [
                                item for item in clonedInputData if item["unit"] not in treated_units_except_current
                            ]

                            # mark currnet unit as treated
                            for row in clonedInputData:
                                if row["unit"] == unit:
                                    row["treated"] = 0 if row["date"] < treatment_date_for_unit else 1

                            # map actual dates/times to indices
                            time_index = 0
                            for time in range(min_time, max_time + 1):
                                time_to_index_map[time] = time_index
                                time_index = time_index + 1
                            for row in clonedInputData:
                                row["date"] = time_to_index_map[row["date"]]
                            time_mapping_applied = True

                            compute_estimator(unit, clonedInputData, treatment_date_for_unit)

    # print profiling output
    # stats = pstats.Stats(prof).strip_dirs().sort_stats("cumtime")
    # stats.print_stats(10) # top 10 rows

    return {
        "message": "ok",
        "outputs": outputs,
        "compute_placebos": data.compute_placebos,
        "consistent_time_window": consistent_time_window,
        "time_mapping_applied": time_mapping_applied,
    }


if os.path.isdir("public"):
    events_router.mount("/", StaticFiles(directory="public", html=True), name="root")
