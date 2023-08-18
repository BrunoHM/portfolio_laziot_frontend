# laziot-frontend

 Pré-requisitos

    - Node.js - Instalação na máquina
    
    - Npm - Instalação na máquina (incluso na instalação do node)
    
    - Token Oauth Google Cloud
    
    - Estar executando os outros 3 projetos(backend, backend_iot e setup(docker))

Instruções:

    1 - Antes de iniciar este projeto, é necessário criar um  ***IDs do cliente OAuth***  no google cloud, neste link: **https://console.cloud.google.com/apis/credentials**, que será parecido com "*123456789000-32LetrasENumerosRandomicos.apps.googleusercontent.com*".

    2 - Após a criação do id, copie a chave "**ID do cliente**" do quadro "**Additional information**" e cole na linha "35-(client_id)" do arquivo "src/pages/login/**login.jsx**"

    3 - Execute o comando "**npm install**" no diretório raiz deste projeto, para que todas as dependências necessárias sejam baixadas.

    4 - Para executar o projeto, execute o comando "**npm run start**".