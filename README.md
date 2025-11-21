# KDefy Grupos - Divulgação de Grupos de WhatsApp e Telegram

Este é o repositório do projeto **KDefy Grupos**, uma plataforma para encontrar e divulgar grupos de WhatsApp e Telegram. O site permite que usuários pesquisem, filtrem e enviem novos grupos para a comunidade.

## Funcionalidades

- **Listagem de Grupos**: Navegue por grupos de WhatsApp e Telegram.
- **Busca e Filtro**: Pesquise por nome, descrição ou filtre por categoria.
- **Envio de Grupos**: Usuários podem submeter seus próprios grupos para serem listados.
- **Painel de Administração**: Um painel seguro para gerenciar e aprovar os grupos enviados.
- **Sistema de Cache**: Utiliza IndexedDB para armazenar grupos localmente e melhorar a performance.

## Setup do Banco de Dados (Supabase)

Para rodar este projeto, você precisará de um projeto no [Supabase](https://supabase.com/). Execute os seguintes comandos no **SQL Editor** do seu projeto.

### 1. Tabela de Grupos (`grupos`)

Esta tabela armazena todas as informações dos grupos enviados.

```sql
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

-- Índices para otimizar as consultas
CREATE INDEX idx_grupos_aprovado ON grupos(aprovado);
CREATE INDEX idx_grupos_vip ON grupos(vip, posicao_vip);
CREATE INDEX idx_grupos_created ON grupos(created_at DESC);
```

### 2. Tabela de Administradores (`admin_users`)

Esta tabela armazena os usuários que podem acessar o painel de administração.

```sql
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Importante:** Para adicionar um administrador, você deve inserir um `username` e o **hash SHA-256** da senha. **Nunca salve a senha em texto puro.**

**Exemplo de como inserir um admin:**

```sql
-- Lembre-se de substituir 'seu_hash_sha256_aqui' pelo hash real da sua senha
INSERT INTO admin_users (username, password_hash) 
VALUES ('seu_usuario_admin', 'seu_hash_sha256_aqui');
```

Para gerar o hash SHA-256 de uma senha, você pode usar o console do navegador na página de admin do projeto com o seguinte comando:
```javascript
// 1. Abra o console (F12) na página de admin
// 2. Cole e execute este código, trocando 'sua_senha_segura'
async function sha256(m) {
  const b = new TextEncoder().encode(m);
  const d = await crypto.subtle.digest('SHA-256', b);
  return Array.from(new Uint8Array(d)).map(h => h.toString(16).padStart(2, '0')).join('');
}
sha256('sua_senha_segura').then(h => console.log(h));
```

### 3. Políticas de Segurança (Row Level Security - RLS)

Estas políticas garantem que os usuários só possam acessar os dados permitidos.

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem visualizar grupos que foram aprovados.
CREATE POLICY "Grupos aprovados são públicos" ON grupos
  FOR SELECT USING (aprovado = true);

-- Política: Qualquer usuário pode enviar um novo grupo para análise.
CREATE POLICY "Qualquer um pode enviar grupos" ON grupos
  FOR INSERT WITH CHECK (true);

-- Política: Administradores têm acesso total à tabela de grupos.
-- (Crie esta política de acordo com a sua lógica de autenticação no Supabase)
-- Exemplo: CREATE POLICY "Admin total" ON grupos FOR ALL USING (auth.role() = 'service_role');
-- Adapte para a sua regra de admin.

-- Política: Permite que a função de login consulte a tabela de admin.
CREATE POLICY "Admin login" ON admin_users FOR SELECT USING (true);

```

### 4. Configuração no `app.js`

Lembre-se de configurar suas chaves do Supabase no arquivo `app.js`:

```javascript
/* Config Supabase */
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_KEY = 'SUA_CHAVE_ANON_AQUI';
```
