package db

type Storage struct {
	UserRepository IUserRepository
}

func NewStorage() *Storage {
	return &Storage{
		UserRepository: &UserRepository{},
	}
}
