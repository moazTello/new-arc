if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )

cd ..

pnpm install

pnpm db:prepare

pnpm build


pause
