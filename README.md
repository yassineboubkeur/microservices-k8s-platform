# Microservices K8s Platform

Production-grade microservices platform deployed on Kubernetes.

## Stack
- **Services**: Node.js (API Gateway, User Service), Python (Product Service)
- **Container**: Docker
- **Orchestration**: Kubernetes + Helm
- **GitOps**: ArgoCD
- **Monitoring**: Prometheus + Grafana

## Architecture
API Gateway → User Service → PostgreSQL
           → Product Service → PostgreSQL

## Quick Start
\`\`\`bash
# Local development
docker compose up --build

# Deploy to K8s
helm install api-gateway ./helm/api-gateway
\`\`\`

## Project Structure
\`\`\`
services/          # Microservices source code
helm/              # Helm charts
k8s/               # Raw Kubernetes manifests
argocd/            # ArgoCD applications
.github/workflows/ # CI/CD pipelines
\`\`\`

## Branching Strategy
- \`main\` — production, stable
- \`develop\` — integration
- \`feature/*\` — new features
- \`release/*\` — pre-production
- \`hotfix/*\` — emergency fixes