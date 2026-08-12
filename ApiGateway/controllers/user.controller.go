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


func (this *UserController) Create(w http.ResponseWriter, r *http.Request) {
	println("inside the user controller")
	// this.userService.Create()
	w.Write([]byte("user registered"))
}
func (this *UserController) Verify(w http.ResponseWriter, r *http.Request) {
	 this.userService.Verify("hdf")
}