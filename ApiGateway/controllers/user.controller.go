package controllers

import (
	"ApiGateway/services"
	"net/http"
)

type UserController struct {
	userService services.IUserService
}

func NewUserController(_userService services.IUserService) *UserController {
	return &UserController{userService: _userService}
}


func (u *UserController) Register(w http.ResponseWriter, r *http.Request) {
	println("inside the user controller")
	u.userService.Register()
	w.Write([]byte("user registered"))
}