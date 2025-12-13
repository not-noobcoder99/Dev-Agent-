# DevAgent Pro - Setup Script
# Run this to quickly set up the project

Write-Host "🤖 DevAgent Pro - Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📦 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check Python
try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Python not found. Some features may not work." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow

# Install root dependencies
Write-Host "Installing root packages..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "Installing frontend packages..." -ForegroundColor Cyan
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Install Python dependencies
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "Installing Python packages..." -ForegroundColor Cyan
    pip install -r requirements.txt
}

Write-Host ""
Write-Host "⚙️  Setting up environment..." -ForegroundColor Yellow

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env and add your API keys" -ForegroundColor Yellow
} else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Quick Start Commands:" -ForegroundColor Cyan
Write-Host "  npm run dev              - Start development server" -ForegroundColor White
Write-Host "  npm run agent:generate   - Generate code" -ForegroundColor White
Write-Host "  npm run agent:review     - Review code" -ForegroundColor White
Write-Host ""
Write-Host "📖 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Edit .env with your API keys (or use mock mode)" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation: README.md" -ForegroundColor Cyan
Write-Host "🎬 Demo Guide: demo/demo-script.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green
