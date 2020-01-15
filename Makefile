REGISTRY=717456749013.dkr.ecr.us-east-1.amazonaws.com
SERVICE=slyce-receipt-api
CONTAINER=$(REGISTRY)/$(SERVICE)
COMMIT=`git rev-parse --short HEAD`
BRANCH_TAG=`git rev-parse --abbrev-ref HEAD | sed 's/\//-/g'`

release: build push

release-staging: build push push-staging

release-production: build push push-production

release-tag:
	docker tag $(SERVICE):$(COMMIT) $(CONTAINER):${tag}
	docker push $(CONTAINER):${tag}

build:
	docker build -t $(SERVICE):$(COMMIT) -f Dockerfile .

push:
	docker tag $(SERVICE):$(COMMIT) $(CONTAINER):$(COMMIT)
	docker push $(CONTAINER):$(COMMIT)

push-staging:
	@make release-tag tag=staging
	@make push-composite environment=staging

push-production:
	@make release-tag tag=production
	@make push-composite environment=production

push-latest:
	@make release-tag tag=latest

push-composite:
	@make release-tag tag="${environment}.$(BRANCH_TAG).$(COMMIT)"

deploy:
	kubectl config use-context data-cluster
	kubectl -n slyce apply -f kube/deploy.yaml
