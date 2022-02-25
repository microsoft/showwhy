#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import os
from typing import Dict, List
from abc import ABC, abstractmethod

from azure.cosmos import CosmosClient, PartitionKey

CONTAINER_NAME = 'results'
DB_NAME = 'ShowWhyData'
TIMEOUT = 60*60


class Database(ABC):

    @abstractmethod
    def get_container(self, db_name: str, container_name: str):
        pass

    @abstractmethod
    def insert_record(self, record: Dict) -> None:
        pass

    @abstractmethod
    def get_records_for_execution_id(execution_id: str) -> List[Dict]:
        pass


class CosmosDatabase(Database):

    def __init__(self, db_name, container_name):
        self.db_name = db_name
        self.container_name = container_name

    def get_container(self):
        verify_connection = False if os.environ.get(
            'DISABLE_SSL_COSMOS', False) else True

        client = CosmosClient.from_connection_string(
            os.environ['COSMOS_CONNECTION'], connection_verify=verify_connection, request_timeout=TIMEOUT)

        db = client.create_database_if_not_exists(
            id=self.db_name)
        container = db.create_container_if_not_exists(
            id=self.container_name, partition_key=PartitionKey(path='/execution_id'), offer_throughput=10000)

        return container


    def insert_record(self, record: Dict) -> None:
        container = self.get_container()
        item = container.upsert_item(record)
        return item


    def get_records_for_execution_id(self, execution_id: str) -> List[Dict]:
        container = self.get_container()
        return [
            {
                key: value
                for key, value in item.items() if not key.startswith('_')
            }
            for item in container.query_items(
                query='SELECT * FROM c WHERE c.execution_id = @execution_id',
                parameters=[dict(name='@execution_id', value=execution_id)])
        ]


class Mongo(Database):

    def __init__(self, db_name, container_name):
        self.db_name = db_name
        self.container_name = container_name

    def get_container(self):
        from pymongo import MongoClient

        # Provide the mongodb atlas url to connect python to mongodb using pymongo
        CONNECTION_STRING = os.environ['MONGO_CONNECTION']

        client = MongoClient(CONNECTION_STRING)

        db = client[self.db_name]

        container = db[self.container_name]
        container.create_index('execution_id')

        return container
    
    def insert_record(self, record: Dict) -> None:
        container = self.get_container()
        item = container.insert_one(record)
        return item
    
    def get_records_for_execution_id(self, execution_id: str) -> List[Dict]:
        container = self.get_container()
        return [
            {
                key: value
                for key, value in item.items() if not key.startswith('_')
            }
            for item in container.find({
                "execution_id": execution_id
            })
        ]
        

def get_db_client():
    return Mongo(DB_NAME, CONTAINER_NAME) if os.environ.get('MONGO_CONNECTION', False) else CosmosDatabase(DB_NAME, CONTAINER_NAME)
