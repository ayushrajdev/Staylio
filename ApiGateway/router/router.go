package router

import (
	"github.com/go-chi/chi/v5"
	"ApiGateway/middlewares"
)

type Router interface{
	Register(r chi.Router)
}

func SetUpRouter(userRouter Router) *chi.Mux {
	chiRouter := chi.NewRouter()
	chiRouter.Use(middlewares.Logger)
	userRouter.Register(chiRouter)
	return chiRouter
}
