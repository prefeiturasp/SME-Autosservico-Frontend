# Template Frontend - Next.js SME

Este projeto utiliza Next.js com CI/CD via Jenkins e deploy automático em Rancher.

## 🧪 Pipeline Jenkins

- Lint do código
- Testes automatizados
- Build de produção
- Imagem Docker
- Deploy automático no Rancher

## 📤 Deploy no Rancher

O arquivo `rancher-deploy.sh` usa a CLI do Rancher para atualizar o workload no cluster correspondente.

## 📦 Docker

A imagem Docker é construída com duas etapas: build e produção (base Alpine).

## 🔒 Controle de branches e aprovações

As PRs seguem fluxo com revisores definidos no arquivo `.github/CODEOWNERS`.

## 📝 Licença

MIT – consulte [LICENSE](./LICENSE)
Autosservico
