package router

import (
	"github.com/go-chi/chi/v5"
)

type Router interface{
	Register(r chi.Router)
}

func SetUpRouter(userRouter Router) *chi.Mux {
	chiRouter := chi.NewRouter()
	userRouter.Register(chiRouter)
	return chiRouter
}
