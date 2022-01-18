version=${1:-latest}
docker build -t aicg4t1/predicted-metric-container-exporter:"${version}" .
docker push aicg4t1/predicted-metric-container-exporter:"${version}"
