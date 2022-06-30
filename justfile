set positional-arguments

install:
    pnpm install --loglevel=error

format: install
    pnpm dprint fmt

typecheck: install
    pnpm tsc --project jsconfig.json
