
## 1. Instalacja kind

## 2. Utworzenie klastra Kubernetes

###  Utworzenie konfiguracji klastra

Plik `kind-config.yaml`:
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: neighborly-cluster
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
  - containerPort: 3241
    hostPort: 3241
    protocol: TCP
- role: worker
- role: worker
```

### Utworzenie klastra (docker desktop)

###  Instalacja Ingress Controller
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

### Instalacja Metrics Server
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl get pods -n kube-system | grep metrics-server
```

---

## 3. Pobranie i przygotowanie aplikacji

### Klonowanie repozytorium

###  Przygotowanie sekretów

#### Utwórz plik z kluczem Firebase:
Skopiuj swój klucz serviceAccountKey.json do katalogu gateway/

#### Zakoduj klucz w base64:
```bash
cat gateway/serviceAccountKey.json | base64 -w 0

# Skopiuj wynik i wklej do k8s/secrets.yaml
```

---

## 4. Wdrożenie aplikacji

### Uruchomienie skryptu wdrożenia
```bash
chmod +x deploy.sh

./deploy.sh
```
---

## 5. Weryfikacja i testowanie

###  Sprawdzenie statusu podów
```bash
kubectl get pods -n neighborly

# W razie błędów
kubectl logs deployment/gateway -n neighborly
kubectl logs deployment/users -n neighborly
```

### Sprawdzenie serwisów
```bash
kubectl get services -n neighborly

kubectl get endpoints -n neighborly
```

### Sprawdzenie ingress
```bash
kubectl get ingress -n neighborly

kubectl describe ingress neighborly-ingress -n neighborly
```

### Sprawdzenie autoskalowania
```bash
kubectl get hpa -n neighborly

kubectl top nodes
kubectl top pods -n neighborly
```

---

## 6. Dostęp do aplikacji

### Port Forwarding
```bash
kubectl port-forward service/gateway-service 3241:3241 -n neighborly

curl http://localhost:3241/health
```

### Ingress z modyfikacją hosts
```bash
echo "127.0.0.1 neighborly.local" | sudo tee -a /etc/hosts

curl http://neighborly.local
```
---

## 7. Zarządzanie klastrem

### Podstawowe polecenia
```bash
# Status klastra
kubectl cluster-info

# Lista zasobów
kubectl get all -n neighborly

# Zużycie zasobów
kubectl top pods -n neighborly
kubectl top nodes
```

### Skalowanie aplikacji
```bash
kubectl scale deployment NAZWA --replicas=5 -n neighborly
```

### Aktualizacja aplikacji (ale się na pewno nie zaktualizuje :) )
```bash
kubectl set image deployment/NAZWA NAZWA=USERNAME/neighborly-NAZWA:v2.0 -n neighborly

kubectl rollout status deployment/gateway -n neighborly

kubectl rollout undo deployment/gateway -n neighborly
```

### Monitorowanie logów
```bash
# Real-Time logi
kubectl logs -f deployment/gateway -n neighborly

# Logi
kubectl logs -l app=gateway -n neighborly

# Logi poprzedniej instancji
kubectl logs deployment/gateway -n neighborly --previous
```

---

## 8. Rozwiązywanie problemów

###  Problemy z obrazami Docker
```bash
# Sprawdzanie dostępności
docker images | grep neighborly

# Sprawdzanie możliwości pobrania
kubectl describe pod NAZWA -n neighborly 
```

###  Problemy z autentykacją Firebase
```bash
# Sprawdzanie sekretów
kubectl get secrets -n neighborly
kubectl describe secret firebase-service-account -n neighborly
```

### Restart serwisów
```bash
# Restart deployment
kubectl rollout restart deployment/gateway -n neighborly

# Restart poda
kubectl delete pod NAZWA -n neighborly
```

---

## 9. Czyszczenie środowiska

### Usunięcie aplikacji:
```bash
# Usuwanie namespace
kubectl delete namespace neighborly
```

### Usunięcie klastra:
```bash
# Usuń klaster kind
kind delete cluster --name neighborly-cluster
```

### Usunięcie wszystkiego:
```bash
# Zatrzymanie wszystkich kontenerów
docker stop $(docker ps -aq)

# Usuwanięcie wszystkich kontenerów
docker rm $(docker ps -aq)

# Wyczyszczenie obrazów
docker system prune -a
```

