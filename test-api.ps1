# Test Gemini API Key - Comprehensive Test
$apiKey = "AIzaSyDWUozePx6WoQqQcWUw5rnmaVliChNbZwg"

# Try multiple endpoints
$endpoints = @(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"
)

$body = @{
    contents = @(
        @{
            parts = @(
                @{
                    text = "Say hello"
                }
            )
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Testing Gemini API with new key..." -ForegroundColor Cyan
Write-Host "API Key: $($apiKey.Substring(0,20))..." -ForegroundColor Gray
Write-Host ""

$success = $false

foreach ($endpoint in $endpoints) {
    $url = "$endpoint`?key=$apiKey"
    $modelName = $endpoint.Split("/")[-1].Replace(":generateContent", "")
    
    Write-Host "Testing: $modelName" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        
        if ($response.candidates -and $response.candidates[0].content.parts) {
            $answer = $response.candidates[0].content.parts[0].text
            Write-Host "  ✅ SUCCESS!" -ForegroundColor Green
            Write-Host "  Response: $answer" -ForegroundColor Cyan
            Write-Host ""
            $success = $true
            break
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "  ❌ Failed (HTTP $statusCode)" -ForegroundColor Red
        
        if ($_.ErrorDetails.Message) {
            $errorJson = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "  Error: $($errorJson.error.message)" -ForegroundColor Red
        }
        Write-Host ""
    }
}

if (-not $success) {
    Write-Host "================================================================" -ForegroundColor Red
    Write-Host "API KEY VERIFICATION FAILED" -ForegroundColor Red
    Write-Host "================================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. API key needs to be enabled in Google AI Studio" -ForegroundColor White
    Write-Host "2. Generative Language API not activated" -ForegroundColor White
    Write-Host "3. Key restrictions might be blocking requests" -ForegroundColor White
    Write-Host ""
    Write-Host "Visit: https://aistudio.google.com/app/apikey" -ForegroundColor Cyan
} else {
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "API KEY IS WORKING CORRECTLY!" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
}
