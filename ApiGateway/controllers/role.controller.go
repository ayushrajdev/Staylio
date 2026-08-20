package controllers

import (
	dto "ApiGateway/dtos"
	"ApiGateway/services"
	response "ApiGateway/utils/response"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type RoleController struct {
	roleService *services.RoleService
}

func NewRoleController(roleService *services.RoleService) *RoleController {
	return &RoleController{
		roleService: roleService,
	}
}

func (this *RoleController) AssignRoleToUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")
	roleId := chi.URLParam(r, "roleId")
	if userId == "" {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "User ID is required", fmt.Errorf("missing user ID"))
		return
	}
	if roleId == "" {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}

	roleIdInt, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}

	userIdInt, err := strconv.ParseInt(userId, 10, 64)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid user ID", err)
		return
	}

	err = this.roleService.AssignRoleToUser(userIdInt, roleIdInt)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to assign role to user", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusOK, "Role assigned to user successfully", nil)

}

func (this *RoleController) GetRoleById(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id") // Extract role ID from URL parameters
	if roleId == "" {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}
	id, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}
	role, err := this.roleService.GetRoleById(id)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch role", err)
		return
	}

	if role == nil {
		response.WriteJsonErrorResponse(w, http.StatusNotFound, "Role not found", fmt.Errorf("role with ID %s not found", roleId))
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusOK, "Role fetched successfully", role)

}

func (this *RoleController) GetAllRoles(w http.ResponseWriter, r *http.Request) {
	roles, err := this.roleService.GetAllRoles()
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch roles", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusOK, "Roles fetched successfully", roles)
}

func (this *RoleController) CreateRole(w http.ResponseWriter, r *http.Request) {
	payload := r.Context().Value("payload").(dto.CreateRoleRequestDTO)

	role, err := this.roleService.CreateRole(payload.Name, payload.Description)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to create role", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusCreated, "Role created successfully", role)
}

func (this *RoleController) UpdateRole(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id")
	if roleId == "" {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}

	id, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}

	payload := r.Context().Value("payload").(dto.UpdateRoleRequestDTO)

	role, err := this.roleService.UpdateRole(id, payload.Name, payload.Description)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to update role", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusOK, "Role updated successfully", role)
}

func (this *RoleController) DeleteRole(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id")
	if roleId == "" {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}

	id, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}

	err = this.roleService.DeleteRoleById(id)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to delete role", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusOK, "Role deleted successfully", nil)
}

func (this *RoleController) GetRolePermissions(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id")
	if roleId == "" {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}

	id, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}

	rolePermissions, err := this.roleService.GetRolePermissions(id)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch role permissions", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusOK, "Role permissions fetched successfully", rolePermissions)
}

func (this *RoleController) AssignPermissionToRole(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id")
	if roleId == "" {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}

	id, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}

	payload := r.Context().Value("payload").(dto.AssignPermissionRequestDTO)

	rolePermission, err := this.roleService.AddPermissionToRole(id, payload.PermissionId)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to assign permission to role", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusCreated, "Permission assigned to role successfully", rolePermission)
}

func (this *RoleController) RemovePermissionFromRole(w http.ResponseWriter, r *http.Request) {
	roleId := chi.URLParam(r, "id")
	if roleId == "" {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Role ID is required", fmt.Errorf("missing role ID"))
		return
	}

	id, err := strconv.ParseInt(roleId, 10, 64)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusBadRequest, "Invalid role ID", err)
		return
	}

	payload := r.Context().Value("payload").(dto.RemovePermissionRequestDTO)

	err = this.roleService.RemovePermissionFromRole(id, payload.PermissionId)
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to remove permission from role", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusOK, "Permission removed from role successfully", nil)
}

func (this *RoleController) GetAllRolePermissions(w http.ResponseWriter, r *http.Request) {
	rolePermissions, err := this.roleService.GetAllRolePermissions()
	if err != nil {
		response.WriteJsonErrorResponse(w, http.StatusInternalServerError, "Failed to fetch all role permissions", err)
		return
	}

	response.WriteJsonSuccessResponse(w, http.StatusOK, "All role permissions fetched successfully", rolePermissions)
}
