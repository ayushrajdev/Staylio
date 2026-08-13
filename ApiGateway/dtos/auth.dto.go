package dtos

type CreateUserDTO struct {
	Email    string `json:"email" validate:"required,email"`
	Username string `json:"username" validate:"required,alphanum`
	Password string `json:"password" validate:"required,min=6,max=10`
}
