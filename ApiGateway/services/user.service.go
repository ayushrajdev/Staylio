package services

import db "ApiGateway/db/repositories"

type IUserService interface {
	Register() error
	Login()
}
type UserService struct {
	userRepository db.IUserRepository
}

func NewUserService(_userRepository db.IUserRepository) IUserService {
	return &UserService{
		userRepository: _userRepository,
	}
}

func (s *UserService) Register() error {
	println("inside the user service")
	s.userRepository.Create()
	return nil
}	
func (s *UserService) Login()  {
	
}	