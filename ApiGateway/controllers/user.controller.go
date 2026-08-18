package controllers

import (
	"ApiGateway/dtos"
	"ApiGateway/services"
	"ApiGateway/utils"
	"ApiGateway/utils/helpers"
	"fmt"
	"net/http"
)

type UserController struct {
	userService services.IUserService
}

func NewUserController(_userService services.IUserService) *UserController {
	return &UserController{userService: _userService}
}

func (this *UserController) Vreate(w http.ResponseWriter, r *http.Request) {
	println("inside the user controller")

	//this will be covert the json body to the struct object and validate the struct object
	var payload dtos.CreateUserDTO

	// it will read the data from the request body chunk by chunk and store it in the payload struct object
	if err := utils.ReadJsonBody(r, &payload); err != nil {
		fmt.Println("error while reading the request body", err)
	}
	// if err := utils.Validator.Struct(&payload); err != nil {
	// 	return
	// }
	// this.userService.Create(&payload)
	w.Write([]byte("user registered"))
}


func (this *UserController) Create(w http.ResponseWriter, r *http.Request) {
	println("inside the user controller")

	var payload dtos.CreateUserDTO
	payload = r.Context().Value("payload").(dtos.CreateUserDTO)

	this.userService.Create(&payload)

	token, _ := helpers.GenerateJwtToken(payload.Username,payload.Password)
	fmt.Println("token : ", token)

	helpers.SetResponseCookie(w, token)
	w.Write([]byte("user registered"))

	
}

func (this *UserController) Verify(w http.ResponseWriter, r *http.Request) {
	// this.userService.Verify("hdf")
	var payload dtos.CreateUserDTO
	payload = r.Context().Value("payload").(dtos.CreateUserDTO)
	
	this.userService.Verify("")
	
	token, _ := helpers.GenerateJwtToken(payload.Username,payload.Password)
	fmt.Println("token : ", token)

	helpers.SetResponseCookie(w, token)
	w.Write([]byte("user verified"))
}


