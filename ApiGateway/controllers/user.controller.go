package controllers

import (
	"ApiGateway/dtos"
	"ApiGateway/middlewares"
	"ApiGateway/services"
	"ApiGateway/utils/helpers"
	"ApiGateway/utils/response"
	"fmt"
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
	payload = r.Context().Value("payload").(dtos.CreateUserDTO)

	this.userService.Create(&payload)

	token, _ := helpers.GenerateJwtToken(payload.Username, payload.Email)
	fmt.Println("token : ", token)

	

	helpers.SetResponseCookie(w, token)
	w.Write([]byte("user registered"))

}

func (this *UserController) Verify(w http.ResponseWriter, r *http.Request) {
	var payload dtos.VerifyUserDTO
	payload = r.Context().Value("payload").(dtos.VerifyUserDTO)

	if err := this.userService.Verify(&payload); err != nil {
		fmt.Println(err.Error())
		w.Write([]byte("user not verified"))
		return
	}
	
	token, _ := helpers.GenerateJwtToken("", payload.Email)
	fmt.Println("token : ", token)

	helpers.SetResponseCookie(w, token)
	w.Write([]byte("user verified"))
}

func (this *UserController) GetProfile(w http.ResponseWriter, r *http.Request) {
	username, ok := r.Context().Value(middlewares.UsernameKey).(string)
	if !ok {
		http.Error(w, "Username not found", http.StatusUnauthorized)
		return
	}

	email, ok := r.Context().Value(middlewares.EmailKey).(string)
	if !ok {
		http.Error(w, "Email not found", http.StatusUnauthorized)
		return
	}

	fmt.Println("Username:", username)
	fmt.Println("Email:", email)

	user, err := this.userService.GetProfile(email)
	if err != nil {
		w.Write([]byte("user not verified"))
		return
	}
	response.WriteJsonSuccessResponse(w, http.StatusOK, "user verified", user)
}
