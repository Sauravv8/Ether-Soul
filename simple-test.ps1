# Simple API Test
$key = "AIzaSyDWUozePx6WoQqQcWUw5rnmaVliChNbZwg"

Write-Host "Testing API key: $($key.Substring(0,20))..." -ForegroundColor Cyan
Write-Host ""

# Test 1: List models endpoint (this should work even if generateContent doesn't)
Write-Host "Test 1: Listing available models..." -ForegroundColor Yellow
try {
    $listUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=$key"
    $models = Invoke-RestMethod -Uri $listUrl -Method GET
    Write-Host "  ✅ SUCCESS! API key works!" -ForegroundColor Green
    Write-Host "  Available models:" -ForegroundColor Cyan
    foreach ($model in $models.models) {
        Write-Host "    - $($model.name)" -ForegroundColor White
    }
    Write-Host ""
} catch {
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $err = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "  Error: $($err.error.message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 2: Generate content
Write-Host "Test 2: Generating content..." -ForegroundColor Yellow
try {
    $genUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$key"
    $body = @{
        contents = @(
            @{
                parts = @(
                    @{ text = "Say hello" }
                )
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $response = Invoke-RestMethod -Uri $genUrl -Method POST -Body $body -ContentType "application/json"
    $answer = $response.candidates[0].content.parts[0].text
    Write-Host "  ✅ SUCCESS! Response: $answer" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $err = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "  Error: $($err.error.message)" -ForegroundColor Red
    }
}
