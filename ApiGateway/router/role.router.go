package router

import (
	"ApiGateway/controllers"
	"ApiGateway/middlewares"

	"github.com/go-chi/chi/v5"
)

type RoleRouter struct {
	roleController *controllers.RoleController
}

func NewRoleRouter(_roleController *controllers.RoleController) Router {
	return &RoleRouter{
		roleController: _roleController,
	}
}

func (this *RoleRouter) Register(r chi.Router) {
	// Role CRUD operations
	r.Get("/roles/{id}", this.roleController.GetRoleById)
	r.Get("/roles", this.roleController.GetAllRoles)
	r.With(middlewares.CreateRoleRequestValidator).Post("/roles", this.roleController.CreateRole)
	r.With(middlewares.UpdateRoleRequestValidator).Put("/roles/{id}", this.roleController.UpdateRole)
	r.Delete("/roles/{id}", this.roleController.DeleteRole)

	// Role permissions operations
	r.Get("/roles/{id}/permissions", this.roleController.GetRolePermissions)
	r.With(middlewares.AssignPermissionRequestValidator).Post("/roles/{id}/permissions", this.roleController.AssignPermissionToRole)
	r.With(middlewares.RemovePermissionRequestValidator).Delete("/roles/{id}/permissions", this.roleController.RemovePermissionFromRole)
	r.Get("/role-permissions", this.roleController.GetAllRolePermissions)
	r.With(middlewares.AuthMiddleware, middlewares.RequireAllRoles("admin")).Post("/roles/{userId}/assign/{roleId}", this.roleController.AssignRoleToUser)
}
