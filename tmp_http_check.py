import json, urllib.request

for path, method, payload in [
    ('/api/v1/auth/login', 'POST', {'email':'admin@inteko.gov.rw','password':'password123'}),
    ('/api/v1/meetings', 'GET', None),
]:
    req = urllib.request.Request('http://localhost:8080' + path, method=method)
    if payload is not None:
        data = json.dumps(payload).encode()
        req.data = data
        req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            print('PATH', path)
            print('STATUS', r.status)
            print(r.read().decode())
            print('---')
    except Exception as e:
        print('PATH', path)
        print('ERROR', e)
        if hasattr(e, 'read'):
            try:
                print(e.read().decode())
            except Exception:
                pass
        print('---')
