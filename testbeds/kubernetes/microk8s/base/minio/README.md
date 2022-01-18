# MinIO 

Deploys a standalone MinIO instance with one PVC and a Service.
Templates taken from: https://github.com/kubernetes/examples/tree/master/staging/storage/minio

## Deploy

```
kubectl apply -f deploy minio-standalone-service.yaml
kubectl apply -f deploy minio-standalone-deployment.yaml
kubectl apply -f deploy minio-standalone-pvc.yaml
```

Ports:
* Console: 30910
* API: 30909

