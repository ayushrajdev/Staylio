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
	r.With(middlewares.ValidateCreateUserRequest).Post("/register", u.userController.Create)
	r.With(middlewares.ValidateLoginUserRequest).Post("/login", u.userController.Verify)
	r.With(middlewares.AuthMiddleware).Get("/profile", u.userController.GetProfile)
}
