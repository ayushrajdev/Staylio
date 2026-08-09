package db

import (
	"ApiGateway/models"
	"database/sql"
	"fmt"
)

type IUserRepository interface {
	Create() error
	DeleteById(id int) error
	Update()
	GetById(id int) (*models.User, error)
	GetAll() ([]*models.User, error)
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (this *UserRepository) Create() error {
	query := "insert into users (username,email,password) values(?,?,?)"
	result, err := this.db.Exec(query, "testuser", "test@gmail.com", "121212")
	println(result)
	if err != nil {
		return err
	}
	noOfRowsaffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if noOfRowsaffected == 0 {
		println("user is not inserted")
		return err

	}
	println("user is inserted")
	return nil
}
func (this *UserRepository) DeleteById(id int) error {
	return nil
}
func (this *UserRepository) Update() {

}
func (this *UserRepository) GetById(id int) (*models.User, error) {
	query := "select id ,username,email from users where id = ?"
	rows := this.db.QueryRow(query, 1)
	user := &models.User{}

	err := rows.Scan(&user.Id, &user.Username, &user.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			println("no rows found with the given id")
		} else {
			println("error scanning the user")
		}
		return nil, err
	}
	fmt.Println(*user)
	return user, nil

}
func (this *UserRepository) GetAll() ([]*models.User, error) {

	return nil, nil

}
