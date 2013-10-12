
test: 
	@./node_modules/.bin/mocha \
		--slow 200ms \
		--bail

test-dev: 
	@NODE_DEBUG='request bikeshare' ./node_modules/.bin/mocha \
		--slow 200ms \
		--bail
		--debug

clean:
	@rm -rf dist
	@rm -rf components
	@rm -rf build
	@rm -rf docs

.PHONY: test