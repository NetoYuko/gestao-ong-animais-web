# Sistema de Gestão ONG de animais - Frontend

Interface web (SPA) desenvolvida em React para o **Sistema de Gestão ONG de animais**, uma aplicação de gestão criada para descentralizar informações, automatizar processos e substituir controles manuais de uma ONG de proteção animal.

* **Aplicação em Produção:** [Acessar Deploy](https://gestao-ong-animais-web.vercel.app/)
* **Repositório Backend (API):** [gestao-ong-animais-api](https://github.com/NetoYuko/gestao-ong-animais-api)


## Stacks Utilizadas
- Linguagens: React
- Estilização & Ícones: Tailwind CSS & Lucide React
- Roteamento: React Router DOM
- Formulários & Validação: React Hook Form + Zod
- Comunicação & BaaS: Axios & Supabase Strorage
- Feedback UI: React Hot Toast
- Deploy: Vercel

## Funcionalidades e Experiência do Usuário (UX) 
- **Dashboard Dinâmico:** Painel inicial com visão dos indicadores da ONG, histórico de adoções recentes e alertas visuais para próximas doses de medicamentos/vacinas.
- **Controle de Acesso:** Renderização condicional baseada no perfil armazenado no AuthContext (ROLE_ADMIN vs ROLE_USER). Usuários visualizadores consultam todas as telas, mas os botões e ações de criação, edição e exclusão ficam ocultos.
- **Módulos Integrados:** Telas completas para gestão de Animais, Tutores, Adoções, Prontuários Médicos e Usuários.
- **Feedback Visual Padronizado:** Notificações flutuantes via `react-hot-toast` para confirmar cadastros, edições, uploads e alertar sobre erros de validação ou regras de negócio.

## Estrutura de pastas
```plaintext
src/
├── assets/                 # Imagens estáticas e ícones globais
├── components/
│   ├── Layout.jsx          # Menu lateral responsivo e cabeçalho
│   ├── ui/                 
│   │   ├── BaseModal.jsx   
│   │   ├── DataTable.jsx
│   │   └── PageHeader.jsx
│   ├── adocao/             # Modais de formulário agrupados por funcionalidade
│   ├── animais/
│   ├── prontuarios/
│   ├── tutores/
│   └── usuarios/
├── contexts/               # AuthContext (gerenciamento global de sessão e token JWT)
├── pages/                  # Telas da aplicação (Login, Dashboard, Animais, Tutores, etc.)
├── routes/                 # Configuração do React Router e proteção de rotas privadas
├── services/               # Instância do Axios e cliente do Supabase
└── utils/                  # Funções auxiliares (formatação, máscaras, conversão de imagem)
```

## Como executar Localmente

#### Pré-requisitos:
- Node.js
- npm ou yarn

### Passo a passo: 
**1. Clone o repositório e instale as dependências:**

```Bash
git clone https://github.com/NetoYuko/gestao-ong-animais-web
cd gestao-ong-animais-web
npm install
```
**2. Configure as variáveis de ambiente:**
Na raiz do projeto, crie um arquivo chamado .env e preencha com a URL da API e as chaves públicas do Supabase:
```bash
VITE_API_URL=http://localhost:8080/api
VITE_SUPABASE_URL=https://[SEU_PROJETO].supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_CHAVE_PUBLICA_ANON_SUPABASE]
```

**3. inicie o servidor de desenvolvimento**

```Bash
npm run dev
```

**4. Acesse a aplicação**
Abra no navegador o endereço exibido no terminal, geralmente `http://localhost:5173)`

## Demonstração (PERFIL: ADMIN): 
- Login: 
<img width="1919" height="916" alt="image" src="https://github.com/user-attachments/assets/46ef2040-945a-4c75-a9af-fef74e1f6c10" />

- Tela inicial:
<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/6ec9242e-6948-470e-97ce-5184c4fb91dc" />

- Tela gestão de animais:
<img width="1918" height="918" alt="image" src="https://github.com/user-attachments/assets/abe061ca-51e1-40f1-91b3-25f89f089470" />

- Tela gestão de tutores:
<img width="1917" height="917" alt="image" src="https://github.com/user-attachments/assets/846da9e7-48ff-4727-9c7a-042230a45f1f" />

- Tela gestão adoções:
<img width="1918" height="915" alt="image" src="https://github.com/user-attachments/assets/51b4fcf5-4d65-4def-811f-c8a0378cc841" />

- Tela gestão de prontuários:
<img width="1916" height="918" alt="image" src="https://github.com/user-attachments/assets/4db64a4d-c3cd-4bbd-af1f-f8ade69e5c99" />

- Tela gestão de usuários:
<img width="1916" height="916" alt="image" src="https://github.com/user-attachments/assets/280f986f-370e-48ef-9269-73df3d4606f0" />





