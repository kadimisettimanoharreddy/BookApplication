# Book Keeper (Docker + Kubernetes + Terraform)

End-to-end sample with:
- FastAPI backend (Postgres + SQLAlchemy)
- React + Vite frontend (runtime-configurable API base via `config.js`)
- Docker Compose for local dev
- Kubernetes manifests for local cluster (minikube/kind/microk8s)
- Terraform to provision **EKS on AWS** (then you can `kubectl apply` the same manifests)

> Note: EKS is Amazon's Kubernetes. If you want Microsoft Azure, that's **AKS**. This repo targets EKS on AWS.

---

## 1) Local: Docker Compose

```bash
# build & start
docker compose up --build -d

# follow logs
docker compose logs -f

# open UI
# http://localhost:5173
```

Services:
- Postgres: localhost:5432
- Backend:  localhost:8000
- Frontend: http://localhost:5173

Run a quick check:
```bash
curl http://localhost:8000/
```

---

## 2) Local: Kubernetes (minikube example)

```bash
# create namespace and deploy
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

# watch
kubectl -n books get pods,svc

# If using minikube, open the NodePort
minikube service -n books frontend --url
# Or access via http://<node-ip>:30080
```

### Update images (optional)
By default, K8s manifests point to **manohar2503/library-backend:latest** and **manohar2503/library-frontend:latest**.
Build & push your images first:

```bash
# backend
docker build -t manohar2503/library-backend:latest backend
docker push manohar2503/library-backend:latest

# frontend
docker build -t manohar2503/library-frontend:latest frontend
docker push manohar2503/library-frontend:latest
```

---

## 3) AWS: EKS with Terraform

**Prereqs**: AWS credentials configured (`aws configure`), Terraform installed.

```bash
cd infra
terraform init
terraform apply -auto-approve
# After apply, set your kubeconfig:
aws eks update-kubeconfig --region $(terraform output -raw region) --name $(terraform output -raw cluster_name)

# Deploy the app
kubectl apply -f ../k8s/namespace.yaml
kubectl apply -f ../k8s/postgres.yaml
kubectl apply -f ../k8s/backend.yaml
kubectl apply -f ../k8s/frontend.yaml
kubectl -n books get svc
```

Clean up:
```bash
terraform destroy -auto-approve
```

---

## 4) Environment details

- Backend expects `DATABASE_URL` like: `postgresql+psycopg://bookuser:bookpass@postgres:5432/booksdb`
- CORS is set to `*` by default for simplicity. Adjust in `k8s/backend.yaml` / `docker-compose.yml`.
- Frontend injects `API_BASE` at **runtime** via Nginx `entrypoint.sh`, so the same image works on Compose & K8s.