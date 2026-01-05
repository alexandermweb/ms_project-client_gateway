## Client Gateway

# Nats
```
docker run -d --name nast-server -p 4222:4222 -p 8222:8222 nats
```


## PROD
Ejecutar 
```
docker build -f dockerfile.prod -t client-gateway .
```