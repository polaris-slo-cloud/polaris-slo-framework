version=${1:-latest}
repo=polarissloc
docker build -t "${repo}"/ai-proxy:"${version}" .
docker push "${repo}"/ai-proxy:"${version}"
