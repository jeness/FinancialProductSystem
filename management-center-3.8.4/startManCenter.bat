@ECHO OFF

set argC=0
for %%x in (%*) do Set /A argC+=1
set help=false

if %argC% equ 1 set help=true
if %argC% gtr 3 set help=true
if %argC% equ 1 ( echo "" if %1% equ "--help" help=true )

if %help% == true (
    echo usage: startManCenter.bat
    echo usage: startManCenter.bat [port] [path]
    echo usage: startManCenter.bat [port] [path] [classpath]
)

if not exist %0\..\work mkdir %0\..\work

if %argC% == 3 (
    java -cp "mancenter-3.8.4.war;%3" Launcher %1 %2
)

if %argC% == 2 (
    java -cp mancenter-3.8.4.war Launcher %1 %2
)

if %argC% == 0 (
    java -cp mancenter-3.8.4.war Launcher
)
