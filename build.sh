# maven package
rm -rf ./build
pnpm run build
VERSION=$(date +%Y%m%d%H%M%S)

docker build -t crpi-b3gi4e2l2a711h4t.cn-shanghai.personal.cr.aliyuncs.com/xqsight/barley-training-admin-web:$VERSION -t crpi-b3gi4e2l2a711h4t.cn-shanghai.personal.cr.aliyuncs.com/xqsight/barley-training-admin-web:latest --push .