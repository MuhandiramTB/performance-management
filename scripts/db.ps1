param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "reset", "logs")]
    [string]$Command
)

function Start-Database {
    Write-Host "Starting PostgreSQL container..."
    docker-compose up -d postgres
    Write-Host "Waiting for PostgreSQL to be ready..."
    Start-Sleep -Seconds 5
    Write-Host "PostgreSQL is ready!"
}

function Stop-Database {
    Write-Host "Stopping PostgreSQL container..."
    docker-compose down
    Write-Host "PostgreSQL container stopped."
}

function Reset-Database {
    Write-Host "Resetting PostgreSQL container..."
    docker-compose down -v
    docker-compose up -d postgres
    Write-Host "Waiting for PostgreSQL to be ready..."
    Start-Sleep -Seconds 5
    Write-Host "PostgreSQL has been reset and is ready!"
}

function Show-DatabaseLogs {
    Write-Host "Showing PostgreSQL logs..."
    docker-compose logs -f postgres
}

switch ($Command) {
    "start" { Start-Database }
    "stop" { Stop-Database }
    "reset" { Reset-Database }
    "logs" { Show-DatabaseLogs }
    default {
        Write-Host "Usage: .\db.ps1 {start|stop|reset|logs}"
        exit 1
    }
} 