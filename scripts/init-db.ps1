$env:PGPASSWORD = "postgres"
psql -h localhost -U postgres -d performance_management -f "$PSScriptRoot\init-db.sql" 