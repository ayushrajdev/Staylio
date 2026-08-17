package router

import (
	"ApiGateway/controllers"
	"ApiGateway/middlewares"
	"github.com/go-chi/chi/v5"
)

type UserRouter struct {
	userController *controllers.UserController
}

func NewUserRouter(_userController *controllers.UserController) Router {
	return &UserRouter{
		userController: _userController,
	}
}

func (u *UserRouter) Register(r chi.Router) {
	r.With(middlewares.ValidateLoginUserRequest).Post("/register", u.userController.Verify)
	r.With(middlewares.ValidateCreateUserRequest).Post("/login", u.userController.Verify)
}
