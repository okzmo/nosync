#!/bin/sh

source ./.env
curl -X POST "http://localhost:7700/indexes/cells/documents?primaryKey=id" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MEILI_MASTER_KEY}" \
  --data-binary @meilisearch/output.json

curl \
  -X PUT 'http://localhost:7700/indexes/cells/settings/filterable-attributes' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer hcNGAAGEWgwka8SiCrsYNiS7ztQ9D--aclbkD6sYBF8' \
  --data-binary '["branchId"]'

curl \
  -X PUT 'http://localhost:7700/indexes/cells/settings/sortable-attributes' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer hcNGAAGEWgwka8SiCrsYNiS7ztQ9D--aclbkD6sYBF8' \
  --data-binary '["createdAt"]'
