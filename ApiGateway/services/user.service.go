package services

import (
	db "ApiGateway/db/repositories"
)

type IUserService interface {
	Create(username string, email string, password string) error
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

func (this *UserService) Create(username string, email string, password string) error {
	println("inside the user service")

	hashedPassword, err := HashPassword(password)
	if err != nil {
		return err
	}
	error := this.userRepository.Create(username, email, hashedPassword)
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
	GenerateJwtToken()
}
