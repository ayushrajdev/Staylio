package db

import "database/sql"

type IRoleRepository interface{}

type RoleRepository struct {
	db *sql.DB
}

func NewRoleRepository(db *sql.DB) *RoleRepository  {
	return &RoleRepository{
		db: db,
	}
}