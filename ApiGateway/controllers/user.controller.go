package controllers

import (
	"ApiGateway/dtos"
	"ApiGateway/services"
	"ApiGateway/utils"
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
	var payload dtos.CreateUserDTO
	utils.ReadJsonBody(r, &payload)
	if err := utils.Validator.Struct(&payload); err != nil {

		return
	}
	this.userService.Create(&payload)
	w.Write([]byte("user registered"))
}
func (this *UserController) Verify(w http.ResponseWriter, r *http.Request) {
	this.userService.Verify("hdf")
}
