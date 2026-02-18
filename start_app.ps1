# Start Docker containers
Write-Host "Starting Docker containers..."
docker-compose up -d

# Start Backend
Write-Host "Starting Backend..."
Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -WorkingDirectory "backend" -NoNewWindow

# Start Frontend
Write-Host "Starting Frontend..."
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "frontend" -NoNewWindow

Write-Host "Application started! Access Frontend at http://localhost:3000"
