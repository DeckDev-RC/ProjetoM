@echo off
echo ==========================================
echo    DEPLOY SCRIPT - HOSTGATOR
echo ==========================================
echo.

echo [1/3] Fazendo build de producao...
call npm run build

if %errorlevel% neq 0 (
    echo ERRO: Build falhou!
    pause
    exit /b 1
)

echo.
echo [2/3] Build concluido com sucesso!
echo.
echo [3/3] Arquivos prontos para upload em: ./dist/
echo.
echo ==========================================
echo    PROXIMOS PASSOS:
echo ==========================================
echo 1. Acesse o File Manager do cPanel
echo 2. Navegue ate public_html
echo 3. Delete arquivos antigos (se existirem)
echo 4. Faca upload de TODOS os arquivos da pasta 'dist'
echo 5. Nao crie subpasta - envie direto para public_html
echo.
echo OU use FTP para enviar os arquivos da pasta 'dist'
echo.
echo Pressione qualquer tecla para abrir a pasta dist...
pause
explorer dist 