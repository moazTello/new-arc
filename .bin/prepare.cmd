if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )

cd ..

npm install

npx run db:prepare

npm run build

pause
