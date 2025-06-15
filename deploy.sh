#!/bin/bash

echo "Building and pushing Docker images..."

docker buildx build --platform linux/amd64,linux/arm64 -t neighborly/users:latest ./users --push
docker buildx build --platform linux/amd64,linux/arm64 -t neighborly/tasks:latest ./tasks --push
docker buildx build --platform linux/amd64,linux/arm64 -t neighborly/leaderboards:latest ./leaderboards --push
docker buildx build --platform linux/amd64,linux/arm64 -t neighborly/reviews:latest ./reviews --push
docker buildx build --platform linux/amd64,linux/arm64 -t neighborly/gateway:latest ./gateway --push

echo "Applying Kubernetes manifests..."

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/storage.yaml
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/postgres-deployment.yaml

echo "Waiting for databases to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mongo -n neighborly
kubectl wait --for=condition=available --timeout=300s deployment/postgres -n neighborly

kubectl apply -f k8s/users-deployment.yaml
kubectl apply -f k8s/tasks-deployment.yaml
kubectl apply -f k8s/leaderboards-deployment.yaml
kubectl apply -f k8s/reviews-deployment.yaml
kubectl apply -f k8s/gateway-deployment.yaml

kubectl apply -f k8s/ingress.yaml

kubectl apply -f k8s/hpa.yaml

echo "Deployment complete!"
echo "You can access the application at: http://neighborly.local"
echo "Add '127.0.0.1 neighborly.local' to your /etc/hosts file"
