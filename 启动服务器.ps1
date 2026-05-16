# WAMUD 开发服务器启动脚本
# 设置编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WAMUD 游戏服务器启动中..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 切换到项目目录
$projectDir = "c:\Users\ximen\Desktop\acciowork\wamud-clone"
Set-Location $projectDir

# 检查依赖
Write-Host "[1/3] 检查依赖..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ 依赖已安装" -ForegroundColor Green
} else {
    Write-Host "  ! 正在安装依赖..." -ForegroundColor Yellow
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ 依赖安装失败" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# 启动服务器
Write-Host "[2/3] 启动开发服务器..." -ForegroundColor Yellow
Write-Host "  地址: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  按 Ctrl+C 停止服务器" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "游戏启动中..." -ForegroundColor Green
Write-Host "请在浏览器中打开: http://localhost:5173" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 启动vite
& npm run dev -- --host

# 保持窗口打开
Write-Host ""
Write-Host "服务器已停止。" -ForegroundColor Yellow
pause
