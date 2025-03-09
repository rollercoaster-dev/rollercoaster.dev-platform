#!/bin/bash

# Check if .env file already exists
if [ -f .env ]; then
  echo "The .env file already exists."
  echo "Would you like to overwrite it? (y/N)"
  read -r answer
  if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
    echo "Aborting..."
    exit 0
  fi
fi

# Check if .env.example exists
if [ ! -f .env.example ]; then
  echo "Error: .env.example file not found."
  exit 1
fi

# Copy .env.example to .env
cp .env.example .env
echo "Created .env file from .env.example template."

# Prompt for database URL
echo "Please enter your PostgreSQL database URL:"
echo "Example: postgres://username:password@localhost:5432/atbadges"
read -r db_url

# Update .env file with provided values
sed -i '' "s|DATABASE_URL=.*|DATABASE_URL=$db_url|" .env

echo "Environment setup complete!"
echo "You can now run 'bun run db:setup' to initialize the database."