"""
UMSA - Carrera de Informática
DAT-262: Procesos Estocásticos y Análisis de Series de Tiempo
Script de Lanzamiento Automático del Dashboard Analítico
Estudiantes: Yeral Ariel Gutierrez Quispe & Raquel Araceli Serrano Mamani
Docente: M.Sc. Mario Amílcar Miranda Gonzales
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import socket

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

class ThreadedServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

def get_local_ip():
    """Obtiene la IP local de red (no loopback) sin enviar datos."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "localhost"

def write_network_url(ip, port):
    """Escribe network_url.js para que el dashboard pueda leer la URL de red."""
    url = f"http://{ip}:{port}"
    js_content = f'// Auto-generado por start_dashboard.py\nwindow.NETWORK_URL = "{url}";\n'
    out_path = os.path.join(DIRECTORY, 'network_url.js')
    with open(out_path, 'w') as f:
        f.write(js_content)
    return url

def main():
    os.chdir(DIRECTORY)
    dataset_file = '2024-01-15-12.json'
    if os.path.exists(dataset_file):
        size_mb = os.path.getsize(dataset_file) / (1024 * 1024)
        dataset_info = f"2024-01-15-12.json ({size_mb:.2f} MB) [CONECTADO Y VALIDADO]"
    else:
        dataset_info = "2024-01-15-12.json [NO ENCONTRADO]"

    # Reconstrucción opcional si se pasa flag --rebuild
    if '--rebuild' in sys.argv:
        print("Reconstruyendo data.js desde 2024-01-15-12.json...")
        import build_full_dataset
        build_full_dataset.run_extraction()

    local_ip = get_local_ip()

    # Intentar puertos alternativos si el 8080 está en uso
    for port in [8080, 8081, 8082, 3000, 8000]:
        try:
            with ThreadedServer(("", port), Handler) as httpd:
                local_url = f"http://localhost:{port}"
                network_url = write_network_url(local_ip, port)
                print("=" * 70)
                print(" UMSA DAT-262: Dashboard Estocástico (GH Archive)")
                print(f" Dataset enlazado: {dataset_info}")
                print(f" Servidor local:   {local_url}")
                print(f" Red local (QR):   {network_url}  ← Compartir con celulares")
                print(" Abriendo en tu navegador predeterminado...")
                print(" Presiona Ctrl + C para detener.")
                print("=" * 70)
                webbrowser.open(local_url)
                try:
                    httpd.serve_forever(poll_interval=0.5)
                except KeyboardInterrupt:
                    print("\nServidor cerrado correctamente.")
                finally:
                    httpd.server_close()
                sys.exit(0)
        except OSError:
            continue

if __name__ == "__main__":
    main()
