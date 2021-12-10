# ShowWhy Functions

# Introduction

ShowWhy Functions is the backend code for ShowWhy, it contains all the logic for the data analysis required. It uses [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) to orchestrate all the behind-the-scenes of the ShowWhy application.

# Getting Started

## Installation process

### Pre-requisites

- Windows Subsystem for Linux (WSL): https://docs.microsoft.com/en-us/windows/wsl/setup/environment (Only for Windows users)

- Docker (For all platforms):

  - Windows: https://docs.docker.com/desktop/windows/install/
  - MAC: https://docs.docker.com/desktop/mac/install/
  - Ubuntu: https://docs.docker.com/engine/install/ubuntu/

- Docker Compose (For Linux Users):
  - Docker Compose: https://docs.docker.com/compose/install/ (look at the correct tab depending on your Operating System)

# Build and Test

## Windows

Open a Poweshell terminal, [navigate to the directory](https://docs.microsoft.com/en-us/powershell/scripting/samples/managing-current-location?view=powershell-7.2) where this project is located and run one of the commands at the `Commands` section of this README.

## MAC/LINUX:

Open a terminal, navigate to the directory where this project is located and run.

**NOTE:** For linux you will need to replace the `-` in `docker-compose` for a space in order for the commands to work, for example: `docker-compose up --build -d` in linux should be `docker compose up --build -d`

## Commands

- `docker-compose up --build -d`: Start all the containers (UI and Backend with all the dependencies) - Useful for users to start using ShowWhy
- `docker-compose up --build -d client`: Start only the UI container
- `docker-compose up --build -d reverseproxy`: Start all the containers needed for the backend and proxy for UI (the UI is excluded) - Useful for UI development
- `docker-compose up --build -d functions`: Start all the containers needed for the backend except the proxy - Useful for backend development

To stop using showwhy you can run these commands on the same powershell terminal:

- `docker-compose stop`: Stops the containers without removing anything
- `docker-compose down -v`: Stops and removes all the containers and volumes used - Use when you stop using ShowWhy
- `docker-compose rm --force`: Use after `docker-compose down -v` to delete all the data used in previous ShowWhy runs

## Testing

After getting the ShowWhy functions container running you can use different tools to test the API directly (without using the UI)

### Testing with cURL:

- Upload a file into the backend:

```
curl --location --request POST 'http://localhost:7071/api/UploadFile?session_id=some_session_id&code=local-docker-key' \
--form 'file=@"/C:/Users/someuser/somefile.csv"'
```

- Load a file into a session:

```
curl --location --request POST ' http://localhost:7071/api/orchestrators/ExecuteNodeOrchestrator?code=local-docker-key' \
--header 'Content-Type: application/json' \
--data-raw '{
  "session_id": "some_session_id",
  "node_data": {
    "type": "LoadNode",
    "url": "blob://result_from_previous_call",
    "result": "name_of_dataset",
    "id": "Load Dataset",
    "value": "Load Dataset",
    "name": "Load Dataset"
  }
}'
```

- Estimate Effect

```
curl --location --request POST 'http://localhost:7071/api/orchestrators/ExecuteNodeOrchestrator?code=local-docker-key' \
--header 'Content-Type: application/json' \
--data-raw '{
    "session_id": "some_session_id",
    "node_data": {
        "population_specs": [
            {
                "type": "Primary",
                "label": "Label 1",
                "dataframe": "name_of_dataset",
                "population_id": "population_id"
            },
            {
                "type": "Secondary",
                "label": "Label 2",
                "dataframe": "name_of_dataset",
                "population_id": "population_id_2"
            }
        ],
        "treatment_specs": [
            {
                "type": "Primary",
                "label": "Label 3",
                "variable": "variable_1"
            },
            {
                "type": "Secondary",
                "label": "Label 4",
                "variable": "variable_2"
            },
            {
                "type": "Secondary",
                "label": "Label 5",
                "variable": "variable_3"
            }
        ],
        "outcome_specs": [
            {
                "type": "Primary",
                "label": "Label 6",
                "variable": "variable_4"
            }
        ],
        "model_specs": [
            {
                "type": "Maximum Model",
                "label": "Maximum Model",
                "confounders": [
                    "confounder_1",
                    "confounder_2",
                    "confounder_3"
                ],
                "outcome_determinants": [
                    "outcome_determinant_1",
                    "outcome_determinant_2",
                    "outcome_determinant_3"
                ]
            },
            {
                "type": "Minimum Model",
                "label": "Minimum Model",
                "confounders": [],
                "outcome_determinants": [
                    "outcome_determinant_1",
                    "outcome_determinant_2"
                ]
            },
            {
                "type": "Unadjusted Model",
                "label": "Unadjusted Model",
                "confounders": [],
                "outcome_determinants": []
            }
        ],
        "estimator_specs": [
            {
                "type": "Treatment Assignment Model",
                "label": "Inverse Propensity Weighting",
                "require_propensity_score": true,
                "method_name": "backdoor.propensity_score_weighting"
            },
            {
                "type": "Treatment Assignment Model",
                "label": "Propensity Score Stratification",
                "require_propensity_score": true,
                "method_name": "backdoor.propensity_score_stratification"
            },
            {
                "type": "Outcome Model",
                "label": "Linear Doubly Robust Learner",
                "require_propensity_score": true,
                "method_name": "backdoor.econml.dr.LinearDRLearner"
            },
            {
                "type": "Outcome Model",
                "label": "Linear Regression",
                "require_propensity_score": false,
                "method_name": "backdoor.linear_regression"
            },
            {
                "type": "Treatment Assignment Model",
                "label": "Propensity Score Matching",
                "require_propensity_score": true,
                "method_name": "backdoor.propensity_score_matching"
            },
            {
                "type": "Outcome Model",
                "label": "Forest Doubly Robust Learner",
                "require_propensity_score": true,
                "method_name": "backdoor.econml.dr.ForestDRLearner"
            }
        ],
        "refuter_specs": {
            "num_simulations": 10
        },
        "confidence_interval": true,
        "type": "EstimateEffectNode",
        "result": "estimate_results",
        "id": "Estimate Effects",
        "value": "Estimate Effects",
        "name": "Estimate Effects"
    }
}'
```
