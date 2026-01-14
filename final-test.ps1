# Final API Test with Correct Model
$key = "AIzaSyDWUozePx6WoQqQcWUw5rnmaVliChNbZwg"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "TESTING GEMINI API - FINAL VERIFICATION" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Test with gemini-2.5-flash (the working model)
Write-Host "Testing with gemini-2.5-flash model..." -ForegroundColor Yellow
try {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$key"
    $body = @{
        contents = @(
            @{
                parts = @(
                    @{ text = "What is 2+2? Answer in exactly 3 words." }
                )
            }
        )
    } | ConvertTo-Json -Depth 10
    
    $response = Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json"
    $answer = $response.candidates[0].content.parts[0].text
    
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "✅✅✅ API KEY IS WORKING PERFECTLY! ✅✅✅" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Question: What is 2+2?" -ForegroundColor Cyan
    Write-Host "AI Response: $answer" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Your API key: $($key.Substring(0,25))..." -ForegroundColor White
    Write-Host ""
    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "1. Add this key to Netlify as GEMINI_API_KEY" -ForegroundColor White
    Write-Host "2. Deploy your site" -ForegroundColor White
    Write-Host "3. Your AI chatbot will give REAL responses! 🎉" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "  ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $err = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "  Error: $($err.error.message)" -ForegroundColor Red
    }
}
