import json
import logging
import os
from typing import Dict

import azure.durable_functions as df
import azure.functions as func

_log = logging.getLogger(__name__)


class ShowWhyDurableOrchestrationClient(df.DurableOrchestrationClient):
    def __init__(self, *args, **kwargs):
        super(ShowWhyDurableOrchestrationClient,
              self).__init__(*args, **kwargs)

    def create_http_management_payload(self, instance_id: str) -> Dict[str, str]:
        """Create a dictionary of orchestrator management urls.
        Parameters
        ----------
        instance_id : str
            The ID of the orchestration instance to check.
        Returns
        -------
        Dict[str, str]
            a dictionary object of orchestrator instance management urls
        """
        http_management_payload = super(
            ShowWhyDurableOrchestrationClient, self).create_http_management_payload(instance_id)

        return self.secure_management_apis(http_management_payload)

    def create_check_status_response(
            self, request: func.HttpRequest, instance_id: str) -> func.HttpResponse:
        """Create a HttpResponse that contains useful information for \
        checking the status of the specified instance.
        Parameters
        ----------
        request : HttpRequest
            The HTTP request that triggered the current orchestration instance.
        instance_id : str
            The ID of the orchestration instance to check.
        Returns
        -------
        HttpResponse
           An HTTP 202 response with a Location header
           and a payload containing instance management URLs
        """
        http_management_payload = self.get_client_response_links(
            request, instance_id)

        http_management_payload = self.secure_management_apis(
            http_management_payload)

        response_args = {
            "status_code": 202,
            "body": json.dumps(http_management_payload),
            "headers": {
                "Content-Type": "application/json",
                "Location": http_management_payload["statusQueryGetUri"],
                "Retry-After": "10",
            },
        }
        return func.HttpResponse(**response_args)

    def secure_management_apis(self, http_management_payload):
        # If not running locally, modify the management urls to use https
        if not os.environ.get('LOCAL_EXECUTION', False):
            for api in http_management_payload:
                http_management_payload[api] = http_management_payload[api].replace(
                    'http://', 'https://')

        return http_management_payload
