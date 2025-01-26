curl \
  -X PUT 'http://localhost:7700/indexes/cells/settings/sortable-attributes' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer MASTER_KEY' \
  --data-binary '["createdAt"]'

curl \
  -X PUT 'http://localhost:7700/indexes/cells/settings/filterable-attributes' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer MASTER_KEY' \
  --data-binary '["branchId"]'
