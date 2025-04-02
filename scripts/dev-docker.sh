#!/bin/bash

# Ensure script fails on any error
set -e

# Build and start the development containers
docker compose -f docker-compose.dev.yml up --build 