set positional-arguments

install:
    pnpm install --ignore-scripts --loglevel=error

build: install
    pnpm tsc --build

watch: install
    pnpm tsc --build --watch

clean: install
    pnpm tsc --build --clean

format: install
    pnpm dprint fmt

test: install build
    pnpm node --test tests
