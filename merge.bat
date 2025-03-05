@echo off
for /r %%i in (*.*) do (
if not %%~nxi == output.txt (
echo %%~nxi >> output.txt
type "%%i" >> output.txt
echo. >> output.txt
echo. >> output.txt
)
)