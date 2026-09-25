# ToDo List

Extensão para o Google Chrome com uma lista de tarefas simples, que abre com um clique na barra de ferramentas. Sem cadastro e sem anúncios. As tarefas ficam salvas só no seu navegador.

## Funcionalidades

- **Adicionar:** digite a tarefa e pressione Enter.
- **Concluir:** marque a caixinha ao lado da tarefa.
- **Editar:** clique duas vezes no texto. Enter salva e Esc cancela.
- **Excluir:** passe o mouse sobre a tarefa e clique no ✕.
- **Filtrar:** alterne entre Todas, Pendentes e Concluídas.
- **Limpar concluídas:** remove todas as finalizadas de uma vez.
- **Contador no ícone:** mostra quantas tarefas ainda estão pendentes.
- **Tema claro e escuro:** segue automaticamente o tema do sistema.

## Instalação para desenvolvimento

1. Clone ou baixe este repositório.
2. Abra `chrome://extensions` no Chrome.
3. Ative o **Modo do desenvolvedor**, no canto superior direito.
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto.
5. Fixe a extensão pelo ícone de quebra-cabeça da barra de ferramentas.

Depois de alterar algum arquivo, clique no botão de recarregar da extensão em `chrome://extensions`.

## Estrutura

```
ToDoList/
├── manifest.json          # Configuração da extensão (Manifest V3)
├── popup.html             # Interface do popup
├── popup.css              # Estilos, incluindo o tema escuro
├── popup.js               # Lógica da lista e persistência
├── icons/                 # Ícones de 16, 32, 48 e 128 px
├── store/                 # Material da Chrome Web Store (não vai no pacote)
│   ├── LISTING.md         # Textos e respostas para o painel da loja
│   ├── privacy-policy.html
│   ├── assets/            # Capturas de tela, banners e ícone da loja
│   ├── src/               # Páginas usadas para gerar as imagens
│   ├── render.ps1         # Gera as imagens da loja
│   └── build-zip.ps1      # Gera o pacote .zip
└── dist/                  # Pacote gerado para envio
```

## Como funciona

- **Armazenamento:** as tarefas são guardadas em `chrome.storage.local` sob a chave `tasks`, como uma lista de objetos `{ id, text, done, createdAt }`.
- **Permissões:** a única permissão pedida é `storage`.
- **Código:** não há dependências nem etapa de build. É HTML, CSS e JavaScript puros.

## Publicação

Os scripts abaixo rodam no Windows (PowerShell).

**Gerar o pacote para a Chrome Web Store:**

```powershell
powershell -ExecutionPolicy Bypass -File store\build-zip.ps1
```

O arquivo é criado em `dist/ToDoList-<versão>.zip`, com a versão lida do `manifest.json`. Em cada atualização, aumente o campo `version` antes de gerar o pacote.

**Gerar de novo as capturas de tela e os banners** (requer o Google Chrome instalado):

```powershell
powershell -ExecutionPolicy Bypass -File store\render.ps1
```

O passo a passo do painel da loja, com textos prontos para copiar, está em [store/LISTING.md](store/LISTING.md).

## Privacidade

A extensão não coleta, não envia e não compartilha nenhum dado. Veja a [política de privacidade](store/privacy-policy.html).
