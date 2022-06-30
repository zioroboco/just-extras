set positional-arguments

all: install format typecheck test

install:
    pnpm install --loglevel=error

format: install
    pnpm dprint fmt

typecheck: install
    pnpm tsc --project jsconfig.json

test: install
    node --test
