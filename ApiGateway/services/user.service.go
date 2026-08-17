package services

import (
	db "ApiGateway/db/repositories"
	"ApiGateway/dtos"
	"fmt"
)

type IUserService interface {
	Create(payload *dtos.CreateUserDTO) error
	Verify(password string)
}
type UserService struct {
	userRepository db.IUserRepository
}

func NewUserService(_userRepository db.IUserRepository) IUserService {
	return &UserService{
		userRepository: _userRepository,
	}
}

func (this *UserService) Create(payload *dtos.CreateUserDTO) error {
	println("inside the user service")
	println(payload.Username,payload.Email,payload.Password)
	hashedPassword, err := HashPassword(payload.Password)
	if err != nil {
		return err
	}
	fmt.Println(hashedPassword)
	error := this.userRepository.Create(payload.Username,payload.Email, hashedPassword)
	if error != nil {
		println(error.Error())
		return error
	}


	return nil
}

func (this *UserService) Verify(password string) {
	user, err := this.userRepository.Verify("ayush@bd.com")
	if err != nil {
		return
	}
	isCorrect := VerifyPassword(password, user.Password)
	if !isCorrect {
		return
	}
}
