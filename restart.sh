#!/bin/bash

# CodeCraft — Restart Script
# Kills processes on dev ports and relaunches start.sh

PORTS=(3000 3001 3002)

echo "Stopping processes on ports ${PORTS[*]}..."

for port in "${PORTS[@]}"; do
  pids=$(lsof -ti :"$port" 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "  Killing port $port (PID $pids)"
    kill -TERM $pids 2>/dev/null
  fi
done

sleep 1

# Force-kill anything still holding the ports
for port in "${PORTS[@]}"; do
  pids=$(lsof -ti :"$port" 2>/dev/null)
  if [ -n "$pids" ]; then
    kill -9 $pids 2>/dev/null
  fi
done

exec "$(dirname "$0")/start.sh"
