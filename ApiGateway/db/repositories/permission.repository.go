package db

import "database/sql"

type IPermissionRepository interface {
}

type PermissionRepository struct {
	db *sql.DB
}