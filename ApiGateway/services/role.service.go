
package services

import (
	repositories "ApiGateway/db/repositories"
	"ApiGateway/models"
)

type IRoleService interface {
	GetRoleById(id int64) (*models.Role, error)
	GetRoleByName(name string) (*models.Role, error)
	GetAllRoles() ([]*models.Role, error)
	CreateRole(name string, description string) (*models.Role, error)
	DeleteRoleById(id int64) error
	UpdateRole(id int64, name string, description string) (*models.Role, error)
	GetRolePermissions(roleId int64) ([]*models.RolePermission, error)
	AddPermissionToRole(roleId int64, permissionId int64) (*models.RolePermission, error)
	RemovePermissionFromRole(roleId int64, permissionId int64) error
	GetAllRolePermissions() ([]*models.RolePermission, error)
	AssignRoleToUser(userId int64, roleId int64) error
}

type RoleService struct {
	roleRepository           *repositories.RoleRepository
	rolePermissionRepository *repositories.RolePermissionRepository
	userRoleRepository       *repositories.UserRoleRepository
}

func NewRoleService(roleRepo *repositories.RoleRepository, rolePermissionRepo *repositories.RolePermissionRepository, userRoleRepo *repositories.UserRoleRepository) *RoleService {
	return &RoleService{
		roleRepository:           roleRepo,
		rolePermissionRepository: rolePermissionRepo,
		userRoleRepository:       userRoleRepo,
	}
}

func (this *RoleService) GetRoleById(id int64) (*models.Role, error) {
	return this.roleRepository.GetRoleById(id)
}

func (this *RoleService) GetRoleByName(name string) (*models.Role, error) {
	return this.roleRepository.GetRoleByName(name)
}

func (this *RoleService) GetAllRoles() ([]*models.Role, error) {
	return this.roleRepository.GetAllRoles()
}

func (this *RoleService) CreateRole(name string, description string) (*models.Role, error) {
	return this.roleRepository.CreateRole(name, description)
}

func (this *RoleService) DeleteRoleById(id int64) error {
	return this.roleRepository.DeleteRoleById(id)
}

func (this *RoleService) UpdateRole(id int64, name string, description string) (*models.Role, error) {

	return this.roleRepository.UpdateRole(id, name, description)
}

func (this *RoleService) GetRolePermissions(roleId int64) ([]*models.RolePermission, error) {
	return this.rolePermissionRepository.GetRolePermissionByRoleId(roleId)
}

func (this *RoleService) AddPermissionToRole(roleId int64, permissionId int64) (*models.RolePermission, error) {
	return this.rolePermissionRepository.AddPermissionToRole(roleId, permissionId)
}

func (this *RoleService) RemovePermissionFromRole(roleId int64, permissionId int64) error {
	return this.rolePermissionRepository.RemovePermissionFromRole(roleId, permissionId)
}

func (this *RoleService) GetAllRolePermissions() ([]*models.RolePermission, error) {
	return this.rolePermissionRepository.GetAllRolePermissions()
}

func (this *RoleService) AssignRoleToUser(userId int64, roleId int64) error {
	return this.userRoleRepository.AssignRoleToUser(userId, roleId)
}
