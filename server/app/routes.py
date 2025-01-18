from flask import Response, request, jsonify
from . import app, db
from bson.json_util import dumps


# @app.route('/ping', methods=['GET'])
# def ping_pong():
#     return jsonify('pong')

@app.route('/getUsers', methods=['GET'])
def get_users():
    users = list(db.users.find({}))
    return Response(dumps(users), status=200, mimetype='application/json')

@app.route('/addUser', methods=['POST'])
def add_user():
    try:
        user = request.json
        result = db.users.insert_one(user)
        user['_id'] = str(result.inserted_id)
        response = jsonify(user) 
        response.status_code = 201
        print(user)
        print(response)
        return response
    except Exception as e:
        print(e)
        return Response(str(e), status=500, mimetype='application/json')

@app.route('/deleteUsers', methods=['DELETE'])
def delete_user():
    try:
        usernames = request.json.get('listOfUsers', [])
        print(usernames)
        if not usernames:
            return Response("No usernames provided", status=400, mimetype='application/json')
        
        users_to_delete = db.users.find({'username': {'$in': usernames}}) 
        user_ids = [user['_id'] for user in users_to_delete]

        result = db.users.delete_many({'_id': {'$in':user_ids}})

        if result.deleted_count == 0:
            return Response("No users were deleted", status=204)

        return jsonify({'deleted_count':result.deleted_count}), 200
    except Exception as e:
        print(e)
        return Response(str(e), status=500, mimetype='application/json')
    
@app.route('/updateUser', methods=['PUT'])
def update_user():
    try:
        data = request.json
        current_user_name = data.get('currentUserName')
        update_user = { 
            'username': data.get('username'), 
            'password': data.get('password'), 
            'roles': data.get('roles'), 
            'preferences': data.get('preferences'),
            'active': data.get('active')
        }
        result = db.users.update_one(
            {'username': current_user_name},
            {'$set': update_user}
        )

        if result.matched_count == 1: 
            return Response(status=204)  
        else: 
            return Response(status=404)
    except Exception as e:
        print(e)
        return Response(str(e), status=500, mimetype='application/json')