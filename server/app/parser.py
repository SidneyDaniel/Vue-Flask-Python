import json
from pymongo import MongoClient
from dataclasses import dataclass, asdict
from datetime import datetime

@dataclass
class UserPreferences:
	timezone: str

@dataclass
class User:
	username: str
	password: str
	roles: list
	preferences: UserPreferences
	created_ts: float
	active: bool = True

def parse_roles(user_data):
      roles = []
      if user_data.get('is_user_admin'): 
        roles.append('admin') 
      if user_data.get('is_user_manager'): 
        roles.append('manager') 
      if user_data.get('is_user_tester'): 
        roles.append('tester') 
      return roles

def load_data(json_file):
     with open(json_file, 'r') as file:
          data = json.load(file)
          users = []
          for user_data in data['users']:
              user = User(
                   username=user_data['user'],
                   password=user_data['password'], 
                   roles=parse_roles(user_data), 
                   preferences=UserPreferences(timezone=user_data['user_timezone']), 
                   active=user_data['is_user_active'], 
                   created_ts=datetime.fromisoformat(user_data['created_at']).timestamp()
              )
              users.append(asdict(user))
          return users
     
def import_data_to_mondgodb(data, db_name, collection_name):
    client = MongoClient('<DataBaseUrl>') 
    db = client[db_name] 
    collection = db[collection_name] 
    collection.insert_many(data) 
    print(f"Imported {len(data)} records to {db_name}.{collection_name}")

if __name__== "__main__":
     json_file = '../../data/udata.json'
     data = load_data(json_file)
     import_data_to_mondgodb(data, '<data_base_name>','users')


# client = pymongo.MongoClient(<CONNECTION STRING>)
# db = client.<DATABASE>
# collection = db.<COLLECTION>
# requesting = []

# with open(r"udata") as f:
#     for jsonObj in f:
#         myDict = json.loads(jsonObj)
#         requesting.append(InsertOne(myDict))

# result = collection.bulk_write(requesting)
# client.close()
