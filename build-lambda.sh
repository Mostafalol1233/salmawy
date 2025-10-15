#!/bin/bash
set -e

echo "Building frontend..."
npm run build

echo "Building serverless lambda..."
npx esbuild server/server-lambda.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server-lambda.js

echo "Build complete!"
