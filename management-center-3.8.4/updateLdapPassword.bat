@ECHO OFF

set argC=0
for %%x in (%*) do Set /A argC+=1
set help=false

if %argC% gtr 0 set help=true

if %help% == true (
    echo usage: updateLdapPassword.bat
)

if %argC% == 0 (
    java -cp mancenter-3.8.4.war Launcher updateLdapPassword
)
