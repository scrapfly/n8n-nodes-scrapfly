# Scrapfly n8n community node — release/dev Makefile.
# Mirrors the other SDK Makefiles so the release procedure in task/sdk-release.md
# can treat every target uniformly: make release VERSION=x.y.z NEXT_VERSION=x.y.z+1

VERSION ?=
NEXT_VERSION ?=

.PHONY: init install dev bump bump-version generate-docs release fmt lint test build publish

init:
	@command -v npm >/dev/null || { echo "npm is required"; exit 2; }

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

test:
	@# n8n community nodes have no unit test harness by default; lint is the gate.
	npm run lint

fmt:
	npm run format

lint:
	npm run lint

bump: bump-version

bump-version:
	@if [ -z "$(VERSION)" ]; then echo "Usage: make bump VERSION=x.y.z"; exit 2; fi
	npm version --no-git-tag-version "$(VERSION)"
	git add package.json package-lock.json
	git commit -m "bump version to $(VERSION)"
	git push

generate-docs:
	@true

publish:
	npm publish --access public

release:
	@if [ -z "$(VERSION)" ]; then echo "Usage: make release VERSION=x.y.z [NEXT_VERSION=x.y.(z+1)]"; exit 2; fi
	git branch | grep \* | cut -d ' ' -f2 | grep main || exit 1
	git pull origin main
	$(MAKE) lint
	$(MAKE) build
	npm version --no-git-tag-version "$(VERSION)"
	git add package.json package-lock.json
	-git commit -m "Release $(VERSION)"
	-git push origin main
	git tag -a v$(VERSION) -m "Version $(VERSION)"
	git push --tags
	$(MAKE) publish
	@if [ -n "$(NEXT_VERSION)" ]; then $(MAKE) bump VERSION=$(NEXT_VERSION); fi
