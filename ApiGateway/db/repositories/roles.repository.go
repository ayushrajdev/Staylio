package db

import (
	"ApiGateway/models"
	"database/sql"
)

type IRoleRepository interface {
	GetRoleById(id int64) (*models.Role, error)
	GetRoleByName(name string) (*models.Role, error)
	GetAllRoles() ([]*models.Role, error)
	CreateRole(name string, description string) (*models.Role, error)
	DeleteRoleById(id int64) error
	UpdateRole(id int64, name string, description string) (*models.Role, error)
}

type RoleRepository struct {
	db *sql.DB
}

func NewRoleRepository(db *sql.DB) *RoleRepository {
	return &RoleRepository{
		db: db,
	}
}

func (this *RoleRepository) GetRoleById(id int64) (*models.Role, error) {
	query := "select id,name,description,created_at,updated_at from roles where id = ?"
	row := this.db.QueryRow(query, id)
	var role = &models.Role{}
	if err := row.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
		return nil, err
	}

	return role, nil
}
func (this *RoleRepository) GetRoleByName(name string) (*models.Role, error) {
	query := "select id,name,description,created_at,updated_at from roles where name = ?"
	row := this.db.QueryRow(query, name)
	var role = &models.Role{}
	if err := row.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
		return nil, err
	}
	return role, nil
}
func (this *RoleRepository) GetAllRoles() ([]*models.Role, error) {
	query := "SELECT id, name, description, created_at, updated_at FROM roles"
	rows, err := this.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []*models.Role
	for rows.Next() {
		role := &models.Role{}
		if err := rows.Scan(&role.Id, &role.Name, &role.Description, &role.CreatedAt, &role.UpdatedAt); err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return roles, nil
}

func (this *RoleRepository) CreateRole(name string, description string) (*models.Role, error) {
	query := "INSERT INTO roles (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())"
	result, err := this.db.Exec(query, name, description)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return &models.Role{
		Id:          id,
		Name:        name,
		Description: description,
		CreatedAt:   "", // Will be set by the database
		UpdatedAt:   "", // Will be set by the database
	}, nil
}

func (this *RoleRepository) DeleteRoleById(id int64) error {
	query := "DELETE FROM roles WHERE id = ?"
	result, err := this.db.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
func (this *RoleRepository) UpdateRole(id int64, name string, description string) (*models.Role, error) {
	query := "UPDATE roles SET name = ?, description = ?, updated_at = NOW() WHERE id = ?"
	_, err := this.db.Exec(query, name, description, id)
	if err != nil {
		return nil, err
	}

	return &models.Role{
		Id:          id,
		Name:        name,
		Description: description,
		CreatedAt:   "", // Will be set by the database
		UpdatedAt:   "", // Will be set by the database
	}, nil
}
