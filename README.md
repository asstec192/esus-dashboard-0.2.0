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

### Passo 4: Executar o aplicativo

Em desenvolvimento: `npm run dev`

Em produção: `npm run build` e `npm run start`

## Deploy utilizando o Docker

Para distribuição da aplicação siga as seguintes etapas:

### Pré-requisitos

Instale o aplicativo [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Passo 1: Configurar o docker-compose

Na pasta raiz do projeto crie um arquivo com o nome `docker-compose.yml` e adicione o seguinte conteúdo

```
version: "3.7"
services:
  app:
    platform: "linux/amd64"
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_CLIENTVAR: "clientvar"
    working_dir: /app
    ports:
      - "3000:3000"
    image: samu-dashboard
    environment:
      - DATABASE_URL=sqlserver://HOST;database=NOME_DO_BANCO;user=USUARIO;password=SENHA;encrypt=true;TrustServerCertificate=true
      - NEXTAUTH_SECRET=chave_secreta
      - NEXTAUTH_URL=http://HOST:PORT
```

### Criando a imagem no docker e executando a aplicação

Execute o comando

```
docker compose up
```

### Distribuindo a imagem criada

Crie uma tag para a imagem existente: `

```
docker tag asstec192/samu-dashboard:nome_da_tag
```

Faça o push da imagem para o docker hub:

```
docker push asstec192/samu-dashboard:nome_da_tag`
```

### Usando a imagem distribuída

A máquina que receberá a imagem distribuída também deverá ter o Docker Desktop instalado.

Abra o terminal de comando e execute:

```
docker pull asstec192/samu-dashboard:nome_da_tag
```

Quando o download da imagem encerrar execute:

```
docker run -p 3000:3000 -e DATABASE_URL="sqlserver://HOST;database=NOME_DO_BANCO;user=USUARIO;password=SENHA;encrypt=true;TrustServerCertificate=true" NEXTAUTH_SECRET="sua_chave_secreta" NEXTAUTH_URL="http://HOST:PORT" asstec192/samu-dashboard
```

Ou se preferir use o aplicativo do Docker Desktop para configurar as variaveis de ambiente pela interface gráfica:

Com o aplicativo aberto navegue para a aba "Image", procure a imagem e clique no botão "run", uma caixa de diálogo irá abrir, abra a opção "Optional Settings" e configura as variáveis de ambiente já descritas acima, mas não inclua as "".
