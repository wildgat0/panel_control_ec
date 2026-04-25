import paramiko, os

LOCAL = r'c:\Repositorio\panel_control_ec'
REMOTE = '/opt/panel_control_ec'
SKIP_DIRS = {'.claude', 'node_modules', '__pycache__', '.git'}
SKIP_FILES = {'deploy.py'}

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('147.185.238.111', username='root', password='JoseIgnacioLeightonZavala98', timeout=10)
sftp = client.open_sftp()

def mkdir_p(sftp, path):
    parts = [p for p in path.split('/') if p]
    current = ''
    for p in parts:
        current += '/' + p
        try:
            sftp.stat(current)
        except FileNotFoundError:
            sftp.mkdir(current)

for root, dirs, files in os.walk(LOCAL):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    rel = os.path.relpath(root, LOCAL).replace('\\', '/')
    remote_dir = REMOTE if rel == '.' else f'{REMOTE}/{rel}'
    mkdir_p(sftp, remote_dir)
    for f in files:
        if f in SKIP_FILES:
            continue
        local_path = os.path.join(root, f)
        remote_path = f'{remote_dir}/{f}'
        sftp.put(local_path, remote_path)
        print(f'  -> {remote_path}')

sftp.close()
client.close()
print('Archivos subidos correctamente.')
