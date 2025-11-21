# KDefy Grupos: A Comunidade de Grupos de WhatsApp e Telegram

Bem-vindo(a) ao **KDefy Grupos**! 👋

Este é o lugar onde construímos uma plataforma aberta e vibrante para que todos possam encontrar e compartilhar os melhores grupos de WhatsApp e Telegram. Se você quer divulgar seu grupo, encontrar uma nova comunidade ou ajudar a construir uma ferramenta incrível, você está no lugar certo!

## ✨ Nossa Missão

Acreditamos que comunidades online são poderosas. Nossa missão é criar o melhor e mais seguro diretório de grupos, conectando pessoas com interesses em comum de forma simples e direta.

## 🚀 Como Funciona

-   **Explore:** Navegue por centenas de grupos, organizados por categorias.
-   **Busque:** Encontre exatamente o que procura com nossa ferramenta de busca.
-   **Contribua:** Envie seu próprio grupo para que outras pessoas possam encontrá-lo.
-   **Seguro:** Um painel de administração garante que apenas grupos de qualidade sejam aprovados.

## 🤝 Quer Ajudar? Contribua com o Projeto!

Nós amamos a ajuda da comunidade! Se você tem ideias, encontrou um bug ou quer escrever código, sua contribuição é muito bem-vinda.

**Não sabe por onde começar? Aqui vão algumas ideias:**

1.  **Reporte um Bug:** Encontrou algo que não funciona como deveria? [Abra uma Issue](https://github.com/kdefycom/App-WaGrupos/issues) e nos conte.
2.  **Sugira uma Melhoria:** Tem uma ideia para uma nova funcionalidade? Adoraríamos ouvir!
3.  **Escreva Código:** Pegue uma `issue` aberta, faça um `fork` do projeto e envie um `Pull Request`!

**Passos para Contribuir com Código:**

1.  Faça um **Fork** deste repositório.
2.  Crie uma nova branch para sua funcionalidade: `git checkout -b minha-nova-feature`
3.  Faça o commit de suas alterações: `git commit -m 'feat: Adiciona minha nova feature'`
4.  Envie para a sua branch: `git push origin minha-nova-feature`
5.  Abra um **Pull Request** aqui no GitHub.

## 🛠️ Setup do Ambiente de Desenvolvimento

Pronto para colocar a mão na massa? Aqui está o que você precisa para rodar o projeto localmente.

**Você vai precisar de:**

-   Uma conta gratuita no [Supabase](https://supabase.com/).
-   Um editor de código como o VS Code.

**Passo 1: Configure o Banco de Dados no Supabase**

1.  Crie um novo projeto no Supabase.
2.  Vá para o **SQL Editor**.
3.  Copie e cole o código abaixo e execute-o para criar as tabelas e as regras de segurança necessárias.

```sql
/* 
  ========================================
  TABELA DE GRUPOS
  Armazena todos os grupos enviados.
  ========================================
*/
CREATE TABLE grupos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('whatsapp', 'telegram')),
  descricao TEXT,
  categoria TEXT,
  foto_url TEXT,
  email TEXT,
  regras JSONB DEFAULT '[]'::jsonb,
  aprovado BOOLEAN DEFAULT false,
  vip BOOLEAN DEFAULT false,
  posicao_vip INTEGER,
  mensagem_admin TEXT,
  ultimo_boost TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para otimizar as buscas
CREATE INDEX idx_grupos_aprovado ON grupos(aprovado);
CREATE INDEX idx_grupos_vip ON grupos(vip, posicao_vip);
CREATE INDEX idx_grupos_created ON grupos(created_at DESC);

/* 
  ========================================
  TABELA DE ADMINISTRADORES
  Controla o acesso ao painel de admin.
  ========================================
*/
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

/*
  ========================================
  POLÍTICAS DE SEGURANÇA (RLS)
  Garantem que os dados estejam seguros.
  ========================================
*/
-- Habilita a segurança em nível de linha
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Regra 1: Todos podem ver os grupos que já foram aprovados.
CREATE POLICY "Grupos aprovados são públicos" ON grupos
  FOR SELECT USING (aprovado = true);

-- Regra 2: Qualquer pessoa pode enviar um novo grupo.
CREATE POLICY "Qualquer um pode enviar grupos" ON grupos
  FOR INSERT WITH CHECK (true);

-- Regra 3: Administradores com a chave de serviço têm acesso total.
CREATE POLICY "Admin total" ON grupos 
  FOR ALL USING (auth.role() = 'service_role');
  
-- Regra 4: Permite a consulta de usuários no login do admin.
CREATE POLICY "Admin login" ON admin_users FOR SELECT USING (true);
```

**Passo 2: Crie um Usuário Administrador**

Por segurança, **nunca salve senhas diretamente**. Salve apenas um "hash" (uma versão criptografada) dela.

1.  **Gere o Hash:** No painel do seu projeto, tem uma página de admin. Abra o console do desenvolvedor (F12) e use a função `sha256('sua_senha_aqui')` para gerar o hash da sua senha.
2.  **Insira no Banco:** Execute o comando SQL abaixo, substituindo o usuário e o hash gerado.

```sql
-- Exemplo para inserir seu usuário admin
INSERT INTO admin_users (username, password_hash) 
VALUES ('meu-admin', 'hash_gerado_no_passo_anterior');
```

**Passo 3: Conecte o Projeto ao Supabase**

1.  No arquivo `app.js`, encontre as seguintes linhas:
    ```javascript
    /* Config Supabase */
    const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
    const SUPABASE_KEY = 'SUA_CHAVE_ANON_AQUI';
    ```
2.  Substitua `'https://SEU_PROJETO.supabase.co'` e `'SUA_CHAVE_ANON_AQUI'` pelas credenciais do seu projeto Supabase, que você encontra em **Project Settings > API**.

Pronto! Agora você pode abrir o `index.html` e ver o projeto rodando.

## 📄 Licença

Este projeto é de código aberto e está licenciado sob a Licença MIT. Sinta-se à vontade para usar, modificar e distribuir!

---

Feito com ❤️ pela comunidade.
