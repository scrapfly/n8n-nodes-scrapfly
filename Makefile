bump-version:
	@echo "Bumping version to ${VERSION}"
	npm version --no-git-tag-version "${VERSION}"
	git add :/
	git commit -m "Bump version to ${VERSION}"
	git tag "v${VERSION}"
	git push --follow-tags
