try {
    Get-Command yarn
}
catch {
    Write-Output "You must install yarn to run this script."
    Write-Output "See: https://yarnpkg.com/ for more information"
    Exit
}

try {
    Get-Command poetry
}
catch {
    Write-Output "You must install poetry to run this script."
    Write-Output "See: https://python-poetry.org/ for more information"
    Exit
}

yarn install

Set-Location -Path "./python/showwhy-backend"

poetry install

Set-Location -Path "../showwhy-inference"

poetry install

Set-Location -Path "../.."