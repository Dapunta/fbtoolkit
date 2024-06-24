import requests

def GetPost(cookie:str, token:str) -> list:
    data = []
    try:
        r = requests.Session()
        req = r.get('https://graph.facebook.com/me?fields=posts.fields(id,message,privacy.value).limit(5000)&access_token={}'.format(token), cookies={'cookie':cookie}).json()
        for i in req['posts']['data']:
            try: data.append({'id':i['id'], 'privacy':i['privacy']['value'], 'caption':i.get('message')})
            except Exception: continue
        return({'status':'success', 'count':len(data), 'data':data})
    except Exception: return({'status':'failed', 'count':0, 'data':[]})

def GetReactCount(cookie:str, token:str, id_post:str):
    response = {
        'status' : 'failed',
        'total'  : 0,
        'id'     : id_post,
        'like'   : {'count':0, 'reactor':[]},
        'love'   : {'count':0, 'reactor':[]},
        'care'   : {'count':0, 'reactor':[]},
        'haha'   : {'count':0, 'reactor':[]},
        'wow'    : {'count':0, 'reactor':[]},
        'sad'    : {'count':0, 'reactor':[]},
        'angry'  : {'count':0, 'reactor':[]},
    }
    try:
        r = requests.Session()
        req = r.get('https://graph.facebook.com/{}?fields=reactions.limit(5000)&access_token={}'.format(id_post, token), cookies={'cookie':cookie}).json()
        for item in req['reactions']['data']:
            try:
                base = response[item['type'].lower()]
                base['reactor'].append({'id':item['id'],'name':item['name']})
                base['count'] += 1
                response['total'] += 1
            except Exception: continue
        response['status'] = 'success' if response['total'] != 0 else 'failed'
        return(response)
    except Exception:
        response.update({'status' :'failed'})
        return(response)

if __name__ == '__main__':
    cookie     = 'sb=dO6kZZiKUA-GYCqlx7trixOV;ps_n=1;ps_l=1;wl_cbv=v2;client_version:2517;timestamp:1717090559;vpd=v1;640x360x2.0000000298023224;wd=945x1102;dpr=0.8999999761581421;locale=id_ID;datr=PWB5Zj5G4CgctduxqnD3XxJ7;c_user=61556949299760;xs=43:RqQzUqq0ayNgyQ:2:1719230542:-1:10888;fr=1ENV4sLjAk4O4F8is.AWV4UPgqjHKhP42Q_fcLcQqaHkk.BmcvHb..AAA.0.0.BmeWBR.AWVxV5m5qQ8;'
    token_eaag = 'EAAGNO4a7r2wBO1xp8TWms5kYl816GdFUHLnJYtUO9XDaJSXPJvx7ai9banefqJzFe1N2ZATy5KA5Ms7CZCciOUzzeRC7GhCiCyJqXUMNYWWyA5MeGECJHiLP3RhQKdFXrXvXYsQdIYip0tMpOYYbeLl1H5T93BM3SAN7ZCxE4TUEmGFTEnSrQczRQZDZD'
    token_eaab = 'EAABsbCS1iHgBOZBk7AIwi33chQX9pMB8SwQZB9YTrTPXZA9s10N2pKvLQEXp0js6cWXnZBVGVL2nwQG0M6rdrAG209yrZAZB3EijR1c5r2tg0ZCtvbGZAJZCFhZCuQi3KekAglQBae4y0zjiva10SAY80e6i5j04lVZBp88AVq8ZCGdTgKXWZBgUpTwryZBogvOwZDZD'

    # post = GetPost(cookie, token_eaag) 
    # print(post)

    id_post = '61556949299760_122154413234231643'
    react = GetReactCount(cookie, token_eaab, id_post)
    print(react)