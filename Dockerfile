FROM billbear-cn-shanghai.cr.volces.com/base/nginx-spa:1.27.0-alpine3.19-slim
ENV APPLICATION_NAME barley-training-admin-web
ADD ./build /data/app
ADD ./default.conf /etc/nginx/conf.d/default.conf
CMD ["nginx","-g","daemon off;"]
