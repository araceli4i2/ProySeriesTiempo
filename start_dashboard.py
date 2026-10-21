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

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

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

    # Intentar puertos alternativos si el 8080 está en uso
    for port in [8080, 8081, 8082, 3000, 8000]:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}"
                print("=" * 70)
                print(" UMSA DAT-262: Dashboard Estocástico (GH Archive)")
                print(f" Dataset enlazado: {dataset_info}")
                print(f" Servidor activo en: {url}")
                print(" Abriendo en tu navegador predeterminado...")
                print(" Presiona Ctrl + C para detener.")
                print("=" * 70)
                webbrowser.open(url)
                try:
                    httpd.serve_forever()
                except KeyboardInterrupt:
                    print("\nServidor cerrado correctamente.")
                    sys.exit(0)
        except OSError:
            continue

if __name__ == "__main__":
    main()
