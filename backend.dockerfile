FROM --platform=linux/arm64/v8 node:lts as build

RUN mkdir -p /app
WORKDIR /app
COPY ./backend /app
COPY ./.env /app
RUN npm install

FROM --platform=linux/arm64/v8 node:lts as name
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000
CMD ["npm","run","prod"]