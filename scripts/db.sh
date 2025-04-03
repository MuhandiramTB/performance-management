#!/bin/bash

# Function to start the database
start_db() {
  echo "Starting PostgreSQL container..."
  docker-compose up -d postgres
  echo "Waiting for PostgreSQL to be ready..."
  sleep 5
  echo "PostgreSQL is ready!"
}

# Function to stop the database
stop_db() {
  echo "Stopping PostgreSQL container..."
  docker-compose down
  echo "PostgreSQL container stopped."
}

# Function to reset the database
reset_db() {
  echo "Resetting PostgreSQL container..."
  docker-compose down -v
  docker-compose up -d postgres
  echo "Waiting for PostgreSQL to be ready..."
  sleep 5
  echo "PostgreSQL has been reset and is ready!"
}

# Function to show database logs
logs_db() {
  echo "Showing PostgreSQL logs..."
  docker-compose logs -f postgres
}

# Main script
case "$1" in
  start)
    start_db
    ;;
  stop)
    stop_db
    ;;
  reset)
    reset_db
    ;;
  logs)
    logs_db
    ;;
  *)
    echo "Usage: $0 {start|stop|reset|logs}"
    exit 1
    ;;
esac 