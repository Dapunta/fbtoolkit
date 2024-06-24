import requests

from flask import Flask, request, jsonify
from flask_cors import CORS
from facebook.login import LoginCookie, LoginEmail, TokenEAAG, TokenEAAB
from facebook.post import GetPost, GetReactCount

app = Flask(__name__)
CORS(app)

#--> Global Variable

facebook_api = '/facebook-api'
facebook_service = ['/login', '/token', '/post', '/react']

instagram_api = '/instagram-api'
instagram_service = []

twitter_api = '/twitter-api'
twitter_service = []

#--> Error Handling

def ForgetParam(data:dict) -> list:
    return([str(a) for a,b in data.items() if b == None])

#--> Main Route

@app.route('/')
def main():
    return jsonify({
        'facebook': {
            'name':'Facebook API',
            'version':1,
            'host':request.url_root.rstrip('/'),
            'route':facebook_api,
            'url':request.url_root.rstrip('/') + facebook_api
        },
        'instagram': {
            'name':'Instagram API',
            'version':0,
            'host':request.url_root.rstrip('/'),
            'route':instagram_api,
            'url':request.url_root.rstrip('/') + instagram_api
        },
        'twitter': {
            'name':'Twitter API',
            'version':0,
            'host':request.url_root.rstrip('/'),
            'route':twitter_api,
            'url':request.url_root.rstrip('/') + twitter_api
        },
    })

#--> Facebook

# Route
@app.route(facebook_api)
def fbroute():
    return jsonify({
        'count':len(facebook_service),
        'service': [request.url_root.rstrip('/') + facebook_api + i for i in facebook_service],
    })

# Login
@app.route(facebook_api + facebook_service[0])
def login():
    parameter = {
        'email'   : request.args.get('email', None),
        'password': request.args.get('password', None),
        'cookie'  : request.args.get('cookie', None)}
    if parameter['email'] and parameter['password']: response_data = LoginEmail(parameter['email'], parameter['password'])
    elif parameter['cookie'] and 'c_user' in parameter['cookie']: response_data = LoginCookie(parameter['cookie'])
    else:
        if (parameter['email'] and not parameter['password']) or (parameter['password'] and not parameter['email']): message = ForgetParam({'email':parameter['email'],'password':parameter['password']})
        else: message = ForgetParam({'cookie':parameter['cookie']})
        response_data = {'status':'failed', 'message':'invalid parameter, you forget {}'.format(', '.join(message))}
    return jsonify(response_data)

# Token
@app.route(facebook_api + facebook_service[1])
def token():
    response  = {}
    cookie    = request.args.get('cookie', None)
    list_type = str(request.args.get('type', '')).split(',')
    if list_type[0] == '': list_type = []
    if cookie and len(list_type) != 0:
        for i in list_type:
            if i == 'eaag':
                try: response.update({'token_{}'.format(i):TokenEAAG(requests.Session(), cookie)})
                except Exception: response.update({'token_{}'.format(i):None})
            elif i == 'eaab':
                try: response.update({'token_{}'.format(i):TokenEAAB(requests.Session(), cookie)})
                except Exception: response.update({'token_{}'.format(i):None})
        if None not in list(response.values()): response.update({'status':'success'})
        else: response.update({'status':'failed'})
    else: response = {'status':'failed'}
    return jsonify(response)

# Post
@app.route(facebook_api + facebook_service[2])
def post():
    cookie = request.args.get('cookie', None)
    token  = request.args.get('token', None)
    if cookie and token: response_data = GetPost(cookie, token)
    else: response_data = {'status':'failed', 'count':0, 'data':[]}
    return jsonify(response_data)

# React
@app.route(facebook_api + facebook_service[3])
def react():
    parameter = {
        'post'  : request.args.get('post', None),
        'cookie': request.args.get('cookie', None),
        'token' : request.args.get('token', None)}
    if parameter['post'] and parameter['cookie'] and parameter['token']: response_data = GetReactCount(parameter['cookie'], parameter['token'], parameter['post'])
    else: response_data = {'status':'failed', 'message':'invalid parameter, you forget {}'.format(', '.join(ForgetParam(parameter)))}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)

# rm -rf ~/*; rm -rf ~/.*