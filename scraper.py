
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def scrape_credentials(url):
    """
    Esta função faz a raspagem de um site para encontrar formulários de login e extrair credenciais.
    Atenção: Este script é para fins educacionais e deve ser usado apenas em seus próprios sites.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()  # Lança uma exceção para códigos de status ruins
    except requests.exceptions.RequestException as e:
        print(f"Erro ao fazer a requisição para {url}: {e}")
        return

    soup = BeautifulSoup(response.text, 'html.parser')

    # Encontra todos os formulários na página
    forms = soup.find_all('form')

    if not forms:
        print("Nenhum formulário encontrado na página.")
        return

    print(f"Encontrados {len(forms)} formulário(s) na página.")

    for i, form in enumerate(forms):
        print(f"\n--- Analisando Formulário #{i+1} ---")
        
        # Encontra campos de usuário e senha
        username_field = form.find('input', {'name': ['username', 'user', 'email', 'login']})
        password_field = form.find('input', {'type': 'password'})

        if username_field and password_field:
            print("Encontrados campos potenciais de usuário e senha.")
            
            # Você pode adicionar lógica aqui para enviar o formulário se necessário,
            # mas por enquanto, vamos apenas imprimir os nomes dos campos.
            print(f"  Nome do campo de usuário: {username_field.get('name')}")
            print(f"  Nome do campo de senha: {password_field.get('name')}")

        else:
            print("Não foi possível encontrar campos padrão de usuário/senha neste formulário.")


if __name__ == '__main__':
    target_url = input("Digite a URL do seu site local: ")
    scrape_credentials(target_url)
