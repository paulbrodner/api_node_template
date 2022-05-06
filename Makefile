IMAGE_NAME:=   paulbrodner/environments
.PHONY: stop
help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build:  ## build the image
	@echo Building $(IMAGE_NAME)
	@docker build -t $(IMAGE_NAME) .

run:  ## run the image
	docker run -v $(PWD) -p 9000:8000 $(IMAGE_NAME)

stop: ## stop
	$(eval POD := $(shell docker ps -q))
	@docker kill $(POD)

push:  ## push to Docker
	@echo Push image to Docker Repository
	@docker push $(IMAGE_NAME)