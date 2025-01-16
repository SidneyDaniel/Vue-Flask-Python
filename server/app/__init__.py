from flask import Flask
from flask_cors import CORS
from pymongo.mongo_client import MongoClient 
from pymongo.server_api import ServerApi

import os 
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv('DATABASE_URL')
database_name = os.getenv('MONGO_DB_NAME')

app = Flask(__name__)
app.config.from_object(__name__)

CORS(app, resources={r'/*': {'origins': '*'}})

uri = database_url 
client = MongoClient(uri, server_api=ServerApi('1')) 
db = client[database_name]

try: 
    client.admin.command('ping') 
    print("Pinged your deployment. You successfully connected to MongoDB!") 
except Exception as e: 
    print(e)


from . import routes
