#!/bin/bash
mkdir -p public
cp index.html script.js public/
cp -r netlify public/ 2>/dev/null || :
# Copy any other assets if you have them, e.g. images
# cp -r images public/ 2>/dev/null || :
echo "Build complete. Files copied to public/"
