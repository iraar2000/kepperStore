@echo off

set /p storename="Store name: "
set /p themeid="Theme ID to delete: "

echo Deleting theme...
shopify theme delete --store=%storename% --theme=123456 --force

echo Starting dev server...
shopify theme dev --store=%storename%

pause