FROM nginx:1.19-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html

RUN chmod u=rw,go=r /etc/nginx/conf.d/default.conf
