version=${1:-latest}
repo=polaris
docker build -t "${repo}"/predicted-metric-container:"${version}" .
docker push "${repo}"/predicted-metric-container:"${version}"
