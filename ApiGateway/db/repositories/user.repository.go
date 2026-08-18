package db

import (
	"ApiGateway/models"
	"database/sql"
	"fmt"
)

type IUserRepository interface {
	Create(username string, email string, hashedPassword string) error
	Verify(email string) (*models.User, error)
	GetByEmail(email string) (*models.User, error)
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (this *UserRepository) Create(username string, email string, hashedPassword string) error {
	query := "insert into users (username,email,password) values(?,?,?)"

	result, err := this.db.Exec(query, username, email, hashedPassword)
	if err != nil {
		return err
	}

	noOfRowsaffected, err := result.RowsAffected()

	if err != nil {
		return err
	}

	if noOfRowsaffected == 0 {
		println("user is not inserted in the db")
		return err
	}

	fmt.Println("user inserted in the db")
	return nil
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

func (this *UserRepository) GetByEmail(email string) (*models.User, error) {
	query := "select id ,username,email from users where email = ?"
	rows := this.db.QueryRow(query, email)
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

func (this *UserRepository) Verify(email string) (*models.User, error) {
	row := this.db.QueryRow("select id,username,emai,password from users where email = ?", email)
	user := &models.User{}
	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.Password)
	if err != nil {
		return nil, nil
	}
	fmt.Println(*user)
	return user, nil

}
