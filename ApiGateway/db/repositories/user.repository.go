package db


type IUserRepository interface {
	Create() error
	Delete()
	Update()
	GetById(id int)
	GetAll()
}

type UserRepository struct {
	// db *sql.DB
}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (user *UserRepository) Create() error{
	println("inside the user repo")
	return nil
}
func (user *UserRepository) Delete() {

}
func (user *UserRepository) Update() {

}
func (user *UserRepository) GetById(id int) {

}
func (user *UserRepository) GetAll() {

}
