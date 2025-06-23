if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )

cd .. && npm run db:backup

cmd /k
