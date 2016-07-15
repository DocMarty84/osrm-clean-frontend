all:
	make install
	make clean
	make build

build:
	npm run build
	cp -r map/src/images/ bin/

clean:
	rm -rf bin && mkdir bin

install:
	npm install

watch:
	npm run watch
