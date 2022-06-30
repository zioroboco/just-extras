bin := "node_modules/.bin/"
dprint := bin + "dprint"
tsc := bin + "tsc"

install:
    pnpm install

build: install
    {{ tsc }} --build

watch: install
    {{ tsc }} --build --watch

clean: install
    {{ tsc }} --build --clean

format: install
    {{ dprint }} fmt

test: install build
    node --test tests
