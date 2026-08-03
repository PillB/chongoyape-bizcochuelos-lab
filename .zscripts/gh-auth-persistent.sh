#!/bin/bash
# Persistent gh auth wrapper — keeps the auth process alive
export PATH="$HOME/.local/bin:$PATH"
export HOME=/home/z

# Run gh auth login, capture output
gh auth login --hostname github.com --git-protocol https --web > /tmp/gh-auth-output.log 2>&1 &
GH_PID=$!
echo $GH_PID > /tmp/gh-auth-real.pid

# Wait for the process to finish (it will block until auth completes or times out)
wait $GH_PID
EXIT_CODE=$?
echo "AUTH_EXIT=$EXIT_CODE" >> /tmp/gh-auth-output.log

# If auth succeeded, set up git credential helper
if [ $EXIT_CODE -eq 0 ]; then
  gh auth setup-git 2>&1 >> /tmp/gh-auth-output.log
  echo "GIT_SETUP_DONE" >> /tmp/gh-auth-output.log
fi
