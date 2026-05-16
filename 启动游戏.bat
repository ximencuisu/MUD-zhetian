@echo off
echo ========================================
echo WAMUD 游戏启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查依赖...
if exist "node_modules" (
    echo ✓ node_modules 已安装
) else (
    echo ✗ 正在安装依赖...
    call npm install
)

echo.
echo [2/3] 启动开发服务器...
echo.
echo ========================================
echo 游戏将在浏览器中打开
echo 地址: http://localhost:5173
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

start http://localhost:5173

call npm run dev

pause
