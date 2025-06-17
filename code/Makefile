.PHONY: build rebuild dev clean

build:
	docker-compose build

rebuild:
	docker-compose build --no-cache
	docker-compose up

dev:
	docker-compose -f docker-compose.dev.yml up --build

clean:
	docker-compose down --volumes
	docker system prune -f

watch:
	while true; do \
		inotifywait -r -e modify package*.json Dockerfile; \
		make rebuild; \
	done