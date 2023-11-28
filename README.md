# SamuDashboard

Este é um aplicativo de dashboard desenvolvido com Next.js voltado para acompanhamento em tempo real e geração de relatórios exclusivos do SAMU 192 de Fortaleza/CE

## Principais tecnologias utilizadas:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Instalação

Siga estas instruções para configurar o aplicativo em seu ambiente local.

### Pré-requisitos

- Node.js (versão 18 ou superior) instalado em seu sistema.
- Git instalado em seu sistema.

### Passo 1: Clonar o repositório

```
git clone https://github.com/asstec192/esus-dashboard-0.2.0.git
```

### Passo 2: Configurar as variáveis de ambiente

Na pasta raiz do projeto e crie um arquivo chamado `.env` com as seguintes variáveis de ambiente:

```
DATABASE_URL="sqlserver://HOST;database=DATA_BASE;user=USUARIO;password=SENHA;encrypt=true;TrustServerCertificate=true"
```

```
NEXTAUTH_URL="http://HOST:PORT"
```

```
NEXTAUTH_SECRET="sua_chave_secreta"
```

### Passo 3: Instalar as dependências

Ainda na pasta raiz execute os seguintes comandos:

`npm install`

`npm install pm2@latest -g`

### Passo 4: Executar o aplicativo

Em desenvolvimento: `npm run dev`

Em produção: `npm run deploy:prod`

Pausando o servidor: `pm2 stop SamuDashboard`
