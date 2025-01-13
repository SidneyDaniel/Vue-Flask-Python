from flask import Response
from . import app, db
from bson.json_util import dumps


@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong')

@app.route('/users', methods=['GET'])
def get_users():
    users = list(db.users.find({}))
    return Response(dumps(users), mimetype='application/json')

