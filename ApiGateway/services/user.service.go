package services

import (
	db "ApiGateway/db/repositories"
	"ApiGateway/dtos"
	"ApiGateway/models"
	"ApiGateway/utils/helpers"
	"fmt"
)

type IUserService interface {
	Create(payload *dtos.CreateUserDTO) error
	Verify(payload *dtos.VerifyUserDTO) error
	GetProfile(email string) (*models.User, error)
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
	println(payload.Username, payload.Email, payload.Password)
	hashedPassword, err := helpers.HashPassword(payload.Password)
	if err != nil {
		return err
	}
	fmt.Println(hashedPassword)
	error := this.userRepository.Create(payload.Username, payload.Email, hashedPassword)
	if error != nil {
		println(error.Error())
		return error
	}

	return nil
}

func (this *UserService) Verify(payload *dtos.VerifyUserDTO) error {

	user, err := this.userRepository.GetByEmail(payload.Email)
	if err != nil {
		return err
	}
	if err := helpers.VerifyPassword(payload.Password, user.Password); err != nil {
		return err
	}	
	return nil

}
func (this *UserService) GetProfile(email string) (*models.User, error) {
	user, err := this.userRepository.GetByEmail(email)
	if err != nil {
		return nil, err
	}
	return user, nil
}
