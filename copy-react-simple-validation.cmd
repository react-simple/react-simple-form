@set SOURCE=..\react-simple-validation
@set TARGET=.\node_modules\@react-simple\react-simple-validation
@set CACHE=.\node_modules\.cache
@cls

if exist %TARGET% rmdir /s /q %TARGET%\
if exist %CACHE% rmdir /s /q %CACHE%

xcopy /s /y %SOURCE%\dist\ %TARGET%\dist\
xcopy /y %SOURCE%\package.json %TARGET%\
xcopy /y %SOURCE%\README.md %TARGET%\

@rem pause 0
