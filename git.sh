#!/bin/bash

# Get the current date
commit_message=$(date '+%Y-%m-%d')

# Commit all changes with the current date as the commit message
git add .
git commit -m "$commit_message"

# Push changes to the remote repository
git push  # Replace "master" with your branch name if needed
