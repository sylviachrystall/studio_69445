.PHONY: clear
clear:
	-yarn run clear

.PHONY: build
build:
	-yarn run build

.PHONY: watch
watch:
	-yarn run watch

.PHONY: bump-major
bump-major:
	-yarn run bump-major

.PHONY: bump-minor
bump-minor:
	-yarn run bump-minor

.PHONY: bump-patch
bump-patch:
	-yarn run bump-patch

.PHONY: dist
dist:
	-yarn run dist
