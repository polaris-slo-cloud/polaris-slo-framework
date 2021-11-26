version=${1:-latest}

docker build -t polaris/predicted-metric-container:"${version}" .
docker push polaris/predicted-metric-container:"${version}"
